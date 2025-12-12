// 畫面切換
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
    gameState.currentScreen = screenId;
}

function showMainMenu() {
    showScreen('mainMenu');
    gameState.quizStarted = false;
    gameState.wordGroupStarted = false;
}

function confirmBackToMenu() {
    if (confirm('確定要退出遊戲嗎？')) {
        showMainMenu();
    }
}

// 玩家設置
function showPlayerSetup() {
    showScreen('playerSetup');
    gameState.playerCount = 1;
    updatePlayerCountDisplay();
}

function increasePlayers() {
    if (gameState.playerCount < 10) {
        gameState.playerCount++;
        updatePlayerCountDisplay();
    }
}

function decreasePlayers() {
    if (gameState.playerCount > 1) {
        gameState.playerCount--;
        updatePlayerCountDisplay();
    }
}

function updatePlayerCountDisplay() {
    document.getElementById('playerCount').textContent = gameState.playerCount;
    document.getElementById('playerCountDisplay').textContent = gameState.playerCount;
}

