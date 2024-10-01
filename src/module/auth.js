// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import language from "./language.js";
import fetcher from "./fetcher.js";
import authSign from "./auth.sign.js";
import apputils from "./apputils.js";

const auth = (() => {
    async function init(lang) {
        const languageData = await language.cache(lang);
        const firebaseConfig = await fetcher.load('../src/config/firebaseConfig.json');

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getDatabase();

        let sign = authSign.render(auth, languageData);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

                sign.remove();
                apputils.render(auth, languageData);
            } else {
                !document.querySelector('.sign') && (sign = authSign.render(auth, languageData));
            }
        });
    }

    return {
        init
    }
})();

export default auth;