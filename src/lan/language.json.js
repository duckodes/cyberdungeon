const languageJson = {
    /**虛擬地下城 */
    appname: String,
    languagetype: {
        /**- */
        system: String,
        /**南非英語 */
        "en-ZA": String,
        /**繁體中文 */
        "zh-TW": String,
        /**日文 */
        ja: String,
        /**韓文 */
        ko: String
    },
    audio: {
        /**主音量 */
        master: String,
        /**環境音 */
        bgm: String,
        /**音效 */
        fx: String
    },
    auth: {
        placeholder: {
            /**信箱/用戶名.. */
            email: String,
            /**密碼.. */
            password: String
        },
        switchAction: {
            /**註冊 */
            register: String,
            /**登入 */
            login: String
        },
        action: {
            /**創建*/
            create: String,
            /**登入 */
            login: String,
            /**登出 */
            logout: String
        }
    },
    wallet: {
        /**BTC */
        bitcoin: String,
        /**N */
        neuralchips: String
    },
    itemskey: {
        /**頭盔 */
        helmet: String,
        /**夾克 */
        jacket: String,
        /**武器 */
        weapon: String,
        /**腿掛 */
        legstrap: String,
        /**靴子 */
        boots: String
    },
    items: {
        /**普通頭盔, */
        helmet: [String],
        /**普通夾克, */
        jacket: [String],
        /**普通小刀, */
        weapon: [String],
        /**普通藥水, */
        legstrap: [String],
        /**普通戰靴, */
        boots: [String]
    },
    nav: {
        /**代號名稱 */
        name: String
    },
    market: {
        /**購買 */
        buy: String,
        /**確認是否購買 */
        "purchase-info": String,
        /**？ */
        "question-mark": String,
        /**確認 */
        confirm: String,
        /**取消 */
        cancel: String,
        /**餘額不足購買失敗 */
        "purchase-failed": String,
        /**感謝, 購買黑市商品 */
        "purchase-success": [String],
        /**已擁有 */
        owned: String
    },
    settings: {
        /**用戶名稱 */
        editusername: String,
        /**登出 */
        logout: String,
        /**身分證 */
        "id-card": String,
        /**地網通行證 C.NetID v.1.7 */
        "cybernet-credentials": String
    },
    game: {
        "open-project": {
            /**連接虛擬地下城 */
            dungeon: String,
            /**裝備 */
            equip: String
        },
        equip: {
            /**您想要將, 賣出嗎 */
            "sell-question": [String],
            /**？ */
            "question-mark": String,
            /**賣出 */
            "sell-confirm": String,
            /**還是算了 */
            "sell-cancel": String
        }
    },
    prompter: {
        /**登入逾時，請重新登入 */
        timeout: String,
        /**點擊螢幕確認 */
        confirm: String
    },
    progress: {
        /**破解地下城 */
        "dungeon-crack": String,
        /**通訊埠加載31337 */
        "port-load": String,
        /**加載中 */
        loading: String
    },
    dungeon: {
        /**淺層網域, 深度網域 */
        area: [String],
        selector: {
            direction: {
                forward: String,
                backward: String,
                "turn-left": String,
                "turn-right": String
            },
            monster: {
                "blue-slime": String
            },
            "treasure-chest": String,
            item: {
                water: String
            },
            wall: {
                "stone-wall": String,
                "rock-wall": String,
                "brick-wall": String,
                "concrete-wall": String,
                "dry-stone-wall": String,
                "retaining-wall": String,
                "magic-barrier": String,
                "crystal-wall": String,
                "iron-wall": String,
                "obsidian-wall": String,
                "thorn-wall": String
            },
            portal: String,
            "safe-zone": String,
            "boss-room": String
        }
    }
};

export default languageJson;