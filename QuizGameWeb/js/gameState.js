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
    ticTacToe2Winner: null,
    // 黑白轉轉棋狀態
    reversiRotateBoard: Array(16).fill(null), // 4x4棋盤
    reversiRotateCurrentPlayer: 'B', // B=黑方, W=白方
    reversiRotateGameOver: false,
    reversiRotateWinner: null,
    reversiRotatePhase: 'move', // 'move': 移動對方棋子, 'place': 下自己的棋子, 'rotate': 旋轉
    reversiRotateSelectedCell: null, // 選中的格子索引
    reversiRotateHasMovedOpponent: false, // 是否已移動對方棋子
    reversiRotateRotateCount: 0, // 棋盤滿格後的旋轉次數
    reversiRotateTimer: null, // 計時器ID
    reversiRotateTimeLeft: 15, // 剩餘時間（秒）
    reversiRotateIsAnimating: false // 是否正在進行旋轉動畫
};

