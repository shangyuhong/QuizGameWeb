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

