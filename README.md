# Application Backoffice - Gestion de Restaurant

Application backoffice complète pour la gestion d'un restaurant, développée en JavaScript vanilla (VanillaJS), HTML5 et CSS3.

## Fonctionnalités

### 🔐 Authentification
- Page de connexion avec credentials statiques : `admin/admin`
- Gestion de session avec localStorage

### 📊 Tableau de Bord
- Statistiques en temps réel (5 cartes d'indicateurs)
- 6 graphiques interactifs :
  - Pie Chart : Répartition des plats par catégorie
  - Doughnut Chart : Statut des commandes
  - Line Chart : Évolution des commandes
  - Bar Chart : Répartition des tables par type
  - Scatter Plot : Revenus par jour
  - Histogram : Distribution des salaires

### 📋 Gestion CRUD (5 entités)

#### 1. Plats (Menu)
- Création, lecture, mise à jour, suppression
- Filtres par catégorie et disponibilité
- Tri par colonnes
- Export CSV et PDF

#### 2. Commandes
- Gestion complète des commandes
- Filtres par statut
- Tri et pagination
- Export CSV et PDF

#### 3. Tables
- Gestion des tables du restaurant
- Filtres par type et disponibilité
- Tri et pagination
- Export CSV et PDF

#### 4. Réservations
- Gestion des réservations clients
- Filtres par statut
- Tri et pagination
- Export CSV et PDF

#### 5. Employés
- Gestion du personnel
- Filtres par poste et statut
- Tri et pagination
- Export CSV et PDF

### 🌍 Internationalisation
- Support de 3 langues : Français, Anglais, Arabe
- Changement de langue dynamique
- Support RTL pour l'arabe

### 🎨 Design
- Interface responsive (mobile, tablette, desktop)
- Design moderne avec Bootstrap 5
- Menu latéral collapsible
- Navbar avec logo et déconnexion
- Animations et transitions fluides

## Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec Grid et Flexbox
- **JavaScript (VanillaJS)** : Logique métier sans framework
- **Bootstrap 5** : Framework CSS pour le design
- **Chart.js** : Bibliothèque pour les graphiques
- **jsPDF** : Génération de fichiers PDF
- **Font Awesome** : Icônes

## Structure du Projet

```
projet web/
├── index.html          # Page de connexion
├── dashboard.html      # Page principale avec sidebar
├── css/
│   └── style.css      # Styles personnalisés
├── js/
│   ├── app.js         # Point d'entrée principal
│   ├── login.js       # Gestion de la connexion
│   ├── router.js      # Système de routage
│   ├── data.js        # Gestion des données (simulées)
│   ├── utils.js       # Fonctions utilitaires
│   ├── i18n.js        # Internationalisation
│   ├── dashboard.js   # Page dashboard
│   ├── plats.js       # CRUD Plats
│   ├── commandes.js   # CRUD Commandes
│   ├── tables.js      # CRUD Tables
│   ├── reservations.js # CRUD Réservations
│   └── employes.js    # CRUD Employés
└── README.md          # Documentation
```

## Installation et Utilisation

1. **Télécharger le projet**
  git

2. **Ouvrir l'application**
   - Ouvrir `index.html` dans un navigateur web moderne
  

3. **Se connecter**
   - Username: `admin`
   - Password: `admin`

4. **Naviguer dans l'application**
   - Utiliser le menu latéral pour accéder aux différentes sections
   - Le tableau de bord affiche les statistiques générales
   - Chaque section CRUD permet de gérer les données correspondantes

## Fonctionnalités Détaillées

### CRUD Complet
Chaque entité dispose de :
- **Create** : Formulaire modal pour ajouter un nouvel élément
- **Read** : Tableau avec pagination (10 éléments par page)
- **Update** : Modification via formulaire modal
- **Delete** : Suppression avec confirmation
- **View Details** : Page de détails complète avec export PDF

### Filtres et Recherche
- Recherche par texte (nom, numéro, etc.)
- Filtres par critères spécifiques (statut, catégorie, etc.)
- Réinitialisation des filtres

### Tri
- Tri par colonnes (cliquer sur l'en-tête)
- Tri ascendant/descendant
- Indicateur visuel du tri actif

### Export
- **CSV** : Export de toutes les données filtrées
- **PDF** : Export des détails d'un élément spécifique

### Pagination
- 10 éléments par page par défaut
- Navigation précédent/suivant
- Numéros de page cliquables

## Données

Les données sont simulées et stockées dans le `localStorage` du navigateur. Les données initiales sont générées automatiquement au premier chargement :
- 20 plats
- 30 commandes
- 15 tables
- 20 réservations
- 15 employés

Les données persistent entre les sessions grâce au localStorage.

## Navigation

L'application utilise un système de routage basé sur les hash (#) :
- `#dashboard` : Tableau de bord
- `#plats` : Gestion des plats
- `#commandes` : Gestion des commandes
- `#tables` : Gestion des tables
- `#reservations` : Gestion des réservations
- `#employes` : Gestion des employés


## résumée

Application développée pour un projet de gestion de restaurant.

