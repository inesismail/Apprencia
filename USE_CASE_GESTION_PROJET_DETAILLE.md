# 📋 Cas d'Utilisation Détaillé - Gestion de Projet

**Projet** : Apprencia - Plateforme d'apprentissage et de gestion de projets  
**Module** : Gestion de Projet  
**Auteur** : Ines Ismail  
**Date** : Janvier 2025  
**Version** : 1.0

---

## Table des Matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Acteurs du Système](#2-acteurs-du-système)
3. [Cas d'Utilisation Utilisateur](#3-cas-dutilisation-utilisateur)
4. [Cas d'Utilisation Administrateur](#4-cas-dutilisation-administrateur)
5. [Système Automatique de Complétion](#5-système-automatique-de-complétion)
6. [Scénarios Détaillés](#6-scénarios-détaillés)
7. [Règles Métier](#7-règles-métier)

---

## 1. Vue d'ensemble

Le module de **Gestion de Projet** permet aux utilisateurs de :
- Consulter et prendre des projets disponibles
- Décomposer les projets en tâches
- Suivre la progression de leurs projets
- **Compléter automatiquement** les projets lorsque toutes les tâches sont terminées

**Particularité importante** : Le système marque **automatiquement** un projet comme "terminé" dès que toutes ses tâches passent à "done". L'utilisateur n'a **jamais** besoin de marquer manuellement le projet comme terminé.

---

## 2. Acteurs du Système

### 2.1 Utilisateur (Apprenant)

**Rôle** : Utilisateur de la plateforme qui souhaite apprendre en réalisant des projets pratiques

**Responsabilités** :
- Consulter les projets disponibles
- Prendre un projet pour le réaliser
- Créer et gérer des tâches pour organiser son travail
- Suivre sa progression

**Attributs** :
- `_id` : Identifiant unique
- `email` : Email de connexion
- `firstName`, `lastName` : Nom complet
- `role` : "user"
- `points` : Points de gamification
- `projectsTaken` : Liste des projets pris

---

### 2.2 Administrateur

**Rôle** : Gestionnaire de la plateforme qui crée et gère le contenu

**Responsabilités** :
- Créer de nouveaux projets
- Modifier ou supprimer des projets existants
- Consulter les statistiques d'utilisation

**Attributs** :
- `_id` : Identifiant unique
- `email` : Email de connexion
- `role` : "admin"

---

### 2.3 Système Automatique de Complétion

**Rôle** : Système automatisé qui vérifie l'état des tâches et met à jour le statut du projet

**Déclencheurs** :
- Changement de statut d'une tâche (UC6)
- Suppression d'une tâche (UC7)

**Actions** :
- Vérifier si toutes les tâches sont "done"
- Marquer le projet comme "terminé" si toutes les tâches sont terminées
- Réouvrir le projet (status = "en cours") si une tâche est modifiée après complétion

**Implémentation** :
```javascript
// Code dans /api/projects/[id]/tasks/route.ts (lignes 135-145)
const allTasks = await Task.find({ projectId: params.id });
const allDone = allTasks.length > 0 && allTasks.every((t) => t.status === "done");

if (allDone && project.status !== "terminé") {
  project.status = "terminé";
  await project.save();
} else if (!allDone && project.status === "terminé") {
  project.status = "en cours";
  await project.save();
}
```

---

## 3. Cas d'Utilisation Utilisateur

### UC1 : Consulter les projets disponibles

**Acteur** : Utilisateur  
**Prérequis** : Compte créé et connecté  
**Déclencheur** : L'utilisateur accède à la page `/projects`

**Scénario Principal** :
1. L'utilisateur accède à la page des projets
2. Le système affiche la liste de tous les projets avec :
   - Titre
   - Description courte
   - Technologies requises
   - Difficulté (Beginner, Intermediate, Advanced)
   - Statut (à venir, en cours, terminé)
   - Badge de disponibilité
3. L'utilisateur peut voir quels projets sont disponibles (status = "à venir")

**Postcondition** : L'utilisateur voit la liste complète des projets

**API** : `GET /api/projects`

---

### UC2 : Filtrer les projets

**Acteur** : Utilisateur  
**Prérequis** : UC1 (Consulter les projets)  
**Déclencheur** : L'utilisateur utilise les filtres de recherche

**Scénario Principal** :
1. L'utilisateur saisit un terme de recherche ou sélectionne un filtre
2. Le système filtre les projets par :
   - Difficulté (Beginner, Intermediate, Advanced)
   - Technologies (React, Node.js, MongoDB, etc.)
   - Statut (à venir, en cours, terminé)
3. Le système affiche uniquement les projets correspondants

**Postcondition** : L'utilisateur voit une liste filtrée de projets

---

### UC3 : Prendre un projet

**Acteur** : Utilisateur  
**Prérequis** : UC1 + Projet avec status = "à venir"  
**Déclencheur** : L'utilisateur clique sur "Prendre ce projet"

**Scénario Principal** :
1. L'utilisateur clique sur "Prendre ce projet"
2. Le système vérifie que le projet est disponible (takenBy = null)
3. Le système met à jour le projet :
   - `takenBy` = userId
   - `status` = "en cours"
   - `takenAt` = Date.now()
4. Le système ajoute le projet à `user.projectsTaken`
5. Le système redirige l'utilisateur vers la page du projet

**Scénario Alternatif** :
- **3a.** Si le projet est déjà pris : Afficher "Ce projet est déjà pris par un autre utilisateur"

**Postcondition** : Le projet est assigné à l'utilisateur et marqué "en cours"

**API** : `POST /api/projects/{id}/take`

---

### UC4 : Créer une tâche

**Acteur** : Utilisateur  
**Prérequis** : UC3 (avoir pris le projet)  
**Déclencheur** : L'utilisateur clique sur "Ajouter une tâche"

**Scénario Principal** :
1. L'utilisateur clique sur "Ajouter une tâche"
2. Le système affiche un formulaire avec :
   - Titre (obligatoire)
   - Description (optionnel)
   - Priorité (low, medium, high)
   - Heures estimées (nombre)
3. L'utilisateur remplit le formulaire et soumet
4. Le système crée la tâche avec :
   - `status` = "todo"
   - `projectId` = id du projet
   - `userId` = id de l'utilisateur
   - `startDate` = null
   - `endDate` = null
5. Le système vérifie automatiquement la complétion du projet (Système Automatique)

**Postcondition** : Une nouvelle tâche est créée avec status "todo"

**API** : `POST /api/projects/{id}/tasks`

---

### UC5 : Modifier une tâche

**Acteur** : Utilisateur  
**Prérequis** : UC4 (tâche existante)  
**Déclencheur** : L'utilisateur clique sur "Modifier" sur une tâche

**Scénario Principal** :
1. L'utilisateur clique sur "Modifier"
2. Le système affiche le formulaire pré-rempli
3. L'utilisateur modifie les champs (titre, description, priorité, heures)
4. L'utilisateur soumet le formulaire
5. Le système met à jour la tâche
6. Le système met à jour `task.updatedAt`

**Postcondition** : La tâche est mise à jour

**API** : `PUT /api/projects/{id}/tasks`

---

### UC6 : Changer le statut d'une tâche ⭐ (Déclenche le Système Automatique)

**Acteur** : Utilisateur  
**Prérequis** : UC4 (tâche existante)  
**Déclencheur** : L'utilisateur change le statut d'une tâche

**Scénario Principal** :
1. L'utilisateur sélectionne un nouveau statut (todo, doing, done)
2. Le système met à jour `task.status`
3. **Si status = "doing" ET startDate = null** :
   - Le système définit `task.startDate` = Date.now()
4. **Si status = "done" ET endDate = null** :
   - Le système définit `task.endDate` = Date.now()
5. **Le Système Automatique de Complétion se déclenche** :
   - Le système récupère toutes les tâches du projet
   - Le système vérifie si toutes les tâches sont "done"
   - **Si toutes les tâches sont "done"** :
     - Le système marque `project.status` = "terminé"
     - Le système affiche "🎉 Félicitations ! Le projet est terminé !"
   - **Si au moins une tâche n'est pas "done" ET project.status = "terminé"** :
     - Le système réouvre le projet : `project.status` = "en cours"

**Postcondition** : 
- La tâche a un nouveau statut
- Le projet peut être automatiquement marqué "terminé" ou réouvert

**API** : `PUT /api/projects/{id}/tasks`

**Code Implémenté** :
```javascript
// Lignes 123-145 de /api/projects/[id]/tasks/route.ts
if (status) {
  task.status = status;
  if (status === "doing" && !task.startDate) {
    task.startDate = new Date();
  }
  if (status === "done" && !task.endDate) {
    task.endDate = new Date();
  }
}
task.updatedAt = new Date();
await task.save();

// Vérifier si toutes les tâches du projet sont terminées
const allTasks = await Task.find({ projectId: params.id });
const allDone = allTasks.length > 0 && allTasks.every((t) => t.status === "done");

if (allDone && project.status !== "terminé") {
  project.status = "terminé";
  await project.save();
} else if (!allDone && project.status === "terminé") {
  project.status = "en cours";
  await project.save();
}
```

---

### UC7 : Supprimer une tâche ⭐ (Déclenche le Système Automatique)

**Acteur** : Utilisateur  
**Prérequis** : UC4 (tâche existante)  
**Déclencheur** : L'utilisateur clique sur "Supprimer" sur une tâche

**Scénario Principal** :
1. L'utilisateur clique sur "Supprimer"
2. Le système affiche une confirmation
3. L'utilisateur confirme la suppression
4. Le système supprime la tâche de la base de données
5. **Le Système Automatique de Complétion se déclenche** :
   - Le système récupère toutes les tâches restantes du projet
   - Le système vérifie si toutes les tâches restantes sont "done"
   - Le système met à jour le statut du projet en conséquence

**Postcondition** : La tâche est supprimée et le statut du projet peut être mis à jour

**API** : `DELETE /api/projects/{id}/tasks`

---

### UC8 : Consulter la progression du projet

**Acteur** : Utilisateur  
**Prérequis** : UC3 (avoir pris le projet)  
**Déclencheur** : L'utilisateur accède à la page du projet

**Scénario Principal** :
1. L'utilisateur accède à `/projects/{id}`
2. Le système affiche :
   - Informations du projet (titre, description, technologies)
   - Liste des tâches avec leur statut
   - Barre de progression : `(tâches done / total tâches) × 100`
   - Statut du projet (en cours / terminé)
3. L'utilisateur peut voir en temps réel sa progression

**Postcondition** : L'utilisateur voit la progression de son projet

---

### UC9 : Abandonner un projet

**Acteur** : Utilisateur  
**Prérequis** : UC3 (avoir pris le projet)  
**Déclencheur** : L'utilisateur clique sur "Abandonner le projet"

**Scénario Principal** :
1. L'utilisateur clique sur "Abandonner le projet"
2. Le système affiche une confirmation
3. L'utilisateur confirme l'abandon
4. Le système met à jour le projet :
   - `takenBy` = null
   - `status` = "à venir"
   - `takenAt` = null
5. Le système retire le projet de `user.projectsTaken`
6. Le système redirige l'utilisateur vers la liste des projets

**Postcondition** : Le projet redevient disponible pour d'autres utilisateurs

---

## 4. Cas d'Utilisation Administrateur

### UC10 : Créer un nouveau projet

**Acteur** : Administrateur  
**Prérequis** : Rôle = "admin"  
**Déclencheur** : L'admin accède à la page de création de projet

**Scénario Principal** :
1. L'admin accède à `/admin/projects/new`
2. Le système affiche un formulaire avec :
   - Titre (obligatoire)
   - Description (obligatoire)
   - Technologies (tableau de strings)
   - Difficulté (Beginner, Intermediate, Advanced)
   - Objectifs (tableau de strings)
   - Durée estimée
   - URL GitHub (optionnel)
3. L'admin remplit le formulaire et soumet
4. Le système crée le projet avec `status` = "à venir"

**Postcondition** : Un nouveau projet est créé et disponible pour les utilisateurs

**API** : `POST /api/projects`

---

### UC11 : Modifier un projet

**Acteur** : Administrateur  
**Prérequis** : Rôle = "admin" + Projet existant  
**Déclencheur** : L'admin clique sur "Modifier" sur un projet

**Scénario Principal** :
1. L'admin clique sur "Modifier"
2. Le système affiche le formulaire pré-rempli
3. L'admin modifie les champs
4. L'admin soumet le formulaire
5. Le système met à jour le projet

**Postcondition** : Le projet est mis à jour

**API** : `PUT /api/projects/{id}`

---

### UC12 : Supprimer un projet

**Acteur** : Administrateur  
**Prérequis** : Rôle = "admin"  
**Déclencheur** : L'admin clique sur "Supprimer" sur un projet

**Scénario Principal** :
1. L'admin clique sur "Supprimer"
2. Le système affiche une confirmation
3. L'admin confirme la suppression
4. Le système supprime le projet et toutes ses tâches associées

**Postcondition** : Le projet et ses tâches sont supprimés

**API** : `DELETE /api/projects/{id}`

---

### UC13 : Consulter les statistiques des projets

**Acteur** : Administrateur  
**Prérequis** : Rôle = "admin"  
**Déclencheur** : L'admin accède au tableau de bord

**Scénario Principal** :
1. L'admin accède à `/admin/dashboard`
2. Le système affiche :
   - Nombre total de projets
   - Nombre de projets "à venir"
   - Nombre de projets "en cours"
   - Nombre de projets "terminés"
   - Taux de complétion moyen
   - Projets les plus populaires

**Postcondition** : L'admin voit les statistiques

---

## 5. Système Automatique de Complétion

### 5.1 Fonctionnement

Le **Système Automatique de Complétion** est un mécanisme qui s'exécute **automatiquement** après certaines actions utilisateur pour maintenir la cohérence du statut du projet.

### 5.2 Déclencheurs

| Action Utilisateur | Cas d'Utilisation | Déclenchement |
|--------------------|-------------------|---------------|
| Changement de statut d'une tâche | UC6 | ✅ Oui |
| Suppression d'une tâche | UC7 | ✅ Oui |
| Création d'une tâche | UC4 | ✅ Oui |
| Modification d'une tâche (sans changement de statut) | UC5 | ❌ Non |

### 5.3 Logique de Vérification

```javascript
// Étape 1 : Récupérer toutes les tâches du projet
const allTasks = await Task.find({ projectId: params.id });

// Étape 2 : Vérifier si toutes les tâches sont "done"
const allDone = allTasks.length > 0 && allTasks.every((t) => t.status === "done");

// Étape 3 : Mettre à jour le statut du projet
if (allDone && project.status !== "terminé") {
  // Toutes les tâches sont terminées → Marquer le projet comme terminé
  project.status = "terminé";
  await project.save();
} else if (!allDone && project.status === "terminé") {
  // Au moins une tâche n'est pas terminée ET le projet était terminé → Réouvrir le projet
  project.status = "en cours";
  await project.save();
}
```

### 5.4 Cas d'Usage

#### Cas 1 : Complétion du Projet

**Situation** :
- Projet avec 5 tâches
- 4 tâches sont "done"
- 1 tâche est "doing"

**Action** : L'utilisateur marque la dernière tâche comme "done"

**Résultat** :
1. Le système met à jour `task.status` = "done"
2. Le système vérifie : `allTasks.every(t => t.status === "done")` → **true**
3. Le système marque `project.status` = "terminé"
4. Le frontend affiche : "🎉 Félicitations ! Le projet est terminé !"

---

#### Cas 2 : Réouverture du Projet

**Situation** :
- Projet avec status = "terminé"
- Toutes les tâches sont "done"

**Action** : L'utilisateur change une tâche de "done" à "doing"

**Résultat** :
1. Le système met à jour `task.status` = "doing"
2. Le système vérifie : `allTasks.every(t => t.status === "done")` → **false**
3. Le système détecte que `project.status === "terminé"`
4. Le système réouvre le projet : `project.status` = "en cours"

---

## 6. Scénarios Détaillés

### Scénario Complet : De la Prise du Projet à la Complétion

**Acteur** : Alice (Utilisatrice)

**Étapes** :

1. **Alice consulte les projets** (UC1)
   - Elle voit "Créer une application de gestion de tâches" (Intermediate)

2. **Alice prend le projet** (UC3)
   - Le projet passe à status = "en cours"
   - takenBy = Alice._id

3. **Alice crée 3 tâches** (UC4)
   - Tâche 1 : "Créer la base de données" (status = "todo")
   - Tâche 2 : "Développer l'API" (status = "todo")
   - Tâche 3 : "Créer l'interface" (status = "todo")

4. **Alice commence la tâche 1** (UC6)
   - Elle change status de "todo" à "doing"
   - startDate = Date.now()
   - Système vérifie : Toutes done ? Non → Projet reste "en cours"

5. **Alice termine la tâche 1** (UC6)
   - Elle change status de "doing" à "done"
   - endDate = Date.now()
   - Système vérifie : Toutes done ? Non (2/3) → Projet reste "en cours"

6. **Alice termine la tâche 2** (UC6)
   - status = "done"
   - Système vérifie : Toutes done ? Non (2/3) → Projet reste "en cours"

7. **Alice termine la tâche 3** (UC6) ⭐
   - status = "done"
   - Système vérifie : Toutes done ? **Oui (3/3)** ✅
   - **Système marque automatiquement project.status = "terminé"**
   - Frontend affiche : "🎉 Félicitations ! Le projet est terminé !"

8. **Alice consulte sa progression** (UC8)
   - Elle voit : Progression 100%, Status "Terminé"

---

## 7. Règles Métier

### 7.1 Règles de Prise de Projet

| Règle | Description |
|-------|-------------|
| **R1** | Un projet ne peut être pris que par **un seul utilisateur** à la fois |
| **R2** | Un projet ne peut être pris que s'il a le status "à venir" |
| **R3** | Un utilisateur peut prendre **plusieurs projets** simultanément |

### 7.2 Règles de Gestion des Tâches

| Règle | Description |
|-------|-------------|
| **R4** | Seul l'utilisateur qui a pris le projet peut créer/modifier/supprimer des tâches |
| **R5** | Une tâche créée a toujours le status "todo" par défaut |
| **R6** | Quand une tâche passe à "doing", `startDate` est automatiquement défini |
| **R7** | Quand une tâche passe à "done", `endDate` est automatiquement défini |

### 7.3 Règles de Complétion Automatique

| Règle | Description |
|-------|-------------|
| **R8** | Le projet est marqué "terminé" **automatiquement** quand toutes les tâches sont "done" |
| **R9** | Le projet est réouvert ("en cours") **automatiquement** si une tâche est modifiée après complétion |
| **R10** | L'utilisateur **ne peut jamais** marquer manuellement un projet comme "terminé" |
| **R11** | La vérification de complétion se fait après **chaque** modification de tâche |

### 7.4 Règles d'Autorisation

| Règle | Description |
|-------|-------------|
| **R12** | Seul un administrateur peut créer/modifier/supprimer des projets |
| **R13** | Un utilisateur ne peut modifier que ses propres tâches |
| **R14** | Un administrateur peut supprimer un projet même s'il est pris par un utilisateur |

---

**Fin du document détaillé**

