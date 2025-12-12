// 黑白轉轉棋遊戲
function showReversiRotate() {
    showScreen('reversiRotate');
    resetReversiRotate();
}

function resetReversiRotate() {
    // 清除舊的計時器
    if (gameState.reversiRotateTimer) {
        clearInterval(gameState.reversiRotateTimer);
        gameState.reversiRotateTimer = null;
    }
    
    // 初始化4x4棋盤，null表示空位，'B'表示黑子，'W'表示白子
    gameState.reversiRotateBoard = Array(16).fill(null);
    gameState.reversiRotateCurrentPlayer = 'B'; // B=黑方, W=白方
    gameState.reversiRotateGameOver = false;
    gameState.reversiRotateWinner = null;
    gameState.reversiRotateSelectedCell = null; // 選中的格子索引（用於移動對方棋子）
    gameState.reversiRotateRotateCount = 0; // 棋盤滿格後的旋轉次數
    gameState.reversiRotateTimeLeft = 15; // 重置剩餘時間
    gameState.reversiRotateHasMovedOpponent = false; // 重置移動標記
    gameState.reversiRotateIsAnimating = false; // 重置動畫標記
    
    renderReversiRotate();
    startTimer(); // 啟動計時器
}

function renderReversiRotate() {
    const board = document.getElementById('reversiRotateBoard');
    const status = document.getElementById('reversiRotateStatus');
    const rotateBtn = document.getElementById('reversiRotateRotateBtn');
    
    if (!board) return;
    
    // 如果正在進行動畫，只更新狀態文字，不重新渲染棋盤
    if (gameState.reversiRotateIsAnimating) {
        updateStatusText(status, rotateBtn);
        return;
    }
    
    // 渲染4x4棋盤
    board.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'reversi-rotate-cell';
        cell.dataset.index = i;
        
        const value = gameState.reversiRotateBoard[i];
        if (value === 'B') {
            cell.classList.add('piece-black');
            // 使用圖片作為黑子
            const piece = document.createElement('img');
            piece.className = 'reversi-piece-img';
            piece.src = 'images/black-piece.png';
            piece.alt = '黑子';
            cell.appendChild(piece);
        } else if (value === 'W') {
            cell.classList.add('piece-white');
            // 使用圖片作為白子
            const piece = document.createElement('img');
            piece.className = 'reversi-piece-img';
            piece.src = 'images/white-piece.png';
            piece.alt = '白子';
            cell.appendChild(piece);
        }
        
        // 設置點擊事件
        if (!gameState.reversiRotateGameOver) {
            if (value === null) {
                // 空白格子：下自己的棋子
                cell.classList.add('placeable');
                cell.addEventListener('click', () => handleCellClick(i));
            } else if (value !== gameState.reversiRotateCurrentPlayer) {
                // 對方棋子：選擇移動
                cell.classList.add('selectable');
                cell.addEventListener('click', () => handleCellClick(i));
            }
            // 自己的棋子：無效，不添加點擊事件
        }
        
        // 標記選中的格子（用於移動對方棋子）
        if (gameState.reversiRotateSelectedCell === i) {
            cell.classList.add('selected');
            // 如果已選中棋子，顯示可移動的相鄰空位
            if (value === null) {
                const selectedIndex = gameState.reversiRotateSelectedCell;
                if (isAdjacent(selectedIndex, i)) {
                    cell.classList.add('movable');
                }
            }
        }
        
        // 添加方向箭頭，表示旋轉時的移動方向
        const nextIndex = getNextPosition(i);
        const direction = getMoveDirection(i, nextIndex);
        if (direction) {
            const arrow = document.createElement('div');
            arrow.className = `rotate-arrow rotate-arrow-${direction}`;
            cell.appendChild(arrow);
        }
        
        board.appendChild(cell);
    }
    
    // 更新狀態文字和按鈕
    updateStatusText(status, rotateBtn);
}

// 更新狀態文字和按鈕（不重新渲染棋盤）
function updateStatusText(status, rotateBtn) {
    if (!status) return;
    
    // 更新狀態文字
    if (gameState.reversiRotateGameOver) {
        // 遊戲結束時清除計時器
        if (gameState.reversiRotateTimer) {
            clearInterval(gameState.reversiRotateTimer);
            gameState.reversiRotateTimer = null;
        }
        
        if (gameState.reversiRotateWinner) {
            const winnerText = gameState.reversiRotateWinner === 'B' ? '黑方' : '白方';
            status.textContent = `${winnerText}獲勝！`;
            status.style.color = '#22c55e';
        } else {
            status.textContent = '和局';
            status.style.color = '#9ca3af';
        }
    } else {
        const playerText = gameState.reversiRotateCurrentPlayer === 'B' ? '黑方' : '白方';
        const timeDisplay = gameState.reversiRotateTimeLeft > 0 ? ` (${gameState.reversiRotateTimeLeft}秒)` : ' (時間到！)';
        status.textContent = `${playerText}的回合${timeDisplay}`;
        status.style.color = gameState.reversiRotateTimeLeft <= 3 ? '#ef4444' : '#1f2937';
    }
    
    // 控制旋轉按鈕的啟用狀態：只在棋盤滿格時啟用
    if (rotateBtn) {
        const isBoardFull = gameState.reversiRotateBoard.every(cell => cell !== null);
        rotateBtn.disabled = !isBoardFull || gameState.reversiRotateGameOver;
    }
}

// 判斷兩個格子是否相鄰（上下左右）
function isAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / 4);
    const col1 = index1 % 4;
    const row2 = Math.floor(index2 / 4);
    const col2 = index2 % 4;
    
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// 計算格子在旋轉時會移動到哪個位置
function getNextPosition(index) {
    // 內圈：中間2x2的格子，按逆時針順序排列
    // 逆時針：5→9→10→6→5
    const innerCircle = [5, 9, 10, 6];
    
    // 外圈：外圍12個格子，按逆時針順序排列
    // 逆時針：0→4→8→12→13→14→15→11→7→3→2→1→0
    const outerCircle = [0, 4, 8, 12, 13, 14, 15, 11, 7, 3, 2, 1];
    
    // 檢查是否在內圈
    const innerIndex = innerCircle.indexOf(index);
    if (innerIndex !== -1) {
        const nextIndex = innerCircle[(innerIndex + 1) % innerCircle.length];
        return nextIndex;
    }
    
    // 檢查是否在外圈
    const outerIndex = outerCircle.indexOf(index);
    if (outerIndex !== -1) {
        const nextIndex = outerCircle[(outerIndex + 1) % outerCircle.length];
        return nextIndex;
    }
    
    // 不在任何圈內（不應該發生）
    return index;
}

// 獲取移動方向（上、下、左、右）
function getMoveDirection(fromIndex, toIndex) {
    const fromRow = Math.floor(fromIndex / 4);
    const fromCol = fromIndex % 4;
    const toRow = Math.floor(toIndex / 4);
    const toCol = toIndex % 4;
    
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    if (rowDiff === -1 && colDiff === 0) return 'up';      // 向上
    if (rowDiff === 1 && colDiff === 0) return 'down';    // 向下
    if (rowDiff === 0 && colDiff === -1) return 'left';    // 向左
    if (rowDiff === 0 && colDiff === 1) return 'right';   // 向右
    
    // 如果移動超過一格或對角線，返回null（不顯示箭頭）
    return null;
}

// 處理格子點擊
function handleCellClick(index) {
    if (gameState.reversiRotateGameOver) return;
    
    const value = gameState.reversiRotateBoard[index];
    
    // 如果已選擇了對方棋子要移動
    if (gameState.reversiRotateSelectedCell !== null) {
        const selectedIndex = gameState.reversiRotateSelectedCell;
        const selectedValue = gameState.reversiRotateBoard[selectedIndex];
        
        // 如果點擊的是空白格子且相鄰，則移動棋子
        if (value === null && isAdjacent(selectedIndex, index)) {
            // 檢查是否已經移動過對方的棋子
            if (gameState.reversiRotateHasMovedOpponent) {
                // 已經移動過，取消選擇
                gameState.reversiRotateSelectedCell = null;
                renderReversiRotate();
                return;
            }
            
            // 移動對方棋子
            gameState.reversiRotateBoard[index] = selectedValue;
            gameState.reversiRotateBoard[selectedIndex] = null;
            gameState.reversiRotateSelectedCell = null;
            gameState.reversiRotateHasMovedOpponent = true; // 標記已移動
            renderReversiRotate();
            // 移動後不自動下棋，等待玩家下棋
            return;
        } else {
            // 點擊其他地方，取消選擇
            gameState.reversiRotateSelectedCell = null;
            renderReversiRotate();
            return;
        }
    }
    
    // 如果點擊的是空白格子，下自己的棋子
    if (value === null) {
        gameState.reversiRotateBoard[index] = gameState.reversiRotateCurrentPlayer;
        // 下完棋後自動觸發旋轉
        renderReversiRotate();
        // 延遲一下讓玩家看到下棋，然後自動旋轉
        setTimeout(() => {
            rotateBoard();
        }, 300);
        return;
    }
    
    // 如果點擊的是對方棋子，選擇它（但只能選擇一次）
    if (value !== gameState.reversiRotateCurrentPlayer) {
        // 如果已經移動過對方的棋子，不能再選擇
        if (gameState.reversiRotateHasMovedOpponent) {
            return;
        }
        gameState.reversiRotateSelectedCell = index;
        renderReversiRotate();
        return;
    }
    
    // 點擊自己的棋子，無效（不做任何事）
}

// 計算格子在棋盤上的實際像素位置（相對於棋盤）
function getCellPixelPosition(index, board) {
    const cell = board.querySelector(`[data-index="${index}"]`);
    if (!cell) return { x: 0, y: 0 };
    
    const boardRect = board.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    
    // 計算格子中心相對於棋盤左上角的像素位置
    const x = (cellRect.left + cellRect.width / 2) - boardRect.left;
    const y = (cellRect.top + cellRect.height / 2) - boardRect.top;
    
    return { x: x, y: y };
}

// 旋轉棋盤（自動觸發或手動點擊）
function rotateBoard() {
    if (gameState.reversiRotateGameOver) return;
    
    const board = document.getElementById('reversiRotateBoard');
    if (!board) return;
    
    // 設置動畫標記
    gameState.reversiRotateIsAnimating = true;
    
    // 手動點擊時，按鈕的disabled狀態已經控制了是否允許旋轉
    // 自動觸發時（下完棋後），直接執行旋轉，不檢查棋盤是否滿格
    
    // 內圈：中間2x2的格子，按逆時針順序排列
    // 棋盤: 0  1  2  3
    //       4  5  6  7
    //       8  9  10 11
    //       12 13 14 15
    // 逆時針：5→9→10→6→5
    const innerCircle = [5, 9, 10, 6];
    
    // 外圈：外圍12個格子，按逆時針順序排列
    // 逆時針：0→4→8→12→13→14→15→11→7→3→2→1→0
    const outerCircle = [0, 4, 8, 12, 13, 14, 15, 11, 7, 3, 2, 1];
    
    // 收集所有需要移動的棋子
    const movingPieces = [];
    
    // 為每個棋子設置動畫，讓它移動到下一個位置
    innerCircle.forEach((index, i) => {
        const cell = board.querySelector(`[data-index="${index}"]`);
        const piece = cell?.querySelector('.reversi-piece-img');
        if (piece && cell) {
            // 計算當前位置（像素）
            const currentPos = getCellPixelPosition(index, board);
            // 計算目標位置（下一個位置）
            const nextIndex = innerCircle[(i + 1) % innerCircle.length];
            const targetPos = getCellPixelPosition(nextIndex, board);
            
            // 計算需要移動的距離
            const deltaX = targetPos.x - currentPos.x;
            const deltaY = targetPos.y - currentPos.y;
            
            // 將棋子移到棋盤層級，以便動畫
            const pieceClone = piece.cloneNode(true);
            // 保持原始棋子的大小
            const pieceRect = piece.getBoundingClientRect();
            pieceClone.style.position = 'absolute';
            pieceClone.style.left = `${currentPos.x}px`;
            pieceClone.style.top = `${currentPos.y}px`;
            pieceClone.style.width = `${pieceRect.width}px`;
            pieceClone.style.height = `${pieceRect.height}px`;
            pieceClone.style.transform = 'translate(-50%, -50%)';
            pieceClone.style.zIndex = '1000';
            pieceClone.style.pointerEvents = 'none';
            board.appendChild(pieceClone);
            
            // 隱藏原始棋子
            piece.style.opacity = '0';
            
            // 設置動畫
            pieceClone.style.setProperty('--delta-x', `${deltaX}px`);
            pieceClone.style.setProperty('--delta-y', `${deltaY}px`);
            pieceClone.classList.add('piece-sliding');
            
            movingPieces.push({ piece: pieceClone, originalPiece: piece });
        }
    });
    
    outerCircle.forEach((index, i) => {
        const cell = board.querySelector(`[data-index="${index}"]`);
        const piece = cell?.querySelector('.reversi-piece-img');
        if (piece && cell) {
            // 計算當前位置（像素）
            const currentPos = getCellPixelPosition(index, board);
            // 計算目標位置（下一個位置）
            const nextIndex = outerCircle[(i + 1) % outerCircle.length];
            const targetPos = getCellPixelPosition(nextIndex, board);
            
            // 計算需要移動的距離
            const deltaX = targetPos.x - currentPos.x;
            const deltaY = targetPos.y - currentPos.y;
            
            // 將棋子移到棋盤層級，以便動畫
            const pieceClone = piece.cloneNode(true);
            // 保持原始棋子的大小
            const pieceRect = piece.getBoundingClientRect();
            pieceClone.style.position = 'absolute';
            pieceClone.style.left = `${currentPos.x}px`;
            pieceClone.style.top = `${currentPos.y}px`;
            pieceClone.style.width = `${pieceRect.width}px`;
            pieceClone.style.height = `${pieceRect.height}px`;
            pieceClone.style.transform = 'translate(-50%, -50%)';
            pieceClone.style.zIndex = '1000';
            pieceClone.style.pointerEvents = 'none';
            board.appendChild(pieceClone);
            
            // 隱藏原始棋子
            piece.style.opacity = '0';
            
            // 設置動畫
            pieceClone.style.setProperty('--delta-x', `${deltaX}px`);
            pieceClone.style.setProperty('--delta-y', `${deltaY}px`);
            pieceClone.classList.add('piece-sliding');
            
            movingPieces.push({ piece: pieceClone, originalPiece: piece });
        }
    });
    
    // 動畫完成後執行實際旋轉
    setTimeout(() => {
        // 移除所有動畫棋子
        movingPieces.forEach(({ piece }) => {
            piece.remove();
        });
        
        // 恢復原始棋子顯示
        movingPieces.forEach(({ originalPiece }) => {
            originalPiece.style.opacity = '';
        });
        
        // 執行實際旋轉
        rotateCircle(innerCircle);
        rotateCircle(outerCircle);
        
        // 檢查棋盤是否已滿，如果滿了則增加旋轉次數
        const isBoardFull = gameState.reversiRotateBoard.every(cell => cell !== null);
        if (isBoardFull) {
            gameState.reversiRotateRotateCount++;
        }
        
        // 重新渲染棋盤
        renderReversiRotate();
        
        // 檢查勝負
        checkWin();
        
        // 清除動畫標記
        gameState.reversiRotateIsAnimating = false;
        
        // 如果遊戲未結束，切換到下一回合
        if (!gameState.reversiRotateGameOver) {
            gameState.reversiRotateCurrentPlayer = gameState.reversiRotateCurrentPlayer === 'B' ? 'W' : 'B';
            gameState.reversiRotateSelectedCell = null;
            gameState.reversiRotateHasMovedOpponent = false; // 重置移動標記
            // 重置計時器
            resetTimer();
        }
        
        renderReversiRotate();
    }, 600); // 動畫持續時間600ms
}

// 啟動計時器
function startTimer() {
    // 清除舊的計時器
    if (gameState.reversiRotateTimer) {
        clearInterval(gameState.reversiRotateTimer);
    }
    
    // 重置時間
    gameState.reversiRotateTimeLeft = 15;
    
    // 啟動新的計時器
    gameState.reversiRotateTimer = setInterval(() => {
        if (gameState.reversiRotateGameOver) {
            clearInterval(gameState.reversiRotateTimer);
            gameState.reversiRotateTimer = null;
            return;
        }
        
        gameState.reversiRotateTimeLeft--;
        
        // 只更新狀態文字，不重新渲染棋盤（避免影響動畫）
        const status = document.getElementById('reversiRotateStatus');
        const rotateBtn = document.getElementById('reversiRotateRotateBtn');
        updateStatusText(status, rotateBtn);
        
        // 時間到時提醒
        if (gameState.reversiRotateTimeLeft === 0) {
            // 可以添加聲音或視覺提醒，這裡只更新顯示
            updateStatusText(status, rotateBtn);
        }
        
        // 如果時間小於0，停止計時器
        if (gameState.reversiRotateTimeLeft < 0) {
            clearInterval(gameState.reversiRotateTimer);
            gameState.reversiRotateTimer = null;
        }
    }, 1000); // 每秒更新一次
}

// 重置計時器
function resetTimer() {
    if (gameState.reversiRotateTimer) {
        clearInterval(gameState.reversiRotateTimer);
        gameState.reversiRotateTimer = null;
    }
    startTimer(); // 重新啟動計時器
}

// 旋轉一個圈（逆時針）
function rotateCircle(circleIndices) {
    if (circleIndices.length === 0) return;
    
    // 將圈內的棋子提取出來
    const values = circleIndices.map(i => gameState.reversiRotateBoard[i]);
    
    // 逆時針旋轉：將最後一個元素移到第一個位置，其他元素向後移動
    const rotated = [values[values.length - 1], ...values.slice(0, values.length - 1)];
    
    // 將旋轉後的值放回棋盤
    circleIndices.forEach((index, i) => {
        gameState.reversiRotateBoard[index] = rotated[i];
    });
}

// 檢查勝負（這裡假設是連成一線獲勝，可以根據實際規則調整）
function checkWin() {
    const board = gameState.reversiRotateBoard;
    
    let blackWins = false;
    let whiteWins = false;
    
    // 檢查橫線（4條）
    for (let row = 0; row < 4; row++) {
        const line = [];
        for (let col = 0; col < 4; col++) {
            line.push(board[row * 4 + col]);
        }
        const winner = checkLine(line);
        if (winner === 'B') {
            blackWins = true;
        } else if (winner === 'W') {
            whiteWins = true;
        }
    }
    
    // 檢查直線（4條）
    for (let col = 0; col < 4; col++) {
        const line = [];
        for (let row = 0; row < 4; row++) {
            line.push(board[row * 4 + col]);
        }
        const winner = checkLine(line);
        if (winner === 'B') {
            blackWins = true;
        } else if (winner === 'W') {
            whiteWins = true;
        }
    }
    
    // 檢查對角線（2條）
    const diag1 = [board[0], board[5], board[10], board[15]];
    const diag2 = [board[3], board[6], board[9], board[12]];
    
    const winner1 = checkLine(diag1);
    if (winner1 === 'B') {
        blackWins = true;
    } else if (winner1 === 'W') {
        whiteWins = true;
    }
    
    const winner2 = checkLine(diag2);
    if (winner2 === 'B') {
        blackWins = true;
    } else if (winner2 === 'W') {
        whiteWins = true;
    }
    
    // 判斷勝負
    if (blackWins && whiteWins) {
        // 雙方都獲勝，判定為和局
        gameState.reversiRotateGameOver = true;
        gameState.reversiRotateWinner = null;
        return;
    } else if (blackWins) {
        gameState.reversiRotateGameOver = true;
        gameState.reversiRotateWinner = 'B';
        return;
    } else if (whiteWins) {
        gameState.reversiRotateGameOver = true;
        gameState.reversiRotateWinner = 'W';
        return;
    }
    
    // 檢查和局條件：棋盤已滿且旋轉5次後仍無勝負
    const isBoardFull = board.every(cell => cell !== null);
    if (isBoardFull && gameState.reversiRotateRotateCount >= 5) {
        // 計算雙方棋子數量
        const blackCount = board.filter(cell => cell === 'B').length;
        const whiteCount = board.filter(cell => cell === 'W').length;
        
        if (blackCount > whiteCount) {
            gameState.reversiRotateGameOver = true;
            gameState.reversiRotateWinner = 'B';
        } else if (whiteCount > blackCount) {
            gameState.reversiRotateGameOver = true;
            gameState.reversiRotateWinner = 'W';
        } else {
            gameState.reversiRotateGameOver = true;
            gameState.reversiRotateWinner = null; // 和局
        }
    }
}

// 檢查一條線是否全部是同一顏色
function checkLine(line) {
    if (line.length !== 4) return null;
    if (line[0] === null) return null;
    
    const first = line[0];
    if (line.every(cell => cell === first)) {
        return first;
    }
    
    return null;
}

