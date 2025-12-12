// 初始化
document.addEventListener('DOMContentLoaded', () => {
    dataService.loadData();
    showMainMenu();
    
    // 設置按住查看答案按鈕的事件監聽器（猜人名）
    const holdAnswerBtn = document.getElementById('holdAnswerBtn');
    if (holdAnswerBtn) {
        // 滑鼠事件
        holdAnswerBtn.addEventListener('mousedown', handleHoldStart);
        holdAnswerBtn.addEventListener('mouseup', handleHoldEnd);
        holdAnswerBtn.addEventListener('mouseleave', handleHoldEnd);
        
        // 觸摸事件
        holdAnswerBtn.addEventListener('touchstart', handleHoldStart, { passive: false });
        holdAnswerBtn.addEventListener('touchend', handleHoldEnd, { passive: false });
        holdAnswerBtn.addEventListener('touchcancel', handleHoldEnd, { passive: false });
        
        // 防止右鍵選單
        holdAnswerBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // 設置按住查看答案按鈕的事件監聽器（一叫高下）
    const zhuyinHoldAnswerBtn = document.getElementById('zhuyinHoldAnswerBtn');
    if (zhuyinHoldAnswerBtn) {
        // 滑鼠事件
        zhuyinHoldAnswerBtn.addEventListener('mousedown', handleHoldStart);
        zhuyinHoldAnswerBtn.addEventListener('mouseup', handleHoldEnd);
        zhuyinHoldAnswerBtn.addEventListener('mouseleave', handleHoldEnd);
        
        // 觸摸事件
        zhuyinHoldAnswerBtn.addEventListener('touchstart', handleHoldStart, { passive: false });
        zhuyinHoldAnswerBtn.addEventListener('touchend', handleHoldEnd, { passive: false });
        zhuyinHoldAnswerBtn.addEventListener('touchcancel', handleHoldEnd, { passive: false });
        
        // 防止右鍵選單
        zhuyinHoldAnswerBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
});
