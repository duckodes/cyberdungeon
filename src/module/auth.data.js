import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import apputils from "./apputils.js";

const authData = (() => {
    function init(auth, database, user, languageData) {
        onValue(ref(database, `cyberdungeon/user/${user.uid}`), (snapshot) => {
            const apputilsRender = apputils.render(auth, languageData);
        });
    }

    return {
        init
    }
})();

export default authData;