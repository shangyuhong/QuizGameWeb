# Quiz Game Web

這是 Quiz Game 的網頁版本，使用 HTML、CSS 和 JavaScript 實現。

## 功能

- **搶答模式**：選擇玩家人數，進行搶答遊戲
- **詞膳團體**：顯示兩個隨機注音符號
- **猜人名**：輸入要猜的名字，記錄提問內容

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
- `README.md` - 說明文件

