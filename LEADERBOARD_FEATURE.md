# 🏆 Système de Classement & Leaderboard

## Vue d'ensemble

Le système de classement et leaderboard permet aux utilisateurs de voir leur position par rapport aux autres apprenants de la plateforme, avec un système de points, de badges et de filtres avancés.

## ✨ Fonctionnalités Implémentées

### 1. 🎯 Système de Points

Les utilisateurs gagnent des points pour différentes activités :

#### Points pour les Quiz
- **Quiz facile réussi** : Score obtenu × 1.0
- **Quiz moyen réussi** : Score obtenu × 1.2
- **Quiz difficile réussi** : Score obtenu × 1.5
- Exemple : Un quiz difficile avec 90% de score = 90 × 1.5 = 135 points

#### Points pour les Projets
- **Projet Beginner terminé** : 100 points
- **Projet Intermediate terminé** : 150 points
- **Projet Advanced terminé** : 200 points
- **Projet en cours** : 25 points (bonus de participation)

#### Points pour les Formations
- **Certificat obtenu** : 150 points par certificat

### 2. 🏅 Système de Badges

Les badges sont attribués automatiquement selon les accomplissements :

#### Badges Projets
- 🌟 **Débutant Projet** : 1+ projet terminé
- ⭐ **Expert Projet** : 5+ projets terminés
- 🏆 **Master des Projets** : 10+ projets terminés

#### Badges Quiz
- 📖 **Amateur Quiz** : 5+ quiz réussis
- 📚 **Expert Quiz** : 10+ quiz réussis
- 🎓 **Génie des Quiz** : 20+ quiz réussis

#### Badges Spéciaux
- 🎖️ **Collectionneur de Certificats** : 5+ certificats obtenus
- 🔥 **Champion** : 2000+ points totaux
- 💎 **Légende** : 5000+ points totaux

### 3. 📊 Filtres Avancés

#### Filtre par Période
- **Tout le temps** : Classement global depuis le début
- **Ce mois** : Classement des 30 derniers jours
- **Cette semaine** : Classement des 7 derniers jours

#### Filtre par Catégorie
- **Toutes catégories** : Points totaux (quiz + projets + formations)
- **Quiz** : Classement basé uniquement sur les points quiz
- **Projets** : Classement basé uniquement sur les points projets
- **Formations** : Classement basé uniquement sur les points formations

### 4. 🎨 Interface Utilisateur

#### Podium Top 3
- **1ère place** : Carte dorée avec animation, trophée animé
- **2ème place** : Carte argentée avec médaille
- **3ème place** : Carte bronze avec récompense

#### Liste Complète
- Affichage de tous les utilisateurs classés
- Avatar personnalisé ou initiales
- Statistiques détaillées (quiz, projets, certificats)
- Badges visibles
- Points totaux mis en évidence

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
1. **`app/api/leaderboard/route.ts`**
   - Route API pour récupérer le classement
   - Calcul des points en temps réel
   - Attribution automatique des badges
   - Filtrage par période et catégorie

2. **`app/leaderboard/page.tsx`**
   - Page du leaderboard avec interface moderne
   - Podium animé pour le top 3
   - Filtres interactifs
   - Liste complète avec détails

### Fichiers Modifiés
1. **`models/User.ts`**
   - Ajout du champ `points` (Number, default: 0)
   - Ajout du champ `badges` (Array de String)

2. **`components/app-sidebar.tsx`**
   - Ajout du lien "Classement" dans le menu
   - Icône Trophy pour le leaderboard

## 🚀 Utilisation

### Accès au Leaderboard
1. Connectez-vous à l'application
2. Cliquez sur "Classement" dans le menu latéral
3. Utilisez les filtres pour personnaliser la vue

### Gagner des Points
- **Réussir des quiz** : Plus le quiz est difficile, plus vous gagnez de points
- **Terminer des projets** : Les projets avancés rapportent plus de points
- **Obtenir des certificats** : Chaque certificat vaut 150 points

### Débloquer des Badges
- Les badges sont attribués automatiquement
- Consultez votre profil pour voir vos badges
- Visez les badges spéciaux pour vous démarquer !

## 🎯 Calcul des Points - Exemples

### Exemple 1 : Utilisateur Débutant
- 3 quiz faciles réussis (70%, 80%, 90%) = 240 points
- 1 projet Beginner terminé = 100 points
- **Total : 340 points**
- **Badges** : 🌟 Débutant Projet

### Exemple 2 : Utilisateur Intermédiaire
- 8 quiz moyens réussis (moyenne 85%) = 816 points
- 3 projets Intermediate terminés = 450 points
- 2 certificats = 300 points
- **Total : 1566 points**
- **Badges** : 📖 Amateur Quiz, ⭐ Expert Projet

### Exemple 3 : Utilisateur Expert
- 25 quiz difficiles réussis (moyenne 90%) = 3375 points
- 12 projets Advanced terminés = 2400 points
- 6 certificats = 900 points
- **Total : 6675 points**
- **Badges** : 🎓 Génie des Quiz, 🏆 Master des Projets, 🎖️ Collectionneur, 💎 Légende

## 🔧 Configuration Technique

### API Endpoint
```
GET /api/leaderboard?period={period}&category={category}
```

**Paramètres** :
- `period` : "all" | "weekly" | "monthly"
- `category` : "all" | "quiz" | "projects" | "formations"

**Réponse** :
```json
{
  "success": true,
  "leaderboard": [
    {
      "userId": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "totalPoints": 5000,
      "quizPoints": 2000,
      "projectPoints": 2500,
      "formationPoints": 500,
      "badges": ["🏆 Master des Projets", "💎 Légende"],
      "completedProjects": 12,
      "passedQuizzes": 25,
      "certificates": 6,
      "rank": 1,
      "avatar": null
    }
  ],
  "period": "all",
  "category": "all"
}
```

### Modèle de Données

#### User Model (ajouts)
```typescript
{
  points: { type: Number, default: 0 },
  badges: [{ type: String }]
}
```

## 🎨 Design & UX

### Couleurs
- **1ère place** : Dégradé jaune/or (#FCD34D → #F59E0B)
- **2ème place** : Dégradé gris/argent (#D1D5DB → #9CA3AF)
- **3ème place** : Dégradé bronze/orange (#F59E0B → #EA580C)
- **Autres** : Fond blanc avec bordure teal

### Animations
- Entrée progressive des cartes (stagger effect)
- Trophée animé pour le champion (bounce)
- Hover effects sur les cartes
- Transitions fluides lors du changement de filtres

### Responsive
- **Mobile** : Podium en colonne, liste simplifiée
- **Tablet** : Podium en grille 3 colonnes
- **Desktop** : Vue complète avec tous les détails

## 📈 Améliorations Futures Possibles

1. **Notifications** : Alerter quand un utilisateur monte dans le classement
2. **Historique** : Graphique de l'évolution des points dans le temps
3. **Compétitions** : Défis hebdomadaires avec récompenses spéciales
4. **Badges personnalisés** : Permettre aux admins de créer des badges
5. **Partage social** : Partager son classement sur les réseaux sociaux
6. **Récompenses** : Débloquer du contenu exclusif avec les points
7. **Équipes** : Classement par équipes ou groupes
8. **Streaks** : Bonus pour les séries de réussites consécutives

## 🐛 Tests Recommandés

1. **Test des filtres** : Vérifier que les filtres fonctionnent correctement
2. **Test des points** : Valider le calcul des points pour chaque activité
3. **Test des badges** : Confirmer l'attribution automatique des badges
4. **Test responsive** : Vérifier l'affichage sur mobile/tablet/desktop
5. **Test performance** : Vérifier les temps de chargement avec beaucoup d'utilisateurs

## 📝 Notes Importantes

- Les points sont calculés en temps réel à chaque requête
- Les badges sont attribués dynamiquement selon les accomplissements
- Seuls les utilisateurs approuvés (`isApproved: true`) apparaissent dans le classement
- Les admins ne sont pas inclus dans le classement (role: "user" uniquement)

---

**Développé avec ❤️ pour Apprencia**

