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
    isHolding: false
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
    const btn = document.getElementById('holdAnswerBtn');
    if (btn) btn.classList.add('holding');
    
    gameState.holdTimer = setTimeout(() => {
        showAnswerPopup();
    }, 1000);
}

function stopHoldTimer() {
    gameState.isHolding = false;
    const btn = document.getElementById('holdAnswerBtn');
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
    answerText.textContent = gameState.targetName;
    popup.classList.add('active');
}

function hideAnswerPopup() {
    const popup = document.getElementById('answerPopup');
    popup.classList.remove('active');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    dataService.loadData();
    showMainMenu();
    
    // 設置按住查看答案按鈕的事件監聽器
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
});

