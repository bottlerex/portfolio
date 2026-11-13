# 港都租車 Harbor Rent — 作品集樣板

這是**作品集樣板**，不是真實客戶的網站。「港都租車 Harbor Rent」為**虛構品牌**；車款、價格、地址、LINE 連結（`https://line.me/R/ti/p/@example`）皆為示意，圖片為 SVG 示意插圖。

純靜態 HTML/CSS/JS，無建置工具、無外部依賴（僅 Google Fonts）。

## 檔案
- `index.html` 首頁（車款篩選、流程、須知、據點、LINE 詢價）
- `cars.json` 車款資料（11 台、4 分類）
- `cars.fallback.js` file:// 預覽備援，內容同 cars.json
- `styles.css` / `app.js` 樣式與邏輯
- `guide.html` 給老闆看的更新說明

## 怎麼改車款
編輯 `cars.json`（欄位：id、category、name、price_per_day、specs、best_for、image、available），`image` 填照片路徑即顯示真照片，留空用示意圖。詳見 `guide.html`，含之後接 Google Sheet 的做法。改完 cars.json 同步更新 `cars.fallback.js`，或上線後刪除該檔與 index.html 中那行 script。

## 預覽
雙擊 `index.html`，或 `python3 -m http.server` 後開 http://localhost:8000。cars.json 讀不到時頁面顯示友善訊息與 LINE 按鈕。
