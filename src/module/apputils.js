import language from "./language.js";
import languagetype from "./languagetype.js";
import authData from "./auth.data.js";
import authSign from "./auth.sign.js";

const apputils = (() => {
    function render(languageData) {
        const app = document.createElement('div');
        app.className = 'app';

        const nav = document.createElement('div');
        nav.className = 'nav';
        const content = document.createElement('div');
        content.className = 'content';
        const footer = document.createElement('div');
        footer.className = 'footer';

        app.appendChild(nav);
        app.appendChild(content);
        app.appendChild(footer);

        const navUtils = navutils.render(languageData);
        nav.appendChild(navUtils.navLeft);
        nav.appendChild(navUtils.navRight);

        const settingsUtils = settingsutils.render(app, languageData);
        content.appendChild(settingsUtils.settings);

        document.body.appendChild(app);
        return {
            display: {
                settings: (isShow) => {
                    isShow ?
                        settings.style.display = 'flex' : settings.style.display = '';
                }
            },
            update: {
                level: (textContent) => {
                    navUtils.navLevel.textContent = textContent === undefined ? '0' : textContent;
                },
                name: (textContent) => {
                    navUtils.navName.textContent = textContent === undefined ? languageData.nav.name : textContent;
                },
                btc: (textContent) => {
                    navUtils.navWalletBTC.textContent = textContent === undefined ? '0 BTC' : textContent + ' BTC';
                },
                nc: (textContent) => {
                    navUtils.navWalletNC.textContent = textContent === undefined ? '0 N' : textContent + ' N';
                }
            }
        }
    }
    function update(languageData) {
        const apputilsRender = render(languageData);
        authData.init(apputilsRender);
    }
    return {
        update,
        forceRevokeApp: () => {
            document.querySelector('.app').remove();
        },
    }
})();

const navutils = (() => {
    function render(languageData) {
        const navLeft = document.createElement('div');
        navLeft.className = 'nav-left';
        const navRight = document.createElement('div');
        navRight.className = 'nav-right';

        const navLevel = document.createElement('div');
        navLevel.className = 'nav-level';
        navLevel.title = 'Level';
        navLevel.textContent = '0';
        const navName = document.createElement('div');
        navName.className = 'nav-name';
        navName.textContent = languageData.nav.name;
        const navWalletBTC = document.createElement('div');
        navWalletBTC.className = 'nav-wallet nav-wallet-btc';
        navWalletBTC.title = 'Bitcoin';
        navWalletBTC.textContent = '0 BTC';
        const navWalletNC = document.createElement('div');
        navWalletNC.className = 'nav-wallet nav-wallet-nc';
        navWalletNC.title = 'NeuralChips';
        navWalletNC.textContent = '0 N';

        navLeft.appendChild(navLevel);
        navLeft.appendChild(navName);
        navRight.appendChild(navWalletBTC);
        navRight.appendChild(navWalletNC);
        return {
            navLeft,
            navRight,
            navLevel,
            navName,
            navWalletBTC,
            navWalletNC
        }
    }
    return {
        render
    }
})();

const settingsutils = (() => {
    /**
    * @param {HTMLDivElement} app
    */
    function render(app, languageData) {
        const settings = document.createElement('div');
        settings.className = 'settings';

        const languageSelect = document.createElement('div');
        languageSelect.className = 'language-select';
        const languageSelectBox = document.createElement('div');
        languageSelectBox.className = 'language-select-box';
        const languageSelectText = document.createElement('div');
        languageSelectText.className = 'language-select-text';
        languageSelectText.textContent = languagetype.getType(languageData, document.documentElement.lang);
        const selectionSymbol = document.createElement('div');
        selectionSymbol.className = 'selection-symbol';
        selectionSymbol.textContent = '▲';
        function isLanguageBoxActive() {
            return selectionSymbol.textContent === '▼';
        }
        languageSelectBox.addEventListener('click', () => {
            const isActiveSelection = isLanguageBoxActive();
            selectionSymbol.textContent = isActiveSelection ? '▲' : '▼';
            if (!isActiveSelection) {
                languageSelectList.style.display = 'flex';
            } else {
                languageSelectList.style.display = 'none';
            }
        });
        const languageSelectList = document.createElement('div');
        languageSelectList.className = 'language-select-list';
        languageSelectList.style.display = 'none';
        for (let i = 0; i < languagetype.getLength(languageData); i++) {
            const languageSelectItem = document.createElement('div');
            languageSelectItem.textContent = languagetype.getValue(languageData)[i];
            languageSelectItem.addEventListener('click', async () => {
                const languageTypeKey = languagetype.getKeys(languageData)[i];
                document.documentElement.lang = languageTypeKey;
                authData.setData('lan', languageTypeKey);
                app.remove();
                apputils.update(await language.set(languageTypeKey));
                console.log(languagetype.getKeys(languageData)[i]);
            });
            languageSelectList.appendChild(languageSelectItem);
        }
        languageSelectBox.appendChild(languageSelectText);
        languageSelectBox.appendChild(selectionSymbol);

        languageSelect.appendChild(languageSelectBox);
        languageSelect.appendChild(languageSelectList);

        const logout = document.createElement('button');
        logout.className = 'logout';
        logout.textContent = languageData.settings.logout;
        logout.addEventListener('click', async () => {
            authSign.logout();
            app.remove();
        });

        settings.appendChild(languageSelect);
        settings.appendChild(logout);
        return {
            settings,
            languageSelect,
            logout
        }
    }
    return {
        render
    }
})();

export default apputils;