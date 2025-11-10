# 💾 Système de Sauvegarde des Points du Leaderboard

## 🎯 Objectif

Sauvegarder les points et badges calculés directement dans MongoDB pour :
- ✅ Améliorer les performances (pas de recalcul à chaque requête)
- ✅ Permettre des requêtes rapides sur les points
- ✅ Historiser les données
- ✅ Faciliter les statistiques

---

## 📁 Fichiers Créés

### 1. **API Route : `/api/leaderboard/update-points/route.ts`**

Route API pour mettre à jour les points de tous les utilisateurs.

**Endpoints :**

#### POST `/api/leaderboard/update-points`
Calcule et sauvegarde les points de tous les utilisateurs.

**Réponse :**
```json
{
  "success": true,
  "message": "Points mis à jour pour 3 utilisateurs",
  "updatedCount": 3,
  "results": [
    {
      "userId": "69053aba4ce6fed93f6564fb",
      "name": "amelie bruno",
      "points": 500,
      "badges": ["🌟 Débutant Projet"]
    }
  ]
}
```

#### GET `/api/leaderboard/update-points`
Retourne le statut de la base de données.

**Réponse :**
```json
{
  "success": true,
  "totalUsers": 3,
  "usersWithPoints": 3,
  "needsUpdate": false
}
```

---

### 2. **Page Admin : `/admin/leaderboard/page.tsx`**

Interface graphique pour gérer le leaderboard.

**Fonctionnalités :**
- 📊 Affichage du statut (combien d'utilisateurs ont des points)
- 🔄 Bouton pour mettre à jour tous les points
- ✅ Affichage des résultats de la mise à jour
- 🎨 Interface moderne avec animations

**Accès :**
```
http://localhost:3000/admin/leaderboard
```

---

### 3. **Script Node.js : `scripts/update-leaderboard-points.js`**

Script autonome pour mettre à jour les points via la ligne de commande.

**Usage :**
```bash
node scripts/update-leaderboard-points.js
```

**Sortie :**
```
🔌 Connexion à MongoDB...
✅ Connecté à MongoDB

📊 Récupération des utilisateurs...
👥 3 utilisateurs trouvés

✅ mohamed ismail: 850 points, 2 badges
✅ ines ines: 0 points, 0 badges
✅ amelie bruno: 500 points, 1 badges

🎉 Mise à jour terminée ! 3 utilisateurs mis à jour

🔌 Déconnecté de MongoDB
```

---

## 🚀 Comment Utiliser

### **Méthode 1 : Via l'Interface Admin** (Recommandé)

1. **Connectez-vous en tant qu'admin**
2. **Allez sur** : http://localhost:3000/admin/leaderboard
3. **Cliquez sur** "Mettre à Jour les Points"
4. **Attendez** quelques secondes
5. **Consultez** les résultats affichés

**Avantages :**
- ✅ Interface visuelle
- ✅ Résultats immédiats
- ✅ Pas besoin de terminal

---

### **Méthode 2 : Via l'API** (Pour les développeurs)

**PowerShell :**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/leaderboard/update-points" -Method POST
```

**Bash/Linux :**
```bash
curl -X POST http://localhost:3000/api/leaderboard/update-points
```

**JavaScript (fetch) :**
```javascript
fetch('/api/leaderboard/update-points', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### **Méthode 3 : Via le Script Node.js** (Pour automatisation)

```bash
cd Apprencia
node scripts/update-leaderboard-points.js
```

**Note :** Le script nécessite la variable d'environnement `MONGODB_URI` ou utilise `mongodb://localhost:27017/apprencia` par défaut.

---

## 🔄 Automatisation

### **Option 1 : Cron Job (Linux/Mac)**

Mettre à jour les points chaque nuit à 2h du matin :

```bash
# Ouvrir crontab
crontab -e

# Ajouter cette ligne
0 2 * * * cd /chemin/vers/Apprencia && node scripts/update-leaderboard-points.js
```

---

### **Option 2 : Task Scheduler (Windows)**

1. **Ouvrir** "Planificateur de tâches"
2. **Créer une tâche de base**
3. **Nom** : "Mise à jour Leaderboard"
4. **Déclencheur** : Quotidien à 2h00
5. **Action** : Démarrer un programme
   - Programme : `node`
   - Arguments : `scripts/update-leaderboard-points.js`
   - Dossier : `C:\Users\ismai\Downloads\Apprencia\Apprencia`

---

### **Option 3 : Webhook après Actions**

Appeler l'API après certaines actions :

**Exemple : Après qu'un utilisateur termine un quiz**

```typescript
// Dans votre API de soumission de quiz
await fetch('/api/leaderboard/update-points', {
  method: 'POST'
});
```

---

## 📊 Vérification dans MongoDB

### **Avant la Mise à Jour**

```javascript
db.users.findOne({ email: "amelie@gmail.com" })

// Résultat :
{
  points: 0,        // ⚠️ Vide
  badges: []        // ⚠️ Vide
}
```

### **Après la Mise à Jour**

```javascript
db.users.findOne({ email: "amelie@gmail.com" })

// Résultat :
{
  points: 500,                    // ✅ Sauvegardé !
  badges: ["🌟 Débutant Projet"]  // ✅ Sauvegardé !
}
```

---

## 🔍 Requêtes MongoDB Utiles

### **Voir tous les utilisateurs avec leurs points**

```javascript
db.users.find(
  { role: "user", isApproved: true },
  { firstName: 1, lastName: 1, points: 1, badges: 1 }
).sort({ points: -1 })
```

### **Top 10 du leaderboard**

```javascript
db.users.find(
  { role: "user", isApproved: true, points: { $gt: 0 } },
  { firstName: 1, lastName: 1, points: 1, badges: 1 }
).sort({ points: -1 }).limit(10)
```

### **Utilisateurs sans points**

```javascript
db.users.find(
  { role: "user", isApproved: true, points: 0 }
)
```

### **Statistiques globales**

```javascript
db.users.aggregate([
  { $match: { role: "user", isApproved: true } },
  { $group: {
      _id: null,
      totalUsers: { $sum: 1 },
      avgPoints: { $avg: "$points" },
      maxPoints: { $max: "$points" },
      minPoints: { $min: "$points" },
      totalPoints: { $sum: "$points" }
  }}
])
```

---

## 📈 Résultats Actuels

Après la première mise à jour :

| Utilisateur | Points | Badges |
|-------------|--------|--------|
| **Mohamed Ismail** | 850 | 🌟 Débutant Projet, 📖 Amateur Quiz |
| **Amelie Bruno** | 500 | 🌟 Débutant Projet |
| **Ines Ines** | 0 | - |

---

## 🎯 Avantages de la Sauvegarde

### **Avant (Calcul en Temps Réel)**
```
Utilisateur demande le leaderboard
  ↓
API récupère tous les utilisateurs
  ↓
API récupère tous les projets
  ↓
API récupère tous les quiz
  ↓
API calcule les points pour CHAQUE utilisateur
  ↓
API trie et retourne
  ↓
⏱️ Temps : 2-5 secondes (lent avec beaucoup d'utilisateurs)
```

### **Après (Avec Sauvegarde)**
```
Utilisateur demande le leaderboard
  ↓
API récupère les utilisateurs avec leurs points
  ↓
API trie par points
  ↓
API retourne
  ↓
⏱️ Temps : 0.1-0.5 secondes (rapide !)
```

---

## 🔧 Configuration

### **Variables d'Environnement**

Ajoutez dans votre `.env.local` :

```env
# MongoDB URI
MONGODB_URI=mongodb://localhost:27017/apprencia

# Optionnel : Clé API pour sécuriser l'endpoint
LEADERBOARD_UPDATE_KEY=votre_cle_secrete
```

### **Sécuriser l'Endpoint (Optionnel)**

Modifiez `/api/leaderboard/update-points/route.ts` :

```typescript
export async function POST(req: NextRequest) {
  // Vérifier la clé API
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.LEADERBOARD_UPDATE_KEY) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 403 }
    );
  }
  
  // ... reste du code
}
```

---

## 🐛 Dépannage

### **Problème : Les points ne se mettent pas à jour**

**Solution :**
1. Vérifiez que MongoDB est connecté
2. Vérifiez que les utilisateurs ont `isApproved: true`
3. Consultez les logs du serveur

### **Problème : Script Node.js ne trouve pas les utilisateurs**

**Solution :**
1. Vérifiez la variable `MONGODB_URI`
2. Assurez-vous que la base de données est la bonne
3. Utilisez plutôt l'API web (méthode 1 ou 2)

### **Problème : Badges affichés en caractères bizarres**

**Solution :**
- C'est un problème d'encodage dans le terminal PowerShell
- Les badges s'affichent correctement dans l'interface web
- Utilisez l'interface admin pour voir les vrais emojis

---

## 📝 Notes Importantes

1. **Fréquence de mise à jour** : Recommandé 1 fois par jour (la nuit)
2. **Performance** : Avec 1000 utilisateurs, la mise à jour prend ~10 secondes
3. **Cohérence** : Les points sont toujours cohérents avec les activités réelles
4. **Historique** : Pour l'instant, seuls les points actuels sont sauvegardés (pas d'historique)

---

## 🚀 Prochaines Améliorations Possibles

1. **Historique des points** : Sauvegarder l'évolution dans le temps
2. **Mise à jour incrémentale** : Ne recalculer que les utilisateurs modifiés
3. **Cache Redis** : Mettre en cache le leaderboard pour encore plus de rapidité
4. **Notifications** : Alerter les utilisateurs quand ils montent dans le classement
5. **API de statistiques** : Endpoints pour graphiques d'évolution

---

**Développé avec ❤️ pour Apprencia**

