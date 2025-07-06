import { ref, update, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import auth from "./auth.js";

const authData = (() => {
    function init(appUtilsRender) {
        const dataRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}`);
        const updateData = (field, val) => {
            update(dataRef, { [field]: val });
        };

        onValue(dataRef, (snapshot) => {
            appUtilsRender.update.level(snapshot.val()?.level);
            appUtilsRender.update.name(snapshot.val()?.name);
            appUtilsRender.update.btc(snapshot.val()?.btc);
            appUtilsRender.update.nc(snapshot.val()?.nc);
            !snapshot.val()?.level && updateData('level', 0);
            !snapshot.val()?.name && updateData('name', auth.auth.currentUser.displayName);
            !snapshot.val()?.btc && updateData('btc', 0);
            !snapshot.val()?.nc && updateData('nc', 0);
        });
    }
    async function purchaseItem({ idToken, itemType, itemId, quantity }) {
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
    async function sellItems({ idToken, itemType, itemId }) {
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

            console.log('success: ', result.message);
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Connect Error：', error.message);
            return { success: false, message: error.message };
        }
    }
    function setData(key, data) {
        const dataRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/${key}`);
        set(dataRef, data);
    }
    async function getData(key) {
        const dataRef = ref(auth.database, `cyberdungeon/user/${auth.auth.currentUser.uid}/${key}`);
        const snapshot = await get(dataRef);
        return snapshot.val();
    }

    const btcKey = 'btc';
    function setBtc(data) {
        authData.setData(btcKey, data);
    }
    async function getBtc() {
        return await getData(btcKey);
    }
    async function modifyBtc(data) {
        const btcData = await getData(btcKey) || 0;
        authData.setData(btcKey, data + btcData);
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
    function setDungeonLeaveBtc(data) {
        authData.setData(leaveBtc, data);
    }
    async function getDungeonLeaveBtc() {
        return await getData(leaveBtc);
    }

    return {
        init: init,
        purchaseItem: purchaseItem,
        sellItems: sellItems,
        setData: setData,
        getData: getData,
        setBtc: setBtc,
        getBtc: getBtc,
        modifyBtc: modifyBtc,
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
        setDungeonLeaveBtc: setDungeonLeaveBtc,
        getDungeonLeaveBtc: getDungeonLeaveBtc
    }
})();

export default authData;