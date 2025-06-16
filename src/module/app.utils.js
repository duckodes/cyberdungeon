import language from "./language.js";
import languageType from "./language.type.js";

import auth from "./auth.js";
import authData from "./auth.data.js";
import authSign from "./auth.sign.js";

import popup from "./popup.js";
import progress from "./progress.js";
import audioSource from "./audio.source.js";
import cssUtils from "./css.utils.js";
import items from "./items.js";
import math from "./math.js";
import timer from "./timer.js";
import scroller from "./scroller.js";
import press from "./press.js";
import languageJson from "../lan/language.json.js";

const appUtils = (() => {
    /**
    * @param {languageJson} languageData
    * @param {Object} itemData
    */
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
        const gameUtils = await gameutils.render(app, content, languageData, itemData);
        const settingsUtils = settingsutils.render(app, languageData);
        content.appendChild(marketUtils.market);
        content.appendChild(gameUtils.game);
        content.appendChild(settingsUtils.settings);

        const footerUtils = footerutils.render(app, content, gameUtils.game);
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
    /**
    * @param {languageJson} languageData
    */
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
    /**
    * @param {languageJson} languageData
    */
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
    /**
    * @param {HTMLDivElement} app
    * @param {languageJson} languageData
    * @param {Object} itemData
    */
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
                    const popupConfirm = popup.render(app);
                    popupConfirm.popupPanel.classList.add('popup-panel-confirm');
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

                        const popupCheck = popup.renderCheck(app);
                        popupCheck.popupPanel.innerHTML = `${btcData} - ${data[i].cost} = <span class="text-red">${btcData - data[i].cost} ${languageData.wallet.bitcoin}</span>`;
                        popupCheck.confirm.textContent = languageData.market.confirm;
                        popupCheck.confirm.addEventListener('click', async () => {
                            popupConfirm.removePanel();
                            popupCheck.removePanel();

                            if (btcData < data[i].cost) {
                                const popupPurchaseFailed = popup.render(app);
                                popupPurchaseFailed.popupPanel.classList.add('popup-panel-purchase-failed');
                                popupPurchaseFailed.popupPanel.textContent = languageData.market['purchase-failed'];
                                await timer.delay(1000);
                                popupPurchaseFailed.removePanel();
                                return;
                            }

                            const popupPurchaseSuccess = popup.render(app);
                            popupPurchaseSuccess.popupPanel.classList.add('popup-panel-purchase-success');
                            popupPurchaseSuccess.popupPanel.textContent = `${languageData.market['purchase-success'][0]} ${auth.auth.currentUser.displayName} ${languageData.market['purchase-success'][1]}`;
                            await timer.delay(1000);
                            popupPurchaseSuccess.removePanel();
                            authData.setBtc(btcData - data[i].cost);
                            await items.setUserItems(key, i);
                            console.log('user items:', await items.getUserItems(itemData));
                        });
                        popupCheck.cancel.textContent = languageData.market.cancel;
                        popupCheck.cancel.addEventListener('click', () => {
                            popupConfirm.removePanel();
                            popupCheck.removePanel();
                        });
                        popupCheck.render();
                    });
                    popupConfirm.popupPanel.appendChild(popupContent);
                    popupConfirm.popupPanel.appendChild(confirmPurchase);
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
    /**
    * @param {HTMLDivElement} app
    * @param {HTMLDivElement} content
    * @param {languageJson} languageData
    * @param {Object} itemData
    */
    async function render(app, content, languageData, itemData) {
        const game = document.createElement('div');
        game.className = 'game';
        const openProjects = document.createElement('div');
        openProjects.className = 'open-projects';

        const dungeon = document.createElement('div');
        dungeon.className = 'dungeon';

        const equip = document.createElement('div');
        equip.className = 'equip';
        await equiputils.render(app, content, equip, languageData, itemData);

        game.appendChild(dungeon);
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
                case 'dungeon':
                    select.addEventListener('click', async () => {
                        remove.child(dungeon);
                        const progressDungeon = progress.render(app);
                        await progressDungeon.set({ value: 0, text: languageData.progress.loading + ' ', delay: math.getRandomIntIncludeMax(0, 300), loadText: '.' });
                        await progressDungeon.set({ value: 20, text: languageData.progress['port-load'] + ' ', delay: math.getRandomIntIncludeMax(500, 700), loadText: '.' });
                        await progressDungeon.set({ value: 50, text: languageData.progress['dungeon-crack'] + ' ', delay: math.getRandomIntIncludeMax(500, 700) });
                        await progressDungeon.set({ value: 100, text: null, delay: 100, loadText: '.', endDelay: 500 });
                        dungeonutils.render(dungeon, languageData);
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

const dungeonutils = (() => {
    /**
    * @param {HTMLDivElement} dungeon
    * @param {languageJson} languageData
    */
    function render(dungeon, languageData) {
        const dungeonArea = document.createElement('div');
        dungeonArea.className = 'dungeon-area';
        dungeonArea.textContent = languageData.dungeon.area[math.getRandomIntIncludeMax(0, 1)];

        dungeon.appendChild(dungeonArea);
    }
    return {
        render: render
    }
})();

const equiputils = (() => {
    /**
    * @param {HTMLDivElement} app
    * @param {HTMLDivElement} content
    * @param {HTMLDivElement} equip
    * @param {languageJson} languageData
    * @param {Object} itemData
    */
    async function render(app, content, equip, languageData, itemData) {
        function update() {
            remove.child(equip);
            setTimeout(async () => {
                await render(app, content, equip, languageData, itemData);
            });
        }
        items.parse(await items.getEquipData(itemData), (equipKey, equipData) => {
            const userEquipContainer = document.createElement('div');
            userEquipContainer.className = 'user-equip-container';
            const userEquipImage = document.createElement('div');
            userEquipImage.className = 'user-equip-img';
            userEquipImage.addEventListener('click', async () => {
                const popupUserItems = popup.render(app);
                popupUserItems.popupPanel.classList.add('popup-panel-user-items');
                const unEquip = document.createElement('div');
                unEquip.className = 'un-equip';
                if (equipData.length === 0) {
                    unEquip.classList.add('border-red');
                }
                unEquip.innerHTML = '<div class="un-equip-bg"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 36 36"><path fill="var(--color-red)" d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18s18-8.059 18-18S27.941 0 18 0zm13 18c0 2.565-.753 4.95-2.035 6.965L11.036 7.036A12.916 12.916 0 0 1 18 5c7.18 0 13 5.821 13 13zM5 18c0-2.565.753-4.95 2.036-6.964l17.929 17.929A12.93 12.93 0 0 1 18 31c-7.179 0-13-5.82-13-13z"></path></svg></div>';
                unEquip.addEventListener('click', async () => {
                    items.setEquipData(Object.keys(itemData).indexOf(equipKey), -1);
                    scroller.savePosition(content);
                    update();
                    popupUserItems.removePanel();
                    scroller.resetPosition(content);
                });
                popupUserItems.popupPanel.appendChild(unEquip);
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
                            const shortLongPress = press.InitShortLongPress(userItemsImage);
                            shortLongPress.shortPress(() => {
                                items.parse(itemData, async (key, data) => {
                                    for (let j = 0; j < data.length; j++) {
                                        if (data[j].name === userData[i].name) {
                                            items.setEquipData(Object.keys(itemData).indexOf(key), j);
                                            scroller.savePosition(content);
                                            update();
                                            popupUserItems.removePanel();
                                            scroller.resetPosition(content);
                                        }
                                    }
                                });
                            });
                            shortLongPress.longPress(async () => {
                                const sellBtc = userData[i].cost * 0.7;
                                const btcData = await authData.getBtc();

                                const popupCheck = popup.renderCheck(app);
                                popupCheck.popupPanel.innerHTML = '<div>' + languageData.game.equip['sell-question'][0] + '<span class="text-red">' + userData[i].name + '</span>' + languageData.game.equip['sell-question'][1] + languageData.game.equip['question-mark'] + '</div>' + `${btcData} + ${math.truncateDecimal(sellBtc, 3)} = <span class="text-red">${Math.round(btcData + sellBtc)} ${languageData.wallet.bitcoin}</span>`;
                                popupCheck.confirm.textContent = languageData.game.equip['sell-confirm'];
                                popupCheck.confirm.addEventListener('click', async () => {
                                    popupUserItems.removePanel();
                                    popupCheck.removePanel();
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
                                                        scroller.savePosition(content);
                                                        update();
                                                        scroller.resetPosition(content);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });
                                popupCheck.cancel.textContent = languageData.game.equip['sell-cancel'];
                                popupCheck.cancel.addEventListener('click', async () => {
                                    popupCheck.removePanel();
                                });
                                popupCheck.render();
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

                            popupUserItems.popupPanel.appendChild(userItemsContainer);
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
    return {
        render: render
    }
})();

const settingsutils = (() => {
    /**
    * @param {HTMLDivElement} app
    * @param {languageJson} languageData
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
    * @param {HTMLDivElement} app
    * @param {HTMLDivElement} content
    * @param {HTMLDivElement} game
    */
    function render(app, content, game) {
        const footerContainer = document.createElement('div');
        footerContainer.className = 'footer-container';
        const selectMarket = document.createElement('div');
        selectMarket.className = 'select-market';
        selectMarket.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16" fill="var(--color-high-light-darkness-max)"><path fill-rule="evenodd" d="M11.5 14c2.49 0 4.5-1 4.5-2.5V2c0-1-2-2-4.5-2S7 1 7 2v3.5c1.17.49 2.17 1.31 2.88 2.35c.49.096 1.03.149 1.62.149c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564q-.357 0-.68-.027q.12.495.16 1.01q.253.014.52.014c1.31 0 2.4-.261 3.18-.686a4 4 0 0 0 .323-.198v1.38c0 .236-.149.586-.791.932c-.632.34-1.58.568-2.71.568q-.345 0-.668-.028a6.4 6.4 0 0 1-.309.974q.472.053.976.053zm2.7-7.56c.615-.336.802-.701.802-.936v-1.38q-.155.106-.323.198c-.778.425-1.87.686-3.18.686s-2.4-.261-3.18-.686a4 4 0 0 1-.323-.198v1.38c0 .235.187.6.802.935c.596.325 1.51.564 2.7.564s2.1-.239 2.7-.564zM8 2.5c0-.288.125-.565.358-.734c.127-.092.265-.184.374-.234c.273-.126 1.64-.533 2.77-.533s2.11.227 2.77.533c.124.057.261.146.382.234c.231.167.35.442.35.727v.006c0 .235-.187.6-.802.936c-.596.325-1.51.564-2.7.564s-2.1-.24-2.7-.564C8.187 3.1 8 2.734 8 2.5" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M9 11.5C9 13.99 6.99 16 4.5 16S0 13.99 0 11.5S2.01 7 4.5 7S9 9.01 9 11.5m-1 0C8 13.43 6.43 15 4.5 15S1 13.43 1 11.5S2.57 8 4.5 8S8 9.57 8 11.5" clip-rule="evenodd"></path></svg>';
        const selectGame = document.createElement('div');
        selectGame.className = 'select-game';
        const selectGameSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="var(--color-high-light-darkness-max)"><path stroke-linecap="round" stroke-linejoin="round" d="M36.9 24L24 36.9L11.1 24l8.6-8.6l-4.3-4.3L2.5 24L24 45.5L45.5 24L24 2.5l-4.3 4.3L36.9 24z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m24 19.757l4.313 4.313L24 28.384l-4.313-4.314L24 19.757z"></path></svg>';
        const selectGameLightSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="var(--color-high-light)"><path stroke-linecap="round" stroke-linejoin="round" d="M36.9 24L24 36.9L11.1 24l8.6-8.6l-4.3-4.3L2.5 24L24 45.5L45.5 24L24 2.5l-4.3 4.3L36.9 24z"></path><path stroke-linecap="round" stroke-linejoin="round" d="m24 19.757l4.313 4.313L24 28.384l-4.313-4.314L24 19.757z"></path></svg>';
        const selectGameBackLightSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="var(--color-high-light)"><path d="M22 12A10 10 0 0 0 12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10m-2 0a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8m-6-5l-5 5l5 5V7Z"></path></svg>';
        selectGame.innerHTML = selectGameSVG;
        selectGame.addEventListener('click', async () => {
            if (game.style.display === '') return;
            if (game.querySelector('.open-projects').style.display === '') return;
            const progressDungeon = progress.render(app);
            await progressDungeon.set({ value: 0, delay: 50, loadText: '.' });
            await progressDungeon.set({ value: 50, delay: 500, loadText: '.' });
            selectGame.innerHTML = selectGameLightSVG;
            await progressDungeon.set({ value: 100, delay: 50, loadText: '.', endDelay: 700 });
            game.querySelectorAll(':scope>*').forEach(async element => {
                element.style.display = '';
            });
        });
        game.querySelector('.open-projects').childNodes.forEach(element => {
            element.addEventListener('click', () => {
                selectGame.innerHTML = selectGameBackLightSVG;
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

const remove = (() => {
    function child(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    return {
        child: child
    }
})();

export default appUtils;