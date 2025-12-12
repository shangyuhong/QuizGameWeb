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

