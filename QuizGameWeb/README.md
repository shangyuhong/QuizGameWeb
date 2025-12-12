# Quiz Game Web

這是 Quiz Game 的網頁版本，使用 HTML、CSS 和 JavaScript 實現。

## 功能

### 問答類遊戲

- **搶答模式**：選擇玩家人數，進行搶答遊戲，答對可得分
- **詞膳團體**：顯示兩個隨機注音符號，玩家需要想出符合條件的詞語
- **猜人名**：輸入要猜的名字，記錄提問內容，按住按鈕查看答案
- **一叫高下**：輸入答案後，使用注音鍵盤輸入，按住按鈕查看答案

### 棋類遊戲

- **進階圈叉**：進階版井字遊戲，玩家可以移動已下的棋子
- **奇雞連連**：使用不同大小的棋子進行井字遊戲，大棋子可以覆蓋小棋子
- **黑白轉轉棋**：4x4 棋盤遊戲，每回合可以選擇移動對方棋子，下自己的棋子後自動旋轉，內圈和外圈分別逆時針旋轉

## 使用方法

### 使用 live-server

1. 安裝 live-server（如果還沒安裝）：
```bash
npm install -g live-server
```

2. 在專案目錄下啟動：
```bash
cd QuizGameWeb
live-server
```

3. 瀏覽器會自動打開 `http://localhost:8080`

### 使用其他本地伺服器

你也可以使用其他方式啟動本地伺服器：

- Python:
```bash
python -m http.server 8000
```

- Node.js http-server:
```bash
npx http-server
```

- VS Code Live Server 擴充功能

## 資料來源

遊戲資料會從 GitHub 自動載入：
`https://raw.githubusercontent.com/shangyuhong/quiz-data/refs/heads/main/questions.json`

如果載入失敗，會使用預設資料。

## 檔案結構

- `index.html` - 主 HTML 檔案
- `styles.css` - 樣式表
- `app.js` - 主要 JavaScript 邏輯
- `js/` - JavaScript 模組目錄
  - `gameState.js` - 遊戲狀態管理
  - `screenManager.js` - 畫面切換管理
  - `dataService.js` - 資料服務
  - `common.js` - 共用函數
  - `quizGame.js` - 搶答模式遊戲邏輯
  - `wordGroup.js` - 詞膳團體遊戲邏輯
  - `guessName.js` - 猜人名遊戲邏輯
  - `zhuyinGame.js` - 一叫高下遊戲邏輯
  - `ticTacToe.js` - 進階圈叉遊戲邏輯
  - `ticTacToe2.js` - 奇雞連連遊戲邏輯
  - `reversiRotate.js` - 黑白轉轉棋遊戲邏輯
- `images/` - 圖片資源目錄（黑白轉轉棋的棋子圖片）
- `README.md` - 說明文件

## 遊戲說明

### 黑白轉轉棋

**遊戲規則：**
- 4x4 棋盤，黑白兩隊輪流進行
- 每回合玩家可以：
  1. **選擇性**：移動對方的一顆棋子至上下左右一格的位置
  2. **必須**：下自己的棋子
  3. **自動**：按下旋轉按鈕（下完棋後自動觸發）
- 旋轉規則：
  - 內圈（中間 2x2 格子）和外圈（外圍 12 個格子）分別逆時針旋轉
  - 棋盤滿格後，旋轉按鈕會啟用，可手動旋轉
- 勝負判定：
  - 連成一線（橫、直、對角線）獲勝
  - 雙方同時獲勝則和局
  - 棋盤滿格且旋轉 5 次後仍無勝負，則根據棋子數量判定勝負或和局
- 計時功能：每位玩家有 15 秒倒數計時，時間到僅提醒，不影響遊戲

