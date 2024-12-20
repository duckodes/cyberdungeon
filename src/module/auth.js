// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import fetcher from "./fetcher.js";
import authSign from "./auth.sign.js";
import authData from "./auth.data.js";
import apputils from "./apputils.js";

const auth = (() => {
    async function init(languageData) {
        const firebaseConfig = await fetcher.load('../src/config/firebaseConfig.json');

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase();

        let sign = authSign.render(auth, languageData);

        onAuthStateChanged(auth, (user) => {
            if (!user)
                return !document.querySelector('.sign') && (sign = authSign.render(auth, languageData));
            sign.remove();

            const apputilsRender = apputils.render(auth, languageData);
            apputils.registerEvent(user, apputilsRender, languageData);
            authData.init(database, user, apputilsRender);
        });
    }

    return {
        init
    }
})();

export default auth;