// 猜人名
function showGuessNameInput() {
    showScreen('guessNameInput');
    document.getElementById('nameInput').value = '';
}

function startGuessName() {
    const name = document.getElementById('nameInput').value.trim();
    if (name) {
        gameState.targetName = name;
        gameState.questions = Array(14).fill('');
        showScreen('guessNameGame');
        renderGuessNameGame();
    }
}

function renderGuessNameGame() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    // 左欄 1-7
    const leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.gap = '12px';
    
    for (let i = 0; i < 7; i++) {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <span class="question-number">${i + 1}.</span>
            <input type="text" class="question-input" 
                   value="${gameState.questions[i]}" 
                   oninput="updateQuestion(${i}, this.value)"
                   placeholder="">
        `;
        leftColumn.appendChild(item);
    }
    
    // 右欄 8-14
    const rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.gap = '12px';
    
    for (let i = 7; i < 14; i++) {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <span class="question-number">${i + 1}.</span>
            <input type="text" class="question-input" 
                   value="${gameState.questions[i]}" 
                   oninput="updateQuestion(${i}, this.value)"
                   placeholder="">
        `;
        rightColumn.appendChild(item);
    }
    
    container.appendChild(leftColumn);
    container.appendChild(rightColumn);
}

function updateQuestion(index, value) {
    gameState.questions[index] = value;
}

