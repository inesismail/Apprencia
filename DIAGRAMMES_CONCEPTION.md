# 📊 Diagrammes de Conception - Apprencia

**Projet** : Apprencia - Plateforme d'apprentissage et de gestion de projets  
**Auteur** : Ines Ismail  
**Date** : Janvier 2025  
**Contexte** : Rapport de Stage

---

## Table des Matières

1. [Introduction](#introduction)
2. [Diagramme de Cas d'Utilisation](#1-diagramme-de-cas-dutilisation)
3. [Diagramme de Classes](#2-diagramme-de-classes)
4. [Diagrammes de Séquence](#3-diagrammes-de-séquence)
5. [Architecture du Système](#4-architecture-du-système)
6. [Dictionnaire de Données](#5-dictionnaire-de-données)

---

## Introduction

**Apprencia** est une plateforme web complète d'apprentissage et de gestion de projets développée avec **Next.js 15**, **React 18**, **TypeScript**, **MongoDB** et **Tailwind CSS**.

### Objectifs du Projet

- 🎓 **Formation** : Offrir des formations vidéo et des ressources pédagogiques
- 📝 **Quiz** : Évaluer les connaissances avec des quiz interactifs
- 🏆 **Certification** : Délivrer des certificats aux apprenants
- 💼 **Projets** : Permettre aux utilisateurs de prendre et gérer des projets
- 📊 **Suivi** : Suivre la progression avec un système de tâches
- 🤖 **IA** : Intégrer l'IA pour l'extraction de compétences (Hugging Face)
- 🏅 **Leaderboard** : Gamification avec système de points et classement

---

## 1. Diagramme de Cas d'Utilisation

### 1.1 Gestion de Projet

Le diagramme de cas d'utilisation ci-dessous illustre les interactions entre les acteurs (Utilisateur et Administrateur) et le système pour la **gestion de projet**.

#### Acteurs

- **Utilisateur** : Apprenant qui utilise la plateforme pour prendre des projets, créer des tâches et suivre sa progression
- **Administrateur** : Gestionnaire de la plateforme qui crée et gère les projets, formations et quiz
- **Système Automatique de Complétion** : Système qui vérifie automatiquement si toutes les tâches sont terminées et marque le projet comme "terminé"

#### Cas d'Utilisation Détaillés

##### Pour l'Utilisateur :

| ID | Cas d'Utilisation | Description | Prérequis |
|----|-------------------|-------------|-----------|
| UC1 | Consulter les projets disponibles | Voir la liste des projets avec leurs détails (titre, difficulté, technologies, statut) | Compte créé |
| UC2 | Filtrer les projets | Filtrer les projets par difficulté (Beginner/Intermediate/Advanced) ou technologie | UC1 |
| UC3 | Prendre un projet | Sélectionner un projet "à venir" et le marquer comme "en cours" (takenBy = userId) | UC1 + Projet disponible |
| UC4 | Créer une tâche | Ajouter une tâche pour décomposer le projet (titre, description, priorité, heures) | UC3 |
| UC5 | Modifier une tâche | Éditer le titre, description, priorité ou heures estimées d'une tâche | UC4 |
| UC6 | Changer le statut d'une tâche | Passer une tâche de "todo" → "doing" → "done" (déclenche vérification automatique) | UC4 |
| UC7 | Supprimer une tâche | Retirer une tâche du projet (déclenche vérification automatique) | UC4 |
| UC8 | Consulter la progression du projet | Voir le pourcentage de tâches terminées et le statut du projet | UC3 |
| UC9 | Abandonner un projet | Libérer le projet (takenBy = null, status = "à venir") | UC3 |

##### Pour l'Administrateur :

| ID | Cas d'Utilisation | Description | Prérequis |
|----|-------------------|-------------|-----------|
| UC10 | Créer un nouveau projet | Ajouter un projet avec titre, description, technologies, difficulté, objectifs | Rôle admin |
| UC11 | Modifier un projet | Éditer les informations d'un projet existant | Rôle admin |
| UC12 | Supprimer un projet | Retirer un projet de la plateforme (même s'il est pris) | Rôle admin |
| UC13 | Consulter les statistiques des projets | Voir les métriques (projets terminés, en cours, taux de complétion) | Rôle admin |

##### Système Automatique de Complétion :

| Déclencheur | Action Automatique | Logique Implémentée |
|-------------|-------------------|---------------------|
| **UC6** : Changement de statut d'une tâche | Vérification de complétion du projet | `allTasks.every(t => t.status === "done")` → Si vrai : `project.status = "terminé"` |
| **UC6** : Changement de statut d'une tâche | Réouverture du projet | Si au moins une tâche n'est pas "done" ET `project.status === "terminé"` → `project.status = "en cours"` |
| **UC7** : Suppression d'une tâche | Vérification de complétion du projet | Même logique que UC6 après suppression de la tâche |

**⚠️ Point Important** : L'utilisateur **ne marque jamais manuellement** le projet comme terminé. Le système le fait **automatiquement** dès que la dernière tâche passe à "done".

#### Relations entre Cas d'Utilisation

- **Extends** : UC2 (Filtrer) étend UC1 (Consulter)
- **Requires** : UC4, UC5, UC6, UC7, UC8, UC9 nécessitent UC3 (avoir pris le projet)
- **Triggers** : UC6 et UC7 déclenchent le Système Automatique de Complétion

---

## 2. Diagramme de Classes

### 2.1 Vue d'ensemble

Le diagramme de classes représente la structure des données du système Apprencia avec **8 classes principales** et leurs relations.

### 2.2 Classes Principales

#### 2.2.1 User (Utilisateur)

**Responsabilité** : Représente un utilisateur de la plateforme (apprenant ou administrateur)

**Attributs** :
- `_id` : ObjectId - Identifiant unique MongoDB
- `email` : String - Email unique (authentification)
- `password` : String - Mot de passe hashé (bcrypt)
- `firstName`, `lastName` : String - Nom et prénom
- `phone` : String - Numéro de téléphone
- `birthDate` : Date - Date de naissance
- `address` : String - Adresse
- `cvUrl` : String - URL du CV uploadé
- `cvText` : String - Texte extrait du CV
- `skills` : String[] - Compétences extraites par IA
- `quizzes` : QuizResult[] - Résultats des quiz passés
- `role` : String - Rôle (user | admin)
- `projectsTaken` : ObjectId[] - Références aux projets pris
- `certificates` : ObjectId[] - Références aux certificats obtenus
- `isApproved` : Boolean - Compte approuvé par admin
- `points` : Number - Points pour le leaderboard
- `badges` : String[] - Badges obtenus
- `createdAt`, `updatedAt` : Date - Timestamps

**Méthodes** :
- `comparePassword(password: String): Boolean` - Vérifie le mot de passe

**Relations** :
- 1 User → 0..* Project (prend)
- 1 User → 0..* Task (crée)
- 1 User → 0..* QuizResult (passe)
- 1 User → 0..* Certificate (obtient)
- 1 User → 0..* Feedback (donne)

---

#### 2.2.2 Project (Projet)

**Responsabilité** : Représente un projet que les utilisateurs peuvent prendre et réaliser

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `title` : String - Titre du projet
- `description` : String - Description détaillée
- `technologies` : String[] - Technologies utilisées (React, Node.js, etc.)
- `status` : String - Statut (à venir | en cours | terminé)
- `difficulty` : String - Difficulté (Beginner | Intermediate | Advanced)
- `objectives` : String[] - Objectifs pédagogiques
- `duration` : String - Durée estimée
- `githubUrl` : String - URL du repository GitHub
- `takenBy` : ObjectId - Référence à l'utilisateur qui a pris le projet
- `takenAt` : Date - Date de prise du projet
- `createdAt`, `updatedAt` : Date - Timestamps

**Relations** :
- 1 Project → 0..* Task (contient)
- * Project → 1 User (pris par)

---

#### 2.2.3 Task (Tâche)

**Responsabilité** : Représente une tâche dans un projet (décomposition du travail)

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `title` : String - Titre de la tâche
- `description` : String - Description
- `projectId` : ObjectId - Référence au projet parent
- `userId` : ObjectId - Référence à l'utilisateur assigné
- `status` : String - Statut (todo | doing | done)
- `priority` : String - Priorité (low | medium | high)
- `hours` : Number - Heures estimées
- `startDate` : Date - Date de début
- `endDate` : Date - Date de fin
- `createdAt`, `updatedAt` : Date - Timestamps

**Relations** :
- * Task → 1 Project (appartient à)
- * Task → 1 User (assignée à)

---

#### 2.2.4 Quiz

**Responsabilité** : Représente un quiz d'évaluation des connaissances

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `title` : String - Titre du quiz
- `description` : String - Description
- `questions` : Question[] - Liste des questions
- `timeLimit` : Number - Temps limite en minutes (calculé automatiquement)
- `passingScore` : Number - Score minimum pour réussir (%)
- `category` : String - Catégorie (Frontend, Backend, etc.)
- `difficulty` : String - Difficulté (facile | moyen | difficile)
- `createdAt`, `updatedAt` : Date - Timestamps

**Relations** :
- 1 Quiz → 1..* Question (contient)
- 1 Quiz → 0..* QuizResult (génère)
- 1 Quiz → 0..* Certificate (délivre)

---

#### 2.2.5 Question

**Responsabilité** : Représente une question dans un quiz

**Attributs** :
- `question` : String - Texte de la question
- `options` : String[] - Options de réponse (4 choix)
- `correctAnswer` : Number - Index de la bonne réponse (0-3)

**Relations** :
- * Question → 1 Quiz (appartient à)

---

#### 2.2.6 QuizResult

**Responsabilité** : Représente le résultat d'un quiz passé par un utilisateur

**Attributs** :
- `quiz` : ObjectId - Référence au quiz
- `score` : Number - Score obtenu (%)
- `date` : Date - Date de passage
- `title` : String - Titre du quiz (dénormalisé)

**Relations** :
- * QuizResult → 1 Quiz (référence)
- * QuizResult → 1 User (appartient à)

---

#### 2.2.7 Certificate (Certificat)

**Responsabilité** : Représente un certificat délivré après réussite d'un quiz

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `userId` : ObjectId - Référence à l'utilisateur
- `quizId` : ObjectId - Référence au quiz
- `quizTitle` : String - Titre du quiz
- `score` : Number - Score obtenu
- `date` : Date - Date d'obtention
- `pdfUrl` : String - URL du PDF du certificat

**Relations** :
- * Certificate → 1 User (appartient à)
- * Certificate → 1 Quiz (certifie)

---

#### 2.2.8 Formation

**Responsabilité** : Représente une formation vidéo ou un cours

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `title` : String - Titre de la formation
- `description` : String - Description
- `photoUrl` : String - URL de l'image de couverture
- `videoUrl` : String - URL de la vidéo
- `duration` : String - Durée de la formation
- `instructor` : String - Nom de l'instructeur
- `level` : String - Niveau (Débutant | Intermédiaire | Avancé)
- `category` : String - Catégorie
- `createdAt`, `updatedAt` : Date - Timestamps

---

#### 2.2.9 Feedback

**Responsabilité** : Représente un retour d'expérience d'un utilisateur

**Attributs** :
- `_id` : ObjectId - Identifiant unique
- `userId` : ObjectId - Référence à l'utilisateur
- `comment` : String - Commentaire
- `rating` : Number - Note (1-5 étoiles)
- `createdAt`, `updatedAt` : Date - Timestamps

**Relations** :
- * Feedback → 1 User (créé par)

---

## 3. Diagrammes de Séquence

### 3.1 Prise d'un Projet

**Scénario** : Un utilisateur consulte les projets disponibles et prend un projet

**Acteurs** :
- Utilisateur
- Interface Web (Frontend)
- API Next.js
- MongoDB
- Système d'Authentification

**Flux Principal** :

1. **Consultation des projets**
   - L'utilisateur accède à la page `/projects`
   - Le frontend envoie `GET /api/projects`
   - L'API interroge MongoDB avec `Project.find()`
   - MongoDB retourne la liste des projets
   - Le frontend affiche les projets avec filtres

2. **Prise du projet**
   - L'utilisateur clique sur "Prendre ce projet"
   - Le frontend vérifie la session utilisateur (localStorage)
   - Le frontend envoie `POST /api/projects/{id}/take` avec `{userId}`
   - L'API vérifie que le projet existe avec `Project.findById(id)`

3. **Vérification de disponibilité**
   - **Si le projet est déjà pris** : L'API retourne une erreur 400
   - **Si le projet est disponible** :
     - L'API met à jour le projet : `Project.update({takenBy: userId, status: "en cours"})`
     - L'API met à jour l'utilisateur : `User.update({$push: {projectsTaken: projectId}})`
     - L'API retourne un succès 200
     - Le frontend affiche "Projet pris avec succès!"
     - Redirection vers `/projects/{id}`

---

### 3.2 Création et Suivi des Tâches

**Scénario** : Un utilisateur crée des tâches pour son projet et suit leur progression

**Flux Principal** :

1. **Consultation des tâches**
   - L'utilisateur ouvre le tracker de progression
   - Le frontend envoie `GET /api/projects/{id}/tasks`
   - L'API interroge MongoDB : `Task.find({projectId, userId})`
   - Le frontend affiche les tâches groupées par statut (todo, doing, done)

2. **Création d'une tâche**
   - L'utilisateur clique sur "Ajouter une tâche"
   - L'utilisateur remplit le formulaire (titre, description, priorité, heures)
   - Le frontend envoie `POST /api/projects/{id}/tasks`
   - L'API crée la tâche : `Task.create({...})`
   - Le frontend affiche "Tâche créée!"

3. **Modification du statut**
   - L'utilisateur change le statut (todo → doing)
   - Le frontend envoie `PATCH /api/tasks/{taskId}` avec `{status: "doing"}`
   - L'API met à jour la tâche : `Task.findByIdAndUpdate(taskId, {status})`
   - L'API vérifie toutes les tâches du projet : `Task.find({projectId})`

4. **Vérification de complétion**
   - **Si toutes les tâches sont terminées** :
     - L'API met à jour le projet : `Project.update({status: "terminé"})`
     - Le frontend affiche "🎉 Projet terminé!"
   - **Sinon** : Le frontend affiche simplement le changement de statut

---

## 4. Architecture du Système

### 4.1 Architecture en Couches

Le système Apprencia suit une **architecture en couches** (Layered Architecture) avec séparation des responsabilités :

#### Couche 1 : Présentation (Frontend)

**Technologies** : React 18, Next.js 15, TypeScript, Tailwind CSS

**Composants** :
- **Pages** : Accueil, Projets, Quiz, Formations, Leaderboard, Profil, Admin
- **Composants réutilisables** : TaskTracker, ChatBot, QuizCard, FormationCard, Sidebar
- **UI Components** : Shadcn/ui (Card, Button, Input, Badge, etc.)

**Responsabilités** :
- Affichage de l'interface utilisateur
- Gestion des interactions utilisateur
- Validation côté client
- Gestion de l'état local (useState, useEffect)
- Routing (Next.js App Router)

---

#### Couche 2 : API (Backend)

**Technologies** : Next.js API Routes, Node.js

**Routes API** :
- `/api/projects` - CRUD des projets
- `/api/tasks` - CRUD des tâches
- `/api/quiz` - Gestion des quiz
- `/api/user` - Gestion des utilisateurs
- `/api/Formation` - Gestion des formations
- `/api/certificates` - Génération de certificats
- `/api/leaderboard` - Classement des utilisateurs
- `/api/upload` - Upload de CV et extraction de compétences
- `/api/Skills` - Extraction de compétences via IA

**Responsabilités** :
- Validation des données
- Logique métier
- Gestion des erreurs
- Authentification et autorisation
- Communication avec la base de données

---

#### Couche 3 : Services

**Services externes et utilitaires** :

1. **Authentification** (bcryptjs)
   - Hashage des mots de passe
   - Comparaison de mots de passe
   - Gestion des tokens de réinitialisation

2. **Hugging Face API**
   - Modèle NER (dslim/bert-base-NER) : Extraction d'entités nommées
   - Modèle Summarization (facebook/bart-large-cnn) : Résumé de texte

3. **PDF Parser** (pdf-parse)
   - Extraction de texte depuis les CV PDF

4. **Email Service** (Nodemailer)
   - Envoi d'emails de réinitialisation de mot de passe
   - Notifications

---

#### Couche 4 : Données

**Base de données** : MongoDB (NoSQL)

**Collections** :
- `users` - Utilisateurs
- `projects` - Projets
- `tasks` - Tâches
- `quizzes` - Quiz
- `formations` - Formations
- `certificates` - Certificats
- `feedbacks` - Retours d'expérience

**ODM** : Mongoose (Object Document Mapper)

---

#### Couche 5 : Stockage Fichiers

**Système de fichiers** : `public/uploads/`

**Fichiers stockés** :
- CV des utilisateurs (PDF)
- Images de formations
- Vidéos de formations (ignorées dans Git)

---

### 4.2 Flux de Données

```
Utilisateur
    ↓
Interface Web (React)
    ↓
API Routes (Next.js)
    ↓
Services (Auth, IA, Email)
    ↓
MongoDB / Système de Fichiers
```

---

## 5. Dictionnaire de Données

### 5.1 Collection Users

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| _id | ObjectId | Identifiant unique | PK, Auto |
| email | String | Email de l'utilisateur | Unique, Required |
| password | String | Mot de passe hashé | Required, Select: false |
| firstName | String | Prénom | - |
| lastName | String | Nom | - |
| phone | String | Téléphone | - |
| birthDate | Date | Date de naissance | - |
| address | String | Adresse | - |
| cvUrl | String | URL du CV | - |
| cvText | String | Texte extrait du CV | Default: "" |
| skills | String[] | Compétences | Default: [] |
| role | String | Rôle | Enum: [user, admin], Default: user |
| projectsTaken | ObjectId[] | Projets pris | Ref: Project |
| certificates | ObjectId[] | Certificats | Ref: Certificate |
| isApproved | Boolean | Compte approuvé | Default: false |
| points | Number | Points leaderboard | Default: 0 |
| badges | String[] | Badges obtenus | Default: [] |
| createdAt | Date | Date de création | Auto |
| updatedAt | Date | Date de modification | Auto |

### 5.2 Collection Projects

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| _id | ObjectId | Identifiant unique | PK, Auto |
| title | String | Titre du projet | Required |
| description | String | Description | Required |
| technologies | String[] | Technologies | Default: [] |
| status | String | Statut | Enum: [à venir, en cours, terminé] |
| difficulty | String | Difficulté | Enum: [Beginner, Intermediate, Advanced] |
| objectives | String[] | Objectifs | Default: [] |
| duration | String | Durée estimée | - |
| githubUrl | String | URL GitHub | - |
| takenBy | ObjectId | Utilisateur | Ref: User, Default: null |
| takenAt | Date | Date de prise | Default: null |
| createdAt | Date | Date de création | Auto |
| updatedAt | Date | Date de modification | Auto |

### 5.3 Collection Tasks

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| _id | ObjectId | Identifiant unique | PK, Auto |
| title | String | Titre de la tâche | Required |
| description | String | Description | - |
| projectId | ObjectId | Projet parent | Ref: Project, Required |
| userId | ObjectId | Utilisateur assigné | Ref: User, Required |
| status | String | Statut | Enum: [todo, doing, done], Default: todo |
| priority | String | Priorité | Enum: [low, medium, high], Default: medium |
| hours | Number | Heures estimées | Default: 1, Min: 0.5 |
| startDate | Date | Date de début | - |
| endDate | Date | Date de fin | - |
| createdAt | Date | Date de création | Auto |
| updatedAt | Date | Date de modification | Auto |

---

## Conclusion

Ces diagrammes de conception illustrent l'architecture complète du système Apprencia, de la couche présentation à la couche données. Le système suit les bonnes pratiques de développement avec :

- ✅ **Séparation des responsabilités** (Layered Architecture)
- ✅ **Modèle MVC** (Model-View-Controller)
- ✅ **API RESTful** (Next.js API Routes)
- ✅ **Base de données NoSQL** (MongoDB avec Mongoose)
- ✅ **Intégration IA** (Hugging Face pour NER et Summarization)
- ✅ **Authentification sécurisée** (bcrypt)
- ✅ **Gestion de fichiers** (Upload de CV, extraction de texte)
- ✅ **Gamification** (Points, badges, leaderboard)

---

**Fin du document**

