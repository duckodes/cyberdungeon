import { ref, update, onValue, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const authData = (() => {
    let Database;
    function init(database, user, apputilsRender) {
        Database = database;
        const dataRef = ref(database, `cyberdungeon/user/${user.uid}`);
        const updateData = (field, val) => {
            update(dataRef, { [field]: val });
        };

        onValue(dataRef, (snapshot) => {
            apputilsRender.update.level(snapshot.val()?.level);
            apputilsRender.update.name(snapshot.val()?.name);
            apputilsRender.update.btc(snapshot.val()?.btc);
            apputilsRender.update.nc(snapshot.val()?.nc);
            !snapshot.val()?.level && updateData('level', 0);
            !snapshot.val()?.name && updateData('name', user.displayName);
            !snapshot.val()?.btc && updateData('btc', 0);
            !snapshot.val()?.nc && updateData('nc', 0);
        });
    }
    function setData(user, key, data) {
        const dataRef = ref(Database, `cyberdungeon/user/${user.uid}/${key}`);
        set(dataRef, data);
    }

    return {
        init,
        setData
    }
})();

export default authData;