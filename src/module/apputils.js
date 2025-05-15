import authSign from "./auth.sign.js";
import languagetype from "./languagetype.js";

const apputils = (() => {
    function registerEvent(user, apputilsRender, languageData) {
        const checkToken = () => {
            if (authSign.checkToken(user, apputilsRender, languageData))
                return;
            window.removeEventListener('focus', checkToken);
        }
        window.addEventListener('focus', checkToken);

        window.addEventListener('close', () => localStorage.removeItem('USER_EMAIL'));
    }
    function render(auth, languageData) {
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

        const settingsUtils = settingsutils.render(auth, app, languageData);
        content.appendChild(settingsUtils.settings);

        document.body.appendChild(app);
        return {
            display: {
                settings: (isShow) => {
                    isShow ?
                        settings.style.display = 'flex' : settings.style.display = '';
                }
            },
            revokeApp: () => {
                authSign.logout(auth);
                app.remove();
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

    return {
        registerEvent,
        render
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
    function render(auth, app, languageData) {
        const settings = document.createElement('div');
        settings.className = 'settings';

        const languageSelect = document.createElement('div');
        languageSelect.className = 'language-select';
        const languageSelectText = document.createElement('div');
        languageSelectText.className = 'language-select-text';
        languageSelectText.textContent = languagetype.getType(languageData);
        const selectionSymbol = document.createElement('div');
        selectionSymbol.className = 'selection-symbol';
        selectionSymbol.textContent = '▲';
        function isLanguageBoxActive() {
            return selectionSymbol.textContent === '▼';
        }
        languageSelect.addEventListener('click', () => {
            const isActiveSelection = isLanguageBoxActive();
            selectionSymbol.textContent = isActiveSelection ? '▲' : '▼';
        });
        for (let i = 0; i < Object.keys(languageData.languagetype).length; i++) {
            const languageSelectBox = document.createElement('div');
            languageSelectBox.textContent = languagetype.getType(languageData);
            languageSelect.appendChild(languageSelectBox);
        }

        const logout = document.createElement('button');
        logout.className = 'logout';
        logout.textContent = languageData.settings.logout;
        logout.addEventListener('click', () => {
            authSign.logout(auth);
            app.remove();
        });

        languageSelect.appendChild(languageSelectText);
        languageSelect.appendChild(selectionSymbol);

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