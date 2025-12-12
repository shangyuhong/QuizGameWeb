// 進階井字遊戲（奇雞連連）
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
            // 根據玩家設置不同的圖案
            pieceDiv.textContent = topPiece.player === 'O' ? '🐔' : '🐦';
            
            // 檢查是否被選中
            const selected = gameState.ticTacToe2SelectedPiece;
            if (selected && selected.index === i && 
                selected.player === topPiece.player && 
                selected.size === topPiece.size) {
                pieceDiv.classList.add('selected');
            }
            
            if (topPiece.player === gameState.ticTacToe2CurrentPlayer && !gameState.ticTacToe2GameOver) {
                pieceDiv.classList.add('movable');
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
            // 根據玩家設置不同的圖案
            pieceDiv.textContent = player === 'O' ? '🐔' : '🐦';
            pieceDiv.dataset.player = player;
            pieceDiv.dataset.size = size;
            
            // 檢查是否被選中（選擇區的棋子）
            const selected = gameState.ticTacToe2SelectedPiece;
            if (selected && !selected.index && 
                selected.player === player && 
                selected.size === size) {
                pieceDiv.classList.add('selected');
            }
            
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
    const targetPieces = gameState.ticTacToe2Board[index];
    const targetTopPieceInfo = getTopPiece(targetPieces);
    const targetTopPiece = targetTopPieceInfo ? targetTopPieceInfo.piece : null;
    
    // 如果沒有選擇棋子，檢查點擊的欄位是否有當前玩家的棋子，如果有就選擇它
    if (!selected) {
        if (targetTopPiece && targetTopPiece.player === gameState.ticTacToe2CurrentPlayer) {
            selectBoardPiece(index);
        }
        return;
    }
    
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

