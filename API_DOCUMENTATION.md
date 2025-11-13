# 🔌 Documentation des API Routes - Apprencia

**Projet** : Apprencia - Plateforme d'apprentissage et de gestion de projets  
**Auteur** : Ines Ismail  
**Date** : Janvier 2025  
**Base URL** : `http://localhost:3000` (local) ou `https://apprencia.vercel.app` (production)

---

## Table des Matières

1. [API Projets](#1-api-projets)
2. [API Tâches](#2-api-tâches)
3. [API Quiz](#3-api-quiz)
4. [API Utilisateurs](#4-api-utilisateurs)
5. [API Formations](#5-api-formations)
6. [API Certificats](#6-api-certificats)
7. [API Leaderboard](#7-api-leaderboard)
8. [API Upload](#8-api-upload)
9. [API Skills](#9-api-skills)
10. [Codes d'Erreur](#10-codes-derreur)

---

## 1. API Projets

### GET /api/projects
**Description** : Récupère la liste de tous les projets

**Requête** :
```http
GET /api/projects
```

**Réponse** (200 OK) :
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Créer une application de gestion de tâches",
    "description": "Développer une application web complète...",
    "technologies": ["React", "Node.js", "MongoDB"],
    "status": "à venir",
    "difficulty": "Intermediate",
    "objectives": ["Apprendre React", "Maîtriser MongoDB"],
    "duration": "2 semaines",
    "githubUrl": "https://github.com/example/project",
    "takenBy": null,
    "takenAt": null,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

### POST /api/projects
**Description** : Crée un nouveau projet (Admin uniquement)

**Requête** :
```http
POST /api/projects
Content-Type: application/json

{
  "title": "Créer un chatbot IA",
  "description": "Développer un chatbot avec OpenAI",
  "technologies": ["Python", "OpenAI", "Flask"],
  "difficulty": "Advanced",
  "objectives": ["Intégrer OpenAI API", "Créer une interface"],
  "duration": "3 semaines"
}
```

**Réponse** (201 Created) :
```json
{
  "message": "Projet créé avec succès",
  "project": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Créer un chatbot IA",
    ...
  }
}
```

---

### GET /api/projects/[id]
**Description** : Récupère les détails d'un projet spécifique

**Requête** :
```http
GET /api/projects/507f1f77bcf86cd799439011
```

**Réponse** (200 OK) :
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Créer une application de gestion de tâches",
  "description": "Développer une application web complète...",
  ...
}
```

---

### POST /api/projects/[id]/take
**Description** : Permet à un utilisateur de prendre un projet

**Requête** :
```http
POST /api/projects/507f1f77bcf86cd799439011/take
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439020"
}
```

**Réponse** (200 OK) :
```json
{
  "message": "Projet pris avec succès",
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "en cours",
    "takenBy": "507f1f77bcf86cd799439020",
    "takenAt": "2025-01-15T14:30:00.000Z"
  }
}
```

**Erreur** (400 Bad Request) :
```json
{
  "message": "Ce projet est déjà pris par un autre utilisateur"
}
```

---

### POST /api/projects/[id]/complete
**Description** : Marque un projet comme terminé (toutes les tâches doivent être done)

**Requête** :
```http
POST /api/projects/507f1f77bcf86cd799439011/complete
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439020"
}
```

**Réponse** (200 OK) :
```json
{
  "message": "Projet marqué comme terminé",
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "terminé"
  }
}
```

**Erreur** (400 Bad Request) :
```json
{
  "message": "Toutes les tâches ne sont pas terminées"
}
```

---

## 2. API Tâches

### GET /api/projects/[id]/tasks
**Description** : Récupère toutes les tâches d'un projet

**Requête** :
```http
GET /api/projects/507f1f77bcf86cd799439011/tasks
Headers:
  x-user-id: 507f1f77bcf86cd799439020
```

**Réponse** (200 OK) :
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "title": "Créer la base de données",
    "description": "Configurer MongoDB et créer les schémas",
    "projectId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439020",
    "status": "done",
    "priority": "high",
    "hours": 4,
    "startDate": "2025-01-15T09:00:00.000Z",
    "endDate": "2025-01-15T13:00:00.000Z",
    "createdAt": "2025-01-15T08:00:00.000Z",
    "updatedAt": "2025-01-15T13:00:00.000Z"
  }
]
```

---

### POST /api/projects/[id]/tasks
**Description** : Crée une nouvelle tâche pour un projet

**Requête** :
```http
POST /api/projects/507f1f77bcf86cd799439011/tasks
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439020",
  "title": "Créer l'interface utilisateur",
  "description": "Développer les composants React",
  "priority": "medium",
  "hours": 8
}
```

**Réponse** (201 Created) :
```json
{
  "message": "Tâche créée avec succès",
  "task": {
    "_id": "507f1f77bcf86cd799439031",
    "title": "Créer l'interface utilisateur",
    "status": "todo",
    ...
  }
}
```

---

### PATCH /api/tasks/[id]
**Description** : Met à jour une tâche (statut, priorité, etc.)

**Requête** :
```http
PATCH /api/tasks/507f1f77bcf86cd799439030
Content-Type: application/json

{
  "status": "doing"
}
```

**Réponse** (200 OK) :
```json
{
  "message": "Tâche mise à jour",
  "task": {
    "_id": "507f1f77bcf86cd799439030",
    "status": "doing",
    "startDate": "2025-01-15T14:00:00.000Z"
  }
}
```

---

### DELETE /api/tasks/[id]
**Description** : Supprime une tâche

**Requête** :
```http
DELETE /api/tasks/507f1f77bcf86cd799439030
```

**Réponse** (200 OK) :
```json
{
  "message": "Tâche supprimée avec succès"
}
```

---

## 3. API Quiz

### GET /api/quiz
**Description** : Récupère la liste de tous les quiz

**Requête** :
```http
GET /api/quiz
Headers:
  authorization: 507f1f77bcf86cd799439020
```

**Réponse** (200 OK) :
```json
[
  {
    "_id": "507f1f77bcf86cd799439040",
    "title": "Quiz JavaScript Avancé",
    "description": "Testez vos connaissances en JavaScript",
    "category": "Frontend",
    "difficulty": "difficile",
    "timeLimit": 30,
    "passingScore": 70,
    "questions": [
      {
        "question": "Qu'est-ce qu'une closure en JavaScript ?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 1
      }
    ],
    "createdAt": "2025-01-10T10:00:00.000Z"
  }
]
```

---

### GET /api/quiz/[id]
**Description** : Récupère les détails d'un quiz spécifique

**Requête** :
```http
GET /api/quiz/507f1f77bcf86cd799439040
```

**Réponse** (200 OK) :
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "title": "Quiz JavaScript Avancé",
  "questions": [...],
  "timeLimit": 30
}
```

---

### POST /api/quiz/[id]/submit
**Description** : Soumet les réponses d'un quiz et calcule le score

**Requête** :
```http
POST /api/quiz/507f1f77bcf86cd799439040/submit
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439020",
  "answers": [1, 2, 0, 3, 1],
  "score": 80
}
```

**Réponse** (200 OK) :
```json
{
  "message": "Quiz soumis avec succès",
  "score": 80,
  "passed": true,
  "certificate": {
    "_id": "507f1f77bcf86cd799439050",
    "userId": "507f1f77bcf86cd799439020",
    "quizId": "507f1f77bcf86cd799439040",
    "score": 80,
    "pdfUrl": "/uploads/certificate_1234.pdf"
  }
}
```

---

### POST /api/quiz
**Description** : Crée un nouveau quiz (Admin uniquement)

**Requête** :
```http
POST /api/quiz
Content-Type: application/json

{
  "title": "Quiz React Hooks",
  "description": "Testez vos connaissances sur les hooks React",
  "category": "Frontend",
  "difficulty": "moyen",
  "passingScore": 70,
  "questions": [
    {
      "question": "Quel hook permet de gérer l'état ?",
      "options": ["useEffect", "useState", "useContext", "useRef"],
      "correctAnswer": 1
    }
  ]
}
```

**Réponse** (201 Created) :
```json
{
  "message": "Quiz créé avec succès",
  "quiz": {
    "_id": "507f1f77bcf86cd799439041",
    "title": "Quiz React Hooks",
    "timeLimit": 10
  }
}
```

---

## 4. API Utilisateurs

### POST /api/user
**Description** : Récupère les informations d'un utilisateur par email

**Requête** :
```http
POST /api/user
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Réponse** (200 OK) :
```json
{
  "skills": ["React", "Node.js", "MongoDB"],
  "cvUrl": "/uploads/1234_cv.pdf",
  "totalUsers": 150
}
```

---

### GET /api/user/[id]
**Description** : Récupère les détails complets d'un utilisateur

**Requête** :
```http
GET /api/user/507f1f77bcf86cd799439020
```

**Réponse** (200 OK) :
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "skills": ["React", "Node.js"],
  "points": 250,
  "badges": ["Débutant", "Quiz Master"],
  "quizzes": [...],
  "projectsTaken": [...],
  "certificates": [...]
}
```

---

## 5. API Formations

### GET /api/Formation
**Description** : Récupère la liste de toutes les formations

**Requête** :
```http
GET /api/Formation
```

**Réponse** (200 OK) :
```json
[
  {
    "_id": "507f1f77bcf86cd799439060",
    "title": "Introduction à React",
    "description": "Apprenez les bases de React",
    "photoUrl": "/uploads/react_cover.jpg",
    "videoUrl": "/uploads/react_intro.mp4",
    "duration": "2 heures",
    "instructor": "John Doe",
    "level": "Débutant",
    "category": "Frontend",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
]
```

---

### POST /api/Formation
**Description** : Crée une nouvelle formation (Admin uniquement)

**Requête** :
```http
POST /api/Formation
Content-Type: multipart/form-data

{
  "title": "Node.js Avancé",
  "description": "Maîtrisez Node.js",
  "duration": "4 heures",
  "instructor": "Jane Smith",
  "level": "Avancé",
  "category": "Backend",
  "photo": [fichier image],
  "video": [fichier vidéo]
}
```

**Réponse** (201 Created) :
```json
{
  "message": "Formation créée avec succès",
  "formation": {
    "_id": "507f1f77bcf86cd799439061",
    "title": "Node.js Avancé",
    ...
  }
}
```

---

## 6. API Certificats

### GET /api/certificates
**Description** : Récupère les certificats d'un utilisateur

**Requête** :
```http
GET /api/certificates?userId=507f1f77bcf86cd799439020
```

**Réponse** (200 OK) :
```json
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "userId": "507f1f77bcf86cd799439020",
    "quizId": "507f1f77bcf86cd799439040",
    "quizTitle": "Quiz JavaScript Avancé",
    "score": 85,
    "date": "2025-01-15T15:00:00.000Z",
    "pdfUrl": "/uploads/certificate_1234.pdf"
  }
]
```

---

## 7. API Leaderboard

### GET /api/leaderboard
**Description** : Récupère le classement des utilisateurs

**Requête** :
```http
GET /api/leaderboard?userId=507f1f77bcf86cd799439020
```

**Réponse** (200 OK) :
```json
{
  "topUsers": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "firstName": "Alice",
      "lastName": "Johnson",
      "points": 500,
      "badges": ["Expert", "Quiz Master"],
      "rank": 1
    },
    {
      "_id": "507f1f77bcf86cd799439020",
      "firstName": "John",
      "lastName": "Doe",
      "points": 250,
      "badges": ["Débutant"],
      "rank": 5
    }
  ],
  "currentUserRank": {
    "_id": "507f1f77bcf86cd799439020",
    "firstName": "John",
    "lastName": "Doe",
    "points": 250,
    "rank": 5
  }
}
```

---

## 8. API Upload

### POST /api/upload
**Description** : Upload un CV et extrait les compétences via IA

**Requête** :
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "email": "user@example.com",
  "file": [fichier PDF]
}
```

**Réponse** (200 OK) :
```json
{
  "message": "✅ CV mis à jour et compétences extraites",
  "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
  "cvUrl": "/uploads/1234567890_cv.pdf"
}
```

**Erreur** (400 Bad Request) :
```json
{
  "error": "Seuls les fichiers PDF sont acceptés"
}
```

---

## 9. API Skills

### POST /api/Skills
**Description** : Extrait les compétences d'un texte via Hugging Face NER

**Requête** :
```http
POST /api/Skills
Content-Type: application/json

{
  "text": "Je suis développeur avec 5 ans d'expérience en React, Node.js et MongoDB. J'ai travaillé chez Google."
}
```

**Réponse** (200 OK) :
```json
{
  "skills": ["React", "Node.js", "MongoDB", "Google"]
}
```

---

## 10. Codes d'Erreur

| Code | Signification | Description |
|------|---------------|-------------|
| **200** | OK | Requête réussie |
| **201** | Created | Ressource créée avec succès |
| **400** | Bad Request | Données invalides ou manquantes |
| **401** | Unauthorized | Authentification requise |
| **403** | Forbidden | Accès refusé (permissions insuffisantes) |
| **404** | Not Found | Ressource non trouvée |
| **500** | Internal Server Error | Erreur serveur |

---

## Exemples d'Utilisation

### Exemple 1 : Prendre un projet et créer des tâches

```javascript
// 1. Récupérer les projets
const response = await fetch('/api/projects');
const projects = await response.json();

// 2. Prendre un projet
const takeResponse = await fetch(`/api/projects/${projectId}/take`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({userId: '507f1f77bcf86cd799439020'})
});

// 3. Créer une tâche
const taskResponse = await fetch(`/api/projects/${projectId}/tasks`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    userId: '507f1f77bcf86cd799439020',
    title: 'Créer la base de données',
    priority: 'high',
    hours: 4
  })
});
```

### Exemple 2 : Passer un quiz et obtenir un certificat

```javascript
// 1. Récupérer le quiz
const quizResponse = await fetch('/api/quiz/507f1f77bcf86cd799439040');
const quiz = await quizResponse.json();

// 2. Soumettre les réponses
const submitResponse = await fetch(`/api/quiz/${quiz._id}/submit`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    userId: '507f1f77bcf86cd799439020',
    answers: [1, 2, 0, 3, 1],
    score: 80
  })
});

const result = await submitResponse.json();
if (result.passed) {
  console.log('Certificat obtenu:', result.certificate.pdfUrl);
}
```

---

**Fin de la documentation API**

