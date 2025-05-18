// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import language from "./language.js";
import fetcher from "./fetcher.js";
import authSign from "./auth.sign.js";
import apputils from "./apputils.js";

const firebaseConfig = await fetcher.load('../src/config/firebaseConfig.json');
const auth = (() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase();

    function init(languageData) {
        let sign = authSign.render(languageData);
        apputils.registerWindowEvent();
        onAuthStateChanged(auth, async (user) => {
            const languageData = await language.cache(document.documentElement.lang);
            if (!user)
                return !document.querySelector('.sign') && (sign = authSign.render(languageData));
            sign.remove();

            apputils.update(languageData);
        });
    }

    return {
        init,
        auth,
        database
    }
})();

export default auth;