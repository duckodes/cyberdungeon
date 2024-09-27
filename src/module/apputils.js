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
        navWalletBTC.title = 'Bitcoin'
        navWalletBTC.textContent = '510654654065406545405655506516540650650540650' + ' ₿';
        const navWalletNeuralChips = document.createElement('div');
        navWalletNeuralChips.className = 'nav-wallet nav-wallet-wafer';
        navWalletNeuralChips.title = 'NeuralChips';
        navWalletNeuralChips.textContent = '510654654065406545405655506516540650650540650' + ' ℕ';

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
        navRight.appendChild(navWalletNeuralChips);

        nav.appendChild(navLeft);
        nav.appendChild(navRight);

        app.appendChild(nav);
        app.appendChild(content);
        app.appendChild(footer);

        document.body.appendChild(app);
    }

    return {
        render
    }
})();

export default apputils;