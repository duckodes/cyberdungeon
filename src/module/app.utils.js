import language from "./language.js";
import languageType from "./language.type.js";

import auth from "./auth.js";
import authData from "./auth.data.js";
import authSign from "./auth.sign.js";

import audioSource from "./audio.source.js";
import cssUtils from "./css.utils.js";
import items from "./items.js";
import math from "./math.js";
import timer from "./timer.js";

const appUtils = (() => {
    async function render(languageData, itemData) {
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

        const marketUtils = marketutils.render(app, languageData, itemData);
        const gameUtils = await gameutils.render(app, languageData, itemData);
        const settingsUtils = settingsutils.render(app, languageData);
        content.appendChild(marketUtils.market);
        content.appendChild(gameUtils.game);
        content.appendChild(settingsUtils.settings);

        const footerUtils = footerutils.render(content, gameUtils.game);
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
                    navUtils.navWalletBTC.textContent = textContent === undefined ? '0 ' + languageData.wallet.bitcoin : textContent + ' ' + languageData.wallet.bitcoin;
                },
                nc: (textContent) => {
                    navUtils.navWalletNC.textContent = textContent === undefined ? '0 N' : textContent + ' N';
                }
            }
        }
    }
    async function update(languageData) {
        document.title = languageData.appname;
        const itemData = await items.get(languageData);
        console.log(itemData);
        const appUtilsRender = await render(languageData, itemData);
        authData.init(appUtilsRender);
        await audioSource.render(appUtilsRender, languageData);
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
        navWalletBTC.textContent = '0 ' + languageData.wallet.bitcoin;
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
    function render(app, languageData, itemData) {
        const market = document.createElement('div');
        market.className = 'market';

        items.parse(itemData, (key, data) => {
            const itemsKey = document.createElement('div');
            itemsKey.className = 'items-key';
            itemsKey.textContent = languageData.itemskey[key];
            const itemsEntire = document.createElement('div');
            itemsEntire.className = 'items-entire';
            for (let i = 0; i < data.length; i++) {
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
                itemBuyButton.textContent = `${data[i].cost}${languageData.wallet.bitcoin} ${languageData.market.buy}`;
                itemBuyButton.addEventListener('click', async () => {
                    const popupUtils = popuputils.render(app);
                    popupUtils.popupPanel.classList.add('popup-panel-confirm');
                    const popupContent = document.createElement('div');
                    popupContent.className = 'popup-content';
                    let counter = 0;
                    items.parse(await items.getUserItems(itemData), (userkey, userData) => {
                        for (let j = 0; j < userData.length; j++) {
                            if (userData[j].name === data[i].name) {
                                counter++;
                            }
                        }
                    });
                    popupContent.innerHTML = `${languageData.market['purchase-info']}<span class="text-red">${data[i].name}${counter > 0 ? ` ( ${languageData.market.owned} x ${counter} ) ` : ''}</span>${languageData.market['question-mark']}`;
                    const confirmPurchase = document.createElement('button');
                    confirmPurchase.textContent = languageData.market.buy;
                    confirmPurchase.addEventListener('click', async () => {
                        const btcData = await authData.getBtc();

                        const popupUtilsCheck = popuputils.renderCheck(app);
                        popupUtilsCheck.popupUtilsCheck.popupPanel.innerHTML = `${btcData} - ${data[i].cost} = <span class="text-red">${btcData - data[i].cost} ${languageData.wallet.bitcoin}</span>`;
                        popupUtilsCheck.confirm.textContent = languageData.market.confirm;
                        popupUtilsCheck.confirm.addEventListener('click', async () => {
                            popupUtils.removePanel();
                            popupUtilsCheck.popupUtilsCheck.removePanel();

                            if (btcData < data[i].cost) {
                                const popupUtilsPurchaseFailed = popuputils.render(app);
                                popupUtilsPurchaseFailed.popupPanel.classList.add('popup-panel-purchase-failed');
                                popupUtilsPurchaseFailed.popupPanel.textContent = languageData.market['purchase-failed'];
                                setTimeout(() => {
                                    popupUtilsPurchaseFailed.removePanel();
                                }, 1000);
                                return;
                            }

                            const popupUtilsPurchaseSuccess = popuputils.render(app);
                            popupUtilsPurchaseSuccess.popupPanel.classList.add('popup-panel-purchase-success');
                            popupUtilsPurchaseSuccess.popupPanel.textContent = `${languageData.market['purchase-success'][0]} ${auth.auth.currentUser.displayName} ${languageData.market['purchase-success'][1]}`;
                            setTimeout(() => {
                                popupUtilsPurchaseSuccess.removePanel();
                            }, 1000);
                            authData.setBtc(btcData - data[i].cost);
                            await items.setUserItems(key, i);
                            console.log('user items:', await items.getUserItems(itemData));
                        });
                        popupUtilsCheck.cancel.textContent = languageData.market.cancel;
                        popupUtilsCheck.cancel.addEventListener('click', () => {
                            popupUtils.removePanel();
                            popupUtilsCheck.popupUtilsCheck.removePanel();
                        });
                        popupUtilsCheck.render();
                    });
                    popupUtils.popupPanel.appendChild(popupContent);
                    popupUtils.popupPanel.appendChild(confirmPurchase);
                });

                item.appendChild(itemTitle);
                item.appendChild(itemImage);
                item.appendChild(itemBuyButton);

                itemsEntire.appendChild(item);

                itemsKey.appendChild(itemsEntire);

                market.appendChild(itemsKey);
            }
        });
        return {
            market: market
        }
    }
    return {
        render: render
    }
})();

const gameutils = (() => {
    async function render(app, languageData, itemData) {
        const game = document.createElement('div');
        game.className = 'game';
        const openProjects = document.createElement('div');
        openProjects.className = 'open-projects';
        const equip = document.createElement('div');
        equip.className = 'equip';

        await updateEquip();

        async function updateEquip() {
            function update() {
                while (equip.firstChild) {
                    equip.removeChild(equip.firstChild);
                }
                setTimeout(async () => {
                    await updateEquip();
                });
            }
            items.parse(await items.getEquipData(itemData), (equipKey, equipData) => {
                const userEquipContainer = document.createElement('div');
                userEquipContainer.className = 'user-equip-container';
                const userEquipImage = document.createElement('div');
                userEquipImage.className = 'user-equip-img';
                userEquipImage.addEventListener('click', async () => {
                    const popupUtilsUserItems = popuputils.render(app);
                    popupUtilsUserItems.popupPanel.classList.add('popup-panel-user-items');
                    const unEquip = document.createElement('div');
                    unEquip.className = 'un-equip';
                    if (equipData.length === 0) {
                        unEquip.classList.add('border-red');
                    }
                    unEquip.innerHTML = '<div class="un-equip-bg"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 36 36"><path fill="var(--color-red)" d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18s18-8.059 18-18S27.941 0 18 0zm13 18c0 2.565-.753 4.95-2.035 6.965L11.036 7.036A12.916 12.916 0 0 1 18 5c7.18 0 13 5.821 13 13zM5 18c0-2.565.753-4.95 2.036-6.964l17.929 17.929A12.93 12.93 0 0 1 18 31c-7.179 0-13-5.82-13-13z"></path></svg></div>';
                    unEquip.addEventListener('click', () => {
                        items.setEquipData(Object.keys(itemData).indexOf(equipKey), -1);
                        update();
                        popupUtilsUserItems.removePanel();
                    });
                    popupUtilsUserItems.popupPanel.appendChild(unEquip);
                    items.parse(await items.getUserItems(itemData), (userkey, userData) => {
                        for (let i = 0; i < userData.length; i++) {
                            if (equipKey === userkey) {
                                const userItemsContainer = document.createElement('div');
                                userItemsContainer.className = 'user-items-container';
                                const userItemsImage = document.createElement('div');
                                userItemsImage.className = 'user-items-img';
                                for (let j = 0; j < equipData.length; j++) {
                                    if (userData[i].name === equipData[j].name) {
                                        userItemsImage.classList.add('border-red');
                                    }
                                }
                                userItemsImage.style.backgroundImage = `url(${userData[i].img})`;
                                let timer;
                                let isLongPress = false;
                                const longPressDuration = 200;
                                userItemsImage.addEventListener('pointerdown', () => {
                                    isLongPress = false;
                                    timer = setTimeout(async () => {
                                        isLongPress = true;
                                        const sellBtc = userData[i].cost * 0.7;
                                        const btcData = await authData.getBtc();

                                        const popupUtilsCheck = popuputils.renderCheck(app);
                                        popupUtilsCheck.popupUtilsCheck.popupPanel.innerHTML = '<div>' + languageData.game.equip['sell-question'][0] + '<span class="text-red">' + userData[i].name + '</span>' + languageData.game.equip['sell-question'][1] + languageData.game.equip['question-mark'] + '</div>' + `${btcData} + ${math.truncateDecimal(sellBtc, 3)} = <span class="text-red">${Math.round(btcData + sellBtc)} ${languageData.wallet.bitcoin}</span>`;
                                        popupUtilsCheck.confirm.textContent = languageData.game.equip['sell-confirm'];
                                        popupUtilsCheck.confirm.addEventListener('click', async () => {
                                            popupUtilsUserItems.removePanel();
                                            popupUtilsCheck.popupUtilsCheck.removePanel();
                                            items.parse(itemData, async (key, data) => {
                                                for (let j = 0; j < data.length; j++) {
                                                    if (userData[i].name === data[j].name) {
                                                        await items.removeUserItems(key, i);

                                                        // Remove unowned equipped items
                                                        let itemDataNames = [];
                                                        items.parse(await items.getUserItems(itemData), (newUserkey, newUserData) => {
                                                            for (let f = 0; f < newUserData.length; f++) {
                                                                itemDataNames.push(newUserData[f].name);
                                                            }
                                                        });
                                                        // userData[i].name: sell item
                                                        authData.setBtc(Math.round(await authData.getBtc() + sellBtc));
                                                        for (let f = 0; f < equipData.length; f++) {
                                                            console.log(itemDataNames, userData[i].name, equipData[f].name);
                                                            if (!itemDataNames.includes(userData[i].name) && userData[i].name === equipData[f].name) {
                                                                await items.setEquipData(Object.keys(itemData).indexOf(key), -1);
                                                                update();
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                        popupUtilsCheck.cancel.textContent = languageData.game.equip['sell-cancel'];
                                        popupUtilsCheck.cancel.addEventListener('click', async () => {
                                            popupUtilsCheck.popupUtilsCheck.removePanel();
                                        });
                                        popupUtilsCheck.render();
                                    }, longPressDuration);
                                });
                                userItemsImage.addEventListener('pointerup', () => {
                                    clearTimeout(timer);
                                    if (isLongPress) return;
                                    items.parse(itemData, async (key, data) => {
                                        for (let j = 0; j < data.length; j++) {
                                            if (data[j].name === userData[i].name) {
                                                items.setEquipData(Object.keys(itemData).indexOf(key), j);
                                                update();
                                                popupUtilsUserItems.removePanel();
                                            }
                                        }
                                    });
                                });
                                userItemsImage.addEventListener('pointercancel', () => {
                                    clearTimeout(timer);
                                });
                                const userItemsName = document.createElement('div');
                                userItemsName.className = 'user-items-name';
                                userItemsName.textContent = userData[i].name;
                                for (let j = 0; j < equipData.length; j++) {
                                    if (userData[i].name === equipData[j].name) {
                                        userItemsName.classList.add('text-red');
                                    }
                                }

                                userItemsContainer.appendChild(userItemsName);
                                userItemsContainer.appendChild(userItemsImage);

                                popupUtilsUserItems.popupPanel.appendChild(userItemsContainer);
                            }
                        }
                    });
                });
                const userEquipType = document.createElement('div');
                userEquipType.className = 'user-equip-type';
                userEquipType.textContent = languageData.itemskey[equipKey];
                for (let i = 0; i < equipData.length; i++) {
                    userEquipImage.style.backgroundImage = `url(${equipData[i].img})`;
                    userEquipType.textContent = equipData[i].name;
                }

                userEquipContainer.appendChild(userEquipType);
                userEquipContainer.appendChild(userEquipImage);

                equip.appendChild(userEquipContainer);
            });
        }

        const connectDungeon = document.createElement('div');
        connectDungeon.className = 'connect-dungeon';

        game.appendChild(connectDungeon);
        game.appendChild(equip);

        game.appendChild(openProjects);

        for (let i = 0; i < game.children.length - 1; i++) {
            const select = document.createElement('div');
            select.className = 'select';
            select.textContent = languageData.game['open-project'][game.children[i].className];
            select.addEventListener('click', () => {
                game.children[i].style.display = 'flex';
                openProjects.style.display = 'none';
            });
            switch (game.children[i].className) {
                case 'connect-dungeon':
                    select.addEventListener('click', async () => {
                        const progressUtils = progressutils.render(app);
                        await progressUtils.set(0, languageData.progress.loading + ' ', 300, '.');
                        await progressUtils.set(20, languageData.progress['port-load'] + ' ', 2000, '.');
                        await progressUtils.set(50, languageData.progress['dungeon-crack'] + ' ', 2000);
                        await progressUtils.set(100, null, 100, '.');
                    });
                    break;
                default:
                    break;
            }
            openProjects.appendChild(select);
        }
        return {
            game: game,
            openProjects: openProjects
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
    /**
    * @param {HTMLDivElement} content
    * @param {HTMLDivElement} game
    */
    function render(content, game) {
        const footerContainer = document.createElement('div');
        footerContainer.className = 'footer-container';
        const selectMarket = document.createElement('div');
        selectMarket.className = 'select-market';
        selectMarket.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16" fill="var(--color-high-light-darkness-max)"><path fill-rule="evenodd" d="M11.5 14c2.49 0 4.5-1 4.5-2.5V2c0-1-2-2-4.5-2S7 1 7 2v3.5c1.17.49 2.17 1.31 2.88 2.35c.49.096 1.03.149 1.62.149c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564q-.357 0-.68-.027q.12.495.16 1.01q.253.014.52.014c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .236-.149.586-.791.932c-.632.34-1.58.568-2.71.568q-.345 0-.668-.028a6.4 6.4 0 0 1-.309.974q.472.053.976.053zm2.7-7.56c.615-.336.802-.701.802-.936v-1.38q-.155.106-.323.198c-.778.425-1.87.686-3.18.686s-2.4-.261-3.18-.686a4 4 0 0 1-.323-.198v1.38c0 .235.187.6.802.935c.596.325 1.51.564 2.7.564s2.1-.239 2.7-.564zM8 2.5c0-.288.125-.565.358-.734c.127-.092.265-.184.374-.234c.273-.126 1.64-.533 2.77-.533s2.11.227 2.77.533c.124.057.261.146.382.234c.231.167.35.442.35.727v.006c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564s-2.1-.24-2.7-.564C8.187 3.1 8 2.734 8 2.5" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M9 11.5C9 13.99 6.99 16 4.5 16S0 13.99 0 11.5S2.01 7 4.5 7S9 9.01 9 11.5m-1 0C8 13.43 6.43 15 4.5 15S1 13.43 1 11.5S2.57 8 4.5 8S8 9.57 8 11.5" clip-rule="evenodd"></path></svg>';
        const selectGame = document.createElement('div');
        selectGame.className = 'select-game';
        selectGame.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="var(--color-high-light-darkness-max)"><path stroke-linecap="round" stroke-linejoin="round" d="M36.9 24L24 36.9L11.1 24l8.6-8.6l-4.3-4.3L2.5 24L24 45.5L45.5 24L24 2.5l-4.3 4.3L36.9 24z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m24 19.757l4.313 4.313L24 28.384l-4.313-4.314L24 19.757z"></path></svg>';
        selectGame.addEventListener('click', () => {
            game.querySelectorAll(':scope>*').forEach(element => {
                element.style.display = '';
            });
        });
        const selectSettings = document.createElement('div');
        selectSettings.className = 'select-settings';
        selectSettings.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="var(--color-high-light)"><path d="M10.75 2.567a2.5 2.5 0 0 1 2.5 0L19.544 6.2a2.5 2.5 0 0 1 1.25 2.165v7.268a2.5 2.5 0 0 1-1.25 2.165l-6.294 3.634a2.5 2.5 0 0 1-2.5 0l-6.294-3.634a2.5 2.5 0 0 1-1.25-2.165V8.366A2.5 2.5 0 0 1 4.456 6.2l6.294-3.634ZM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"></path></svg>';

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
        footerContainer.appendChild(selectGame);
        footerContainer.appendChild(selectSettings);
        return {
            footerContainer: footerContainer
        }
    }
    return {
        render: render
    }
})();

const popuputils = (() => {
    function render(app) {
        const popupBase = document.createElement('div');
        popupBase.className = 'popup-base';
        popupBase.classList.add('fade-in');
        popupBase.addEventListener('animationend', () => {
            popupBase.classList.remove('fade-in');
        });
        const popupPanel = document.createElement('div');
        popupPanel.className = 'popup-panel';
        popupPanel.classList.add('slide-in');
        popupPanel.addEventListener('animationend', () => {
            popupPanel.classList.remove('slide-in');
        });
        popupBase.addEventListener('click', (e) => {
            if (popupPanel.contains(e.target)) return;
            removePanel();
        });
        function removePanel() {
            popupPanel.classList.add('slide-out');
            popupPanel.addEventListener('animationend', () => {
                popupBase.remove();
            });
            popupBase.classList.add('fade-out');
            popupBase.addEventListener('animationend', () => {
                popupBase.classList.remove('fade-out');
            });
        }

        popupBase.appendChild(popupPanel);

        app.appendChild(popupBase);
        return {
            popupPanel: popupPanel,
            removePanel: removePanel
        }
    }
    function renderCheck(app) {
        const popupUtilsCheck = render(app);
        popupUtilsCheck.popupPanel.classList.add('popup-panel-confirm-check');
        const confirmCancel = document.createElement('div');
        confirmCancel.className = 'confirm-cancel';
        const confirm = document.createElement('button');
        const cancel = document.createElement('button');

        confirmCancel.appendChild(confirm);
        confirmCancel.appendChild(cancel);
        return {
            popupUtilsCheck: popupUtilsCheck,
            confirmCancel: confirmCancel,
            confirm: confirm,
            cancel: cancel,
            render: () => {
                popupUtilsCheck.popupPanel.appendChild(confirmCancel);
            }
        }
    }
    return {
        render: render,
        renderCheck: renderCheck
    }
})();

const progressutils = (() => {
    function render(app) {
        const progress = document.createElement('div');
        progress.className = 'progress';
        const progressBar = document.createElement('progress');
        progressBar.className = 'progress-bar';
        progressBar.max = '100';
        progressBar.value = '0';
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        const progressState = {
            saveText: '',
            dotCount: 0,
            increasing: true,
            loadText: '',
            animationId: null
        };
        const dotAnimation = () => {
            if (!progressState.loadText) return;
            progressState.animationId = setTimeout(() => {
                if (!progressState.loadText) return;

                progressState.dotCount += progressState.increasing ? 1 : -1;
                if (progressState.dotCount === 3) progressState.increasing = false;
                if (progressState.dotCount === 1) progressState.increasing = true;

                progressText.textContent = progressState.saveText + progressState.loadText.repeat(progressState.dotCount);
                dotAnimation();
            }, 200);
        };

        progress.appendChild(progressBar);
        progress.appendChild(progressText);

        app.appendChild(progress);

        return {
            set: async (value, text = '', delay = 100, loadText = '') => {
                progressBar.value = value;
                progressState.loadText = loadText;

                if (text) progressState.saveText = text;
                progressText.textContent = progressState.saveText + (loadText ? loadText.repeat(progressState.dotCount) : '');

                if (loadText) {
                    clearTimeout(progressState.animationId);
                    dotAnimation();
                } else {
                    progressState.dotCount = 0;
                    clearTimeout(progressState.animationId);
                }

                await timer.delay(delay);
                if (value < 100) return;
                await timer.delay(2000);
                progressBar.classList.add('fade-out-noise');
                progressBar.addEventListener('animationend', () => {
                    progressText.classList.add('fade-out');
                    progressText.addEventListener('animationend', () => {
                        progress.remove();
                    });
                });
            }
        }
    }
    return {
        render: render
    }
})();

export default appUtils;