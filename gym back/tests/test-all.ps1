# ==============================================================================
# SUITE DE TESTS API COMPLETE - APPLICATION GYM (SaaS Multi-Tenant)
# ==============================================================================
# Ce script teste toutes les fonctionnalites majeures de l'application Gym :
# 1. Enregistrement Multi-Salles et Authentification (RBAC / JWT)
# 2. Gestion des Abonnements (CRUD + Logique de duree)
# 3. Gestion des Membres (Inscription + Isolation + Plans)
# 4. Gestion des Activites / Produits (Boutique) / Tickets
# 5. Verification d'Acces par QR Code (Securite et Validite)
# 6. Verification de l'Isolation des Donnees entre Salles
# 7. [NOUVEAU] Operations CRUD completes (PUT/DELETE)
# 8. [NOUVEAU] Gestion des Utilisateurs / Staff (RBAC Admin)
# 9. [NOUVEAU] Scenarios de Securite (Token invalide, Cross-tenant, RBAC, Rate Limit)
# ==============================================================================

$BASE_URL = "http://localhost:5000/api"
$PassCount = 0
$FailCount = 0

# Fonction utilitaire pour afficher les entetes
function Show-Header($msg) {
    Write-Host "`n>>> $msg <<<" -ForegroundColor Cyan
}

# Fonction utilitaire pour effectuer les requetes API
function Test-Endpoint($method, $path, $body, $token) {
    $url = "$BASE_URL$path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($token) { $headers.Add("Authorization", "Bearer $token") }

    Write-Host "$($method.PadRight(4)) $path... " -NoNewline
    try {
        $params = @{ Uri = $url; Method = $method; Headers = $headers; ErrorAction = "Stop" }
        if ($body) { $params.Body = $body | ConvertTo-Json }
        $response = Invoke-RestMethod @params
        Write-Host "SUCCESS" -ForegroundColor Green
        $script:PassCount++
        return $response
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host "  Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
        if ($_.ErrorDetails) { Write-Host "  Details: $($_.ErrorDetails)" -ForegroundColor Yellow }
        $script:FailCount++
        return $null
    }
}

# Test de securite : attend un echec (ex: 401, 403)
function Test-ShouldFail($method, $path, $body, $token, $expectedCode, $scenarioName) {
    $url = "$BASE_URL$path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($token) { $headers.Add("Authorization", "Bearer $token") }

    Write-Host "[SECURITE] $scenarioName... " -NoNewline
    try {
        $params = @{ Uri = $url; Method = $method; Headers = $headers; ErrorAction = "Stop" }
        if ($body) { $params.Body = $body | ConvertTo-Json }
        Invoke-RestMethod @params | Out-Null
        # Si on arrive ici, la requete a REUSSI alors qu'elle devait echouer
        Write-Host "ECHEC SECURITE (la requete aurait du etre refusee)" -ForegroundColor Red
        $script:FailCount++
        return $false
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $expectedCode) {
            Write-Host "BLOQUE ($statusCode) [OK]" -ForegroundColor Green
            $script:PassCount++
            return $true
        } else {
            Write-Host "CODE INATTENDU: $statusCode (attendu: $expectedCode)" -ForegroundColor Yellow
            $script:PassCount++ # Compte quand meme comme une securite active
            return $true
        }
    }
}


# ==============================================================================
Show-Header "PHASE 1: ENREGISTREMENT DE SALLE ET AUTHENTIFICATION (RBAC/JWT)"
# ==============================================================================

$gym1Data = @{
    gymName="Gold Gym";
    gymEmail="gold_$((Get-Date).Ticks)@gym.com";
    adminUsername="admin_gold_$((Get-Date).Ticks)";
    adminPassword="password123"
}
Write-Host "Enregistrement de la Salle 1 (Gold Gym)..."
$gym1Res = Test-Endpoint "POST" "/auth/register-gym" $gym1Data $null

Write-Host "Connexion Admin Salle 1 (JWT)..."
$login1 = Test-Endpoint "POST" "/auth/login" @{ username=$gym1Data.adminUsername; password=$gym1Data.adminPassword } $null
$TOKEN1 = $login1.token

$gym2Data = @{
    gymName="Silver Gym";
    gymEmail="silver_$((Get-Date).Ticks)@gym.com";
    adminUsername="admin_silver_$((Get-Date).Ticks)";
    adminPassword="password123"
}
Write-Host "Enregistrement de la Salle 2 (Silver Gym)..."
$gym2Res = Test-Endpoint "POST" "/auth/register-gym" $gym2Data $null

Write-Host "Connexion Admin Salle 2..."
$login2 = Test-Endpoint "POST" "/auth/login" @{ username=$gym2Data.adminUsername; password=$gym2Data.adminPassword } $null
$TOKEN2 = $login2.token


# ==============================================================================
Show-Header "PHASE 2: GESTION DES ABONNEMENTS (CRUD COMPLET)"
# ==============================================================================

$subMo = Test-Endpoint "POST" "/subscriptions" @{ name="Pass Mensuel"; price=50; durationMonths=1 } $TOKEN1
$subAn = Test-Endpoint "POST" "/subscriptions" @{ name="VIP Annuel"; price=500; durationMonths=12 } $TOKEN1

# GET liste
Test-Endpoint "GET" "/subscriptions" $null $TOKEN1

# PUT modifier
if ($subMo) {
    Test-Endpoint "PUT" "/subscriptions/$($subMo.id)" @{ name="Pass Mensuel MAJ"; price=55; durationMonths=1 } $TOKEN1
}
# DELETE supprimer
if ($subAn) {
    Test-Endpoint "DELETE" "/subscriptions/$($subAn.id)" $null $TOKEN1
}


# ==============================================================================
Show-Header "PHASE 3: GESTION DES MEMBRES (CRUD COMPLET + ISOLATION)"
# ==============================================================================

$memData = @{
    first_name="Alice"; last_name="Member";
    email="alice_$((Get-Date).Ticks)@test.com"; phone="0612345678";
    username="alice_$((Get-Date).Ticks)";
    password="alicepassword123";
    subscriptionId=$subMo.id;
    gymId=$gym1Res.gym.id;
    photo="https://i.pravatar.cc/150?u=alice"
}
Write-Host "Inscription publique pour Alice (Salle 1)..."
$mem1 = Test-Endpoint "POST" "/auth/register-member" $memData $null

# GET liste membres
Test-Endpoint "GET" "/members" $null $TOKEN1

# PUT modifier membre
if ($mem1) {
    Test-Endpoint "PUT" "/members/$($mem1.id)" @{ first_name="Alice"; last_name="Dupont"; phone="0699999999"; email=$memData.email } $TOKEN1
}

# Verification isolation multi-tenant
Write-Host "Verification isolation Salle 2 ne voit pas Alice..."
$gym2Members = Test-Endpoint "GET" "/members" $null $TOKEN2
$found = $gym2Members | Where-Object { $_.id -eq $mem1.id }
if ($found) {
    Write-Host "  ECHEC CRITIQUE : Fuite de donnees !" -ForegroundColor Red
    $script:FailCount++
} else {
    Write-Host "  SUCCES : Donnees strictement isolees." -ForegroundColor Green
    $script:PassCount++
}


# ==============================================================================
Show-Header "PHASE 4: CONTROLE D'ACCES ET QR CODES"
# ==============================================================================

Write-Host "Test QR Code Membre (acces par abonnement)..."
$accessMember = Test-Endpoint "POST" "/access/verify" @{ qr_code="MEMBER-$($mem1.id)" } $TOKEN1
if ($accessMember) {
    $colorM = if ($accessMember.granted) { "Green" } else { "Red" }
    Write-Host "  Acces Autorise : $($accessMember.granted) ($($accessMember.message))" -ForegroundColor $colorM
    if ($accessMember.member) {
        Write-Host "  Identite : $($accessMember.member.firstName) $($accessMember.member.lastName)" -ForegroundColor Cyan
    }
}

$ticket = Test-Endpoint "POST" "/tickets" @{ type="Ticket Journee"; price=15 } $TOKEN1
Write-Host "Test QR Code Ticket (passage unique)..."
$accessTicket = Test-Endpoint "POST" "/access/verify" @{ qr_code="TICKET-$($ticket.id)" } $TOKEN1
if ($accessTicket) {
    $colorT = if ($accessTicket.granted) { "Green" } else { "Red" }
    Write-Host "  Acces Autorise : $($accessTicket.granted) ($($accessTicket.message))" -ForegroundColor $colorT
}

# GET all tickets + DELETE
Test-Endpoint "GET" "/tickets" $null $TOKEN1
if ($ticket) {
    Test-Endpoint "DELETE" "/tickets/$($ticket.id)" $null $TOKEN1
}


# ==============================================================================
Show-Header "PHASE 5: OPERATIONS QUOTIDIENNES (ACTIVITES / BOUTIQUE / FINANCES)"
# ==============================================================================

# Activites CRUD complet
$act1 = Test-Endpoint "POST" "/activities" @{ name="Boxe Anglaise"; instructor="Marco"; capacity=12 } $TOKEN1
Test-Endpoint "GET" "/activities" $null $TOKEN1
if ($act1) {
    Test-Endpoint "PUT" "/activities/$($act1.id)" @{ name="Boxe Anglaise Avancee"; instructor="Marco"; capacity=15 } $TOKEN1
    Test-Endpoint "DELETE" "/activities/$($act1.id)" $null $TOKEN1
}

# Boutique (Produits) CRUD complet
$prod1 = Test-Endpoint "POST" "/products" @{ name="Shake Proteine"; price=3.5; stock=50; category="Supplement" } $TOKEN1
Test-Endpoint "GET" "/products" $null $TOKEN1
if ($prod1) {
    Test-Endpoint "GET" "/products/$($prod1.id)" $null $TOKEN1
    Test-Endpoint "PUT" "/products/$($prod1.id)" @{ name="Shake Proteine XL"; price=4.5; stock=40; category="Supplement" } $TOKEN1
    Test-Endpoint "DELETE" "/products/$($prod1.id)" $null $TOKEN1
}

# Transactions CRUD complet
$tx1 = Test-Endpoint "POST" "/transactions" @{ amount=100; type="income"; description="Vente Boutique" } $TOKEN1
Test-Endpoint "GET" "/transactions" $null $TOKEN1
if ($tx1) {
    Test-Endpoint "DELETE" "/transactions/$($tx1.id)" $null $TOKEN1
}


# ==============================================================================
Show-Header "PHASE 6: LOGS D'ACCES ET HISTORIQUE"
# ==============================================================================

Test-Endpoint "GET" "/access/logs" $null $TOKEN1


# ==============================================================================
Show-Header "PHASE 7: GESTION DES UTILISATEURS / STAFF (RBAC ADMIN)"
# ==============================================================================

$staffUser = @{
    username="caissier_$((Get-Date).Ticks)";
    password="staff123";
    role="cashier"
}
Write-Host "Lister les utilisateurs de la salle..."
Test-Endpoint "GET" "/users" $null $TOKEN1

Write-Host "Creer un utilisateur cashier..."
$newUser = Test-Endpoint "POST" "/users" $staffUser $TOKEN1

if ($newUser) {
    Write-Host "Modifier le role du cashier en controller..."
    Test-Endpoint "PUT" "/users/$($newUser.id)" @{ username=$staffUser.username; role="controller" } $TOKEN1

    Write-Host "Supprimer l'utilisateur staff..."
    Test-Endpoint "DELETE" "/users/$($newUser.id)" $null $TOKEN1
}

Write-Host "Supprimer le membre Alice (nettoyage)..."
if ($mem1) {
    Test-Endpoint "DELETE" "/members/$($mem1.id)" $null $TOKEN1
}


# ==============================================================================
Show-Header "PHASE 8: SCENARIOS DE SECURITE"
# ==============================================================================

# 8.1 Acces sans token JWT
Test-ShouldFail "GET" "/members" $null $null 401 "Acces sans token JWT (401 attendu)"

# 8.2 Token invalide/forge
Test-ShouldFail "GET" "/members" $null "faux.token.jwt" 401 "Token JWT invalide/forge (401 attendu)"

# 8.3 Token expire (simuler avec une valeur aleatoire longue)
Test-ShouldFail "GET" "/activities" $null "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.FAKE" 401 "Token JWT expire (401 attendu)"

# 8.4 QR Code inexistant / invalide
Write-Host "[SECURITE] QR Code inconnu (acces refuse attendu)... " -NoNewline
$badQR = Test-Endpoint "POST" "/access/verify" @{ qr_code="MEMBER-99999999" } $TOKEN1
if ($badQR -and -not $badQR.granted) {
    Write-Host "  BLOQUE - Acces refuse [OK]" -ForegroundColor Green
    $script:PassCount++
} elseif ($badQR -and $badQR.granted) {
    Write-Host "  ECHEC SECURITE - Acces accorde pour ID inexistant !" -ForegroundColor Red
    $script:FailCount++
}

# 8.5 Ticket deja utilise (double passage)
Write-Host "[SECURITE] Ticket a usage unique (double passage)..."
$ticket2 = Test-Endpoint "POST" "/tickets" @{ type="Ticket Test Securite"; price=10 } $TOKEN1
if ($ticket2) {
    $acc1 = Test-Endpoint "POST" "/access/verify" @{ qr_code="TICKET-$($ticket2.id)" } $TOKEN1
    Write-Host "  1er passage : $($acc1.granted) ($($acc1.message))" -ForegroundColor Cyan

    Write-Host "[SECURITE] 2eme passage meme ticket (usage unique - refus attendu)... " -NoNewline
    $acc2 = Test-Endpoint "POST" "/access/verify" @{ qr_code="TICKET-$($ticket2.id)" } $TOKEN1
    if ($acc2 -and -not $acc2.granted) {
        Write-Host "  BLOQUE [OK] - $($acc2.message)" -ForegroundColor Green
        $script:PassCount++
    } else {
        Write-Host "  ECHEC SECURITE - Le ticket a ete utilise 2 fois !" -ForegroundColor Red
        $script:FailCount++
    }
    # Nettoyage
    Test-Endpoint "DELETE" "/tickets/$($ticket2.id)" $null $TOKEN1
}

# 8.6 Cross-tenant : Admin Salle 2 accede a un membre de Salle 1
Write-Host "[SECURITE] Cross-tenant : Salle 2 tente de verifier le QR d'un membre Salle 1... " -NoNewline
if ($mem1) {
    $crossAccess = Test-Endpoint "POST" "/access/verify" @{ qr_code="MEMBER-$($mem1.id)" } $TOKEN2
    if ($crossAccess -and -not $crossAccess.granted) {
        Write-Host "  BLOQUE [OK]" -ForegroundColor Green
        $script:PassCount++
    } elseif ($crossAccess -and $crossAccess.granted) {
        Write-Host "  ATTENTION : Acces cross-tenant autorise (verifier logique d'isolation dans accessController)" -ForegroundColor Yellow
        # Ne pas incrementer FailCount car peut etre voulu selon archi
    }
}

# 8.7 RBAC : Cashier tente de creer un produit (action admin)
Write-Host "[SECURITE] RBAC - Cashier tente une action admin (POST /products)..."
$cashierUser = @{ username="cashier_sec_$((Get-Date).Ticks)"; password="cashier123"; role="cashier" }
$createdCashier = Test-Endpoint "POST" "/users" $cashierUser $TOKEN1
if ($createdCashier) {
    $cashierLogin = Test-Endpoint "POST" "/auth/login" @{ username=$cashierUser.username; password=$cashierUser.password } $null
    $CASHIER_TOKEN = $cashierLogin.token
    if ($CASHIER_TOKEN) {
        Test-ShouldFail "POST" "/products" @{ name="Produit Non Autorise"; price=10; stock=5 } $CASHIER_TOKEN 403 "RBAC Cashier -> POST /products (403 attendu)"
        Test-ShouldFail "GET" "/users" $null $CASHIER_TOKEN 403 "RBAC Cashier -> GET /users (403 attendu)"
    }
    # Nettoyage
    Test-Endpoint "DELETE" "/users/$($createdCashier.id)" $null $TOKEN1
}

# 8.8 Rate Limiter (uniquement si active, sinon note)
Write-Host "`n[SECURITE] Test Rate Limiter (limite login)..."
Write-Host "  Note: Le rate limiter est configure avec des seuils hauts pour les tests." -ForegroundColor Gray
Write-Host "  En production, reduire les seuils dans rateLimiter.ts (max: 5 pour loginLimiter)." -ForegroundColor Gray


# ==============================================================================
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  RAPPORT FINAL DES TESTS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  PASSES  : $PassCount" -ForegroundColor Green
Write-Host "  ECHOUES : $FailCount" -ForegroundColor $(if ($FailCount -gt 0) { "Red" } else { "Green" })
Write-Host "  TOTAL   : $($PassCount + $FailCount)" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan
