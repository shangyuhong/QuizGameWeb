// 資料服務
const dataService = {
    categories: [],
    zhuyin: [],
    isLoading: false,
    
    async loadData() {
        this.isLoading = true;
        try {
            const response = await fetch('https://raw.githubusercontent.com/shangyuhong/quiz-data/refs/heads/main/questions.json');
            if (!response.ok) throw new Error('載入失敗');
            const data = await response.json();
            this.categories = data.categories || [];
            this.zhuyin = data.zhuyin || [];
        } catch (error) {
            console.error('載入資料失敗:', error);
            this.loadDefaultData();
        } finally {
            this.isLoading = false;
        }
    },
    
    loadDefaultData() {
        this.categories = [
            "黑色的東西", "球體", "圓形的東西", "容器",
            "會飛的東西","會發光的東西", "會動的東西", "紅色的東西", 
            "白色的東西", "虛擬人物", "歌曲名稱", "成語", "量數為『顆』的東西", 
            "量數為『條』的東西", "量數為『根』的東西", "動物", "食物", 
            "交通工具", "職業", "運動", "國家", "城市", "樂器", "家具", 
            "電器", "植物", "學校會出現的", "自然現象", "每天都會看到的東西", 
            "複數存在的東西", "冰箱裡會出現的東西", "披薩的配料", "超過兩公尺的東西", 
            "比手機還小的東西","景點", "餐廳名稱", "歷史人物", "電影名稱", "疾病名稱",
            "現在看得到的東西", "可以投資的東西","機場會出現的東西", "海灘會出現的東西", 
            "每天都會變化的東西","藝人", "奧運項目", "需要雙手才能完成的動作", "顏色"
        ];
        this.zhuyin = ["ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ","ㄐ","ㄑ","ㄒ","ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ","ㄧ","ㄨ","ㄩ"];
    },
    
    getRandomCategory(currentCategory = '') {
        const categories = this.categories.length > 0 ? this.categories : ["食物"];
        let newCategory = categories[Math.floor(Math.random() * categories.length)];
        while (newCategory === currentCategory && categories.length > 1) {
            newCategory = categories[Math.floor(Math.random() * categories.length)];
        }
        return newCategory;
    },
    
    getRandomZhuyin() {
        const zhuyin = this.zhuyin.length > 0 ? this.zhuyin : ["ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ","ㄐ","ㄑ","ㄒ","ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ","ㄧ","ㄨ","ㄩ"];
        return zhuyin[Math.floor(Math.random() * zhuyin.length)];
    }
};

