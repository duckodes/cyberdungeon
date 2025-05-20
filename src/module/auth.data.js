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
            !snapshot.val()?.name && updateData('name', user.displayName);
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

    return {
        init,
        setData,
        getData
    }
})();

export default authData;