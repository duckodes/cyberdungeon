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
    const probability = 'dungeon/probability';
    function setDungeonProbability(data) {
        authData.setData(probability, data);
    }
    async function getDungeonProbability() {
        return await getData(probability);
    }

    return {
        init: init,
        setData: setData,
        getData: getData,
        setBtc: setBtc,
        getBtc: getBtc,
        setDungeon: setDungeon,
        getDungeon: getDungeon,
        setDungeonArea: setDungeonArea,
        getDungeonArea: getDungeonArea,
        setDungeonProbability: setDungeonProbability,
        getDungeonProbability: getDungeonProbability
    }
})();

export default authData;