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

