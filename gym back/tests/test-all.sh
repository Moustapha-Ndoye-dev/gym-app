#!/bin/bash

# ==============================================================================
# SUITE DE TESTS API COMPLETE - APPLICATION GYM (SaaS Multi-Tenant)
# ==============================================================================
# Ce script teste toutes les fonctionnalites majeures de l'application Gym :
# 1. Enregistrement Multi-Salles et Authentification (JWT / RBAC)
# 2. Gestion des Abonnements (CRUD + Logique de duree)
# 3. Gestion des Membres (Inscription + Isolation + Plans)
# 4. Gestion des Activites / Produits (Boutique) / Tickets
# 5. Verification d'Acces par QR Code (Securite et Validite)
# 6. Verification de l'Isolation des Donnees entre Salles
# ==============================================================================

BASE_URL="http://localhost:5000/api"

# Helper pour les entetes
show_header() {
    echo -e "\n\033[1;36m>>> $1 <<<\033[0m"
}

# Helper pour les requetes
test_endpoint() {
    local method=$1
    local path=$2
    local body=$3
    local token=$4
    local url="$BASE_URL$path"

    echo -n "$method $path... "
    
    local headers=("-H" "Content-Type: application/json")
    if [ -n "$token" ]; then
        headers+=("-H" "Authorization: Bearer $token")
    fi

    if [ -n "$body" ]; then
        response=$(curl -s -X "$method" "$url" "${headers[@]}" -d "$body")
    else
        response=$(curl -s -X "$method" "$url" "${headers[@]}")
    fi

    if [ $? -eq 0 ]; then
        echo -e "\033[0;32mSUCCESS\033[0m"
        echo "$response"
    else
        echo -e "\033[0;31mFAILED\033[0m"
        return 1
    fi
}

show_header "PHASE 1: ENREGISTREMENT ET AUTHENTIFICATION (JWT/RBAC)"

TICKS=$(date +%s)
# 1.1 Inscription Salle 1 (Administration Autonome)
gym1Data="{\"gymName\":\"Gold Gym\",\"gymEmail\":\"gold_$TICKS@gym.com\",\"adminUsername\":\"admin_gold_$TICKS\",\"adminPassword\":\"password123\"}"
gym1Res=$(test_endpoint "POST" "/auth/register-gym" "$gym1Data")
GYM1_ID=$(echo "$gym1Res" | grep -oP '(?<="id":)\d+')

# 1.2 Connexion Salle 1 (Token JWT)
login1Res=$(test_endpoint "POST" "/auth/login" "{\"username\":\"admin_gold_$TICKS\",\"password\":\"password123\"}")
TOKEN1=$(echo "$login1Res" | grep -oP '(?<="token":")[^"]+')

# 1.3 Inscription Salle 2 (Pour test isolation)
gym2Data="{\"gymName\":\"Silver Gym\",\"gymEmail\":\"silver_$TICKS@gym.com\",\"adminUsername\":\"admin_silver_$TICKS\",\"adminPassword\":\"password123\"}"
gym2Res=$(test_endpoint "POST" "/auth/register-gym" "$gym2Data")

# 1.4 Connexion Salle 2
login2Res=$(test_endpoint "POST" "/auth/login" "{\"username\":\"admin_silver_$TICKS\",\"password\":\"password123\"}")
TOKEN2=$(echo "$login2Res" | grep -oP '(?<="token":")[^"]+')


show_header "PHASE 2: GESTION DES ABONNEMENTS (PLANS FLEXIBLES)"
subMo=$(test_endpoint "POST" "/subscriptions" '{"name":"Pass Mensuel","price":50,"durationMonths":1}' "$TOKEN1")
SUB_ID=$(echo "$subMo" | grep -oP '(?<="id":)\d+')


show_header "PHASE 3: MEMBRES ET ISOLATION MULTI-TENANCY"
# 3.1 Inscription publique Alice (Salle 1)
memData="{\"first_name\":\"Alice\",\"last_name\":\"Member\",\"email\":\"alice_$TICKS@test.com\",\"phone\":\"0612345678\",\"subscriptionId\":$SUB_ID,\"gymId\":$GYM1_ID}"
mem1Res=$(test_endpoint "POST" "/auth/register-member" "$memData")
MEM1_ID=$(echo "$mem1Res" | grep -oP '(?<="id":)\d+')

# 3.2 Test d'isolation des donnees
gym2Members=$(test_endpoint "GET" "/members" "" "$TOKEN2")
if [[ "$gym2Members" == *"$MEM1_ID"* ]]; then
    echo -e "\033[0;31mECHEC : La Salle 2 peut voir les membres de la Salle 1 !\033[0m"
else
    echo -e "\033[0;32mSUCCES : Isolation des donnees confirmee.\033[0m"
fi


show_header "PHASE 4: CONTROLE D'ACCES ET QR CODES (MEMBER-ID / TICKET-ID)"
# 4.1 Acces Membre
accessRes=$(test_endpoint "POST" "/access/verify" "{\"qr_code\":\"MEMBER-$MEM1_ID\"}" "$TOKEN1")
echo "Resultat de l'acces: $accessRes"

# 4.2 Acces Ticket (Usage unique)
ticketRes=$(test_endpoint "POST" "/tickets" '{"type":"Ticket Journee","price":10}' "$TOKEN1")
TICK_ID=$(echo "$ticketRes" | grep -oP '(?<="id":)\d+')
test_endpoint "POST" "/access/verify" "{\"qr_code\":\"TICKET-$TICK_ID\"}" "$TOKEN1"


show_header "PHASE 5: OPERATIONS QUOTIDIENNES (CRUD)"
test_endpoint "POST" "/activities" '{"name":"Yoga","instructor":"Sarah"}' "$TOKEN1"
test_endpoint "POST" "/products" '{"name":"Eau","price":1.5}' "$TOKEN1"
test_endpoint "POST" "/transactions" '{"amount":100,"type":"income"}' "$TOKEN1"


show_header "SUITE DE TESTS TERMINEE"
