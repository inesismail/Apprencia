# 🎓 Apprencia

**Apprencia** est une plateforme moderne de gestion de projets et d'apprentissage, conçue pour aider les développeurs à trouver des projets, suivre leur progression et obtenir de l'assistance IA tout au long de leur parcours d'apprentissage.

![Apprencia](./public/skill.png)

## ✨ Fonctionnalités Principales

### 👤 Gestion des Utilisateurs
- 🔐 Authentification sécurisée (connexion/inscription)
- 👤 Profils utilisateurs avec suivi des compétences
- 📊 Tableau de bord personnalisé
- 🎯 Suivi de la progression

### 📚 Projets
- 🔍 Navigation et recherche de projets
- 📝 Projets avec différents niveaux de difficulté (Débutant/Intermédiaire/Avancé)
- 🎯 Objectifs d'apprentissage définis
- 🔗 Liens GitHub et démos en direct
- 💬 Assistant IA pour chaque projet

### 🧠 Quiz
- 📝 Quiz interactifs avec timer
- ✅ Correction automatique
- 📊 Suivi des résultats
- 🏆 Système de scoring

### 🎓 Formations
- 📹 Formations vidéo
- 📚 Contenu structuré
- 👨‍🏫 Informations sur les formateurs
- 📈 Niveaux de difficulté

### 🤖 Intelligence Artificielle
- 💬 ChatBot d'assistance
- 🤖 Assistant de projet spécifique
- 📝 Résumé de texte avec HuggingFace

### 🎖️ Certificats
- 🏆 Génération de certificats
- 📊 Suivi des accomplissements

### 💬 Retours d'Expérience
- ⭐ Système de feedback
- 💭 Partage d'expériences
- 🌓 Mode clair/sombre

### 👨‍💼 Interface Admin
- 👥 Gestion des utilisateurs
- ✅ Approbation des comptes
- ➕ Ajout de projets
- ➕ Ajout de quiz
- ➕ Ajout de formations
- 📊 Statistiques et analytics

## 🎨 Design

Apprencia utilise un **thème moderne Teal/Cyan** avec :
- 🎨 Palette de couleurs harmonieuse
- 🌓 Support du mode sombre
- 📱 Design responsive
- ✨ Animations fluides
- ♿ Accessibilité optimisée

## 🛠️ Technologies Utilisées

### Frontend
- ⚛️ **Next.js 15** - Framework React avec App Router
- 🎨 **React** - Bibliothèque UI
- 📘 **TypeScript** - Typage statique
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 🧩 **Shadcn/ui** - Composants UI modernes
- 🎭 **Lucide Icons** - Icônes

### Backend
- 🟢 **Node.js** - Runtime JavaScript
- 🍃 **MongoDB** - Base de données NoSQL
- 📦 **Mongoose** - ODM pour MongoDB
- 🔐 **bcryptjs** - Hachage de mots de passe
- 📧 **Nodemailer** - Envoi d'emails

### IA & ML
- 🤖 **HuggingFace API** - Modèles d'IA pour le résumé de texte
- 💬 **React Simple Chatbot** - Interface de chatbot

### Autres
- 📄 **html2pdf** - Génération de PDF
- 📅 **date-fns** - Manipulation de dates
- 🎨 **Framer Motion** - Animations

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/inesismail/apprencia.git
cd apprencia
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB
MONGODB_URI=votre_uri_mongodb

# Email (Nodemailer)
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# HuggingFace
HUGGINGFACE_API_KEY=votre_clé_api_huggingface

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Ouvrir l'application**

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
Apprencia/
├── app/                      # Pages Next.js (App Router)
│   ├── admin/               # Pages d'administration
│   ├── api/                 # Routes API
│   ├── dashboard/           # Tableau de bord
│   ├── Formation/           # Formations
│   ├── projects/            # Projets
│   ├── quizzes/             # Quiz
│   ├── feedback/            # Retours d'expérience
│   └── ...
├── components/              # Composants React réutilisables
│   ├── ui/                  # Composants UI Shadcn
│   ├── app-sidebar.tsx      # Barre latérale
│   ├── top-nav.tsx          # Navigation supérieure
│   └── ...
├── models/                  # Modèles Mongoose
│   ├── User.ts
│   ├── Project.ts
│   ├── Quiz.ts
│   ├── Formation.ts
│   └── ...
├── lib/                     # Utilitaires et helpers
│   ├── mongo.ts             # Connexion MongoDB
│   ├── huggingface.ts       # API HuggingFace
│   └── ...
├── public/                  # Fichiers statiques
├── styles/                  # Styles globaux
└── types/                   # Types TypeScript
```

## 🎨 Thème de Couleurs

Le projet utilise une palette **Teal/Cyan** moderne :

- **Primary** : `#2D9D92` (Teal vibrant)
- **Secondary** : Cyan doux
- **Accent** : Teal clair

Pour plus de détails, consultez [THEME_COLORS.md](./THEME_COLORS.md)

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteur

**Ines Ismail**
- GitHub: [@inesismail](https://github.com/inesismail)

## 🙏 Remerciements

- Next.js pour le framework
- Shadcn/ui pour les composants
- HuggingFace pour l'IA
- MongoDB pour la base de données
- Tous les contributeurs open source

---

**Fait avec ❤️ par Ines Ismail**

