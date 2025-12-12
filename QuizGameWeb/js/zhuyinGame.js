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

