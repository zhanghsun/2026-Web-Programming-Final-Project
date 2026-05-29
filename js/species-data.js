/**
 * Species Data
 * ============
 * Single source of truth for all species displayed on the website.
 *
 * To add a new species:
 *   1. Choose a unique camelCase key (e.g. 'turtle').
 *   2. Add an entry to speciesData below following the schema.
 *   3. Add a <li data-species="turtle"> to the correct list in index.html.
 *   4. Optionally add a .spot on the map with data-species="turtle".
 *
 * Schema (all fields required unless marked optional):
 * ┌─────────────────┬──────────────────────────────────────────────────────┐
 * │ key             │ string  — unique identifier, matches data-species    │
 * │ name            │ string  — Chinese common name                        │
 * │ category        │ 'animal' | 'plant'                                   │
 * │ avatar          │ string  — path to thumbnail image (images/*.jpg)     │
 * │ scientific      │ string  — Latin scientific name                      │
 * │ classification  │ string  — full taxonomic hierarchy, zh + Latin       │
 * │ dist            │ string  — HTML <ul> for distribution info            │
 * │ threats         │ string  — HTML <ul> for threat factors               │
 * │ conservation    │ string  — HTML <ul> for conservation actions         │
 * └─────────────────┴──────────────────────────────────────────────────────┘
 */

// ---------------------------------------------------------------------------
// Animals
// ---------------------------------------------------------------------------

const animals = {

    squirrel: {
        name: '赤腹松鼠',
        englishName: 'Pallas\'s Squirrel',
        category: 'animal',
        group: 'ground',
        groups: ['ground'],
        characterTitle: '樹梢跑酷大師',
        avatar: 'assets/images/赤腹松鼠.jpg',
        photos: [
            'assets/images/species/赤腹松鼠/赤腹松鼠1.jpg',
            'assets/images/species/赤腹松鼠/赤腹松鼠2.jpg',
            'assets/images/species/赤腹松鼠/赤腹松鼠3.jpg'
        ],
        commonness: 5,
        activityTime: '白天',
        difficulty: 1,
        hotspot: '校園各大樹群',
        story: '在中大校園，如果有一種動物最懂得讓人眼睛一亮，那絕對是牠。蓬鬆的尾巴、橘紅色的腹部，加上跳躍於樹梢的輕盈身手，讓無數學生在課間散步時驚喜相遇。牠完全不懼怕人類，有時甚至大搖大擺地在你腳邊穿越。',
        idClues: ['腹部為明顯橘紅色', '尾巴蓬鬆、與體長相近', '後腳有力、善於垂直攀爬', '動作敏捷、跳躍距離長'],
        scientific: 'Callosciurus erythraeus',
        classification: '哺乳綱 Mammalia／囓齒目 Rodentia／松鼠科 Sciuridae／麗松鼠屬 Callosciurus',
        dist: `<ul>
            <li><strong>原生分布：</strong>主要分布於東亞與東南亞</li>
            <li><strong>台灣地區：</strong>幾乎全島皆可見，從低海拔到中海拔山區都能生存</li>
            <li><strong>棲地類型：</strong>偏好樹木茂密的環境，如闊葉林、人工林，也能適應都市綠地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破壞：</strong>都市開發與森林砍伐，使其原本的樹林棲地減少</li>
            <li><strong>人為干擾：</strong>過度接近人類活動區域，可能改變其覓食與行為模式</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護森林、生態綠地與校園樹林</li>
            <li><strong>環境教育：</strong>宣導不要餵食野生動物，避免改變其自然習性</li>
        </ul>`
    },

    magpie: {
        name: '臺灣藍鵲',
        englishName: 'Taiwan Blue Magpie',
        category: 'animal',
        group: 'forest',
        groups: ['forest', 'icon'],
        characterTitle: '校園的藍色傳奇',
        avatar: 'assets/images/台灣藍鵲.jpg',
        photos: [
            'assets/images/species/臺灣藍鵲/台灣藍鵲1.jpg',
            'assets/images/species/臺灣藍鵲/台灣藍鵲2.jpg',
            'assets/images/species/臺灣藍鵲/台灣藍鵲3.jpg'
        ],
        commonness: 4,
        activityTime: '白天',
        difficulty: 3,
        hotspot: '中大湖周邊、光電大樓後方樹林',
        story: '每當藍鵲一家飛過，校園裡的目光都會自動追過去。那抹寶藍色就像森林裡的霓虹燈，無論出現在哪裡都引人注目。牠們行動成群、互相呼應，育雛期間甚至會驅趕接近巢位的人，是中大校園裡最有「家族感」的野生動物。',
        idClues: ['鮮豔藍色羽毛配紅色嘴喙', '超長的尾羽，飛行如藍色絲帶', '成群活動、彼此呼應', '育雛期間具護巢性，請保持距離'],
        scientific: 'Urocissa caerulea',
        classification: '鳥綱 Aves／雀形目 Passeriformes／鴉科 Corvidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>臺灣特有種</li>
            <li><strong>台灣地區：</strong>低海拔至中海拔森林，中大校園內極常見</li>
            <li><strong>棲地類型：</strong>偏好闊葉林或人為開發程度低的次生林</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>都市開發導致低海拔森林棲地減少，影響其築巢與覓食範圍</li>
            <li><strong>人為干擾：</strong>育雛期間因護巢行為較強，常與人類產生衝突導致巢位受破壞</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園森林與大型樹木的完整性，提供安全的築巢環境</li>
            <li><strong>環境教育：</strong>宣導「不餵食、不干擾」，並教育師生理解其護巢的天性</li>
        </ul>`
    },

    lizard: {
        name: '斯文豪氏攀蜥',
        englishName: 'Swinhoe\'s Tree Lizard',
        category: 'animal',
        group: 'ground',
        groups: ['ground'],
        characterTitle: '石頭上的日光浴客',
        avatar: 'assets/images/斯文豪氏攀蜥.jpg',
        photos: [
            'assets/images/species/斯文豪氏攀蜥/斯文豪氏攀蜥1.jpg',
            'assets/images/species/斯文豪氏攀蜥/斯文豪氏攀蜥2.jpg',
            'assets/images/species/斯文豪氏攀蜥/斯文豪氏攀蜥3.jpg'
        ],
        commonness: 4,
        activityTime: '白天',
        difficulty: 2,
        hotspot: '理學院石牆、中大湖畔欄杆',
        story: '找到一塊被陽光曬得溫熱的石頭或牆面，幾乎必然能看到牠。斯文豪氏攀蜥是臺灣特有種，全身鱗甲花紋精緻，雄性遇到競爭對手時會做出「伏地挺身」的宣示動作，是校園裡最有趣的迷你表演。',
        idClues: ['背部有縱向深色條紋', '雄性喉部色彩鮮豔（橘紅或黃色）', '頭部三角形、眼神銳利', '常靜止不動、與樹皮融為一體'],
        scientific: 'Diploderma swinhonis',
        classification: '爬行綱 Reptilia／有鱗目 Squamata／飛蜥科 Agamidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>臺灣特有種</li>
            <li><strong>台灣地區：</strong>全島低海拔至中海拔山區，分布廣泛</li>
            <li><strong>棲地類型：</strong>偏好有樹木的環境，常見於樹幹與草叢間</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>校園建物過多或樹木間距過大，限制其在樹冠層間移動與避敵</li>
            <li><strong>人為干擾：</strong>行人過度驚擾或校園流浪貓狗的捕食壓力，影響其族群穩定</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園森林與綠帶的連結性，保留樹木作為其活動與日曬場所</li>
            <li><strong>環境教育：</strong>宣導「遠觀而不捕捉」，讓師生了解其生態功能</li>
        </ul>`
    },

    frog: {
        name: '澤蛙',
        englishName: 'Paddy Frog',
        category: 'animal',
        group: 'ground',
        groups: ['ground'],
        characterTitle: '雨後的大合唱',
        avatar: 'assets/images/澤蛙.jpg',
        photos: [
            'assets/images/species/澤蛙/澤蛙1.jpg',
            'assets/images/species/澤蛙/澤蛙2.jpg',
            'assets/images/species/澤蛙/澤蛙3.jpg'
        ],
        commonness: 4,
        activityTime: '晨昏、夜間',
        difficulty: 3,
        hotspot: '中大湖畔草地、理學院後方濕地',
        story: '只要一場大雨過後的夜晚，走過中大湖周邊，你就會聽見震耳欲聾的大合唱。那是澤蛙在集體宣示愛意。平時牠們安靜地藏在草叢，雨後則化身合唱團，是校園裡最受歡迎的免費演出。',
        idClues: ['體型小，背部灰褐色或綠褐色', '皮膚粗糙，有不規則花紋', '雄蛙喉部有鳴囊，叫聲響亮', '善於跳躍，受驚擾立即跳入水中'],
        scientific: 'Fejervarya limnocharis',
        classification: '兩棲綱 Amphibia／無尾目 Anura／叉舌蛙科 Dicroglossidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞、東南亞及南亞大部分地區</li>
            <li><strong>台灣地區：</strong>全島平地及低海拔山區最常見的蛙類</li>
            <li><strong>棲地類型：</strong>稻田、草地、水溝及校園潮濕綠地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>校園內過多的水泥地與排水溝，阻隔了澤蛙移動與繁殖的路徑</li>
            <li><strong>農藥與化學汙染：</strong>會直接透過皮膚傷害兩棲類</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>保留校園內的草澤與落葉堆，提供生存空間</li>
            <li><strong>環境教育：</strong>保護校園天然的「生物捕蚊器」</li>
        </ul>`
    },

    dragonfly: {
        name: '霜白蜻蜓',
        englishName: 'Crimson Dropwing',
        category: 'animal',
        group: 'ground',
        groups: ['ground'],
        characterTitle: '水邊的透明翅膀',
        avatar: 'assets/images/霜白蜻蜓.jpg',
        photos: [
            'assets/images/species/霜白蜻蜓/霜白蜻蜓1.jpg',
            'assets/images/species/霜白蜻蜓/霜白蜻蜓2.jpg',
            'assets/images/species/霜白蜻蜓/霜白蜻蜓3.jpg'
        ],
        commonness: 3,
        activityTime: '白天',
        difficulty: 2,
        hotspot: '中大湖生態池、校園水景區',
        story: '成熟雄性全身覆蓋著霜白色蠟粉，是臺灣最美麗的蜻蜓之一。牠們忠誠守護著自己的水域領地，每天在固定地點巡邏，同時也是校園水質的天然指標——有牠的地方，代表水質夠好。',
        idClues: ['雄性成熟後體表覆蓋霜白色蠟粉', '翅膀透明有光澤', '常停棲在突出的枝條或石頭上', '領域性強，雄性會驅趕其他雄性'],
        scientific: 'Orthetrum pruinosum',
        classification: '昆蟲綱 Insecta／蜻蜓目 Odonata／蜻蜓科 Libellulidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>廣泛分佈於東亞、南亞及東南亞</li>
            <li><strong>台灣地區：</strong>普遍分佈於全島低海拔山區與平地</li>
            <li><strong>棲地類型：</strong>水池、溝渠、沼澤等緩流或靜止水域</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破壞：</strong>校園水池或溼地若過度水泥化，導致幼蟲失去生存空間</li>
            <li><strong>水質污染：</strong>生活廢水或化學藥劑流入水域</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園生態池的自然植被</li>
            <li><strong>環境教育：</strong>了解蜻蜓作為生物指標的重要性</li>
        </ul>`
    },

    heron: {
        name: '黑冠麻鷺',
        englishName: 'Malayan Night Heron',
        category: 'animal',
        group: 'icon',
        groups: ['icon'],
        characterTitle: '校園的悠閒哲學家',
        avatar: 'assets/images/species/黑冠麻鷺/黑冠麻鷺1.jpg',
        photos: [
            'assets/images/species/黑冠麻鷺/黑冠麻鷺1.jpg',
            'assets/images/species/黑冠麻鷺/黑冠麻鷺2.jpg',
            'assets/images/species/黑冠麻鷺/黑冠麻鷺3.JPG'
        ],
        commonness: 5,
        activityTime: '全天（晨昏最活躍）',
        difficulty: 1,
        hotspot: '中大湖周邊、理學院草坪、文學院綠地',
        story: '牠是中大校園最知名的野生鄰居。總是一個人慢悠悠地在草坪上踱步，用那雙黃色的眼睛盯著地面，等待蚯蚓出現。就算旁邊有人靠近，牠也不慌不忙，彷彿對這個世界早已看透——「發呆鳥」的稱號不是沒有原因的。',
        idClues: ['頭頂有黑色羽冠', '全身栗褐色，佈滿細密條紋', '頸部短粗、縮起時像駝背', '受驚時筆直立起脖子、一動不動'],
        scientific: 'Gorsachius melanolophus',
        classification: '鳥綱 Aves／鵜形目 Pelecaniformes／鷺科 Ardeidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞、東南亞及南亞各地</li>
            <li><strong>台灣地區：</strong>全島低海拔地區，在中大校園極為常見</li>
            <li><strong>棲地類型：</strong>草地、公園、湖畔、樹林邊緣</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地減少：</strong>校園綠地若過度硬鋪面化，導致蚯蚓等食物來源減少</li>
            <li><strong>人為干擾：</strong>幼鳥離巢時常被誤認為受傷，被人帶走反而造成傷害</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護草坪土壤的天然結構，讓蚯蚓族群維持健全</li>
            <li><strong>環境教育：</strong>宣導「不捕捉、不餵食」，讓幼鳥自然融入環境</li>
        </ul>`
    },

    barbet: {
        name: '五色鳥',
        englishName: 'Taiwan Barbet',
        category: 'animal',
        group: 'forest',
        groups: ['forest'],
        characterTitle: '森林的彩色打鼓手',
        avatar: 'assets/images/species/五色鳥/五色鳥1.jpg',
        photos: [
            'assets/images/species/五色鳥/五色鳥1.jpg',
            'assets/images/species/五色鳥/五色鳥2.jpg',
            'assets/images/species/五色鳥/五色鳥3.jpg'
        ],
        commonness: 5,
        activityTime: '白天',
        difficulty: 2,
        hotspot: '中大湖周邊樹林、科學四館前老榕樹',
        story: '就算從未見過五色鳥，只要在校園裡聽見規律的「郭郭郭郭郭」聲，就代表牠在附近。頭部集結了紅、黃、藍、綠、黑五種顏色，是大自然最狂野的調色盤，也因叫聲像木魚而得了「花和尚」的雅號。牠不築鳥巢，而是直接用嘴在枯木上鑿洞當家。',
        idClues: ['頭部有紅、黃、藍、綠、黑五色', '體型圓滾、喙粗厚有力', '叫聲「郭郭郭」規律而響亮', '常停留在樹梢、不太移動'],
        scientific: 'Psilopogon nuchalis',
        classification: '鳥綱 Aves／鴷形目 Piciformes／擬鴷科 Megalaimidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>臺灣特有亞種</li>
            <li><strong>台灣地區：</strong>中低海拔闊葉林、公園及校園綠地，分布廣泛</li>
            <li><strong>棲地類型：</strong>偏好有大型樹木與老樹的環境，便於鑿洞築巢</li>
        </ul>`,
        threats: `<ul>
            <li><strong>老樹砍除：</strong>鑿洞築巢需要枯木或老樹，若過度清除枯木將失去繁殖場所</li>
            <li><strong>棲地破碎化：</strong>綠地面積縮小影響其覓食範圍</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>保留枯木：</strong>在安全前提下保留枯立木，提供築巢空間</li>
            <li><strong>棲地保護：</strong>維護校園老樹與大型喬木的生存環境</li>
        </ul>`
    },

    babbler: {
        name: '小彎嘴',
        englishName: 'Streaked Laughingthrush',
        category: 'animal',
        group: 'forest',
        groups: ['forest'],
        characterTitle: '灌木叢裡的神秘隱士',
        avatar: 'assets/images/species/小彎嘴/小彎嘴1.jpg',
        photos: [
            'assets/images/species/小彎嘴/小彎嘴1.jpg',
            'assets/images/species/小彎嘴/小彎嘴2.jpg',
            'assets/images/species/小彎嘴/小彎嘴3.jpg'
        ],
        commonness: 4,
        activityTime: '白天',
        difficulty: 4,
        hotspot: '中大湖周邊灌木區、校園外圍竹林',
        story: '多數人在校園裡和小彎嘴相遇時，根本不知道發生了什麼——只聽見灌木叢裡有聲音，卻始終看不到身影。那把像鐮刀一樣向下彎曲的長喙，專門用來在落葉堆裡翻找昆蟲，是森林底層最稱職的清道夫。',
        idClues: ['喙部明顯向下彎曲，如鐮刀', '棕褐色羽毛配白色眉線', '常以小家庭群體出沒', '喜歡躲在灌木叢內、很少現身'],
        scientific: 'Pomatorhinus musicus',
        classification: '鳥綱 Aves／雀形目 Passeriformes／噪眉科 Leiothrichidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>臺灣特有種</li>
            <li><strong>台灣地區：</strong>全島低海拔至中海拔山區</li>
            <li><strong>棲地類型：</strong>濃密灌木叢、竹林、低海拔森林底層</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地減少：</strong>灌木叢被清除或修剪，使其失去隱蔽場所</li>
            <li><strong>外來種入侵：</strong>部分外來種鳥類競爭相似的食物資源</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地維護：</strong>保留校園自然生長的灌木叢與竹林邊緣</li>
            <li><strong>減少干擾：</strong>避免過度整地，保留底層枯葉與腐植質</li>
        </ul>`
    },

    drongo: {
        name: '大卷尾',
        englishName: 'Black Drongo',
        category: 'animal',
        group: 'forest',
        groups: ['forest'],
        characterTitle: '空中的保全隊長',
        avatar: 'assets/images/species/大卷尾/大卷尾1.jpg',
        photos: [
            'assets/images/species/大卷尾/大卷尾1.jpg',
            'assets/images/species/大卷尾/大卷尾2.jpg',
            'assets/images/species/大卷尾/大卷尾3.jpg'
        ],
        commonness: 5,
        activityTime: '白天',
        difficulty: 1,
        hotspot: '大草坪、操場周邊、松樹大道',
        story: '大卷尾是校園裡最勇猛的小鳥。體型不大，但連大冠鷲、鳳頭蒼鷹這些猛禽靠近時，牠也敢飛出去俯衝驅趕。那把剪刀形的尾巴在飛行中優雅地分叉，是最容易辨認的特徵之一。',
        idClues: ['全身亮黑色，有金屬光澤', '尾羽向外分叉、形如剪刀', '常停在電線或樹梢制高點', '飛行時敢驅趕大型猛禽'],
        scientific: 'Dicrurus macrocercus',
        classification: '鳥綱 Aves／雀形目 Passeriformes／卷尾科 Dicruridae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞、南亞及東南亞</li>
            <li><strong>台灣地區：</strong>全島平地至低海拔山區，極常見</li>
            <li><strong>棲地類型：</strong>草地、農田邊緣、電線桿、樹梢</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地改變：</strong>大面積草地減少影響其狩獵空間</li>
            <li><strong>農藥使用：</strong>農藥減少昆蟲族群，間接影響食物來源</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>保留開闊草地與農田景觀，維護昆蟲多樣性</li>
            <li><strong>減少農藥：</strong>推廣友善農業與校園有機管理</li>
        </ul>`
    },

    eagle: {
        name: '大冠鷲',
        englishName: 'Crested Serpent Eagle',
        category: 'animal',
        group: 'sky',
        groups: ['sky'],
        characterTitle: '天空的孤獨王者',
        avatar: 'assets/images/species/大冠鷲/大冠鷲1.jpg',
        photos: [
            'assets/images/species/大冠鷲/大冠鷲1.jpg',
            'assets/images/species/大冠鷲/大冠鷲2.jpg',
            'assets/images/species/大冠鷲/大冠鷲3.jpg'
        ],
        commonness: 2,
        activityTime: '白天',
        difficulty: 3,
        hotspot: '中大湖上空、校園林區上方',
        story: '盤旋在校園上空的身影，翼展可達一百二十公分以上。牠是山林頂端的掠食者，主食蛇類，因此又叫「蛇鵰」。一旦發現牠在高空中緩緩盤旋，附近很可能有蛇的蹤跡——兩種動物的故事，往往在同一地點交疊。',
        idClues: ['體型大，翼展超過120公分', '飛行時翅膀寬圓，翼下有白色斑紋', '頭頂黑色羽冠明顯', '常發出「忽悠—忽悠」的高亢叫聲'],
        scientific: 'Spilornis cheela',
        classification: '鳥綱 Aves／隼形目 Falconiformes／鷹科 Accipitridae',
        dist: `<ul>
            <li><strong>原生分布：</strong>南亞、東南亞至東亞</li>
            <li><strong>台灣地區：</strong>全島中低海拔山區，台灣特有亞種</li>
            <li><strong>棲地類型：</strong>森林邊緣、山谷、校園大樹林區</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地減少：</strong>山林開發壓縮其獵場範圍</li>
            <li><strong>二次中毒：</strong>誤食中毒蛇類或獵物導致間接傷害</li>
            <li><strong>人為干擾：</strong>繁殖期巢位附近的活動干擾育雛</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>保護山林：</strong>維護校園周邊山坡地的自然植被</li>
            <li><strong>避免毒餌：</strong>禁止校園內使用可能造成二次中毒的毒鼠藥</li>
            <li><strong>繁殖期保護：</strong>若發現巢位，保持距離、不干擾</li>
        </ul>`
    },

    besra: {
        name: '松雀鷹',
        englishName: 'Besra',
        category: 'animal',
        group: 'sky',
        groups: ['sky'],
        characterTitle: '森林裡的飛行影子',
        avatar: 'assets/images/species/松雀鷹/松雀鳥1.jpg',
        photos: [
            'assets/images/species/松雀鷹/松雀鳥1.jpg',
            'assets/images/species/松雀鷹/松雀鳥2.jpg',
            'assets/images/species/松雀鷹/松雀鳥3.jpg'
        ],
        commonness: 2,
        activityTime: '白天',
        difficulty: 5,
        hotspot: '中大湖周邊樹林、體育場後方林道',
        story: '森林裡的隱形獵人。身形細長，擅長在茂密樹冠之間高速穿梭追獵。警戒心強，一有異動立刻消失。在校園猛禽中，牠是記錄難度最高的一種——能拍到清晰照片的人，幾乎都是運氣與耐心的雙重勝者。',
        idClues: ['體型比鴿子小，身形修長', '背部灰褐色，腹面有細密橫紋', '飛行速度極快，穿梭樹間', '尾羽較長，飛行時有力地拍翅'],
        scientific: 'Accipiter virgatus',
        classification: '鳥綱 Aves／隼形目 Falconiformes／鷹科 Accipitridae',
        dist: `<ul>
            <li><strong>原生分布：</strong>南亞、東南亞至東亞</li>
            <li><strong>台灣地區：</strong>全島低至中海拔山區森林，部分族群為冬候鳥</li>
            <li><strong>棲地類型：</strong>森林邊緣、樹冠層、次生林</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破壞：</strong>低海拔森林開發壓縮其活動空間</li>
            <li><strong>食物來源減少：</strong>小型鳥類族群下降影響其獵食機會</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地維護：</strong>保留校園林地連結性，讓猛禽能自由穿越</li>
            <li><strong>生物多樣性：</strong>維護昆蟲與小型鳥類多樣性，間接保障猛禽食物鏈</li>
        </ul>`
    },

    goshawk: {
        name: '鳳頭蒼鷹',
        englishName: 'Crested Goshawk',
        category: 'animal',
        group: 'sky',
        groups: ['sky'],
        characterTitle: '都市叢林的獵者',
        avatar: 'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹1.jpg',
        photos: [
            'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹1.jpg',
            'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹2.jpg',
            'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹3.jpg'
        ],
        commonness: 3,
        activityTime: '白天',
        difficulty: 4,
        hotspot: '中大湖周邊、行政大樓行道樹',
        story: '頭頂有明顯的羽冠，繁殖期間胸前出現橘紅色橫紋。曾被列為保育類，現已調整為一般類野生動物，代表族群已漸漸恢復。牠選擇在人類活動的校園附近築巢，本身就是對環境品質最高的認可。',
        idClues: ['頭頂有短而明顯的羽冠', '繁殖期雄鳥胸部有橘紅色縱紋', '尾羽有明顯橫帶', '常在樹冠層間快速穿梭，偶爾盤旋'],
        scientific: 'Accipiter trivirgatus',
        classification: '鳥綱 Aves／隼形目 Falconiformes／鷹科 Accipitridae',
        dist: `<ul>
            <li><strong>原生分布：</strong>南亞至東南亞、東亞各地</li>
            <li><strong>台灣地區：</strong>全島低至中海拔山區，也見於城市公園與校園</li>
            <li><strong>棲地類型：</strong>校園、公園、次生林、城市綠地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地減少：</strong>低海拔森林開發導致繁殖場所减少</li>
            <li><strong>人為干擾：</strong>繁殖期干擾巢位容易造成棄巢</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>繁殖期保護：</strong>發現巢位後保持適當距離，避免驚擾</li>
            <li><strong>棲地維護：</strong>校園保留高大喬木，提供其築巢場所</li>
        </ul>`
    },

    kestrel: {
        name: '紅隼',
        englishName: 'Common Kestrel',
        category: 'animal',
        group: 'sky',
        groups: ['sky'],
        characterTitle: '懸停專家',
        avatar: 'assets/images/species/紅隼/紅隼1.jpg',
        photos: [
            'assets/images/species/紅隼/紅隼1.jpg',
            'assets/images/species/紅隼/紅隼2.jpg',
            'assets/images/species/紅隼/紅隼3.png'
        ],
        commonness: 2,
        activityTime: '白天',
        difficulty: 3,
        hotspot: '大操場上空、校園邊緣開闊地',
        story: '秋冬季節，有時會在大操場上空看到一隻鳥「定格」在空中，鼓動著翅膀卻紋絲不動——那就是紅隼在施展其最厲害的技能「懸停定點」，用精準的眼力搜索地面獵物。這個特殊本領讓牠在所有猛禽中顯得獨一無二。',
        idClues: ['飛行時能原地懸停、不隨風漂移', '雄性背部為磚紅色', '尾羽細長，飛行輪廓修長', '秋冬季過境或留守，夏季較少見'],
        scientific: 'Falco tinnunculus',
        classification: '鳥綱 Aves／隼形目 Falconiformes／隼科 Falconidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>歐亞大陸廣泛分布</li>
            <li><strong>台灣地區：</strong>主要為冬候鳥，少數繁殖族群</li>
            <li><strong>棲地類型：</strong>農田、草地、濕地、開闊空間</li>
        </ul>`,
        threats: `<ul>
            <li><strong>農藥使用：</strong>農田農藥減少食蟲類昆蟲與小型鼠類，影響食物來源</li>
            <li><strong>棲地減少：</strong>開闊農地轉為開發用地</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>友善農業：</strong>鼓勵使用有機農法，維護開闊草地生態</li>
            <li><strong>棲地維護：</strong>保留校園與周邊開闊綠地</li>
        </ul>`
    },

    shrike: {
        name: '紅尾伯勞',
        englishName: 'Brown Shrike',
        category: 'animal',
        group: 'forest',
        groups: ['forest'],
        characterTitle: '南來的冬日訪客',
        avatar: 'assets/images/species/紅尾伯勞/紅尾伯勞1.jpg',
        photos: [
            'assets/images/species/紅尾伯勞/紅尾伯勞1.jpg',
            'assets/images/species/紅尾伯勞/紅尾伯勞2.jpg',
            'assets/images/species/紅尾伯勞/紅尾伯勞3.jpg'
        ],
        commonness: 4,
        activityTime: '白天',
        difficulty: 2,
        hotspot: '中大湖周邊、操場旁樹叢',
        story: '每年秋天，牠從北方遠道而來越冬。雖然體型只有麻雀大小，卻能制服比自己更大的昆蟲和小型動物，甚至會把獵物插在荊棘上儲存，是名副其實的「屠夫鳥」。常站在制高點四處張望，態度自信、眼神犀利。',
        idClues: ['通過黑色過眼帶（像戴面具）', '背部栗褐色，尾羽偏紅棕色', '常停在電線或樹頂制高點', '秋冬季出現，春夏後返回北方'],
        scientific: 'Lanius cristatus',
        classification: '鳥綱 Aves／雀形目 Passeriformes／伯勞科 Laniidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞，繁殖於中國東北、俄羅斯遠東等地</li>
            <li><strong>台灣地區：</strong>秋冬季常見過境及度冬鳥，全島普遍</li>
            <li><strong>棲地類型：</strong>灌木叢、電線桿、農地邊緣、校園樹叢</li>
        </ul>`,
        threats: `<ul>
            <li><strong>過境危險：</strong>長距離遷徙期間面臨建築物撞擊、捕獵等風險</li>
            <li><strong>棲地減少：</strong>農地開發使度冬棲地減少</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>遷徙保護：</strong>宣導不捕捉過境候鳥，減少校園玻璃幕牆的鳥擊</li>
            <li><strong>棲地維護：</strong>保留灌木叢邊緣環境</li>
        </ul>`
    },

    snake: {
        name: '草花蛇',
        englishName: 'Striped Kukri Snake',
        category: 'animal',
        group: 'ground',
        groups: ['ground'],
        characterTitle: '草叢裡的誤會主角',
        avatar: 'assets/images/species/草花蛇/草花蛇1.jpg',
        photos: [
            'assets/images/species/草花蛇/草花蛇1.jpg',
            'assets/images/species/草花蛇/草花蛇2.jpg',
            'assets/images/species/草花蛇/草花蛇3.jpg'
        ],
        commonness: 3,
        activityTime: '白天、晨昏',
        difficulty: 4,
        hotspot: '中大湖周邊草地、理學院後方林緣',
        story: '一見到蛇就退三步，是很多人的反應。但草花蛇是無毒蛇，個性害羞，遇到人通常比你更想逃。牠是校園生態鏈的重要一環，以青蛙和小型動物維生，出現代表著生態系夠健康——看到牠，應該算是好消息。',
        idClues: ['體型纖細，動作快速', '背部有黑色斑紋，外觀類似花紋', '頭部略呈三角形但非毒蛇特徵', '遇到人通常迅速逃走，幾乎不主動攻擊'],
        scientific: 'Oligodon formosanus',
        classification: '爬行綱 Reptilia／有鱗目 Squamata／黃頷蛇科 Colubridae',
        dist: `<ul>
            <li><strong>原生分布：</strong>臺灣特有種</li>
            <li><strong>台灣地區：</strong>全島低海拔至中海拔山區，校園草地常見</li>
            <li><strong>棲地類型：</strong>草叢、灌木叢、湖畔、陰涼潮濕處</li>
        </ul>`,
        threats: `<ul>
            <li><strong>人為捕殺：</strong>因誤認為毒蛇而遭到捕殺或驚嚇致傷</li>
            <li><strong>棲地減少：</strong>草地硬鋪面化使其活動與覓食空間縮小</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>環境教育：</strong>宣導正確識別蛇類，了解無毒蛇的生態功能</li>
            <li><strong>遇蛇守則：</strong>保持距離、讓蛇自行離開，切勿驅趕或捕捉</li>
        </ul>`
    },

    pigeon: {
        name: '野鴿',
        englishName: 'Feral Pigeon',
        category: 'animal',
        group: 'urban',
        groups: ['urban'],
        characterTitle: '廣場老住戶',
        avatar: 'assets/images/species/野鴿/野鴿1.jpg',
        photos: [
            'assets/images/species/野鴿/野鴿1.jpg',
            'assets/images/species/野鴿/野鴿2.jpg',
            'assets/images/species/野鴿/野鴿3.jpg'
        ],
        commonness: 5,
        activityTime: '白天',
        difficulty: 1,
        hotspot: '圖書館前廣場、餐廳周邊',
        story: '外來種，但已徹底融入校園生活。廣場、餐廳附近、教學大樓前都是牠的地盤。雖然生態學家擔憂其擠壓本土鳥類的空間，但那深沉的「咕——咕——」聲，已成為許多學生熟悉的校園背景音，也讓我們思考人類活動對自然的影響。',
        idClues: ['灰藍色羽毛，翅膀有黑色橫帶', '頸部有金屬光澤（綠紫色）', '成群活動，不懼怕人類接近', '廣場、建築物旁最常見'],
        scientific: 'Columba livia domestica',
        classification: '鳥綱 Aves／鴿形目 Columbiformes／鳩鴿科 Columbidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>外來種，原生於歐洲、中亞及北非</li>
            <li><strong>台灣地區：</strong>全台城市及校園，分布廣泛</li>
            <li><strong>棲地類型：</strong>廣場、建築物、天台、人行道</li>
        </ul>`,
        threats: `<ul>
            <li><strong>族群過多：</strong>大量聚集可能影響本土鳥類棲息空間</li>
            <li><strong>衛生問題：</strong>排泄物可能造成環境與建築物損壞</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>不餵食：</strong>避免人為餵食造成族群過度聚集</li>
            <li><strong>環境教育：</strong>了解外來種對本土生態的潛在影響</li>
        </ul>`
    },

    owl: {
        name: '領角鴞',
        englishName: 'Collared Scops Owl',
        category: 'animal',
        group: 'night',
        groups: ['night'],
        characterTitle: '夜晚的神秘守衛',
        avatar: 'assets/images/species/領角鴞/領角鴞1.jpg',
        photos: [
            'assets/images/species/領角鴞/領角鴞1.jpg',
            'assets/images/species/領角鴞/領角鴞2.jpg',
            'assets/images/species/領角鴞/領角鴞3.jpg'
        ],
        commonness: 4,
        activityTime: '夜間',
        difficulty: 5,
        hotspot: '中大湖周邊大樹、行政大樓行道樹',
        story: '白天幾乎看不見牠——不是因為牠離開了，而是牠已將自己完美偽裝成一截樹幹。入夜後，那一聲悠長的「呼——」才洩露了牠的存在。領角鴞是校園夜間生態系的頂端守望者，靜靜地維護著黑夜裡的生態平衡。',
        idClues: ['頭頂兩側有短耳羽（角狀）', '全身灰褐色、布滿細密斑紋，與樹皮融合', '眼睛大而圓、橘黃色', '夜間發出深沉的「呼——」單音叫聲'],
        scientific: 'Otus lettia',
        classification: '鳥綱 Aves／鴞形目 Strigiformes／鴟鴞科 Strigidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞及東南亞</li>
            <li><strong>台灣地區：</strong>全島低至中海拔山區，校園綠地亦有繁殖</li>
            <li><strong>棲地類型：</strong>校園綠地、公園、闊葉林</li>
        </ul>`,
        threats: `<ul>
            <li><strong>光害干擾：</strong>校園夜間燈光過亮影響其狩獵行為</li>
            <li><strong>棲地減少：</strong>大型老樹減少使其失去築巢場所</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>光害管理：</strong>減少非必要夜間照明，保護夜行性動物</li>
            <li><strong>保留老樹：</strong>維護大型喬木，提供貓頭鷹棲息繁殖空間</li>
        </ul>`
    }

};

// ---------------------------------------------------------------------------
// Plants
// ---------------------------------------------------------------------------

const plants = {

    cedar: {
        name: '台灣肖楠',
        category: 'plant',
        avatar: 'assets/images/台灣肖楠.jpg',
        scientific: 'Calocedrus formosana',
        classification: '松柏綱 Coniferopsida／松柏目 Pinales／柏科 Cupressaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣特有種</li>
            <li><strong>台灣地區：</strong>北部及中部中低海拔山區，校園常有栽植</li>
            <li><strong>棲地類型：</strong>偏好濕潤的山谷或溪澗旁</li>
        </ul>`,
        threats: `<ul>
            <li><strong>病蟲害侵襲：</strong>易受蚜蟲或介殼蟲危害</li>
            <li><strong>環境適應力：</strong>若排水不良容易引發根部腐爛</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業維護：</strong>定期進行病蟲害防治與枯枝清理</li>
            <li><strong>棲地管理：</strong>維持樹穴土壤疏鬆與排水通暢</li>
        </ul>`
    },

    juniper: {
        name: '龍柏',
        category: 'plant',
        avatar: 'assets/images/龍柏.jpg',
        scientific: "Juniperus chinensis 'Kaizuka'",
        classification: '松柏綱 Coniferopsida／松柏目 Pinales／柏科 Cupressaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞地區，如台灣、中國、日本</li>
            <li><strong>台灣地區：</strong>普遍栽植於校園景觀樹</li>
        </ul>`,
        threats: `<ul>
            <li><strong>病蟲害侵襲：</strong>易受紅蜘蛛或介殼蟲危害</li>
            <li><strong>人為破壞：</strong>若修剪不當傷口極難復原</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業照護：</strong>定期進行病蟲害防治與專業修剪</li>
            <li><strong>棲地管理：</strong>維持樹穴土壤的排水性與通風</li>
        </ul>`
    },

    paperbark: {
        name: '白千層',
        category: 'plant',
        avatar: 'assets/images/白千層.jpg',
        scientific: 'Melaleuca leucadendra',
        classification: '木蘭綱 Magnoliopsida／桃金孃目 Myrtales／桃金孃科 Myrtaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>澳洲、東南亞</li>
            <li><strong>台灣地區：</strong>全台各地廣泛栽種</li>
        </ul>`,
        threats: `<ul>
            <li><strong>人為破壞：</strong>海綿狀的樹皮容易被剝除，影響水分傳導</li>
            <li><strong>棲地退化：</strong>土壤過度板結導致根系無法呼吸</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>環境教育：</strong>宣導「不隨手剝樹皮」，守護校園樹木健康</li>
        </ul>`
    },

    acacia: {
        name: '相思樹',
        category: 'plant',
        avatar: 'assets/images/相思樹.jpg',
        scientific: 'Acacia confusa',
        classification: '木蘭綱 Magnoliopsida／豆目 Fabales／豆科 Fabaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣、菲律賓及越南北部</li>
            <li><strong>台灣地區：</strong>全島低海拔丘陵及平地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地開發：</strong>硬舖面增加限制其根系生長空間</li>
            <li><strong>病蟲害侵襲：</strong>易受褐根病危害</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業維護：</strong>定期進行安全巡檢與枯枝修剪</li>
            <li><strong>棲地管理：</strong>維持樹穴透氣性</li>
        </ul>`
    },

    cherry: {
        name: '櫻花',
        category: 'plant',
        avatar: 'assets/images/山櫻花.jpg',
        scientific: 'Prunus spp.',
        classification: '木蘭綱 Magnoliopsida／薔薇目 Rosales／薔薇科 Rosaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>北半球溫帶地區</li>
            <li><strong>台灣地區：</strong>全台山區及校園栽植區</li>
        </ul>`,
        threats: `<ul>
            <li><strong>氣候變遷：</strong>暖冬與異常降雨導致花期紊亂</li>
            <li><strong>人為干擾：</strong>遊客攀折花木或踐踏根部</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>環境教育：</strong>宣導「賞花不折花」，提升保護意識</li>
        </ul>`
    }

};

// ---------------------------------------------------------------------------
// Merged lookup table (used by modal.js: speciesData[key])
// ---------------------------------------------------------------------------

const speciesData = { ...animals, ...plants };

// ---------------------------------------------------------------------------
// Extended metadata — used by pages/species.html detail page
// Merged into speciesData so every consumer has access.
// ---------------------------------------------------------------------------

const speciesExtended = {
    squirrel: {
        conservationTags: ['一般物種'],
        diet: '果實、堅果、嫩葉、昆蟲',
        size: '體長約 20–25 公分（尾長約 20 公分）',
        lifespan: '野外約 3–6 年',
        role: '種子傳播者',
        bestTimes: ['上午 7:00–10:00', '下午 3:00–5:00'],
        photoTips: [
            '注意腹部的橘紅色，是最明顯的辨認特徵',
            '觀察蓬鬆尾巴在樹枝間保持平衡的方式',
            '牠常用前腳握持食物，側臉觀察時可見圓耳'
        ]
    },
    magpie: {
        conservationTags: ['臺灣特有種', '一般物種'],
        diet: '雜食性（果實、昆蟲、小動物）',
        size: '體長約 65 公分（含尾羽）',
        lifespan: '約 10–15 年',
        role: '種子傳播者、森林清道夫',
        bestTimes: ['上午 6:00–9:00', '下午 4:00–6:00'],
        photoTips: [
            '注意那條比身體還長的尾羽，飛行時如藍色絲帶',
            '觀察鮮豔的紅色嘴喙與腳爪',
            '成群飛行時，前後呼應的隊形是最美的畫面'
        ]
    },
    lizard: {
        conservationTags: ['臺灣特有種', '一般物種'],
        diet: '昆蟲、蜘蛛等無脊椎動物',
        size: '體長約 30 公分（含尾巴）',
        lifespan: '約 5–8 年',
        role: '昆蟲控制者',
        bestTimes: ['上午 9:00–下午 3:00（日曬後最活躍）'],
        photoTips: [
            '注意雄性喉部在日照下閃現的橘紅色彩',
            '觀察牠在樹幹上做出「伏地挺身」的宣示動作',
            '背部縱向條紋讓牠完美融入樹皮紋理'
        ]
    },
    frog: {
        conservationTags: ['一般物種'],
        diet: '昆蟲、蜘蛛、蚯蚓等無脊椎動物',
        size: '體長約 4–6 公分',
        lifespan: '約 3–5 年',
        role: '昆蟲控制者、食物鏈重要節點',
        bestTimes: ['雨後傍晚', '春夏繁殖期夜晚'],
        photoTips: [
            '觀察背部灰褐色的不規則花紋',
            '雨後可見雄蛙喉部的鳴囊鼓脹',
            '牠常在草叢邊緣靜止，受驚後立即跳入水中'
        ]
    },
    dragonfly: {
        conservationTags: ['一般物種'],
        diet: '蚊子、蒼蠅等小型飛行昆蟲',
        size: '體長約 4.5–5 公分，翼展約 6–8 公分',
        lifespan: '成蟲約 1–2 個月',
        role: '水域昆蟲控制者、水質指標物種',
        bestTimes: ['上午 9:00–下午 4:00'],
        photoTips: [
            '成熟雄性體表的霜白色蠟粉在陽光下閃閃發光',
            '觀察翅膀的透明質感與光澤',
            '牠常停棲在固定的制高點守衛領地'
        ]
    },
    heron: {
        conservationTags: ['一般物種', '校園代表物種'],
        diet: '蚯蚓、蝸牛、昆蟲、蜥蜴、蛙類',
        size: '體長約 47–50 公分',
        lifespan: '野外約 10–15 年',
        role: '草地生態系中階捕食者',
        bestTimes: ['清晨', '傍晚', '雨後草地'],
        photoTips: [
            '注意頭頂的黑色羽冠，站立時縮起脖子像駝背',
            '觀察牠靜止等待獵物的耐心姿態',
            '雨後草地上最常見，用黃色眼睛凝視地面'
        ]
    },
    barbet: {
        conservationTags: ['臺灣特有亞種', '一般物種'],
        diet: '果實、漿果、昆蟲',
        size: '體長約 20–22 公分',
        lifespan: '約 8–12 年',
        role: '種子傳播者、鑿木工匠',
        bestTimes: ['上午 6:00–10:00', '下午 3:00–5:00'],
        photoTips: [
            '從正面觀察，可看清楚五種顏色的頭部配色',
            '注意那把短厚的鑿木喙，是牠開鑿巢洞的工具',
            '尋找牠常駐的樹梢位置，叫聲比外型更好找牠'
        ]
    },
    babbler: {
        conservationTags: ['臺灣特有種', '一般物種'],
        diet: '昆蟲、蜘蛛、蚯蚓等無脊椎動物',
        size: '體長約 19–20 公分',
        lifespan: '不詳',
        role: '森林底層昆蟲控制者',
        bestTimes: ['上午 7:00–10:00'],
        photoTips: [
            '注意那把特殊的鐮刀形下彎長喙',
            '觀察棕褐色羽毛上的白色眉線',
            '牠通常在灌木叢底部活動，需要耐心等待'
        ]
    },
    drongo: {
        conservationTags: ['一般物種'],
        diet: '飛行昆蟲、蝗蟲、蟬、蛾類',
        size: '體長約 28–30 公分',
        lifespan: '野外約 5–8 年',
        role: '天然除蟲專家、其他鳥類的守衛',
        bestTimes: ['上午 7:00–10:00', '下午 3:00–5:30'],
        photoTips: [
            '仔細看尾羽末端的剪刀形分叉',
            '觀察牠在空中急轉彎捕食昆蟲的動作',
            '全身黑色羽毛在陽光下有金屬般光澤'
        ]
    },
    eagle: {
        conservationTags: ['臺灣特有亞種', '一般物種'],
        diet: '蛇類、蜥蜴、蛙類等小型脊椎動物',
        size: '翼展約 120–130 公分',
        lifespan: '野外約 12–15 年',
        role: '頂級掠食者',
        bestTimes: ['上午 10:00–下午 2:00（熱氣流時段）'],
        photoTips: [
            '觀察翼下明顯的白色斑紋，飛行時最顯眼',
            '留意頭頂黑色羽冠及金黃色的眼睛',
            '在熱氣流上升時，牠常在此高度緩緩盤旋'
        ]
    },
    besra: {
        conservationTags: ['一般物種', '部分族群為冬候鳥'],
        diet: '小型鳥類、昆蟲、蜥蜴',
        size: '體長約 28–36 公分',
        lifespan: '野外約 5–10 年',
        role: '中型掠食者',
        bestTimes: ['上午 8:00–11:00'],
        photoTips: [
            '注意腹面的細密橫紋，是辨認關鍵',
            '觀察牠在樹冠間穿梭的修長輪廓',
            '牠警覺性極高，通常在林緣靜止觀察環境'
        ]
    },
    goshawk: {
        conservationTags: ['一般物種'],
        diet: '鳥類、小型哺乳類、蜥蜴',
        size: '體長約 40–49 公分',
        lifespan: '野外約 6–10 年',
        role: '都市生態系頂級掠食者',
        bestTimes: ['上午 8:00–11:00'],
        photoTips: [
            '注意頭頂短而明顯的羽冠',
            '繁殖期雄鳥胸部有橘紅色縱紋',
            '尾羽有明顯的橫帶紋路'
        ]
    },
    kestrel: {
        conservationTags: ['一般物種', '冬候鳥'],
        diet: '昆蟲、鼠類、小型鳥類、蜥蜴',
        size: '體長約 30–35 公分',
        lifespan: '野外約 6–14 年',
        role: '草地與農田生態系捕食者',
        bestTimes: ['上午 10:00–下午 2:00'],
        photoTips: [
            '尋找牠在空中原地懸停的定格畫面',
            '雄鳥背部的磚紅色在晴天最為鮮豔',
            '注意尾羽細長與修長的飛行輪廓'
        ]
    },
    shrike: {
        conservationTags: ['一般物種', '冬候鳥'],
        diet: '昆蟲、蜥蜴、小型鳥類、鼠類',
        size: '體長約 17–20 公分',
        lifespan: '野外約 5–10 年',
        role: '小型掠食者',
        bestTimes: ['上午 8:00–11:00', '下午 3:00–5:00'],
        photoTips: [
            '注意通過眼部的黑色過眼帶（戴面具效果）',
            '觀察牠在制高點靜止守望的姿態',
            '尾羽偏紅棕色，在陽光下明顯可見'
        ]
    },
    snake: {
        conservationTags: ['一般物種', '無毒蛇類'],
        diet: '蛙卵、蚯蚓、蜥蜴、小型脊椎動物',
        size: '體長約 40–70 公分',
        lifespan: '約 5–10 年',
        role: '中階掠食者',
        bestTimes: ['上午 9:00–11:00', '傍晚（天氣暖和時）'],
        photoTips: [
            '觀察背部黑色斑紋的排列特徵',
            '注意體型纖細與快速移動的特性',
            '牠喜歡在草地與灌木叢邊緣穿行'
        ]
    },
    pigeon: {
        conservationTags: ['外來種', '一般物種'],
        diet: '種子、穀物、植物碎屑',
        size: '體長約 30–35 公分',
        lifespan: '野外約 3–5 年',
        role: '都市環境適應者',
        bestTimes: ['全天均可觀察'],
        photoTips: [
            '觀察頸部在陽光下的金屬光澤（綠紫色）',
            '注意翅膀上兩條明顯的黑色橫帶',
            '成群活動時，注意牠們的點頭走路方式'
        ]
    },
    owl: {
        conservationTags: ['一般物種'],
        diet: '昆蟲、鼠類、小型鳥類、兩棲類',
        size: '體長約 20–25 公分',
        lifespan: '野外約 8–12 年',
        role: '夜間捕食者、鼠患控制者',
        bestTimes: ['日落後 30 分鐘', '整個夜晚（聆聽鳴聲）'],
        photoTips: [
            '白天靜止時幾乎與樹幹融為一體',
            '注意頭頂兩側的短耳羽（角狀突起）',
            '大眼睛橘黃色，夜間可在樹枝上發現'
        ]
    }
};

// Merge extended data into main lookup table
Object.entries(speciesExtended).forEach(function(entry) {
    var key = entry[0], ext = entry[1];
    if (speciesData[key]) Object.assign(speciesData[key], ext);
});

// ---------------------------------------------------------------------------
// Utility helpers (available globally for future use)
// ---------------------------------------------------------------------------

/**
 * Return all species entries matching a given category.
 * @param {'animal'|'plant'} category
 * @returns {Object.<string, Object>} Subset of speciesData
 */
function getSpeciesByCategory(category) {
    return Object.fromEntries(
        Object.entries(speciesData).filter(([, v]) => v.category === category)
    );
}

/**
 * Return all registered species keys.
 * @returns {string[]}
 */
function getAllSpeciesKeys() {
    return Object.keys(speciesData);
}

/**
 * Check whether a key exists in the dataset.
 * @param {string} key
 * @returns {boolean}
 */
function hasSpecies(key) {
    return Object.prototype.hasOwnProperty.call(speciesData, key);
}

// CommonJS export (no-op in browser; used if ever run in Node.js / tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { speciesData, getSpeciesByCategory, getAllSpeciesKeys, hasSpecies };
}

