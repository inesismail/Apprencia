# 📊 Diagrammes Complémentaires - Apprencia

**Projet** : Apprencia - Plateforme d'apprentissage et de gestion de projets  
**Auteur** : Ines Ismail  
**Date** : Janvier 2025  
**Contexte** : Rapport de Stage - Annexes

---

## Table des Matières

1. [Module Quiz et Certification](#1-module-quiz-et-certification)
2. [Module Extraction de Compétences (IA)](#2-module-extraction-de-compétences-ia)
3. [Diagrammes d'États](#3-diagrammes-détats)
4. [Infrastructure et Déploiement](#4-infrastructure-et-déploiement)
5. [Spécifications Techniques](#5-spécifications-techniques)

---

## 1. Module Quiz et Certification

### 1.1 Cas d'Utilisation - Quiz et Certification

#### Acteurs

- **Utilisateur** : Apprenant qui passe des quiz pour évaluer ses connaissances
- **Administrateur** : Gestionnaire qui crée et gère les quiz
- **Système de Calcul de Temps** : Système automatique qui calcule le temps limite des quiz

#### Cas d'Utilisation Utilisateur

| ID | Cas d'Utilisation | Description | Prérequis |
|----|-------------------|-------------|-----------|
| UC1 | Consulter les quiz disponibles | Voir la liste des quiz avec filtres (catégorie, difficulté) | Compte créé |
| UC2 | Passer un quiz | Démarrer un quiz et répondre aux questions | UC1 |
| UC3 | Répondre aux questions | Sélectionner une réponse pour chaque question | UC2 |
| UC4 | Soumettre le quiz | Envoyer les réponses et obtenir le score | UC3 |
| UC5 | Voir les résultats | Consulter le score et les réponses correctes | UC4 |
| UC6 | Obtenir un certificat | Recevoir un certificat si score >= passingScore | UC5 + Score suffisant |
| UC7 | Télécharger le certificat PDF | Télécharger le certificat au format PDF | UC6 |
| UC12 | Consulter l'historique des quiz | Voir tous les quiz passés avec scores | Compte créé |

#### Cas d'Utilisation Administrateur

| ID | Cas d'Utilisation | Description | Prérequis |
|----|-------------------|-------------|-----------|
| UC8 | Créer un quiz | Ajouter un nouveau quiz avec questions | Rôle admin |
| UC9 | Modifier un quiz | Éditer un quiz existant | Rôle admin |
| UC10 | Supprimer un quiz | Retirer un quiz de la plateforme | Rôle admin |
| UC11 | Voir les statistiques des quiz | Consulter les métriques (taux de réussite, moyenne) | Rôle admin |

#### Système de Calcul de Temps

Le système calcule automatiquement le temps limite d'un quiz selon la formule :

```
timeLimit = nbQuestions × tempsParQuestion

Où tempsParQuestion dépend de la difficulté :
- Facile : 1.5 minutes/question
- Moyen : 2 minutes/question
- Difficile : 3 minutes/question
```

**Exemple** :
- Quiz de 10 questions en difficulté "Moyen"
- timeLimit = 10 × 2 = 20 minutes

---

### 1.2 Séquence - Passage d'un Quiz avec Certification

#### Phase 1 : Consultation et Démarrage

1. **Consultation des quiz**
   - L'utilisateur accède à `/quiz`
   - Le frontend envoie `GET /api/quiz`
   - L'API retourne la liste des quiz avec filtres
   - Le frontend affiche les quiz (catégorie, difficulté, nombre de questions)

2. **Démarrage du quiz**
   - L'utilisateur clique sur "Passer ce quiz"
   - Le frontend envoie `GET /api/quiz/{id}`
   - L'API retourne le quiz complet avec toutes les questions
   - Le frontend calcule le `timeLimit` automatiquement
   - Le frontend affiche le quiz avec un timer dégressif

#### Phase 2 : Passage du Quiz

3. **Réponse aux questions**
   - Pour chaque question, l'utilisateur sélectionne une réponse
   - Le frontend stocke les réponses localement (useState)
   - Le timer continue de décompter

4. **Soumission**
   - L'utilisateur clique sur "Soumettre" (ou le timer expire)
   - Le frontend calcule le score : `(bonnes réponses / total) × 100`
   - Le frontend envoie `POST /api/quiz/{id}/submit` avec `{userId, answers, score}`

#### Phase 3 : Enregistrement et Certification

5. **Enregistrement du résultat**
   - L'API récupère l'utilisateur : `User.findById(userId)`
   - L'API ajoute le résultat à l'historique : `User.update({$push: {quizzes: result}})`

6. **Vérification du score**
   - **Si score >= passingScore** :
     - L'API crée un certificat : `Certificate.create({userId, quizId, score})`
     - L'API génère un PDF du certificat (html2pdf)
     - L'API met à jour le certificat avec l'URL du PDF
     - L'API ajoute 50 points à l'utilisateur : `User.update({$inc: {points: 50}})`
     - Le frontend affiche "🎉 Félicitations! Certificat obtenu"
     - L'utilisateur peut télécharger le PDF
   
   - **Si score < passingScore** :
     - Le frontend affiche "❌ Score insuffisant. Réessayez!"
     - L'utilisateur peut repasser le quiz

---

## 2. Module Extraction de Compétences (IA)

### 2.1 Vue d'ensemble

Le module d'extraction de compétences utilise l'**Intelligence Artificielle** pour analyser automatiquement les CV des utilisateurs et extraire leurs compétences techniques.

**Technologies utilisées** :
- **Hugging Face API** : Plateforme d'IA pour modèles pré-entraînés
- **Modèle NER** : `dslim/bert-base-NER` (Named Entity Recognition)
- **PDF Parser** : `pdf-parse` pour extraire le texte des PDF

### 2.2 Séquence - Upload CV et Extraction de Compétences

#### Phase 1 : Upload du CV

1. **Sélection du fichier**
   - L'utilisateur accède à la page Profil
   - L'utilisateur sélectionne un fichier CV (PDF uniquement)
   - L'utilisateur clique sur "Upload CV"

2. **Envoi au serveur**
   - Le frontend envoie `POST /api/upload` avec `FormData(file, email)`
   - L'API vérifie le type de fichier (doit être `application/pdf`)
   - **Si invalide** : Erreur 400 "Seuls les PDF sont acceptés"

#### Phase 2 : Sauvegarde du Fichier

3. **Stockage du CV**
   - L'API crée le dossier `public/uploads/` si nécessaire
   - L'API génère un nom unique : `{timestamp}_{filename}.pdf`
   - L'API sauvegarde le fichier : `writeFile(buffer)`
   - L'URL publique est générée : `/uploads/{filename}`

#### Phase 3 : Extraction du Texte

4. **Parsing du PDF**
   - L'API utilise `pdf-parse` pour extraire le texte
   - Le texte brut est extrait (cvText)
   - L'API log la longueur du texte : "Longueur texte: X caractères"

#### Phase 4 : Extraction des Compétences (IA)

5. **Appel à Hugging Face**
   - L'API envoie une requête POST à Hugging Face :
     ```
     URL: https://api-inference.huggingface.co/models/dslim/bert-base-NER
     Headers: Authorization: Bearer hf_xxx
     Body: {inputs: cvText}
     ```

6. **Analyse NER**
   - Le modèle Hugging Face analyse le texte
   - Il identifie les entités nommées :
     - **PERSON** : Noms de personnes
     - **ORG** : Organisations (Google, Microsoft, etc.)
     - **MISC** : Compétences, technologies (React, Node.js, etc.)
   
   - Exemple de résultat :
     ```json
     [
       {word: "React", entity_group: "MISC", score: 0.95},
       {word: "Node", entity_group: "MISC", score: 0.92},
       {word: "##.js", entity_group: "MISC", score: 0.92},
       {word: "MongoDB", entity_group: "MISC", score: 0.89},
       {word: "Google", entity_group: "ORG", score: 0.98}
     ]
     ```

7. **Traitement des résultats**
   - L'API filtre les entités (garde MISC et ORG)
   - L'API nettoie les mots (supprime les `##` de tokenization)
   - L'API fusionne les tokens : `["Node", "##.js"]` → `"Node.js"`
   - L'API supprime les doublons
   - Résultat final : `skills = ["React", "Node.js", "MongoDB", "Google"]`

#### Phase 5 : Sauvegarde dans MongoDB

8. **Mise à jour de l'utilisateur**
   - L'API met à jour l'utilisateur :
     ```javascript
     User.findOneAndUpdate(
       {email},
       {
         $set: {
           cvUrl: "/uploads/1234_cv.pdf",
           cvText: "Je suis développeur...",
           skills: ["React", "Node.js", "MongoDB"]
         }
       }
     )
     ```

9. **Réponse au frontend**
   - L'API retourne : `{message: "CV uploadé", skills: [...], cvUrl: "..."}`
   - Le frontend affiche : "✅ CV uploadé! Compétences extraites: React, Node.js..."
   - Le frontend affiche les compétences sous forme de badges

---

### 2.3 Avantages de l'Extraction Automatique

| Avantage | Description |
|----------|-------------|
| **Gain de temps** | L'utilisateur n'a pas besoin de saisir manuellement ses compétences |
| **Précision** | Le modèle NER est entraîné sur des millions de documents |
| **Standardisation** | Les compétences sont extraites de manière cohérente |
| **Découverte** | L'utilisateur peut découvrir des compétences qu'il avait oubliées |
| **Matching** | Facilite le matching avec des projets ou formations adaptés |

---

## 3. Diagrammes d'États

### 3.1 Cycle de Vie d'un Projet

Un projet passe par plusieurs états au cours de son cycle de vie :

#### États du Projet

| État | Description | Attributs | Transitions possibles |
|------|-------------|-----------|----------------------|
| **Créé** | Projet créé par l'admin mais non publié | status: null, takenBy: null, visible: Non | → À venir |
| **À venir** | Projet publié et disponible pour les utilisateurs | status: "à venir", takenBy: null, visible: Oui | → En cours, → Supprimé |
| **En cours** | Projet pris par un utilisateur | status: "en cours", takenBy: userId, tâches actives | → Terminé, → À venir, → Supprimé |
| **Terminé** | Toutes les tâches sont terminées | status: "terminé", takenBy: userId, toutes tâches: done | → Archivé |
| **Supprimé** | Projet supprimé par l'admin | Supprimé de la base | - |

#### Transitions

1. **Créé → À venir** : L'admin publie le projet
2. **À venir → En cours** : Un utilisateur prend le projet
3. **En cours → Terminé** : Toutes les tâches sont marquées "done"
4. **En cours → À venir** : L'utilisateur abandonne le projet
5. **À venir → Supprimé** : L'admin supprime le projet
6. **En cours → Supprimé** : L'admin supprime le projet

#### Règles Métier

- Un projet ne peut être pris que par **un seul utilisateur** à la fois
- Un projet ne peut être marqué "terminé" que si **toutes les tâches sont done**
- Quand un projet est terminé, l'utilisateur gagne **+100 points**
- Un projet "à venir" peut être pris par n'importe quel utilisateur

---

### 3.2 Cycle de Vie d'une Tâche

Une tâche passe par plusieurs états au cours de sa réalisation :

#### États de la Tâche

| État | Description | Attributs | Badge |
|------|-------------|-----------|-------|
| **Todo** | Tâche créée mais non commencée | status: "todo", startDate: null, endDate: null | 📋 À faire |
| **Doing** | Tâche en cours de réalisation | status: "doing", startDate: Date.now(), endDate: null | 🔄 En cours |
| **Done** | Tâche terminée | status: "done", endDate: Date.now() | ✅ Terminée |
| **Validée** | Tâche vérifiée et validée | Vérification automatique | ✔️ Validée |
| **Supprimée** | Tâche supprimée | Supprimée de la base | - |

#### Transitions

1. **Todo → Doing** : L'utilisateur commence la tâche
2. **Doing → Done** : L'utilisateur termine la tâche
3. **Doing → Todo** : Retour en arrière (annulation)
4. **Done → Doing** : Réouverture de la tâche
5. **Done → Validée** : Vérification automatique du système
6. **Todo/Doing/Done → Supprimée** : L'utilisateur supprime la tâche

#### Règles Métier

- Quand une tâche passe à "doing", `startDate` est automatiquement défini
- Quand une tâche passe à "done", `endDate` est automatiquement défini
- Quand toutes les tâches d'un projet sont "done", le projet passe à "terminé"
- Chaque tâche terminée rapporte **+10 points** à l'utilisateur
- Une tâche peut avoir une priorité : **low**, **medium**, **high**

#### Calcul de la Progression

```javascript
const progression = (tâchesDone / totalTâches) × 100

Exemple :
- 3 tâches done sur 10 total
- Progression = (3 / 10) × 100 = 30%
```

---

## 4. Infrastructure et Déploiement

### 4.1 Architecture de Déploiement

#### Composants de l'Infrastructure

| Composant | Technologie | Hébergement | Port/URL |
|-----------|-------------|-------------|----------|
| **Client** | Navigateur Web (Chrome, Firefox, Safari) | Poste utilisateur | - |
| **Serveur Web** | Next.js 15 | Vercel ou Local | 3000 |
| **Base de Données** | MongoDB | Local ou MongoDB Atlas | 27017 |
| **API IA** | Hugging Face | Cloud Hugging Face | HTTPS |
| **Service Email** | Nodemailer + Gmail SMTP | Gmail | 587 |
| **Stockage Fichiers** | Système de fichiers | Serveur local | public/uploads/ |

#### Flux de Communication

```
Client (Browser)
    ↓ HTTPS
Next.js Server (Port 3000)
    ↓ Mongoose ODM
MongoDB (Port 27017)

Next.js Server
    ↓ HTTP POST
Hugging Face API (api-inference.huggingface.co)

Next.js Server
    ↓ SMTP
Gmail (smtp.gmail.com:587)
```

---

### 4.2 Configuration de Déploiement

#### Variables d'Environnement (.env.local)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mondb
# ou pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/apprencia

# Email (Nodemailer)
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# HuggingFace
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# ou pour production :
# NEXT_PUBLIC_BASE_URL=https://apprencia.vercel.app
```

#### Déploiement sur Vercel

1. **Connexion à Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configuration du projet**
   ```bash
   vercel
   ```

3. **Variables d'environnement**
   - Ajouter les variables dans le dashboard Vercel
   - Settings → Environment Variables

4. **Déploiement**
   ```bash
   vercel --prod
   ```

#### Déploiement Local

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Configuration de MongoDB**
   ```bash
   # Démarrer MongoDB localement
   mongod --dbpath /data/db
   ```

3. **Lancement du serveur**
   ```bash
   npm run dev
   ```

4. **Accès à l'application**
   - URL : http://localhost:3000

---

## 5. Spécifications Techniques

### 5.1 Technologies Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Next.js** | 15.2.4 | Framework React avec SSR et API Routes |
| **React** | 18 | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 3.x | Framework CSS utility-first |
| **Shadcn/ui** | Latest | Composants UI modernes |
| **Framer Motion** | 11.x | Animations |
| **Lucide React** | Latest | Icônes |

### 5.2 Technologies Backend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | 18+ | Runtime JavaScript |
| **MongoDB** | 6.x | Base de données NoSQL |
| **Mongoose** | 8.x | ODM pour MongoDB |
| **bcryptjs** | 2.x | Hachage de mots de passe |
| **Nodemailer** | 6.x | Envoi d'emails |
| **pdf-parse** | 1.x | Extraction de texte PDF |
| **axios** | 1.x | Requêtes HTTP |

### 5.3 APIs Externes

| API | Utilisation | Modèle |
|-----|-------------|--------|
| **Hugging Face** | Extraction de compétences | dslim/bert-base-NER |
| **Hugging Face** | Résumé de texte | facebook/bart-large-cnn |
| **Gmail SMTP** | Envoi d'emails | - |

### 5.4 Performances

| Métrique | Valeur | Objectif |
|----------|--------|----------|
| **Temps de chargement** | < 2s | Optimisé |
| **Taille du bundle** | ~500 KB | Acceptable |
| **Requêtes API** | < 500ms | Rapide |
| **Upload CV** | < 5s | Dépend de la taille |
| **Extraction IA** | 2-10s | Dépend de Hugging Face |

### 5.5 Sécurité

| Aspect | Implémentation |
|--------|----------------|
| **Authentification** | bcrypt (hash + salt) |
| **Mots de passe** | Hashés avec bcrypt (10 rounds) |
| **Tokens** | Stockés dans localStorage (côté client) |
| **API** | Validation des données côté serveur |
| **Fichiers** | Validation du type (PDF uniquement) |
| **CORS** | Configuré pour Next.js |
| **Variables sensibles** | Stockées dans .env.local (non versionnées) |

---

## Conclusion

Ces diagrammes complémentaires illustrent en détail les modules spécifiques du système Apprencia :

- ✅ **Module Quiz et Certification** : Système complet d'évaluation avec génération automatique de certificats
- ✅ **Module IA** : Extraction automatique de compétences via Hugging Face NER
- ✅ **Diagrammes d'États** : Cycle de vie des projets et tâches
- ✅ **Infrastructure** : Architecture de déploiement et configuration
- ✅ **Spécifications Techniques** : Technologies, performances et sécurité

Ces documents constituent une base solide pour votre **rapport de stage** et démontrent une compréhension approfondie de l'architecture et du fonctionnement du système.

---

**Fin du document complémentaire**

