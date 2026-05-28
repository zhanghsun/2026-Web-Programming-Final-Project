# 中央大學 生態與保育資訊網
National Central University Ecological and Conservation Information Website

## 專案簡介
本專案為靜態前端網站，提供校園生物多樣性介紹、互動式校園生態地圖、資源中心與意見回饋表單。

本版本已完成前端可維護化重構：移除 `index.html` 的 inline CSS/JavaScript，改以模組化 CSS/JS 檔案管理，並保留原有功能。

## 專案結構

```
project-root/
├── index.html
├── index.html.bak               # 舊版備份（保留參考用）
├── map.html
├── README.md
│
├── css/
│   ├── shared.css               # 全站共用：變數/排版/基礎樣式
│   ├── navbar.css               # 導覽列
│   ├── hero.css                 # 首頁 Hero
│   ├── cards.css                # 卡片/清單/按鈕樣式
│   ├── map.css                  # 地圖 modal / spots / side panel
│   ├── resources.css            # 資源中心與資源 modal
│   ├── forms.css                # 表單
│   ├── animations.css           # scroll reveal / 轉場
│   └── style.css                # 舊版樣式（目前 index.html 不使用）
│
├── js/
│   ├── species-data.js          # 物種資料庫（給側欄顯示用）
│   ├── navigation.js            # 分頁切換（home/resources/join）
│   ├── modal.js                 # map/resource/side-panel 開關與內容填入
│   ├── map.js                   # 地圖點位互動（讀 data-species）
│   ├── resources.js             # 身分切換與資源卡片開 modal
│   ├── form.js                  # 表單送出（Google Apps Script）
│   ├── animations.js            # IntersectionObserver scroll reveal
│   ├── main.js                  # 單一初始化入口（避免重複綁定）
│   └── app.js                   # 舊版腳本（目前 index.html 不使用）
│
└── images/
		└── (網站圖片資源)
```

## 功能特性
- 首頁：物種清單（點擊顯示側欄資訊）、導覽列分頁
- 生態地圖（index.html 內 modal）：點位點擊顯示物種資訊側欄
- 資源中心：身分切換（學生/教師/知識庫），點卡片顯示資源 modal
- 參與我們：表單送出至 Google Apps Script

## 本地預覽
1. 直接用瀏覽器開啟 `index.html`
2. 使用導覽列切換「首頁 / 資源中心 / 參與我們」
3. 點「中大生態地圖」開啟地圖 modal，點地圖點位查看物種資訊

## 維護方式

### 新增/修改物種
- 物種內容：在 `js/species-data.js` 增修對應 key 的資料
- 觸發點：
	- 首頁清單：`index.html` 的 `<li data-species="...">`
	- 地圖點位：`index.html` 的 `.spot[data-species]`（位置由 `css/map.css` 的 `.spot--*` 控制）

### 新增資源中心卡片
在 `index.html` 增加一張 `.action-button`，並設定：
- `data-resource-title`
- `data-resource-text`

## 技術棧
- HTML5 / CSS3
- Vanilla JavaScript（無框架）
- Intersection Observer（scroll reveal）
- Google Apps Script（表單資料）

---

**最後更新**：2026-05-27
