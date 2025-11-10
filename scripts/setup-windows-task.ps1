# Script PowerShell pour créer une tâche planifiée Windows
# Ce script configure une tâche qui met à jour les points du leaderboard chaque jour à 2h du matin

Write-Host "🔧 Configuration de la tâche planifiée pour le Leaderboard..." -ForegroundColor Cyan
Write-Host ""

# Paramètres
$TaskName = "Apprencia-UpdateLeaderboard"
$TaskDescription = "Met à jour les points et badges du leaderboard Apprencia quotidiennement"
$ScriptPath = "$PSScriptRoot\update-leaderboard-points.js"
$WorkingDirectory = Split-Path -Parent $PSScriptRoot
$NodePath = (Get-Command node).Source

Write-Host "📋 Paramètres de la tâche :" -ForegroundColor Yellow
Write-Host "  Nom : $TaskName"
Write-Host "  Script : $ScriptPath"
Write-Host "  Dossier : $WorkingDirectory"
Write-Host "  Node.js : $NodePath"
Write-Host ""

# Vérifier si Node.js est installé
if (-not $NodePath) {
    Write-Host "❌ Erreur : Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "   Installez Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier si le script existe
if (-not (Test-Path $ScriptPath)) {
    Write-Host "❌ Erreur : Le script $ScriptPath n'existe pas" -ForegroundColor Red
    exit 1
}

# Supprimer la tâche existante si elle existe
$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($ExistingTask) {
    Write-Host "⚠️  Une tâche existante a été trouvée. Suppression..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "✅ Tâche existante supprimée" -ForegroundColor Green
}

# Créer l'action (ce que la tâche va exécuter)
$Action = New-ScheduledTaskAction `
    -Execute $NodePath `
    -Argument "`"$ScriptPath`"" `
    -WorkingDirectory $WorkingDirectory

# Créer le déclencheur (quand la tâche va s'exécuter)
# Tous les jours à 2h00 du matin
$Trigger = New-ScheduledTaskTrigger -Daily -At "02:00"

# Créer les paramètres de la tâche
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Créer le principal (sous quel compte la tâche s'exécute)
$Principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType S4U `
    -RunLevel Limited

# Enregistrer la tâche
try {
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Description $TaskDescription `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -Principal $Principal `
        -Force | Out-Null
    
    Write-Host ""
    Write-Host "✅ Tâche planifiée créée avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📅 Configuration :" -ForegroundColor Cyan
    Write-Host "  • Fréquence : Tous les jours"
    Write-Host "  • Heure : 02:00 (2h du matin)"
    Write-Host "  • Action : Mise à jour des points du leaderboard"
    Write-Host ""
    Write-Host "🔍 Pour voir la tâche :" -ForegroundColor Yellow
    Write-Host "  1. Ouvrez 'Planificateur de tâches' (Task Scheduler)"
    Write-Host "  2. Cherchez '$TaskName'"
    Write-Host ""
    Write-Host "🧪 Pour tester maintenant :" -ForegroundColor Yellow
    Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
    Write-Host ""
    Write-Host "🗑️  Pour supprimer la tâche :" -ForegroundColor Yellow
    Write-Host "  Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
    Write-Host ""
    
    # Proposer de tester maintenant
    $Test = Read-Host "Voulez-vous tester la tâche maintenant ? (O/N)"
    if ($Test -eq "O" -or $Test -eq "o") {
        Write-Host ""
        Write-Host "🚀 Exécution de la tâche..." -ForegroundColor Cyan
        Start-ScheduledTask -TaskName $TaskName
        Start-Sleep -Seconds 2
        Write-Host "✅ Tâche lancée ! Vérifiez les logs dans le Planificateur de tâches." -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors de la création de la tâche :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

