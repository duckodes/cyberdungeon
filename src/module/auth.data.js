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
    const treasureChestBtc = 'dungeon/treasure/btc';
    function setDungeonTreasureBtc(data) {
        authData.setData(treasureChestBtc, data);
    }
    async function getDungeonTreasureBtc() {
        return await getData(treasureChestBtc);
    }

    return {
        init: init,
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
        setDungeonTreasureBtc: setDungeonTreasureBtc,
        getDungeonTreasureBtc: getDungeonTreasureBtc
    }
})();

export default authData;