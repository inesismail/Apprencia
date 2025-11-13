# 🏆 Système de Classement (Leaderboard) - Documentation Complète

**Projet** : Apprencia  
**Date** : Janvier 2025  
**Version** : 2.0 (avec persistance en base de données)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture](#2-architecture)
3. [Modèle de Données](#3-modèle-de-données)
4. [APIs](#4-apis)
5. [Filtrage par Période et Catégorie](#5-filtrage-par-période-et-catégorie)
6. [Mise à Jour Automatique](#6-mise-à-jour-automatique)
7. [Utilisation](#7-utilisation)

---

## 1. Vue d'ensemble

Le système de classement d'Apprencia permet de :
- ✅ **Classer les utilisateurs** selon leurs performances
- ✅ **Filtrer par période** : Tout temps, Hebdomadaire, Mensuel
- ✅ **Filtrer par catégorie** : Global, Quiz, Projets, Formations
- ✅ **Persister le classement** dans la base de données MongoDB
- ✅ **Mettre à jour automatiquement** le classement périodiquement

---

## 2. Architecture

### 2.1 Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Utilisateur effectue une action                         │
│    - Passe un quiz                                          │
│    - Termine un projet                                      │
│    - Obtient un certificat                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. API Leaderboard calcule les points                      │
│    GET /api/leaderboard?period=all&category=all             │
│    - Récupère tous les utilisateurs                         │
│    - Calcule les points selon période/catégorie             │
│    - Trie par points décroissants                           │
│    - Attribue les rangs                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Mise à jour de la base de données                       │
│    User.findByIdAndUpdate()                                 │
│    - Enregistre le rang de chaque utilisateur               │
│    - Enregistre les points par catégorie                    │
│    - Enregistre les points par période                      │
│    - Met à jour les badges                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Récupération rapide du classement                       │
│    GET /api/leaderboard/user/{id}                           │
│    - Lecture directe depuis la base de données              │
│    - Pas de recalcul nécessaire                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Modèle de Données

### 3.1 Schéma User (mis à jour)

```typescript
{
  // ... autres champs ...
  
  // 🏆 Système de points
  points: Number,
  badges: [String],
  
  // 📊 Classement détaillé (NOUVEAU)
  leaderboardStats: {
    // Classement global
    globalRank: Number,        // Rang global (tous temps, toutes catégories)
    globalPoints: Number,      // Points globaux
    
    // Classement par catégorie
    quizRank: Number,          // Rang dans la catégorie Quiz
    quizPoints: Number,        // Points Quiz
    projectRank: Number,       // Rang dans la catégorie Projets
    projectPoints: Number,     // Points Projets
    formationRank: Number,     // Rang dans la catégorie Formations
    formationPoints: Number,   // Points Formations
    
    // Classement par période
    weeklyRank: Number,        // Rang cette semaine
    weeklyPoints: Number,      // Points cette semaine
    monthlyRank: Number,       // Rang ce mois
    monthlyPoints: Number,     // Points ce mois
    
    // Métadonnées
    lastUpdated: Date,         // Date de dernière mise à jour
  }
}
```

### 3.2 Exemple de Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Johnson",
  "points": 2500,
  "badges": ["🏆 Master des Projets", "🎓 Génie des Quiz"],
  "leaderboardStats": {
    "globalRank": 1,
    "globalPoints": 2500,
    "quizRank": 2,
    "quizPoints": 1200,
    "projectRank": 1,
    "projectPoints": 800,
    "formationRank": 3,
    "formationPoints": 500,
    "weeklyRank": 1,
    "weeklyPoints": 350,
    "monthlyRank": 1,
    "monthlyPoints": 1200,
    "lastUpdated": "2025-01-15T14:30:00.000Z"
  }
}
```

---

## 4. APIs

### 4.1 GET /api/leaderboard

**Description** : Récupère le classement complet avec filtres

**Paramètres** :
- `period` : "all" | "weekly" | "monthly" (défaut: "all")
- `category` : "all" | "quiz" | "projects" | "formations" (défaut: "all")
- `userId` : ID de l'utilisateur connecté (optionnel)

**Exemple** :
```
GET /api/leaderboard?period=weekly&category=quiz&userId=507f1f77bcf86cd799439011
```

**Réponse** :
```json
{
  "success": true,
  "leaderboard": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "name": "Alice Johnson",
      "totalPoints": 1200,
      "quizPoints": 1200,
      "projectPoints": 0,
      "formationPoints": 0,
      "rank": 1,
      "badges": ["🎓 Génie des Quiz"],
      "completedProjects": 5,
      "passedQuizzes": 15,
      "certificates": 3
    }
  ],
  "currentUserRank": {
    "userId": "507f1f77bcf86cd799439011",
    "rank": 1,
    "totalPoints": 1200
  },
  "period": "weekly",
  "category": "quiz"
}
```

---

### 4.2 GET /api/leaderboard/user/[id]

**Description** : Récupère le classement d'un utilisateur spécifique depuis la base de données

**Exemple** :
```
GET /api/leaderboard/user/507f1f77bcf86cd799439011
```

**Réponse** :
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "badges": ["🏆 Master des Projets", "🎓 Génie des Quiz"],
    "points": 2500,
    "leaderboardStats": {
      "globalRank": 1,
      "globalPoints": 2500,
      "quizRank": 2,
      "quizPoints": 1200,
      "projectRank": 1,
      "projectPoints": 800,
      "formationRank": 3,
      "formationPoints": 500,
      "weeklyRank": 1,
      "weeklyPoints": 350,
      "monthlyRank": 1,
      "monthlyPoints": 1200,
      "lastUpdated": "2025-01-15T14:30:00.000Z"
    }
  }
}
```

---

## 5. Filtrage par Période et Catégorie

### 5.1 Filtrage par Période

| Période | Description | Calcul |
|---------|-------------|--------|
| **all** | Tout temps | Tous les points depuis l'inscription |
| **weekly** | Cette semaine | Points des 7 derniers jours |
| **monthly** | Ce mois | Points des 30 derniers jours |

**Logique** :
```javascript
let startDate = null;
const now = new Date();

if (period === "weekly") {
  startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
} else if (period === "monthly") {
  startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

// Filtrer les actions après startDate
if (startDate && new Date(action.date) < startDate) return;
```

---

### 5.2 Filtrage par Catégorie

| Catégorie | Description | Points Comptabilisés |
|-----------|-------------|----------------------|
| **all** | Global | Quiz + Projets + Formations |
| **quiz** | Quiz uniquement | Points des quiz réussis |
| **projects** | Projets uniquement | Points des projets terminés |
| **formations** | Formations uniquement | Points des certificats obtenus |

**Calcul des Points** :

#### Quiz
```javascript
let quizPoints = 0;
user.quizzes.forEach((quizResult) => {
  if (quizResult.score >= passingScore) {
    let points = quizResult.score;
    if (quiz.difficulty === "difficile") points *= 1.5;
    else if (quiz.difficulty === "moyen") points *= 1.2;
    quizPoints += Math.round(points);
  }
});
```

#### Projets
```javascript
let projectPoints = 0;
userProjects.forEach((project) => {
  if (project.status === "terminé") {
    let points = 100;
    if (project.difficulty === "Advanced") points = 200;
    else if (project.difficulty === "Intermediate") points = 150;
    projectPoints += points;
  } else if (project.status === "en cours") {
    projectPoints += 25;
  }
});
```

#### Formations
```javascript
let formationPoints = user.certificates.length * 150;
```

---

## 6. Mise à Jour Automatique

### 6.1 Script de Mise à Jour

**Fichier** : `scripts/update-leaderboard.js`

**Fonctionnement** :
1. Se connecte à MongoDB
2. Calcule le classement pour toutes les combinaisons :
   - 3 périodes × 4 catégories = 12 classements
3. Met à jour chaque utilisateur dans la base de données
4. Se déconnecte

**Exécution** :
```bash
node scripts/update-leaderboard.js
```

**Sortie** :
```
🚀 Démarrage de la mise à jour du classement...
📡 Connexion à MongoDB: mongodb://localhost:27017/mondb
✅ Connecté à MongoDB

📊 Calcul du classement: all / all
✅ 150 utilisateurs mis à jour

📊 Calcul du classement: all / quiz
✅ 150 utilisateurs mis à jour

...

🎉 Mise à jour du classement terminée avec succès !
👋 Déconnecté de MongoDB
```

---

### 6.2 Automatisation avec Cron

**Linux/Mac** (`crontab -e`) :
```bash
# Mise à jour toutes les heures
0 * * * * cd /path/to/Apprencia && node scripts/update-leaderboard.js

# Mise à jour toutes les 6 heures
0 */6 * * * cd /path/to/Apprencia && node scripts/update-leaderboard.js
```

**Windows** (Task Scheduler) :
1. Ouvrir "Planificateur de tâches"
2. Créer une tâche de base
3. Déclencheur : Toutes les heures
4. Action : Démarrer un programme
5. Programme : `node`
6. Arguments : `C:\path\to\Apprencia\scripts\update-leaderboard.js`

---

## 7. Utilisation

### 7.1 Frontend - Afficher le Classement

```typescript
// Récupérer le classement
const response = await fetch('/api/leaderboard?period=weekly&category=all&userId=123');
const data = await response.json();

// Afficher le top 10
data.leaderboard.slice(0, 10).map((user) => (
  <div key={user.userId}>
    <span>#{user.rank}</span>
    <span>{user.name}</span>
    <span>{user.totalPoints} pts</span>
  </div>
));

// Afficher le classement de l'utilisateur connecté
if (data.currentUserRank) {
  <div>
    Votre classement : #{data.currentUserRank.rank}
    Points : {data.currentUserRank.totalPoints}
  </div>
}
```

### 7.2 Frontend - Afficher le Profil Utilisateur

```typescript
// Récupérer le classement de l'utilisateur
const response = await fetch('/api/leaderboard/user/123');
const data = await response.json();

// Afficher les stats
<div>
  <h2>{data.user.name}</h2>
  <p>Classement global : #{data.user.leaderboardStats.globalRank}</p>
  <p>Points globaux : {data.user.leaderboardStats.globalPoints}</p>
  
  <h3>Par catégorie</h3>
  <p>Quiz : #{data.user.leaderboardStats.quizRank} ({data.user.leaderboardStats.quizPoints} pts)</p>
  <p>Projets : #{data.user.leaderboardStats.projectRank} ({data.user.leaderboardStats.projectPoints} pts)</p>
  <p>Formations : #{data.user.leaderboardStats.formationRank} ({data.user.leaderboardStats.formationPoints} pts)</p>
  
  <h3>Par période</h3>
  <p>Cette semaine : #{data.user.leaderboardStats.weeklyRank} ({data.user.leaderboardStats.weeklyPoints} pts)</p>
  <p>Ce mois : #{data.user.leaderboardStats.monthlyRank} ({data.user.leaderboardStats.monthlyPoints} pts)</p>
</div>
```

---

## 8. Avantages du Système

| Avantage | Description |
|----------|-------------|
| **⚡ Performance** | Lecture rapide depuis la base de données (pas de recalcul) |
| **📊 Historique** | Conservation du classement dans le temps |
| **🔍 Filtrage** | Filtrage par période et catégorie |
| **🎯 Précision** | Classement mis à jour régulièrement |
| **📈 Évolution** | Suivi de la progression de l'utilisateur |

---

**Fin de la documentation**

