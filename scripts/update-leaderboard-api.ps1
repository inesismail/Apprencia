# Script PowerShell pour mettre à jour le leaderboard via l'API
# Ce script appelle l'API web pour mettre à jour les points

param(
    [string]$ApiUrl = "http://localhost:3000/api/leaderboard/update-points",
    [string]$LogFile = "$PSScriptRoot\leaderboard-update.log"
)

# Fonction pour écrire dans le log
function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] $Message"
    Write-Host $LogMessage
    Add-Content -Path $LogFile -Value $LogMessage
}

Write-Log "=========================================="
Write-Log "🚀 Début de la mise à jour du leaderboard"
Write-Log "=========================================="

try {
    # Vérifier si le serveur est accessible
    Write-Log "🔍 Vérification de l'accessibilité du serveur..."
    
    try {
        $TestResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
        Write-Log "✅ Serveur accessible"
    } catch {
        Write-Log "❌ ERREUR : Le serveur n'est pas accessible"
        Write-Log "   Assurez-vous que l'application Next.js est en cours d'exécution"
        Write-Log "   Commande : npm run dev"
        exit 1
    }
    
    # Appeler l'API de mise à jour
    Write-Log "📊 Appel de l'API de mise à jour..."
    
    $Response = Invoke-WebRequest -Uri $ApiUrl -Method POST -ContentType "application/json" -UseBasicParsing
    $Data = $Response.Content | ConvertFrom-Json
    
    if ($Data.success) {
        Write-Log "✅ Mise à jour réussie !"
        Write-Log "   Utilisateurs mis à jour : $($Data.updatedCount)"
        
        # Afficher les détails
        if ($Data.results) {
            Write-Log ""
            Write-Log "📋 Détails des utilisateurs :"
            foreach ($user in $Data.results) {
                Write-Log "   • $($user.name) : $($user.points) points, $($user.badges.Count) badges"
            }
        }
    } else {
        Write-Log "❌ ERREUR : La mise à jour a échoué"
        Write-Log "   Message : $($Data.error)"
        exit 1
    }
    
} catch {
    Write-Log "❌ ERREUR CRITIQUE : $($_.Exception.Message)"
    Write-Log "   Détails : $($_.Exception)"
    exit 1
}

Write-Log ""
Write-Log "=========================================="
Write-Log "✅ Mise à jour terminée avec succès"
Write-Log "=========================================="
Write-Log ""

exit 0

