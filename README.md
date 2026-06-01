# Campus Nature Explorer
**國立中央大學 生態與保育資訊網**

為國立中央大學校園生態保育推廣計畫所開發的多頁靜態教育網站，作為網頁程式設計課程期末專題提交。

---

## 目錄

1. [專案概述](#專案概述)
2. [技術棧](#技術棧)
3. [系統架構](#系統架構)
4. [專案結構](#專案結構)
5. [內容管理設計](#內容管理設計)
6. [功能實作](#功能實作)
7. [路由架構](#路由架構)
8. [響應式設計策略](#響應式設計策略)
9. [UI/UX 設計決策](#uiux-設計決策)
10. [安裝與本地開發](#安裝與本地開發)
11. [建置與部署](#建置與部署)
12. [未來技術改善方向](#未來技術改善方向)
13. [貢獻成員](#貢獻成員)
14. [總結](#總結)

---

## 專案概述

Campus Nature Explorer 是一個零依賴的靜態多頁網站，收錄了中央大學校園內 17 種野生動物與 10 種植物物種。網站整合了互動式生態地圖、5 章節決策式遊戲引擎，以及以 Google Sheets 為後端的參與表單。

本專案不使用任何前端框架，所有互動功能均以原生 JavaScript 實作，採用功能模組化的組織方式，展示 DOM 操作、Fetch API、Intersection Observer、sessionStorage 與 CSS 自訂屬性等核心網頁技術。

**規模：** 17 個模組約 4,500 行 JavaScript、18 個樣式表約 3,200 行 CSS、17 個 HTML 頁面（含子頁面）、51 張以上圖片資源。

---

## 技術棧

### HTML5（語義化標記）
所有頁面使用語義化 HTML5 元素（`<article>`、`<section>`、`<nav>`、`<figure>`）。`pages/` 下的子頁面統一使用 `<base href="../">` 將所有資源路徑解析至專案根目錄，避免每個子頁面重複撰寫路徑前綴。

### 原生 CSS3（無框架）
所有樣式均為手寫 CSS3。`shared.css` 全域使用 CSS 自訂屬性（`--var`）管理主題色彩。版面配置以 CSS Grid 與 Flexbox 實現，刻意不使用預處理器（Sass/Less）或工具類框架（Tailwind），以展示對層疊規則與優先權的掌握。

主要 CSS 技術：
- `@keyframes` — 結果頁 SVG 分數環的 `stroke-dashoffset` 動畫
- `backdrop-filter: blur()` — 地圖側邊欄與導覽列的玻璃擬態效果
- `clip-path` 與 `radial-gradient` — 首頁 hero 聚光燈與卡片光暈效果
- Intersection Observer 驅動的 `.scroll-reveal` 類別切換（無 scroll 事件監聽輪詢）

### 原生 JavaScript（ES6+、IIFE 模組）
無打包工具、無轉譯器。每個 JS 檔案採用 IIFE（`(function(){ 'use strict'; ... })()`）或掛載至 `window` 的普通函式，在不引入 ES module 語法的前提下防止全域作用域污染。

模組載入順序透過各 HTML 檔案中 `<script>` 標籤的排列順序明確管理。資料提供腳本（`species-data.js`、`ecosystem-game-data.js`）必須在消費它們的腳本之前載入，形成簡單的依賴契約。

### Markdown（內容撰寫）
植物詳細資訊以 `.md` 檔案存放於 `data/plants/`。`plant-detail.js` 透過 Fetch API 取得檔案後，以自製 regex 解析器解析 Markdown 表格、標題與清單，不依賴任何外部 Markdown 函式庫，實現無建置步驟的內容與呈現分離。

### Google Sheets API（表單後端）
`form.js` 中的參與表單透過 `fetch()` 搭配 `FormData` 提交至 Google Apps Script 網路應用程式端點，以零成本的無伺服器架構收集使用者回饋，不需要任何後端伺服器基礎設施。

### Intersection Observer API（捲動動畫）
`animations.js` 為所有 `.scroll-reveal` 元素註冊 `IntersectionObserver`。當元素進入可視區 10% 時加入 `reveal` 類別，並立即呼叫 `unobserve()`，避免捲回時重複觸發回呼。

---

## 系統架構

網站依使用情境採用兩種不同的導覽模式：

```
┌──────────────────────────────────────────────────────────────┐
│                         index.html                           │
│  ┌───────────┐  ┌────────────────┐  ┌──────────────────────┐ │
│  │ #home-page│  │ #resources-page│  │    #join-page        │ │
│  │  (active  │  │  (hidden div)  │  │    (hidden div)      │ │
│  │   by CSS) │  │                │  │                      │ │
│  └───────────┘  └────────────────┘  └──────────────────────┘ │
│       ↑                 ↑                      ↑             │
│       └────────── navigation.js (showPage) ───┘             │
│              [data-page] 屬性綁定                             │
└──────────────────────────────────────────────────────────────┘
         │ location.href                │ location.href
         ▼                              ▼
  pages/animals.html           pages/ecosystem-guardian.html
  pages/plants.html                     │
  pages/wildlife-map.html               ▼
  pages/species.html           pages/ecosystem-game.html
  pages/plant-detail.html               │ sessionStorage: eg_results
                                        ▼
                               pages/ecosystem-results.html
```

**模式 A — SPA 模擬（index.html）：**
`index.html` 包含三個頁面 `<div>` 元素（`#home-page`、`#resources-page`、`#join-page`），每次僅透過 `.active` 類別切換顯示其中一個。`navigation.js` 將 `showPage(id)` 暴露為全域函式，並在 `DOMContentLoaded` 時綁定所有 `[data-page]` 元素，避免三個主要區塊的頁面重載。

**模式 B — 多頁面導覽（pages/）：**
功能較複雜的頁面（`animals.html`、`plants.html`、`ecosystem-game.html` 等）為獨立 HTML 檔案，使用 `<base href="../">` 確保所有相對資源路徑（`js/`、`css/`、`assets/`）從專案根目錄解析，不受實體檔案位置影響。

**跨頁面狀態傳遞：**
遊戲引擎將結果以 JSON 序列化後寫入 `sessionStorage`（鍵名：`eg_results`）。結果頁面載入時讀取此鍵；若鍵不存在（直接以 URL 存取），則渲染靜態示範資料。此方式避免 URL query string 雜亂，並將遊戲狀態限制在瀏覽器分頁的 session 範圍內。

---

## 專案結構

```
NCU_WebsiteDesign_/
│
├── index.html                   # SPA 殼層：首頁、資源中心、參與表單
│
├── pages/                       # 獨立子頁面
│   ├── animals.html             # 野生動物探索卡片網格
│   ├── species.html             # 單一物種詳細頁（URL 參數驅動）
│   ├── plants.html              # 植物探索卡片網格
│   ├── plant-detail.html        # 單一植物詳細頁（URL 參數驅動）
│   ├── wildlife-map.html        # 全螢幕互動校園生態地圖
│   ├── ecosystem-guardian.html  # 遊戲簡報 / 挑戰任務基地
│   ├── ecosystem-game.html      # 5 章節決策遊戲引擎
│   └── ecosystem-results.html   # 守護分數 + 決策時間軸
│
├── js/                          # 每個功能一個模組檔案
│   ├── species-data.js          # 全域資料儲存：17 物種（window.speciesData）
│   ├── ecosystem-game-data.js   # 全域資料儲存：5 劇本（window.GAME_SCENARIOS）
│   ├── navigation.js            # SPA 頁面切換、角色切換
│   ├── modal.js                 # 地圖側邊欄填充（displayInfo）
│   ├── map.js                   # 地圖 Modal、標記點互動、釘選狀態
│   ├── animals.js               # 物種網格、篩選標籤、抽屜開關
│   ├── species-page.js          # 物種詳細頁（URL 參數：?species=key）
│   ├── plants.js                # 植物卡片網格、飄落葉片粒子效果
│   ├── plant-images.js          # 圖片探測載入器（PlantImages API）
│   ├── plant-detail.js          # MD 取得 + 解析器、10 區塊版面建構
│   ├── ecosystem-guardian.js    # 挑戰卡片互動
│   ├── ecosystem-game.js        # 遊戲引擎：狀態機、血量條、章節推進
│   ├── ecosystem-results.js     # 結果渲染：等級分類、決策時間軸
│   ├── resources.js             # 資源卡片點擊 → 外部頁面路由
│   ├── form.js                  # Google Sheets 表單提交
│   ├── animations.js            # Intersection Observer 捲動揭示
│   ├── mouse-spotlight.js       # 游標聚光燈效果（radial-gradient）
│   └── main.js                  # 應用程式入口：模組初始化、載入遮罩
│
├── css/                         # 每個功能 / 元件一個樣式表
│   ├── shared.css               # CSS 自訂屬性、重置、字型
│   ├── navbar.css
│   ├── hero.css
│   ├── home-sections.css
│   ├── cards.css
│   ├── explore-cards.css
│   ├── map.css
│   ├── resources.css
│   ├── forms.css
│   ├── animations.css
│   ├── mouse-spotlight.css
│   ├── animals.css
│   ├── species.css
│   ├── plants.css
│   ├── plant-detail.css
│   ├── ecosystem-game.css
│   ├── ecosystem-guardian.css
│   └── ecosystem-results.css
│
├── data/
│   ├── plants/                  # 10 個 .md 檔（每種植物一份）
│   └── species/                 # 17 個 .md 檔（每種動物一份）
│
└── assets/
    ├── icons/
    └── images/
        ├── background/          # 10 張劇本背景圖
        ├── plants/              # 10 個資料夾 × 每種 3 張圖
        └── species/             # 17 個資料夾 × 每種 3 張圖
```

**模組職責說明：**

| 模組 | 職責 |
|------|------|
| `species-data.js` | 17 種物種的唯一資料來源，暴露 `window.speciesData`，被 `modal.js`、`animals.js`、`map.js`、`ecosystem-results.js` 共用。 |
| `ecosystem-game-data.js` | 5 個遊戲劇本定義，包含選項、血量變化值與回饋文字，必須在 `ecosystem-game.js` 之前載入。 |
| `navigation.js` | `showPage(id)` — 啟用一個 `.page` div、停用其餘所有頁面，並處理角色切換邏輯。 |
| `plant-images.js` | 以 `new Image()` 探測候選圖片 URL，確認存在後才注入，避免破圖的 `<img>` 元素。 |
| `main.js` | 協調模組初始化順序，僅在函式存在時才呼叫 `init*()`（對當前頁面未載入的模組採無操作處理）。 |

---

## 內容管理設計

### 以 Markdown 為基礎的植物內容

10 種植物各有一份 `.md` 檔存放於 `data/plants/`，由 `plant-detail.js` 在執行期間取得：

```js
fetch(`data/plants/${plantName}.md`)
  .then(r => r.text())
  .then(md => parseAndRender(md));
```

`plant-detail.js` 包含自製解析函式：
- **Markdown 表格** → 以 `|` 分隔行的 regex 解析為 `string[][]`
- **區塊標題**（`## heading`）→ 對應到具名區塊 `<div>` 元素
- **條列清單** → 轉換為 `<ul><li>` 結構

新增一種植物只需：
1. 建立 `data/plants/新植物.md`（遵循標準區塊綱要）
2. 新增 `assets/images/plants/新植物/新植物1.jpg`、`新植物2.jpg`、`新植物3.jpg`

不需修改任何 JavaScript 程式碼，`plant-images.js` 會自動透過命名規約探測圖片。

### 物種資料組織

野生動物資料存放於 `js/species-data.js`，以 JavaScript 物件（`window.speciesData`）呈現，每筆資料遵循嚴格的綱要：

```js
squirrel: {
  name:           '赤腹松鼠',
  englishName:    "Pallas's Squirrel",
  category:       'animal',      // 'animal' | 'plant'
  group:          'ground',      // 篩選分組鍵
  characterTitle: '樹梢跑酷大師',
  avatar:         'assets/images/赤腹松鼠.jpg',
  photos:         ['...1.jpg', '...2.jpg', '...3.jpg'],
  commonness:     5,             // 1–5 星常見度
  activityTime:   '白天',
  difficulty:     1,             // 觀察難度 1–5
  hotspot:        '校園各大樹群',
  story:          '...',
  idClues:        ['...', '...'],
  scientific:     '...',
  classification: '...',
  dist:           '<ul>...</ul>',
  threats:        '<ul>...</ul>',
  conservation:   '<ul>...</ul>',
}
```

此集中物件被四個模組共用，無任何資料重複：地圖側邊欄、動物網格、物種詳細頁、遊戲結果渲染。

### 圖片資源命名規約

圖片遵循以程式強制執行的命名規約：

```
assets/images/species/{中文名稱}/{中文名稱}1.jpg   （索引 1–3）
assets/images/plants/{中文名稱}/{中文名稱}1.jpg    （索引 1–3）
```

`plant-images.js` 在建構探測 URL 時使用 `encodeURIComponent(name)` 處理中文字元資料夾名稱。所有副檔名統一使用小寫 `.jpg`，確保跨平台一致性（在大小寫敏感的 Linux 伺服器上至關重要）。

---

## 功能實作

### 野生動物探索（`animals.html` + `animals.js`）

探索頁面從 `window.speciesData` 渲染可篩選的卡片網格，篩選標籤對應資料綱要中的 `group` 欄位。點擊卡片會開啟透過 CSS `transform: translateX()` 過渡滑入的抽屜（`<div class="drawer">`）。

抽屜展示物種的 `photos` 陣列作為圖片集。已查看的物種鍵值以 `localStorage`（鍵名：`ncu-wildlife-discovered`）持久化儲存，實現跨頁面載入的「已發現」徽章狀態。

點擊「完整圖鑑」導覽至 `pages/species.html?species={key}`，由 `species-page.js` 讀取 `URLSearchParams` 查找對應的 `speciesData` 資料。

### 植物探索（`plants.html` + `plants.js` + `plant-images.js`）

`plants.js` 以絕對定位的 `<div>` 元素生成飄落葉片粒子，並透過 inline style 注入隨機化的 `animation-delay`、`animation-duration` 與水平 `left` 值，不需 Canvas 或 WebGL 即可實現環境葉片飄落效果。

植物卡片圖片透過 `PlantImages.loadPrimary(name)` 載入，以 `new Image()` 探測候選 URL：`onload` 時將圖片注入卡片；`onerror` 時顯示預設佔位圖，防止圖片破損造成版面位移。

點擊卡片導覽至 `pages/plant-detail.html?plant={name}`，`plant-detail.js` 讀取 `URLSearchParams`、取得 `.md` 檔案，並填充 10 個捲動區塊的版面。浮動側邊導覽的圓點指示器透過第二個 `IntersectionObserver` 實例追蹤當前作用區塊。

### 校園生態守護遊戲（三頁面流程）

遊戲橫跨三個頁面，狀態透過 `sessionStorage` 傳遞。

**簡報頁（`ecosystem-guardian.html`）：**
五張挑戰卡片（`.eg-card`）呈現不同生態場景，每張卡片透過 `onclick="location.href='pages/ecosystem-game.html'"` 進入遊戲。三張 SDG 參考卡片以 `<a>` 元素連結至聯合國官方 SDG 頁面。

**遊戲引擎（`ecosystem-game.js`）：**
以包含狀態機的 IIFE 實作：

```
State: { currentChapter, health, choices[], deltas[], isAnimating }

章節流程：
  loadChapter(n)
    → 從 GAME_SCENARIOS[n-1] 填充 DOM
    → 淡入場景背景圖片
    → 綁定選項按鈕

  handleChoice(choiceKey)
    → isAnimating 防護（防止重複提交）
    → 套用血量變化值（限制在 [0, 100]）
    → 記錄至 state.choices / state.deltas
    → 顯示回饋面板（CSS 滑入動畫）
    → 「下一章」按鈕：推進或呼叫 showEndScreen()

  showEndScreen()
    → 將狀態序列化至 sessionStorage（鍵：eg_results）
    → 顯示 .gm-end 遮罩
    → 以 stroke-dashoffset 動畫顯示 SVG 分數環
    → 依血量門檻決定評語文字
```

血量條色彩轉換（綠 → 琥珀 → 紅）由每次套用血量變化時的 inline `width` 樣式更新與 CSS 類別切換驅動。

**結果頁（`ecosystem-results.js`）：**
載入時讀取 `sessionStorage.getItem('eg_results')`。等級分類使用門檻陣列：

```js
const TIERS = [
  { min: 90, title: 'NCU Ecosystem Master'    },
  { min: 70, title: 'Campus Guardian'         },
  { min: 50, title: 'Nature Observer'         },
  { min:  0, title: 'Explorer in Training'    },
];
const tier = TIERS.find(t => health >= t.min);
```

物種影響卡片從以 `'{chapter}-{choiceKey}'` 為鍵的 `SPECIES_OUTCOMES` 映射表渲染。決策時間軸每章節一列，顯示所選選項、血量變化值與結果分類。

---

## 路由架構

### 策略一 — 頁內區塊切換（index.html）

`navigation.js` 實作無 URL 變更的客戶端區塊切換：

```js
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    window.scrollTo(0, 0);
    // 重新執行捲動揭示（針對新顯示的內容）
    if (typeof window.reinitializeAnimations === 'function') {
        setTimeout(() => window.reinitializeAnimations(), 100);
    }
}
```

所有導覽觸發點使用初始化時綁定的 `[data-page]` 屬性。Hash 深層連結（如 `index.html#resources`）透過載入時讀取 `window.location.hash` 處理。

### 策略二 — URL 參數驅動的詳細頁面

`species.html` 與 `plant-detail.html` 為執行期間動態填充的通用樣板：

```js
// species-page.js
const key     = new URLSearchParams(window.location.search).get('species');
const species = window.speciesData.animals[key];

// plant-detail.js
const plantName = new URLSearchParams(window.location.search).get('plant');
fetch(`data/plants/${plantName}.md`).then(...);
```

### 路由對照表

| 進入點 | URL | 處理模組 |
|--------|-----|---------|
| 首頁 | `index.html` | `showPage('home')` |
| 資源中心 | `index.html` → 點擊導覽列 | `showPage('resources')` |
| 加入 / 表單 | `index.html` → 點擊導覽列 | `showPage('join')` |
| 野生動物探索 | `pages/animals.html` | `animals.js` |
| 物種詳細頁 | `pages/species.html?species={key}` | `species-page.js` |
| 植物探索 | `pages/plants.html` | `plants.js` |
| 植物詳細頁 | `pages/plant-detail.html?plant={name}` | `plant-detail.js` |
| 校園生態地圖 | `pages/wildlife-map.html` | `map.js`（獨立版） |
| 遊戲簡報 | `pages/ecosystem-guardian.html` | `ecosystem-guardian.js` |
| 遊戲 | `pages/ecosystem-game.html` | `ecosystem-game.js` |
| 遊戲結果 | `pages/ecosystem-results.html` | `ecosystem-results.js` |

---

## 響應式設計策略

所有版面採用行動優先的 CSS Grid 與 Flexbox 實作，不使用任何 JavaScript 版面切換邏輯，所有適配均在 CSS 中處理。

### 主要響應式模式

**卡片網格：** 物種與植物卡片網格使用 `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`，內在響應式，無需針對各斷點設定欄數。

**導覽列：** 在行動裝置（`< 768px`）以新增/移除 CSS 類別的方式切換漢堡選單，不操作 inline style。

**遊戲場景：** 背景（`#sceneBg`）在全視窗 `<div>` 上使用 `object-fit: cover`，無需 JavaScript 即可適應任何長寬比。

**野生動物地圖：** 校園地圖圖片使用 `vw`/`vh` 單位與 `object-fit: contain`。返回按鈕在螢幕寬度小於 `480px` 時透過媒體查詢隱藏文字 `<span>`，縮減為僅圖示。

**植物詳細頁側邊導覽：** 10 個區塊的圓點導覽在行動裝置上設為 `display: none`，避免遮擋窄視窗內容。

---

## UI/UX 設計決策

### 深色主題搭配自然調色盤
網站使用深色底色（`#0a0f0a`、`#111811`）與綠色強調色（`#2d6a4f`、`#52b788`、`#95d5b2`），調色盤呼應森林生態。所有色彩組合對內文文字均達 WCAG AA 對比度標準。

### 游標聚光燈效果
`mouse-spotlight.js` 監聽 `mousemove` 事件，透過 `requestAnimationFrame` 更新固定遮罩元素上的 CSS `radial-gradient`。以線性插值（lerp）平滑游標延遲，避免版面重排：

```js
currentX += (targetX - currentX) * 0.08;
currentY += (targetY - currentY) * 0.08;
spotlight.style.background = `radial-gradient(600px at ${currentX}px ${currentY}px, ...)`;
```

### 玻璃擬態面板
地圖側邊欄與遊戲回饋遮罩使用 `backdrop-filter: blur(18px) saturate(180%)` 搭配半透明背景，包含 `-webkit-` 前綴以支援 Safari。

### SVG 分數環動畫
結果頁使用帶有 `stroke-dasharray` / `stroke-dashoffset` 的 SVG `<circle>`，在載入時透過含緩動函式的 `requestAnimationFrame` 將 `stroke-dashoffset` 從完整周長動畫至 `周長 × (1 − 分數/100)`，允許目標值在執行期間動態計算。

### 載入遮罩
全視窗遮罩在頁面解析時即顯示（無需 JavaScript 進行初始顯示）。`main.js` 在 `DOMContentLoaded` 後延遲 280 ms 加入 `fade-out` 類別，讓瀏覽器完成首次繪製後才揭開遮罩。`transitionend` 監聽器執行後設定 `display: none`，將遮罩從無障礙樹中移除。

### 捲動揭示一致性
所有主要內容區塊使用 `.scroll-reveal`，以統一的 `translateY(-20px) → translateY(0)` 與 `opacity: 0 → 1` 過渡進場。`animations.js` 暴露 `reinitializeAnimations()`，使動態載入或頁面切換後新顯示的內容也能重新被觀察。

---

## 安裝與本地開發

本專案**無需建置步驟，亦無任何依賴套件**，所有檔案均為靜態資源。

### 方式一 — VS Code Live Server（建議）
1. 安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴充功能。
2. 在 `index.html` 上按右鍵 → **Open with Live Server**。
3. 網站開啟於 `http://127.0.0.1:5500/`。

### 方式二 — Python HTTP 伺服器
```bash
python -m http.server 8080
# 然後開啟 http://localhost:8080
```

### 方式三 — Node.js serve
```bash
npx serve .
```

> **重要：** 請勿直接以 `file://` URL 開啟 `index.html`。`plant-detail.js` 中的 `fetch()` 呼叫將被瀏覽器的 CORS 政策封鎖，必須透過 HTTP 伺服器提供服務。

---

## 建置與部署

本專案無建置流程，部署只需將專案目錄複製至任何靜態檔案主機。

### GitHub Pages
```bash
git init
git add .
git commit -m "initial deploy"
git remote add origin https://github.com/{user}/{repo}.git
git push -u origin main
# Settings → Pages → Source: main / (root)
```

### Nginx（自架主機）
```nginx
server {
    listen 80;
    root /var/www/campus-nature-explorer;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 部署前資源最佳化
所有圖片為未壓縮 `.jpg`。建議部署前進行以下處理：
- 使用 `sharp` 或 `imagemin` 壓縮圖片
- 將 `ncu_ecology_map.png`（校園地圖，為最大單一資源）轉換為 WebP 格式
- 絕大多數非 hero 圖片已套用 `<img loading="lazy">`，可直接沿用

---

## 未來技術改善方向

### 1. CMS 整合
植物與物種內容目前以靜態 `.md` 檔案與單體 JS 資料物件撰寫。替換為 Headless CMS（Contentful、Strapi 或 Directus）可將內容撰寫與程式碼解耦，讓非技術人員也能更新物種資料而不需接觸程式碼。

### 2. 後端 + 資料庫（觀察紀錄）
`animals.js` 目前以 `localStorage` 追蹤已發現物種。建置正式後端（Node.js + PostgreSQL 或 Firebase Firestore）可實現跨裝置持久化紀錄、社群觀察記錄提交，以及目擊地點熱力圖視覺化。

### 3. 全文搜尋
以目前規模（17 種動物、10 種植物），網格瀏覽已足夠。規模擴大後，客戶端搜尋索引（Fuse.js 或 MiniSearch）可在無伺服器往返的情況下，對物種名稱、描述與棲地進行即時模糊搜尋。

### 4. GIS 互動地圖
目前 `wildlife-map.html` 以靜態校園照片搭配硬編碼 CSS 絕對定位標記。改用 Leaflet.js 或 MapLibre GL 可提供精確地理座標、觀測點叢集，以及使用者提交的目擊標記與真實地圖圖磚。

### 5. ES Module 重構 + 打包工具
目前 `window.*` 模式為維持 `file://` 開發相容性而迴避 ES module 語法。遷移至搭配 Vite 或 esbuild 的 ES modules 可啟用 Tree-shaking、程式碼分割（遊戲腳本僅在遊戲頁面載入），以及 TypeScript 型別檢查。

### 6. 無障礙審查
目前 ARIA 使用較為有限。建議針對 WCAG 2.1 AA 進行完整審查：Modal 中的鍵盤焦點陷阱管理、遊戲回饋面板的 `aria-live` 區域、琥珀色/綠色強調色組合的對比度複查，以及所有互動元素的 focus-visible 外框。

### 7. Service Worker（離線支援）
Cache API Service Worker 可讓網站在首次訪問後離線運作，適合在校園進行實地生態觀察活動時使用。

---

## 貢獻成員

| 姓名 | 學號 | 主要貢獻 |
|------|------|---------|
| **張循** | 113403521 | 專案整合與最終實作。負責整體專案架構規劃、首頁重新設計、互動式下拉導覽列、野生動物探索、植物探索、校園生態守護遊戲、生態地圖強化、資源中心優化、參與表單改版、頁尾設計，以及技術文件撰寫。 |
| **施竑宇** | 113403515 | 初期 UI/UX 設計與視覺素材蒐集。負責第一版資源中心與參與頁面、Google Sheets 表單串接，以及野生動物與植物圖片資源蒐集。 |
| **彭靖淵** | 113403517 | 初期網站架構建置與資料蒐集。負責第一版首頁與生態地圖、Google Sheets 表單串接，以及野生動物與植物資訊資源蒐集。 |

*國立中央大學 · 資訊管理學系*
*課程：網頁程式設計 · 2026 春夏學期*

---

## 總結

Campus Nature Explorer 展示了一套不依賴任何 JavaScript 框架或 CSS 工具類函式庫的完整前端工程工作流程。主要技術成果如下：

- **模組化 JS 架構** — 17 個單一職責模組透過明確定義的全域介面（`window.speciesData`、`window.GAME_SCENARIOS`、`sessionStorage`）進行溝通，避免緊耦合
- **執行期 Markdown 解析** — 植物內容在執行期間以自製 regex 解析器取得並解析，在零建置依賴的前提下實現內容與呈現的分離
- **動態圖片探測** — `plant-images.js` 透過 `Image` 建構子探測候選 URL，而非維護靜態圖片列表，以命名規約作為唯一契約
- **狀態機遊戲引擎** — `ecosystem-game.js` 以純 vanilla JS 實作 5 章節推進狀態機，包含動畫化血量條、SVG 環形動畫，以及透過 `sessionStorage` 的跨頁面狀態傳遞
- **雙重路由策略** — 將頁內區塊切換（首頁的 SPA 模擬）與 URL 參數驅動的詳細頁面（物種/植物詳細頁）結合，在不引入路由函式庫的前提下提供一致的導覽模型

本專案以原生 HTML/CSS/JS 的可讀性與可維護性為優先，而非追求框架的便利性，作為展示基礎網頁程式設計技術的具體參考實作。

