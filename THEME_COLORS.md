# 🎨 Thème de Couleurs - Skill Forge

## Palette Principale - Teal/Cyan

Le thème utilise une palette moderne **Teal/Cyan** (bleu-vert) qui est professionnelle, agréable à l'œil, et ni trop foncée ni trop claire.

### Couleurs Principales

#### Primary (Teal vibrant)
- **HSL**: `174 62% 47%`
- **Usage**: Boutons principaux, liens, éléments interactifs
- **Exemple**: Boutons "Se connecter", icônes principales

#### Secondary (Cyan doux)
- **HSL**: `180 25% 94%`
- **Usage**: Arrière-plans secondaires, zones de contenu
- **Exemple**: Cartes, sections secondaires

#### Accent (Teal clair)
- **HSL**: `174 45% 92%`
- **Usage**: Mise en évidence, hover states
- **Exemple**: Survol de boutons, badges

### Couleurs de Fond

#### Background
- **HSL**: `0 0% 100%` (Blanc pur)
- **Usage**: Fond principal de l'application

#### Muted (Gris-bleu léger)
- **HSL**: `180 20% 96%`
- **Usage**: Zones désactivées, texte secondaire
- **Exemple**: Placeholders, texte désactivé

### Couleurs de Texte

#### Foreground
- **HSL**: `200 15% 20%`
- **Usage**: Texte principal
- **Exemple**: Titres, paragraphes

#### Muted Foreground
- **HSL**: `200 10% 45%`
- **Usage**: Texte secondaire, descriptions
- **Exemple**: Sous-titres, métadonnées

### Couleurs Fonctionnelles

#### Destructive (Rouge)
- **HSL**: `0 84.2% 60.2%`
- **Usage**: Actions de suppression, erreurs
- **Exemple**: Bouton supprimer, messages d'erreur

#### Border
- **HSL**: `180 15% 88%`
- **Usage**: Bordures, séparateurs
- **Exemple**: Contours de cartes, lignes de séparation

### Sidebar

#### Sidebar Background
- **HSL**: `174 35% 96%`
- **Usage**: Fond de la barre latérale
- **Couleur**: Teal très clair

#### Sidebar Primary
- **HSL**: `174 62% 47%`
- **Usage**: Éléments actifs dans la sidebar
- **Couleur**: Teal vibrant

## Dégradés Utilisés

### Page de Connexion/Inscription
```css
background: linear-gradient(to bottom right, from-teal-50, via-cyan-50, to-white)
```

### Dashboard
```css
background: linear-gradient(to bottom right, from-teal-50/50, via-cyan-50/30, to-white)
```

### Illustration Login/Signup
```css
background: linear-gradient(to top right, from-teal-500, to-cyan-600)
```

## Cartes du Dashboard

### Projets
- **Gradient**: `from-teal-600 via-cyan-600 to-teal-500`
- **Couleur**: Teal principal

### Quiz
- **Gradient**: `from-emerald-500 via-teal-500 to-cyan-500`
- **Couleur**: Vert émeraude vers cyan

### Formations
- **Gradient**: `from-cyan-500 via-sky-500 to-blue-500`
- **Couleur**: Cyan vers bleu ciel

### Certificats
- **Gradient**: `from-amber-500 via-yellow-500 to-orange-500`
- **Couleur**: Ambre/jaune (contraste chaleureux)

### Utilisateurs (Admin)
- **Gradient**: `from-teal-700 via-teal-600 to-cyan-600`
- **Couleur**: Teal foncé

## Badges de Difficulté

### Beginner
- **Classes**: `bg-green-100 text-green-800`
- **Couleur**: Vert clair

### Intermediate
- **Classes**: `bg-yellow-100 text-yellow-800`
- **Couleur**: Jaune clair

### Advanced
- **Classes**: `bg-red-100 text-red-800`
- **Couleur**: Rouge clair

## Mode Sombre (Dark Mode)

Le thème inclut également un mode sombre avec des couleurs adaptées :

- **Background**: `200 20% 12%` (Gris-bleu très foncé)
- **Primary**: `174 62% 55%` (Teal légèrement plus clair)
- **Card**: `200 18% 15%` (Gris-bleu foncé)

## Utilisation dans le Code

### Avec Tailwind CSS
```jsx
// Bouton principal
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Cliquer ici
</button>

// Carte
<div className="bg-card text-card-foreground border border-border">
  Contenu
</div>

// Texte secondaire
<p className="text-muted-foreground">Description</p>
```

### Avec les Variables CSS
```css
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}
```

## Accessibilité

- ✅ Contraste suffisant entre le texte et l'arrière-plan
- ✅ Couleurs distinctes pour les différents états (hover, active, disabled)
- ✅ Palette cohérente à travers toute l'application
- ✅ Support du mode sombre pour réduire la fatigue oculaire

## Pages Mises à Jour

Toutes les pages suivantes ont été mises à jour avec le nouveau thème Teal/Cyan :

### Pages Utilisateur
- ✅ **Page de connexion** (`app/page.tsx`)
- ✅ **Page d'inscription** (`app/signup/page.tsx`)
- ✅ **Dashboard** (`app/dashboard/page.tsx`)
- ✅ **Projets** (`app/projects/page.tsx`)
- ✅ **Détails d'un projet** (`app/projects/[id]/page.tsx`)
- ✅ **Quiz** (`app/quizzes/page.tsx`)
- ✅ **Formations** (`app/Formation/page.tsx`)
- ✅ **Retour d'expérience** (`app/feedback/page.tsx`)
- ✅ **Progression** (`app/progress/page.tsx`)

### Pages Admin
- ✅ **Gestion des utilisateurs** (`app/admin/users/page.tsx`)
- ✅ **Ajouter un quiz** (`app/admin/addquiz/page.tsx`)
- ✅ **Ajouter un projet** (`app/admin/addproject/page.tsx`)
- ✅ **Ajouter une formation** (`app/admin/addformation/page.tsx`)

### Composants
- ✅ **Sidebar** (`components/app-sidebar.tsx`)
- ✅ **Navigation supérieure** (`components/top-nav.tsx`)
- ✅ **Layout principal** (`app/layout.tsx`)

## Notes

- Le thème est défini dans `app/globals.css`
- Les couleurs utilisent le format HSL pour une meilleure manipulation
- Toutes les couleurs sont accessibles via les variables CSS Tailwind
- Le thème est compatible avec les composants Shadcn/ui
- Toutes les interfaces ont été mises à jour pour une cohérence visuelle complète

