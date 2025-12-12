// 搶答模式
function startQuizGame() {
    gameState.scores = Array(gameState.playerCount).fill(0);
    showScreen('quizGame');
    renderQuizGame();
}

function renderQuizGame() {
    const content = document.getElementById('quizContent');
    const scoresContainer = document.getElementById('playerScores');
    
    if (!gameState.quizStarted) {
        content.innerHTML = '<button class="btn btn-blue" onclick="startQuiz()">開始</button>';
        scoresContainer.innerHTML = '';
    } else {
        content.innerHTML = `
            <div class="category-display">${gameState.category}</div>
            <div class="zhuyin-display">注音：${gameState.randomZhuyin}</div>
            <div class="quiz-buttons">
                <button class="btn btn-orange" onclick="changeCategory()">換題目</button>
                <button class="btn btn-blue" onclick="nextZhuyin()">下一題</button>
            </div>
        `;
        
        scoresContainer.innerHTML = `
            <h2 style="color: white; text-align: center; margin-bottom: 20px;">玩家分數 (共 ${gameState.playerCount} 人)</h2>
            ${gameState.scores.map((score, index) => `
                <div class="player-score-item">
                    <span>玩家 ${index + 1}：${score} 分</span>
                    <button class="score-btn" onclick="addScore(${index})">+1</button>
                </div>
            `).join('')}
        `;
    }
}

function startQuiz() {
    gameState.quizStarted = true;
    gameState.category = dataService.getRandomCategory();
    gameState.randomZhuyin = dataService.getRandomZhuyin();
    renderQuizGame();
}

function changeCategory() {
    gameState.category = dataService.getRandomCategory(gameState.category);
    renderQuizGame();
}

function nextZhuyin() {
    gameState.randomZhuyin = dataService.getRandomZhuyin();
    renderQuizGame();
}

function addScore(playerIndex) {
    gameState.scores[playerIndex]++;
    renderQuizGame();
}

