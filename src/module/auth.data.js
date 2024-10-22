import { ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import apputils from "./apputils.js";

const authData = (() => {
    function init(auth, database, user, languageData) {
        const dataRef = ref(database, `cyberdungeon/user/${user.uid}`);
        const updateData = (field, val) => {
            update(dataRef, { [field]: val });
        };
        const apputilsRender = apputils.render(auth, languageData);
        onValue(dataRef, (snapshot) => {
            apputilsRender.update.level(snapshot.val().level);
            apputilsRender.update.name(snapshot.val().name);
            apputilsRender.update.btc(snapshot.val().btc);
            apputilsRender.update.nc(snapshot.val().nc);
            !snapshot.val().name && updateData('name', user.displayName);
        });
    }

    return {
        init
    }
})();

export default authData;