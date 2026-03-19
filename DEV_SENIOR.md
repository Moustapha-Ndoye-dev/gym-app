# Guide du Développeur Senior - Gym App

## 🎯 Objectifs Principaux
- Stabiliser l'authentification (Inscription/Connexion).
- Assurer l'intégrité des données via Prisma.
- Garantir une communication fluide entre les Frontends et l'API.
- Maintenir une architecture SaaS (multi-tenant) propre.

## 🛠 Tâches Prioritaires
1. **Audit de l'Auth :** Vérifier les routes `POST /api/auth/register` et `POST /api/auth/login`.
2. **Validation DB :** S'assurer que les migrations Prisma sont à jour et que le schéma correspond aux besoins des frontends.
3. **CORS & Sécurité :** Vérifier que les headers CORS autorisent les ports de développement (5173, 3000, 3001).
4. **Validation des Inputs :** Utiliser Zod ou Joi pour valider les données entrantes côté API.
5. **Gestion d'Erreurs :** Centraliser la gestion d'erreurs côté backend pour des réponses API cohérentes.

## 📜 Bonnes Pratiques
- **DRY (Don't Repeat Yourself) :** Créer des utilitaires pour les appels API côté front.
- **Type Safety :** Partager ou synchroniser les interfaces TypeScript entre back et front.
- **Surgical Commits :** Une modification, une intention, un test.
- **Documentation :** Mettre à jour `EVOLUTION.md` après chaque changement majeur.
- **Logs :** Utiliser des logs clairs pour le débogage (Winston ou simple console structurée).

## 💡 Leçons Apprises (Post-Audit 19/03/2026)
- **Prisma Output Path :** Éviter les dossiers d'output personnalisés dans `schema.prisma`. Préférer le chemin par défaut (`node_modules/@prisma/client`) pour garantir que le client soit correctement empaqueté lors de la compilation `tsc` dans `dist`.
- **Zod Immutability :** Utiliser `.partial()` pour les mises à jour au lieu de `.deepPartial()` si les objets ne sont pas profondément imbriqués et pour éviter des bugs de signature de type.
- **SaaS Tenancy Fallback :** Dans un environnement multi-tenant, toujours prévoir un fallback (ex: `findFirst()`) si le `gymId` fourni par le client est erroné, afin de ne pas bloquer les nouveaux utilisateurs tout en loggant l'erreur.
