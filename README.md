# 中央大學 生態與保育資訊網
# National Central University Ecological and Conservation Information Website

## 專案簡介
這是中央大學生態保育課程的網站專案，提供校園生物多樣性資訊、互動生態地圖，以及教學資源整合平台。

## 專案結構

```
project-root/
├── index.html              # 主頁面（首頁、資源中心、參與表單）
├── map.html                # 互動生態地圖頁面
│
├── css/
│   └── style.css          # 全站共用樣式表
│
├── js/
│   └── app.js             # 預留區域（目前 JavaScript 為內聯式）
│
├── images/                # 所有圖片資源
│   ├── 動物類
│   │   ├── animal1.jpg    # 赤腹松鼠
│   │   ├── animal2.jpg    # 台灣藍鵲
│   │   ├── animal3.jpg    # 澤蛙
│   │   ├── animal4.jpg    # 斯文豪氏攀蜥
│   │   └── animal5.jpg    # 霜白蜻蜓
│   │
│   ├── 植物類
│   │   ├── plant1.jpg     # 台灣肖楠
│   │   ├── plant2.jpg     # 龍柏
│   │   ├── plant3.jpg     # 白千層
│   │   ├── plant4.jpg     # 相思樹
│   │   └── plant5.jpg     # 櫻花
│   │
│   └── 其他
│       ├── logo.png       # NCU 校徽
│       ├── map.png        # 地圖預覽圖
│       ├── ncu.jpg        # 校園主景圖
│       └── ncu_ecology_map.png  # 互動地圖背景
│
└── README.md              # 本檔案

```

## 功能特性

### 首頁 (index.html)
- **校園景觀展示** - 動畫背景圖片與文案
- **物種清單** - 動物與植物分類列表
- **互動地圖入口** - 連結至 map.html

### 生態地圖 (map.html)
- **互動式地圖** - 點擊校園各位置查看物種資訊
- **滑出式側邊欄** - 詳細物種介紹（分類、分布、威脅因素、保育行動）
- **呼吸動畫** - 地圖點位的視覺反饋

### 資源中心 (index.html)
- **角色選擇** - 學生、教師、校園物種知識庫
- **分類資源** - 針對不同用戶提供相應資訊

### 參與表單 (index.html)
- **意見回饋** - 搜集使用者的生態觀察與建議
- **Google Sheets 整合** - 自動記錄提交內容

## 使用說明

### 本地預覽
1. 在瀏覽器中開啟 `index.html`
2. 點擊「中大生態地圖」按鈕進入互動地圖
3. 在地圖上點擊各個點位查看物種詳情

### 部署
- 所有檔案都是靜態資源，可直接上傳至任何網頁伺服器
- 無需後端程式或資料庫

## 技術棧

- **HTML5** - 語意化結構
- **CSS3** - 動畫、佈局、響應式設計
- **Vanilla JavaScript** - 互動功能（無外部框架）
- **Google Apps Script** - 表單資料整合

## 瀏覽器相容性

- Chrome / Edge (推薦)
- Firefox
- Safari
- 支援行動裝置 (RWD)

## 檔案清理說明

重新組織後，您可以安全地刪除根目錄中的以下舊檔案：
- `style.css` (已移至 `css/style.css`)
- `animal1.jpg` ~ `animal5.jpg` (已移至 `images/`)
- `plant1.jpg` ~ `plant5.jpg` (已移至 `images/`)
- `logo.png` (已移至 `images/`)
- `map.png` (已移至 `images/`)
- `ncu.jpg` (已移至 `images/`)
- `ncu_ecology_map.png` (已移至 `images/`)

## 維護建議

### 代碼組織
- 當 JavaScript 代碼增加時，可將內聯 scripts 抽出至 `js/app.js`
- 若 CSS 增長過大，可拆分為多個模組檔案 (例如 `css/components.css`)

### 效能優化
- 考慮壓縮圖片以減少載入時間
- 未來可加入 minify CSS/JS

### 功能擴充
- 新增物種可直接編輯 HTML 中的 `speciesData` 物件
- 新增教學資源只需更新資源中心的 action-button

## 授權與貢獻

This is a university course project. © 2026 National Central University Ecological and Conservation Group. All Rights Reserved.

## 聯絡方式

如有任何建議或問題，請透過網站上的「參與我們 & 意見回饋」表單提交。

---

**最後更新**: 2026年5月27日
**專案狀態**: 主體功能完成，架構優化完成
