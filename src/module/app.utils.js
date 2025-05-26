import language from "./language.js";
import languageType from "./language.type.js";

import auth from "./auth.js";
import authData from "./auth.data.js";
import authSign from "./auth.sign.js";

import audioSource from "./audio.source.js";
import cssUtils from "./css.utils.js";
import items from "./items.js";

const appUtils = (() => {
    function render(languageData, itemData) {
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

        const marketUtils = marketutils.render(languageData, itemData);
        const settingsUtils = settingsutils.render(app, languageData);
        content.appendChild(marketUtils.market);
        content.appendChild(settingsUtils.settings);

        const footerUtils = footerutils.render(content);
        footer.appendChild(footerUtils.footerContainer);

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
    async function update(languageData) {
        const itemData = await items.get(languageData);
        console.log(itemData);
        const appUtilsRender = render(languageData, itemData);
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
        navLeft.appendChild(navLevel);
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

const marketutils = (() => {
    function render(languageData, itemData) {
        const market = document.createElement('div');
        market.className = 'market';

        const itemskey = document.createElement('div');
        itemskey.className = 'items-key';
        items.parse(itemData, (key, data, i) => {
            const itemkey = document.createElement('div');
            itemkey.textContent = languageData.itemskey[key];
            if (!data[i].store) return;
            const item = document.createElement('div');
            item.className = 'item';
            item.setAttribute('data', data[i].name);
            const itemTitle = document.createElement('div');
            itemTitle.className = 'item-title';
            itemTitle.textContent = data[i].name;
            const itemImage = document.createElement('div');
            itemImage.className = 'item-image';
            itemImage.style.backgroundImage = `url(${data[i].img})`;
            const itemBuyButton = document.createElement('div');
            itemBuyButton.className = 'item-buy-button';
            itemBuyButton.textContent = data[i].cost + 'BTC ' + languageData.market.buy;

            item.appendChild(itemTitle);
            item.appendChild(itemImage);
            item.appendChild(itemBuyButton);

            itemskey.appendChild(itemkey);

            market.appendChild(item);
            market.appendChild(itemskey);
        });
        return {
            market: market
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
        settings.style.display = 'flex';

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
            const languageTypeValue = languageType.getValue(languageData)[i];
            languageSelectItem.textContent = languageTypeValue;
            languageTypeValue === languageSelectText.textContent
                && (languageSelectItem.style.color = cssUtils.getRootProperty('--color-yellow'));
            languageSelectItem.addEventListener('click', () => {
                const languageTypeKey = languageType.getKeys(languageData)[i];
                app.remove();
                audioSource.playSoundEffect('click3');
                if (languageTypeKey === 'system') {
                    refresh(navigator.language);
                    return;
                }
                refresh(languageTypeKey);
                async function refresh(languageTypeKey) {
                    document.documentElement.lang = languageTypeKey;
                    authData.setData('lan', languageTypeKey);
                    appUtils.update(await language.set(languageTypeKey));
                    console.log(languageTypeKey);
                }
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

const footerutils = (() => {
    function render(content) {
        const footerContainer = document.createElement('div');
        footerContainer.className = 'footer-container';
        const selectMarket = document.createElement('div');
        selectMarket.className = 'select-market';
        selectMarket.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16" fill="var(--color-high-light-darkness-max)"><path fill-rule="evenodd" d="M11.5 14c2.49 0 4.5-1 4.5-2.5V2c0-1-2-2-4.5-2S7 1 7 2v3.5c1.17.49 2.17 1.31 2.88 2.35c.49.096 1.03.149 1.62.149c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564q-.357 0-.68-.027q.12.495.16 1.01q.253.014.52.014c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .236-.149.586-.791.932c-.632.34-1.58.568-2.71.568q-.345 0-.668-.028a6.4 6.4 0 0 1-.309.974q.472.053.976.053zm2.7-7.56c.615-.336.802-.701.802-.936v-1.38q-.155.106-.323.198c-.778.425-1.87.686-3.18.686s-2.4-.261-3.18-.686a4 4 0 0 1-.323-.198v1.38c0 .235.187.6.802.935c.596.325 1.51.564 2.7.564s2.1-.239 2.7-.564zM8 2.5c0-.288.125-.565.358-.734c.127-.092.265-.184.374-.234c.273-.126 1.64-.533 2.77-.533s2.11.227 2.77.533c.124.057.261.146.382.234c.231.167.35.442.35.727v.006c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564s-2.1-.24-2.7-.564C8.187 3.1 8 2.734 8 2.5" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M9 11.5C9 13.99 6.99 16 4.5 16S0 13.99 0 11.5S2.01 7 4.5 7S9 9.01 9 11.5m-1 0C8 13.43 6.43 15 4.5 15S1 13.43 1 11.5S2.57 8 4.5 8S8 9.57 8 11.5" clip-rule="evenodd"></path></svg>`
        const selectSettings = document.createElement('div');
        selectSettings.className = 'select-settings';
        selectSettings.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="var(--color-high-light)"><path d="M10.75 2.567a2.5 2.5 0 0 1 2.5 0L19.544 6.2a2.5 2.5 0 0 1 1.25 2.165v7.268a2.5 2.5 0 0 1-1.25 2.165l-6.294 3.634a2.5 2.5 0 0 1-2.5 0l-6.294-3.634a2.5 2.5 0 0 1-1.25-2.165V8.366A2.5 2.5 0 0 1 4.456 6.2l6.294-3.634ZM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"></path></svg>`;

        footerContainer.addEventListener('click', (e) => {
            const eTargetIndexMetchContent = content.querySelectorAll(':scope>*')[Array.from(footerContainer.querySelectorAll(':scope>*')).indexOf(e.target)];
            if (!eTargetIndexMetchContent) return;
            // sound
            audioSource.playSoundEffect('click3');
            // color
            footerContainer.querySelectorAll('*>*>svg').forEach(element => {
                element.setAttribute('fill', 'var(--color-high-light-darkness-max)');
            });
            e.target.querySelector('svg').setAttribute('fill', 'var(--color-high-light)');

            // interact
            content.querySelectorAll(':scope>*').forEach(element => {
                element.style = '';
            });
            eTargetIndexMetchContent.style.display = 'flex';
        });

        footerContainer.appendChild(selectMarket);
        footerContainer.appendChild(selectSettings);
        return {
            footerContainer: footerContainer,
            selectSettings: selectSettings,
            selectMarket: selectMarket
        }
    }
    return {
        render: render
    }
})();

export default appUtils;