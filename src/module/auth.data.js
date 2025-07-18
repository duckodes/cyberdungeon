import { ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import auth from "./auth.js";
import authSign from "./auth.sign.js";

const authData = (() => {
    function init(appUtilsRender) {
        // btc auto change
        const btcRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/btc`);
        onValue(btcRef, (snapshot) => {
            appUtilsRender.update.btc(snapshot.val());
        });

        // nc auto change
        const ncRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/nc`);
        onValue(ncRef, (snapshot) => {
            appUtilsRender.update.nc(snapshot.val());
        });

        // level auto change
        const levelRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/level`);
        onValue(levelRef, (snapshot) => {
            appUtilsRender.update.level(snapshot.val());
            !snapshot.val() && set(levelRef, 0);
        });

        // name auto change
        const nameRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/name`);
        onValue(nameRef, (snapshot) => {
            appUtilsRender.update.name(snapshot.val());
            !snapshot.val() && set(nameRef, auth.auth.currentUser.displayName);
        });
    }
    //#region  API
    async function purchaseItem({ itemType, itemId, quantity }) {
        const idToken = await authSign.idToken();
        try {
            const response = await fetch('https://buyitems-uqj7m73rbq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemType,
                    itemId,
                    quantity
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('request failed', result.message);
                return { success: false, message: result.message };
            }

            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    async function sellItems({ itemType, itemId }, callback) {
        const idToken = await authSign.idToken();
        try {
            const response = await fetch('https://sellitems-uqj7m73rbq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemType,
                    itemId
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('request failed', result.message);
                return { success: false, message: result.message };
            }
            if (callback) {
                callback();
            }
            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    async function openDungeonTreasure({ typeIndex }) {
        const idToken = await authSign.idToken();
        try {
            const response = await fetch('https://opendungeontreasure-uqj7m73rbq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    typeIndex
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('request failed', result.message);
                return { success: false, message: result.message };
            }
            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    async function initLeaveDungeon() {
        const idToken = await authSign.idToken();
        try {
            const response = await fetch('https://initleavedungeon-uqj7m73rbq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('request failed', result.message);
                return { success: false, message: result.message };
            }
            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    async function leaveDungeon() {
        const idToken = await authSign.idToken();
        try {
            const response = await fetch('https://leavedungeon-uqj7m73rbq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('request failed', result.message);
                return { success: false, message: result.message };
            }
            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    //#endregion

    function setData(key, data) {
        const dataRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/${key}`);
        set(dataRef, data);
    }
    async function getData(key) {
        const dataRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/${key}`);
        const snapshot = await get(dataRef);
        return snapshot.val();
    }

    async function getItems(itemData) {
        const categoryMap = {};
        const promises = [];

        Object.entries(itemData).forEach(([category, items]) => {
            categoryMap[category] = [];

            items.forEach(({ id, name }) => {
                const itemRef = ref(auth.database, `cyberdungeon/items/${category}/${id}`);
                const promise = get(itemRef)
                    .then(snapshot => {
                        const data = snapshot.val();
                        if (data) {
                            // console.log(`success ${category}/${id}:`, data);
                            categoryMap[category].push({ id, name, ...data });
                        }
                    })
                    .catch(error => {
                        // console.error(`failed ${category}/${id}:`, error);
                    });

                promises.push(promise);
            });
        });

        await Promise.all(promises);
        return categoryMap;
    }
    async function getStoreItems(itemData) {
        const categoryMap = {};
        const promises = [];

        Object.entries(itemData).forEach(([category, items]) => {
            categoryMap[category] = [];

            items.forEach(({ id, name }) => {
                const itemRef = ref(auth.database, `cyberdungeon/store/${category}/${id}`);
                const promise = get(itemRef)
                    .then(snapshot => {
                        const data = snapshot.val();
                        if (data) {
                            // console.log(`success ${category}/${id}:`, data);
                            categoryMap[category].push({ id, name, ...data });
                        }
                    })
                    .catch(error => {
                        // console.error(`failed ${category}/${id}:`, error);
                    });

                promises.push(promise);
            });
        });

        await Promise.all(promises);
        return categoryMap;
    }

    const btcKey = 'btc';
    async function getBtc() {
        return await getData(btcKey);
    }

    const isDungeon = 'dungeon/start';
    function setDungeon(data) {
        authData.setData(isDungeon, data);
    }
    async function getDungeon() {
        return await getData(isDungeon);
    }
    const dungeonArea = 'dungeon/area';
    function setDungeonArea(data) {
        authData.setData(dungeonArea, data);
    }
    async function getDungeonArea() {
        return await getData(dungeonArea);
    }
    const safe = 'dungeon/safe';
    function setDungeonSafe(data) {
        authData.setData(safe, data);
    }
    async function getDungeonSafe() {
        return await getData(safe);
    }
    const dungeonSelector = 'dungeon/selector';
    async function setDungeonSelectorForce(data) {
        authData.setData(dungeonSelector, data);
    }
    async function setDungeonSelector(data) {
        const currentSelector = await authData.getData(dungeonSelector) || [];
        if (currentSelector.length > 3) return;
        authData.setData(dungeonSelector, [...currentSelector, data]);
    }
    async function getDungeonSelector() {
        return await getData(dungeonSelector);
    }
    const treasure = 'dungeon/treasure';
    function removeTreasure() {
        authData.setData(treasure, null);
    }
    const treasureType = 'dungeon/treasure/type';
    function setDungeonTreasureType(data) {
        authData.setData(treasureType, data);
    }
    async function getDungeonTreasureType() {
        return await getData(treasureType);
    }
    const treasureChestBtc = 'dungeon/treasure/btc';
    function setDungeonTreasureBtc(data) {
        authData.setData(treasureChestBtc, data);
    }
    async function getDungeonTreasureBtc() {
        return await getData(treasureChestBtc);
    }
    const leaveBtc = 'dungeon/leave/btc';
    async function getDungeonLeaveBtc() {
        return await getData(leaveBtc);
    }

    return {
        init: init,
        purchaseItem: purchaseItem,
        sellItems: sellItems,
        openDungeonTreasure: openDungeonTreasure,
        initLeaveDungeon: initLeaveDungeon,
        leaveDungeon: leaveDungeon,

        getItems: getItems,
        getStoreItems: getStoreItems,
        setData: setData,
        getData: getData,

        getBtc: getBtc,
        setDungeon: setDungeon,
        getDungeon: getDungeon,
        setDungeonArea: setDungeonArea,
        getDungeonArea: getDungeonArea,
        setDungeonSafe: setDungeonSafe,
        getDungeonSafe: getDungeonSafe,
        setDungeonSelectorForce: setDungeonSelectorForce,
        setDungeonSelector: setDungeonSelector,
        getDungeonSelector: getDungeonSelector,
        removeTreasure: removeTreasure,
        setDungeonTreasureType: setDungeonTreasureType,
        getDungeonTreasureType: getDungeonTreasureType,
        setDungeonTreasureBtc: setDungeonTreasureBtc,
        getDungeonTreasureBtc: getDungeonTreasureBtc,
        getDungeonLeaveBtc: getDungeonLeaveBtc
    }
})();

export default authData;