# PRD - DigitalSaurien

## État de l'Application : V1 (Développement Initial)

### Objectifs
Créer une application web professionnelle pour un prestataire indépendant, regroupant trois modules métiers :
1. Devis de livraison d'animaux
2. Devis de prestations d'automatisation digitale
3. Génération de logigrammes par texte/voix

### Fonctionnalités Développées

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

### Prochaines Étapes
- [ ] Finalisation des exports PDF/Print pour les devis.
- [ ] Amélioration de la transcription vocale réelle pour les schémas.
- [ ] Optimisation des performances pour le déploiement Vercel.
- [ ] Dashboard : Statistiques réelles basées sur la base de données.
