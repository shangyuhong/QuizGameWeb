// 遊戲狀態
let gameState = {
    currentScreen: 'mainMenu',
    playerCount: 1,
    quizStarted: false,
    category: '',
    randomZhuyin: '',
    scores: [],
    wordGroupStarted: false,
    firstZhuyin: '',
    secondZhuyin: '',
    targetName: '',
    questions: Array(14).fill(''),
    holdTimer: null,
    isHolding: false,
    zhuyinGameStarted: false,
    selectedZhuyin: '',
    zhuyinElements: [],
    dragElement: null,
    dragOffset: { x: 0, y: 0 },
    zhuyinAnswer: '',
    zhuyinDisabled: {}, // 追蹤每個注音符號的禁用狀態
    ticTacToeBoard: Array(9).fill(''), // 九宮格狀態
    currentPlayer: 'O', // 當前玩家：O 或 X
    playerMoves: { 'O': [], 'X': [] }, // 每個玩家的移動歷史（最多3個）
    gameOver: false,
    winner: null,
    // 進階井字遊戲狀態
    ticTacToe2Board: Array(9).fill(null).map(() => []), // 九宮格狀態，每個格子存陣列 [{player, size}, ...]
    ticTacToe2CurrentPlayer: 'O',
    ticTacToe2Pieces: {
        'O': { 'small': 2, 'medium': 2, 'large': 2 },
        'X': { 'small': 2, 'medium': 2, 'large': 2 }
    },
    ticTacToe2SelectedPiece: null, // {player, size, index} 或 null
    ticTacToe2GameOver: false,
    ticTacToe2Winner: null
};

// 資料服務
const dataService = {
    categories: [],
    zhuyin: [],
    isLoading: false,
    
    async loadData() {
        this.isLoading = true;
        try {
            const response = await fetch('https://raw.githubusercontent.com/shangyuhong/quiz-data/refs/heads/main/questions.json');
            if (!response.ok) throw new Error('載入失敗');
            const data = await response.json();
            this.categories = data.categories || [];
            this.zhuyin = data.zhuyin || [];
        } catch (error) {
            console.error('載入資料失敗:', error);
            this.loadDefaultData();
        } finally {
            this.isLoading = false;
        }
    },
    
    loadDefaultData() {
        this.categories = [
            "黑色的東西", "球體", "圓形的東西", "容器",
            "會飛的東西","會發光的東西", "會動的東西", "紅色的東西", 
            "白色的東西", "虛擬人物", "歌曲名稱", "成語", "量數為『顆』的東西", 
            "量數為『條』的東西", "量數為『根』的東西", "動物", "食物", 
            "交通工具", "職業", "運動", "國家", "城市", "樂器", "家具", 
            "電器", "植物", "學校會出現的", "自然現象", "每天都會看到的東西", 
            "複數存在的東西", "冰箱裡會出現的東西", "披薩的配料", "超過兩公尺的東西", 
            "比手機還小的東西","景點", "餐廳名稱", "歷史人物", "電影名稱", "疾病名稱",
            "現在看得到的東西", "可以投資的東西","機場會出現的東西", "海灘會出現的東西", 
            "每天都會變化的東西","藝人", "奧運項目", "需要雙手才能完成的動作", "顏色"
        ];
        this.zhuyin = ["ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ","ㄐ","ㄑ","ㄒ","ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ","ㄧ","ㄨ","ㄩ"];
    },
    
    getRandomCategory(currentCategory = '') {
        const categories = this.categories.length > 0 ? this.categories : ["食物"];
        let newCategory = categories[Math.floor(Math.random() * categories.length)];
        while (newCategory === currentCategory && categories.length > 1) {
            newCategory = categories[Math.floor(Math.random() * categories.length)];
        }
        return newCategory;
    },
    
    getRandomZhuyin() {
        const zhuyin = this.zhuyin.length > 0 ? this.zhuyin : ["ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ","ㄐ","ㄑ","ㄒ","ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ","ㄧ","ㄨ","ㄩ"];
        return zhuyin[Math.floor(Math.random() * zhuyin.length)];
    }
};

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

function startQuizGame() {
    gameState.scores = Array(gameState.playerCount).fill(0);
    showScreen('quizGame');
    renderQuizGame();
}

// 搶答模式
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

// 詞膳團體
function showWordGroup() {
    showScreen('wordGroup');
    gameState.wordGroupStarted = false;
    renderWordGroup();
}

function renderWordGroup() {
    const content = document.getElementById('wordGroupContent');
    if (!gameState.wordGroupStarted) {
        content.innerHTML = `
            <h1>詞膳團體</h1>
            <button class="btn btn-blue" onclick="startWordGroup()">開始</button>
        `;
    } else {
        content.innerHTML = `
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                <h1>詞膳團體</h1>
                <div class="word-group-display">
                    <div class="zhuyin-large">${gameState.firstZhuyin}</div>
                    <div class="zhuyin-large">${gameState.secondZhuyin}</div>
                </div>
                <button class="btn btn-blue btn-large" onclick="nextWordGroup()" style="margin-top: auto; margin-bottom: 40px;">下一題</button>
            </div>
        `;
    }
}

function startWordGroup() {
    gameState.wordGroupStarted = true;
    gameState.firstZhuyin = dataService.getRandomZhuyin();
    gameState.secondZhuyin = dataService.getRandomZhuyin();
    renderWordGroup();
}

function nextWordGroup() {
    gameState.firstZhuyin = dataService.getRandomZhuyin();
    gameState.secondZhuyin = dataService.getRandomZhuyin();
    renderWordGroup();
}

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

function startHoldTimer() {
    gameState.isHolding = true;
    const btn = document.getElementById('holdAnswerBtn') || document.getElementById('zhuyinHoldAnswerBtn');
    if (btn) btn.classList.add('holding');
    
    gameState.holdTimer = setTimeout(() => {
        showAnswerPopup();
    }, 1000);
}

function stopHoldTimer() {
    gameState.isHolding = false;
    const btn = document.getElementById('holdAnswerBtn') || document.getElementById('zhuyinHoldAnswerBtn');
    if (btn) btn.classList.remove('holding');
    
    if (gameState.holdTimer) {
        clearTimeout(gameState.holdTimer);
        gameState.holdTimer = null;
    }
    hideAnswerPopup();
}

function handleHoldStart(e) {
    e.preventDefault();
    startHoldTimer();
}

function handleHoldEnd(e) {
    e.preventDefault();
    stopHoldTimer();
}

function showAnswerPopup() {
    const popup = document.getElementById('answerPopup');
    const answerText = document.getElementById('answerName');
    // 判斷是猜人名還是一叫高下
    if (gameState.currentScreen === 'guessNameGame') {
        answerText.textContent = gameState.targetName;
    } else if (gameState.currentScreen === 'zhuyinKeyboard') {
        answerText.textContent = gameState.zhuyinAnswer;
    }
    popup.classList.add('active');
}

function hideAnswerPopup() {
    const popup = document.getElementById('answerPopup');
    popup.classList.remove('active');
}

// 一叫高下
function showZhuyinKeyboard() {
    showScreen('zhuyinInput');
    document.getElementById('zhuyinAnswerInput').value = '';
}

function startZhuyinGame() {
    const answer = document.getElementById('zhuyinAnswerInput').value.trim();
    if (answer) {
        gameState.zhuyinAnswer = answer;
        gameState.zhuyinGameStarted = true;
        gameState.zhuyinElements = [];
        gameState.zhuyinDisabled = {}; // 重置禁用狀態
        showScreen('zhuyinKeyboard');
        renderZhuyinGame();
    }
}

function renderZhuyinGame() {
    const displayContent = document.getElementById('zhuyinDisplayContent');
    const keyboardContent = document.getElementById('zhuyinKeyboardContent');
    
    displayContent.innerHTML = `
        <div class="zhuyin-canvas" id="zhuyinCanvas">
            <button class="btn btn-blue btn-clear" onclick="clearZhuyinCanvas()">清除</button>
            <button class="btn btn-orange btn-undo" onclick="undoLastZhuyin()">上一步</button>
        </div>
    `;
    renderZhuyinKeyboard();
    // 重新渲染畫布上的元素
    renderZhuyinCanvas();
}


function renderZhuyinKeyboard() {
    const keyboardContent = document.getElementById('zhuyinKeyboardContent');
    
    // 37個注音符號按照鍵盤排序
    // 第一行：聲母（21個）
    const consonants = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ'];
    // 第二行：韻母（16個）
    const vowels = ['ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'];
    // 聲調（5個）
    const tones = ['ˉ', 'ˊ', 'ˇ', 'ˋ', '˙'];
    
    let html = '';
    
    // 第一行：聲母
    html += '<div class="zhuyin-row">';
    consonants.forEach(zhuyin => {
        const isDisabled = gameState.zhuyinDisabled[zhuyin] || false;
        const disabledClass = isDisabled ? 'zhuyin-key-disabled' : '';
        html += `<button class="zhuyin-key ${disabledClass}" data-zhuyin="${zhuyin}">${zhuyin}</button>`;
    });
    html += '</div>';
    
    // 第二行：韻母
    html += '<div class="zhuyin-row">';
    vowels.forEach(zhuyin => {
        const isDisabled = gameState.zhuyinDisabled[zhuyin] || false;
        const disabledClass = isDisabled ? 'zhuyin-key-disabled' : '';
        html += `<button class="zhuyin-key ${disabledClass}" data-zhuyin="${zhuyin}">${zhuyin}</button>`;
    });
    html += '</div>';
    
    // 第三行：聲調
    html += '<div class="zhuyin-row zhuyin-tones-row">';
    tones.forEach(tone => {
        const isDisabled = gameState.zhuyinDisabled[tone] || false;
        const disabledClass = isDisabled ? 'zhuyin-key-disabled' : '';
        html += `<button class="zhuyin-key zhuyin-tone ${disabledClass}" data-zhuyin="${tone}">${tone}</button>`;
    });
    html += '</div>';
    
    keyboardContent.innerHTML = html;
    
    // 為每個按鈕添加事件監聽器
    const keys = keyboardContent.querySelectorAll('.zhuyin-key');
    keys.forEach(key => {
        const zhuyin = key.dataset.zhuyin;
        setupZhuyinKeyEvents(key, zhuyin);
    });
}

function setupZhuyinKeyEvents(button, zhuyin) {
    let longPressTimer = null;
    let isLongPressing = false;
    
    // 點擊事件（短按）
    button.addEventListener('click', (e) => {
        if (gameState.zhuyinDisabled[zhuyin]) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        selectZhuyin(zhuyin);
    });
    
    // 長按開始
    const handleLongPressStart = (e) => {
        if (gameState.zhuyinDisabled[zhuyin]) {
            // 如果已禁用，長按恢復
            longPressTimer = setTimeout(() => {
                toggleZhuyinDisabled(zhuyin, false);
                isLongPressing = false;
            }, 1000);
        } else {
            // 如果未禁用，長按禁用
            longPressTimer = setTimeout(() => {
                toggleZhuyinDisabled(zhuyin, true);
                isLongPressing = true;
            }, 1000);
        }
    };
    
    // 長按結束
    const handleLongPressEnd = (e) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        isLongPressing = false;
    };
    
    // 滑鼠事件
    button.addEventListener('mousedown', handleLongPressStart);
    button.addEventListener('mouseup', handleLongPressEnd);
    button.addEventListener('mouseleave', handleLongPressEnd);
    
    // 觸摸事件
    button.addEventListener('touchstart', handleLongPressStart, { passive: false });
    button.addEventListener('touchend', handleLongPressEnd, { passive: false });
    button.addEventListener('touchcancel', handleLongPressEnd, { passive: false });
}

function toggleZhuyinDisabled(zhuyin, disabled) {
    gameState.zhuyinDisabled[zhuyin] = disabled;
    renderZhuyinKeyboard();
}

function selectZhuyin(zhuyin) {
    // 檢查是否被禁用
    if (gameState.zhuyinDisabled[zhuyin]) {
        return;
    }
    
    const canvas = document.getElementById('zhuyinCanvas');
    if (!canvas) return;
    
    // 創建新的可拖移元素
    const element = {
        id: Date.now() + Math.random(),
        text: zhuyin,
        x: Math.random() * (canvas.offsetWidth - 60) + 30,
        y: Math.random() * (canvas.offsetHeight - 60) + 30
    };
    
    gameState.zhuyinElements.push(element);
    renderZhuyinCanvas();
}

function renderZhuyinCanvas() {
    const canvas = document.getElementById('zhuyinCanvas');
    if (!canvas) return;
    
    // 清除現有元素（保留按鈕）
    const clearBtn = canvas.querySelector('.btn-clear');
    const undoBtn = canvas.querySelector('.btn-undo');
    canvas.innerHTML = '';
    
    // 重新添加清除按鈕
    if (clearBtn) {
        canvas.appendChild(clearBtn);
    } else {
        const btn = document.createElement('button');
        btn.className = 'btn btn-blue btn-clear';
        btn.textContent = '清除';
        btn.onclick = clearZhuyinCanvas;
        canvas.appendChild(btn);
    }
    
    // 重新添加上一步按鈕
    if (undoBtn) {
        canvas.appendChild(undoBtn);
    } else {
        const btn = document.createElement('button');
        btn.className = 'btn btn-orange btn-undo';
        btn.textContent = '上一步';
        btn.onclick = undoLastZhuyin;
        canvas.appendChild(btn);
    }
    
    // 渲染所有元素
    gameState.zhuyinElements.forEach(element => {
        const el = document.createElement('div');
        el.className = 'zhuyin-draggable';
        el.textContent = element.text;
        el.style.left = element.x + 'px';
        el.style.top = element.y + 'px';
        el.dataset.id = element.id;
        
        // 添加拖移事件
        makeDraggable(el, element);
        
        canvas.appendChild(el);
    });
}

function makeDraggable(element, data) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    element.addEventListener('mousedown', (e) => {
        if (e.target === element || element.contains(e.target)) {
            isDragging = true;
            const rect = element.getBoundingClientRect();
            const canvasRect = element.parentElement.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialX = rect.left - canvasRect.left;
            initialY = rect.top - canvasRect.top;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && element.dataset.id === data.id.toString()) {
            const canvasRect = element.parentElement.getBoundingClientRect();
            const newX = initialX + (e.clientX - startX);
            const newY = initialY + (e.clientY - startY);
            
            // 限制在畫布範圍內
            const maxX = canvasRect.width - element.offsetWidth;
            const maxY = canvasRect.height - element.offsetHeight;
            
            data.x = Math.max(0, Math.min(newX, maxX));
            data.y = Math.max(0, Math.min(newY, maxY));
            
            element.style.left = data.x + 'px';
            element.style.top = data.y + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'grab';
        }
    });
    
    // 觸摸事件支援
    element.addEventListener('touchstart', (e) => {
        if (e.target === element || element.contains(e.target)) {
            isDragging = true;
            const touch = e.touches[0];
            const rect = element.getBoundingClientRect();
            const canvasRect = element.parentElement.getBoundingClientRect();
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = rect.left - canvasRect.left;
            initialY = rect.top - canvasRect.top;
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging && element.dataset.id === data.id.toString()) {
            const touch = e.touches[0];
            const canvasRect = element.parentElement.getBoundingClientRect();
            const newX = initialX + (touch.clientX - startX);
            const newY = initialY + (touch.clientY - startY);
            
            const maxX = canvasRect.width - element.offsetWidth;
            const maxY = canvasRect.height - element.offsetHeight;
            
            data.x = Math.max(0, Math.min(newX, maxX));
            data.y = Math.max(0, Math.min(newY, maxY));
            
            element.style.left = data.x + 'px';
            element.style.top = data.y + 'px';
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
        }
    });
    
    element.style.cursor = 'grab';
}

function clearZhuyinCanvas() {
    gameState.zhuyinElements = [];
    renderZhuyinCanvas();
}

function undoLastZhuyin() {
    if (gameState.zhuyinElements.length > 0) {
        gameState.zhuyinElements.pop(); // 移除最後一個元素
        renderZhuyinCanvas();
    }
}

// 進階圈叉
function showAdvancedTicTacToe() {
    showScreen('advancedTicTacToe');
    resetTicTacToe();
}

function resetTicTacToe() {
    gameState.ticTacToeBoard = Array(9).fill('');
    gameState.currentPlayer = 'O';
    gameState.playerMoves = { 'O': [], 'X': [] };
    gameState.gameOver = false;
    gameState.winner = null;
    renderTicTacToe();
}

function renderTicTacToe() {
    const board = document.getElementById('ticTacToeBoard');
    const status = document.getElementById('ticTacToeStatus');
    const result = document.getElementById('ticTacToeResult');
    
    if (!board) return;
    
    board.innerHTML = '';
    
    // 創建九宮格
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tic-tac-toe-cell';
        cell.dataset.index = i;
        
        if (gameState.ticTacToeBoard[i]) {
            cell.textContent = gameState.ticTacToeBoard[i];
            cell.classList.add(`player-${gameState.ticTacToeBoard[i]}`);
        } else if (!gameState.gameOver) {
            cell.addEventListener('click', () => handleCellClick(i));
        }
        
        board.appendChild(cell);
    }
    
    // 更新狀態
    if (gameState.gameOver) {
        if (gameState.winner) {
            status.textContent = `玩家 ${gameState.winner} 獲勝！`;
            status.style.color = '#22c55e';
        } else {
            status.textContent = '平手！';
            status.style.color = '#9ca3af';
        }
        result.textContent = '';
    } else {
        status.textContent = `玩家 ${gameState.currentPlayer} 的回合`;
        status.style.color = '#1f2937';
        const oMoves = gameState.playerMoves['O'].length;
        const xMoves = gameState.playerMoves['X'].length;
        result.innerHTML = `
            <div>玩家 O：${oMoves}/3 格</div>
            <div>玩家 X：${xMoves}/3 格</div>
        `;
    }
}

function handleCellClick(index) {
    if (gameState.gameOver || gameState.ticTacToeBoard[index]) {
        return;
    }
    
    const player = gameState.currentPlayer;
    const moves = gameState.playerMoves[player];
    
    // 如果玩家已經有3個格子，移除最早的
    if (moves.length >= 3) {
        const oldestIndex = moves[0];
        gameState.ticTacToeBoard[oldestIndex] = '';
        moves.shift(); // 移除最早的移動
    }
    
    // 添加新的移動
    gameState.ticTacToeBoard[index] = player;
    moves.push(index);
    
    // 檢查勝利
    if (checkWin(player)) {
        gameState.gameOver = true;
        gameState.winner = player;
    } else {
        // 切換玩家
        gameState.currentPlayer = player === 'O' ? 'X' : 'O';
    }
    
    renderTicTacToe();
}

function checkWin(player) {
    const board = gameState.ticTacToeBoard;
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫線
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直線
        [0, 4, 8], [2, 4, 6] // 斜線
    ];
    
    // 檢查玩家是否有連成一線
    const playerMoves = gameState.playerMoves[player];
    if (playerMoves.length < 3) return false;
    
    // 檢查所有勝利模式
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            // 確認這三個位置都在玩家的移動歷史中
            const hasAll = pattern.every(pos => playerMoves.includes(pos));
            if (hasAll) {
                return true;
            }
        }
    }
    
    return false;
}

// 進階井字遊戲
function showAdvancedTicTacToe2() {
    showScreen('advancedTicTacToe2');
    resetTicTacToe2();
}

function resetTicTacToe2() {
    gameState.ticTacToe2Board = Array(9).fill(null).map(() => []);
    gameState.ticTacToe2CurrentPlayer = 'O';
    gameState.ticTacToe2Pieces = {
        'O': { 'small': 2, 'medium': 2, 'large': 2 },
        'X': { 'small': 2, 'medium': 2, 'large': 2 }
    };
    gameState.ticTacToe2SelectedPiece = null;
    gameState.ticTacToe2GameOver = false;
    gameState.ticTacToe2Winner = null;
    renderTicTacToe2();
}

function renderTicTacToe2() {
    const board = document.getElementById('ticTacToe2Board');
    const status = document.getElementById('ticTacToe2Status');
    const result = document.getElementById('ticTacToe2Result');
    const playerOPieces = document.getElementById('playerOPieces');
    const playerXPieces = document.getElementById('playerXPieces');
    
    if (!board) return;
    
    // 渲染九宮格
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tic-tac-toe-cell tic-tac-toe2-cell';
        cell.dataset.index = i;
        
        const pieces = gameState.ticTacToe2Board[i];
        // 獲取最大的棋子（用於顯示）
        const topPieceInfo = getTopPiece(pieces);
        if (topPieceInfo) {
            const topPiece = topPieceInfo.piece;
            const pieceDiv = document.createElement('div');
            pieceDiv.className = `piece piece-${topPiece.size} piece-${topPiece.player}`;
            pieceDiv.textContent = '♟️';
            if (topPiece.player === gameState.ticTacToe2CurrentPlayer && !gameState.ticTacToe2GameOver) {
                pieceDiv.classList.add('movable');
                pieceDiv.addEventListener('click', (e) => {
                    const selected = gameState.ticTacToe2SelectedPiece;
                    // 如果已經選擇了任何棋子，允許事件冒泡到格子來處理移動
                    if (selected) {
                        // 不阻止冒泡，讓格子的點擊事件處理移動
                        return;
                    }
                    // 如果還沒選擇，選擇這個棋子並阻止冒泡
                    e.stopPropagation();
                    selectBoardPiece(i);
                });
            }
            cell.appendChild(pieceDiv);
        }
        
        if (!gameState.ticTacToe2GameOver) {
            cell.addEventListener('click', () => handleCellClick2(i));
        }
        
        board.appendChild(cell);
    }
    
    // 渲染棋子選擇區
    renderPlayerPieces('O', playerOPieces);
    renderPlayerPieces('X', playerXPieces);
    
    // 更新狀態（隱藏狀態文字，只在遊戲結束時顯示）
    if (gameState.ticTacToe2GameOver) {
        if (gameState.ticTacToe2Winner) {
            status.textContent = `玩家 ${gameState.ticTacToe2Winner} 獲勝！`;
            status.style.color = '#22c55e';
            status.style.display = 'block';
        } else {
            status.textContent = '平手！';
            status.style.color = '#9ca3af';
            status.style.display = 'block';
        }
        result.textContent = '';
    } else {
        status.style.display = 'none';
        result.textContent = '';
    }
}

// 獲取最大的棋子（用於顯示）
function getTopPiece(pieces) {
    if (!pieces || pieces.length === 0) return null;
    
    const sizeOrder = { 'small': 1, 'medium': 2, 'large': 3 };
    let topPiece = pieces[0];
    let topIndex = 0;
    for (let i = 1; i < pieces.length; i++) {
        if (sizeOrder[pieces[i].size] > sizeOrder[topPiece.size]) {
            topPiece = pieces[i];
            topIndex = i;
        }
    }
    return { piece: topPiece, index: topIndex };
}

// 移除最大的棋子
function removeTopPiece(pieces) {
    if (!pieces || pieces.length === 0) return null;
    
    const sizeOrder = { 'small': 1, 'medium': 2, 'large': 3 };
    let maxSize = 0;
    let maxIndex = -1;
    for (let i = 0; i < pieces.length; i++) {
        if (sizeOrder[pieces[i].size] > maxSize) {
            maxSize = sizeOrder[pieces[i].size];
            maxIndex = i;
        }
    }
    if (maxIndex === -1) return null;
    return pieces.splice(maxIndex, 1)[0];
}

function renderPlayerPieces(player, container) {
    container.innerHTML = '';
    const pieces = gameState.ticTacToe2Pieces[player];
    const sizes = ['small', 'medium', 'large'];
    const sizeLabels = { 'small': '小', 'medium': '中', 'large': '大' };
    
    sizes.forEach(size => {
        for (let i = 0; i < pieces[size]; i++) {
            const pieceDiv = document.createElement('div');
            pieceDiv.className = `piece piece-${size} piece-${player} selectable-piece`;
            pieceDiv.textContent = '♟️';
            pieceDiv.dataset.player = player;
            pieceDiv.dataset.size = size;
            
            if (player === gameState.ticTacToe2CurrentPlayer && !gameState.ticTacToe2GameOver) {
                pieceDiv.addEventListener('click', () => selectPiece(player, size));
            } else {
                pieceDiv.style.opacity = '0.5';
            }
            
            container.appendChild(pieceDiv);
        }
    });
}

function selectPiece(player, size) {
    if (gameState.ticTacToe2CurrentPlayer !== player) return;
    gameState.ticTacToe2SelectedPiece = { player, size };
    renderTicTacToe2();
}

function selectBoardPiece(index) {
    const pieces = gameState.ticTacToe2Board[index];
    const topPieceInfo = getTopPiece(pieces);
    if (!topPieceInfo) return;
    
    const topPiece = topPieceInfo.piece;
    if (topPiece.player !== gameState.ticTacToe2CurrentPlayer) return;
    
    gameState.ticTacToe2SelectedPiece = { 
        player: topPiece.player, 
        size: topPiece.size, 
        index: index 
    };
    renderTicTacToe2();
}

function handleCellClick2(index) {
    if (gameState.ticTacToe2GameOver) return;
    
    const selected = gameState.ticTacToe2SelectedPiece;
    if (!selected) return;
    
    const targetPieces = gameState.ticTacToe2Board[index];
    const targetTopPieceInfo = getTopPiece(targetPieces);
    const targetTopPiece = targetTopPieceInfo ? targetTopPieceInfo.piece : null;
    
    // 如果是移動場上的棋子
    if (selected.index !== undefined) {
        const sourceIndex = selected.index;
        
        // 不能移動到相同位置
        if (sourceIndex === index) {
            gameState.ticTacToe2SelectedPiece = null;
            renderTicTacToe2();
            return;
        }
        
        const sourcePieces = gameState.ticTacToe2Board[sourceIndex];
        const sourceTopPieceInfo = getTopPiece(sourcePieces);
        
        if (!sourceTopPieceInfo) return;
        
        const sourceTopPiece = sourceTopPieceInfo.piece;
        
        // 驗證選擇的棋子確實是最大的棋子
        if (sourceTopPiece.player !== selected.player || sourceTopPiece.size !== selected.size) {
            gameState.ticTacToe2SelectedPiece = null;
            renderTicTacToe2();
            return;
        }
        
        // 從源位置移除最大的棋子
        const movedPiece = removeTopPiece(sourcePieces);
        if (!movedPiece) return;
        
        // 移動棋子到目標位置
        if (!targetTopPiece) {
            // 移動到空位
            targetPieces.push(movedPiece);
        } else {
            // 嘗試吃子（相同顏色或不同顏色都可以，只要大小允許）
            const sizeOrder = { 'small': 1, 'medium': 2, 'large': 3 };
            // 重新獲取目標位置的最大棋子（確保獲取的是最新的）
            const currentTargetTopPieceInfo = getTopPiece(targetPieces);
            const currentTargetTopPiece = currentTargetTopPieceInfo ? currentTargetTopPieceInfo.piece : null;
            
            if (currentTargetTopPiece && sizeOrder[movedPiece.size] > sizeOrder[currentTargetTopPiece.size]) {
                // 可以吃掉，先移除被吃掉的棋子（最大的），然後加入被吃掉的棋子和移動的棋子
                const eatenPiece = removeTopPiece(targetPieces);
                if (eatenPiece) {
                    // 將被吃掉的棋子加入陣列（保留在堆疊中）
                    targetPieces.push(eatenPiece);
                }
                // 將移動的棋子加入目標位置
                targetPieces.push(movedPiece);
            } else {
                // 不能吃掉，恢復源位置的棋子
                sourcePieces.push(movedPiece);
                gameState.ticTacToe2SelectedPiece = null;
                renderTicTacToe2();
                return;
            }
        }
    } else {
        // 下新棋子
        if (!targetTopPiece) {
            // 檢查是否還有該大小的棋子
            if (gameState.ticTacToe2Pieces[selected.player][selected.size] > 0) {
                targetPieces.push({ player: selected.player, size: selected.size });
                gameState.ticTacToe2Pieces[selected.player][selected.size]--;
            } else {
                return;
            }
        } else {
            // 嘗試吃子（相同顏色或不同顏色都可以，只要大小允許）
            const sizeOrder = { 'small': 1, 'medium': 2, 'large': 3 };
            // 重新獲取目標位置的最大棋子（確保獲取的是最新的）
            const currentTargetTopPieceInfo = getTopPiece(targetPieces);
            const currentTargetTopPiece = currentTargetTopPieceInfo ? currentTargetTopPieceInfo.piece : null;
            
            if (currentTargetTopPiece && sizeOrder[selected.size] > sizeOrder[currentTargetTopPiece.size]) {
                // 可以吃掉，先移除被吃掉的棋子（最大的），然後加入被吃掉的棋子和新棋子
                const eatenPiece = removeTopPiece(targetPieces);
                if (eatenPiece) {
                    // 將被吃掉的棋子加入陣列（保留在堆疊中）
                    targetPieces.push(eatenPiece);
                }
                // 將新棋子加入陣列
                targetPieces.push({ player: selected.player, size: selected.size });
                gameState.ticTacToe2Pieces[selected.player][selected.size]--;
            } else {
                // 不能吃掉
                return;
            }
        }
    }
    
    // 檢查勝利（檢查所有玩家，不只是當前玩家）
    // 因為移動最上層的棋子可能使得下層的棋子完成一條線
    if (checkWin2('O')) {
        gameState.ticTacToe2GameOver = true;
        gameState.ticTacToe2Winner = 'O';
    } else if (checkWin2('X')) {
        gameState.ticTacToe2GameOver = true;
        gameState.ticTacToe2Winner = 'X';
    }
    
    // 如果遊戲未結束，切換玩家
    if (!gameState.ticTacToe2GameOver) {
        gameState.ticTacToe2CurrentPlayer = gameState.ticTacToe2CurrentPlayer === 'O' ? 'X' : 'O';
    }
    gameState.ticTacToe2SelectedPiece = null;
    renderTicTacToe2();
}

function checkWin2(player) {
    const board = gameState.ticTacToe2Board;
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫線
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直線
        [0, 4, 8], [2, 4, 6] // 斜線
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const topAInfo = getTopPiece(board[a]);
        const topBInfo = getTopPiece(board[b]);
        const topCInfo = getTopPiece(board[c]);
        
        const topA = topAInfo ? topAInfo.piece : null;
        const topB = topBInfo ? topBInfo.piece : null;
        const topC = topCInfo ? topCInfo.piece : null;
        
        if (topA && topA.player === player &&
            topB && topB.player === player &&
            topC && topC.player === player) {
            return true;
        }
    }
    
    return false;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    dataService.loadData();
    showMainMenu();
    
    // 設置按住查看答案按鈕的事件監聽器（猜人名）
    const holdAnswerBtn = document.getElementById('holdAnswerBtn');
    if (holdAnswerBtn) {
        // 滑鼠事件
        holdAnswerBtn.addEventListener('mousedown', handleHoldStart);
        holdAnswerBtn.addEventListener('mouseup', handleHoldEnd);
        holdAnswerBtn.addEventListener('mouseleave', handleHoldEnd);
        
        // 觸摸事件
        holdAnswerBtn.addEventListener('touchstart', handleHoldStart, { passive: false });
        holdAnswerBtn.addEventListener('touchend', handleHoldEnd, { passive: false });
        holdAnswerBtn.addEventListener('touchcancel', handleHoldEnd, { passive: false });
        
        // 防止右鍵選單
        holdAnswerBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // 設置按住查看答案按鈕的事件監聽器（一叫高下）
    const zhuyinHoldAnswerBtn = document.getElementById('zhuyinHoldAnswerBtn');
    if (zhuyinHoldAnswerBtn) {
        // 滑鼠事件
        zhuyinHoldAnswerBtn.addEventListener('mousedown', handleHoldStart);
        zhuyinHoldAnswerBtn.addEventListener('mouseup', handleHoldEnd);
        zhuyinHoldAnswerBtn.addEventListener('mouseleave', handleHoldEnd);
        
        // 觸摸事件
        zhuyinHoldAnswerBtn.addEventListener('touchstart', handleHoldStart, { passive: false });
        zhuyinHoldAnswerBtn.addEventListener('touchend', handleHoldEnd, { passive: false });
        zhuyinHoldAnswerBtn.addEventListener('touchcancel', handleHoldEnd, { passive: false });
        
        // 防止右鍵選單
        zhuyinHoldAnswerBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
});


