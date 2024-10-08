import authSign from "./auth.sign.js";

const apputils = (() => {
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
        navLevel.textContent = '0';
        const navName = document.createElement('div');
        navName.className = 'nav-name';
        navName.textContent = 'QueenmasteraasdfEEEE';
        const navWalletBTC = document.createElement('div');
        navWalletBTC.className = 'nav-wallet nav-wallet-btc';
        navWalletBTC.title = 'Bitcoin';
        navWalletBTC.textContent = '0 ₿';
        const navWalletNC = document.createElement('div');
        navWalletNC.className = 'nav-wallet nav-wallet-nc';
        navWalletNC.title = 'NeuralChips';
        navWalletNC.textContent = '0 ℕ';

        const settings = document.createElement('div');
        settings.className = 'settings';

        const logout = document.createElement('button');
        logout.className = 'logout';
        logout.textContent = languageData.settings.logout;
        logout.addEventListener('click', () => {
            authSign.logout(auth, languageData);
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
            update: {
                level: (textContent) => {
                    navLevel.textContent = textContent;
                },
                name: (textContent) => {
                    navName.textContent = textContent;
                },
                btc: (textContent) => {
                    navWalletBTC.textContent = textContent + ' ₿';
                },
                nc: (textContent) => {
                    navWalletNC.textContent = textContent + ' ℕ';
                }
            }
        }
    }

    return {
        render
    }
})();

export default apputils;