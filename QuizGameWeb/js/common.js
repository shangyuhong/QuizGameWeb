// 共用功能
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

