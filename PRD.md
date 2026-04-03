# PRD - DigitalSaurien

## État de l'Application : V1 (Développement Initial)

### Objectifs
Créer une application web professionnelle pour un prestataire indépendant, regroupant trois modules métiers :
1. Devis de livraison d'animaux
2. Devis de prestations d'automatisation digitale
3. Génération de logigrammes par texte/voix

### Fonctionnalités Développées

#### 🛠️ Architecture & Persistance

### 🗄️ Base de Données
- **Principal** : SQLite (`prisma/dev.db`) pour la rapidité et l'usage hors-ligne.
- **ORM** : Prisma 7.

### ☁️ Synchronisation Cloud (Google Drive)
- **Méthode** : Export/Import client-side via GAPI & GIS.
- **Fichier** : `digitalsaurien_sync_backup.json`.
- **Emplacement** : `/DigitalSaurien/AUTOMATE/DigitalSaurien`.
- **Fonctionnalités** :
    - Connexion via compte Google.
    - Sauvegarde manuelle des données locales vers le Drive.
    - Restauration des données depuis le Drive vers la machine locale.

## ✅ Fonctionnalités Développées
1. **Module Livraison** : Calculateur de devis dynamique (Carburant, Temps, Risque).
2. **Module Automatisation** : Calculateur de prestations IT/IA avec coefficients de complexité.
3. **Générateur de Schémas** : Interface de création de diagrammes via texte.
4. **Gestion Clients** : Base de données clients et historique des devis.
5. **Dashboard Central** : Vue d'ensemble de l'activité et statistiques.
6. **Persistance Hybride** : SQLite local synchronisé sur Google Drive.

#### 1. Architecture & Design System
- [x] **Framework** : Next.js 15 (App Router).
- [x] **Langage** : TypeScript.
- [x] **UI/UX** : Design system "Sober Premium" en Vanilla CSS avec variables globales.
- [x] **Base de Données** : Prisma avec SQLite (Prêt pour PostgreSQL).
- [x] **Layout Global** : AppShell avec Sidebar persistante et Navigation intuitive.

#### 2. Module Devis de Livraison
- [x] **Moteur de Calcul** : Intégration de la distance, durée, consommation véhicule, prix carburant, usure/km, péages et pénibilité.
- [x] **Interface Saisie** : Formulaire interactif avec calcul dynamique en temps réel.
- [x] **Historique** : Sauvegarde et suivi des devis générés.

#### 3. Module Devis d'Automatisation
- [x] **Moteur de Calcul** : Basé sur le temps, la complexité, le nombre d'outils SaaS, le nombre d'IA et les forfaits techniques.
- [x] **Interface Saisie** : Formulaire avec indicateur visuel de temps ajusté.
- [x] **Synthèse** : Visualisation claire des coûts par poste (Setup, Maintenance, etc.).

#### 4. Module Schémas (Logigrammes)
- [x] **Moteur de Rendu** : Mermaid.js pour la génération de diagrammes SVG.
- [x] **Parseur Intelligent** : Traduction du langage naturel ( "Si... -> ..." ) en syntaxe de diagramme.
- [x] **Interface** : Zone de saisie texte avec prévisualisation dynamique.

#### 5. Gestion Clients
- [x] **CRUD** : Liste dynamique, recherche et création de nouveaux clients.
- [x] **Typage** : Modèle de données Prisma structuré (Nom, Email, Phone, Adresse).

### Guide de Configuration Supabase (Indispensable pour Vercel)

Pour éviter les erreurs de connexion ("Connection Limit Reached" ou "PgBouncer error"), voici la marche à suivre :

1.  **Créer un projet sur Supabase.com**.
2.  Dans **Project Settings > Database**, récupérer l'**URL de connexion**.
3.  Utiliser le **port 6543** et ajouter le flag `?pgbouncer=true` pour la variable `DATABASE_URL` (Utilisée par l'application sur Vercel/Next.js).
4.  Utiliser le **port 5432** sans flag pour la variable `DIRECT_URL` (Utilisée par Prisma CLI pour les migrations).

### État de la Migration Supabase (Prête)
- [x] **Drivers PostgreSQL** : Installés (`pg`, `@prisma/adapter-pg`).
- [x] **Adaptateur Prisma 7** : Configuré dans `src/lib/db.ts`.
- [x] **Schéma** : Converti en `postgresql`.
- [ ] **Secret Management** : Remplir `.env` avec vos vrais accès Supabase.
- [ ] **Déploiement Initial** : Lancer `npx prisma db push` une fois les accès configurés.

### Prochaines Étapes
- [ ] Finalisation des exports PDF/Print pour les devis.
- [ ] Amélioration de la transcription vocale réelle pour les schémas.
- [ ] Optimisation des performances pour le déploiement Vercel.
- [ ] Dashboard : Statistiques réelles basées sur la base de données.

> [!TIP]
> Si vous avez un doute lors de la création du projet Supabase, je peux vous guider étape par étape. L'application est actuellement configurée pour détecter automatiquement la transition SQLite -> PostgreSQL dès que vous renseignez les accès.
