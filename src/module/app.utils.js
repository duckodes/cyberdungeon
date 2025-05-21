import language from "./language.js";
import languageType from "./language.type.js";

import authData from "./auth.data.js";
import authSign from "./auth.sign.js";

import audioSource from "./audio.source.js";
import auth from "./auth.js";

const appUtils = (() => {
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
            settings: settingsUtils.settings,
            display: {
                settings: (active) => {
                    active ?
                        settingsUtils.settings.style.display = 'flex' : settingsUtils.settings.style.display = '';
                }
            },
            update: {
                level: (textContent) => {
                    navUtils.navLevel.textContent = textContent === undefined ? '0 LV' : textContent + ' LV';
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
        const appUtilsRender = render(languageData);
        authData.init(appUtilsRender);
        audioSource.render(appUtilsRender, languageData);
    }
    return {
        update: update,
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

        const navName = document.createElement('div');
        navName.className = 'nav-name';
        navName.textContent = languageData.nav.name;
        const navLevel = document.createElement('div');
        navLevel.className = 'nav-level';
        navLevel.title = 'Level';
        navLevel.textContent = '0';
        const navWalletBTC = document.createElement('div');
        navWalletBTC.className = 'nav-wallet nav-wallet-btc';
        navWalletBTC.title = 'Bitcoin';
        navWalletBTC.textContent = '0 BTC';
        const navWalletNC = document.createElement('div');
        navWalletNC.className = 'nav-wallet nav-wallet-nc';
        navWalletNC.title = 'NeuralChips';
        navWalletNC.textContent = '0 N';

        navLeft.appendChild(navName);
        navRight.appendChild(navLevel);
        navRight.appendChild(navWalletBTC);
        navRight.appendChild(navWalletNC);
        return {
            navLeft: navLeft,
            navRight: navRight,
            navLevel: navLevel,
            navName: navName,
            navWalletBTC: navWalletBTC,
            navWalletNC: navWalletNC
        }
    }
    return {
        render: render
    }
})();

const settingsutils = (() => {
    /**
    * @param {HTMLDivElement} app
    */
    function render(app, languageData) {
        const settings = document.createElement('div');
        settings.className = 'settings';

        const editUsername = document.createElement('div');
        editUsername.className = 'edit-username';
        const inputUsername = document.createElement('input');
        inputUsername.type = 'text';
        inputUsername.placeholder = languageData.settings.editusername + '(3 ~ 20)..';
        inputUsername.value = auth.auth.currentUser.displayName;
        const confirmUsername = document.createElement('div');
        confirmUsername.className = 'confirm-username';
        confirmUsername.textContent = '✓';
        inputUsername.addEventListener('input', () => {
            if (inputUsername.value != auth.auth.currentUser.displayName) {
                confirmUsername.style.display = 'flex';
            } else {
                confirmUsername.style = '';
            }
            if (inputUsername.value === '' || inputUsername.value.length < 3 || inputUsername.value.length > 20) {
                confirmUsername.style = '';
            }
        });
        confirmUsername.addEventListener('click', () => {
            authSign.updateProfiles(auth.auth.currentUser, inputUsername.value);
            authData.setData('name', inputUsername.value);
            confirmUsername.style = '';
        });
        editUsername.appendChild(inputUsername);
        editUsername.appendChild(confirmUsername);

        const languageSelect = document.createElement('div');
        languageSelect.className = 'language-select';
        const languageSelectBox = document.createElement('div');
        languageSelectBox.className = 'language-select-box';
        const languageSelectText = document.createElement('div');
        languageSelectText.className = 'language-select-text';
        languageSelectText.textContent = languageType.getType(languageData, document.documentElement.lang);
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
            audioSource.playSoundEffect('click4');
        });
        const languageSelectList = document.createElement('div');
        languageSelectList.className = 'language-select-list';
        languageSelectList.style.display = 'none';
        for (let i = 0; i < languageType.getLength(languageData); i++) {
            const languageSelectItem = document.createElement('div');
            languageSelectItem.textContent = languageType.getValue(languageData)[i];
            languageSelectItem.addEventListener('click', async () => {
                const languageTypeKey = languageType.getKeys(languageData)[i];
                document.documentElement.lang = languageTypeKey;
                authData.setData('lan', languageTypeKey);
                app.remove();
                appUtils.update(await language.set(languageTypeKey));

                audioSource.playSoundEffect('click3');
                console.log(languageType.getKeys(languageData)[i]);
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

        const systemInfo = document.createElement('pre');
        systemInfo.className = 'system-info';
        systemInfo.textContent =
            `User Agent: ${navigator.userAgent}\n` +
            `Memory: ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Not available'}\n` +
            `Screen Resolution: ${window.screen.width} x ${window.screen.height}\n` +
            `Online Status: ${navigator.onLine ? 'Online' : 'Offline'}`;

        settings.appendChild(editUsername);
        settings.appendChild(languageSelect);
        settings.appendChild(logout);
        settings.appendChild(systemInfo);
        return {
            settings: settings,
            inputUsername: inputUsername,
            languageSelect: languageSelect,
            logout: logout
        }
    }
    return {
        render: render
    }
})();

export default appUtils;