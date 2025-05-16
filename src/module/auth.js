// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import language from "./language.js";
import fetcher from "./fetcher.js";
import authSign from "./auth.sign.js";
import authData from "./auth.data.js";
import apputils from "./apputils.js";

const auth = (async () => {
    const firebaseConfig = await fetcher.load('../src/config/firebaseConfig.json');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase();

    async function init(languageData) {
        let sign = authSign.render(auth, languageData);

        onAuthStateChanged(auth, async (user) => {
            const languageData = await language.cache(document.documentElement.lang);
            if (!user)
                return !document.querySelector('.sign') && (sign = authSign.render(auth, languageData));
            sign.remove();

            update(languageData);
        });
    }
    function update(languageData) {
        const apputilsRender = apputils.render(languageData);
        apputils.registerEvent(auth.currentUser, apputilsRender, languageData);
        authData.init(database, auth.currentUser, apputilsRender);
    }

    return {
        init,
        update,
        auth
    }
})();

export default auth;