import authSign from "./auth.sign.js";

const apputils = (() => {
    function registerEvent(user, apputilsRender, languageData) {
        const checkToken = () => {
            const isTokenExist = authSign.checkToken(user, apputilsRender, languageData);
            if (isTokenExist) return;
            window.removeEventListener('focus', checkToken);
        }
        window.addEventListener('focus', checkToken);
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

        const settings = document.createElement('div');
        settings.className = 'settings';

        const logout = document.createElement('button');
        logout.className = 'logout';
        logout.textContent = languageData.settings.logout;
        logout.addEventListener('click', () => {
            authSign.logout(auth);
            app.remove();
        });

        settings.appendChild(logout);

        content.appendChild(settings);

        navLeft.appendChild(navLevel);
        navLeft.appendChild(navName);
        navRight.appendChild(navWalletBTC);
        navRight.appendChild(navWalletNC);

        nav.appendChild(navLeft);
        nav.appendChild(navRight);

        app.appendChild(nav);
        app.appendChild(content);
        app.appendChild(footer);

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
                    navLevel.textContent = textContent === undefined ? '0' : textContent;
                },
                name: (textContent) => {
                    navName.textContent = textContent === undefined ? languageData.nav.name : textContent;
                },
                btc: (textContent) => {
                    navWalletBTC.textContent = textContent === undefined ? '0 BTC' : textContent + ' BTC';
                },
                nc: (textContent) => {
                    navWalletNC.textContent = textContent === undefined ? '0 N' : textContent + ' N';
                }
            }
        }
    }

    return {
        registerEvent,
        render
    }
})();

export default apputils;