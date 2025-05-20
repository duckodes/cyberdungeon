// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import language from "./language.js";
import fetcher from "./fetcher.js";

import authSign from "./auth.sign.js";
import authData from "./auth.data.js";

import appUtils from "./app.utils.js";

const firebaseConfig = await fetcher.load('../src/config/firebaseConfig.json');
const auth = (() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase();

    function init(languageData) {
        let sign = authSign.render(languageData);
        onAuthStateChanged(auth, async (user) => {
            let languageData = await language.cache(document.documentElement.lang);
            if (!user)
                return !document.querySelector('.sign') && (sign = authSign.render(languageData));
            sign.remove();

            const lanData = await authData.getData('lan');
            lanData && (document.documentElement.lang = lanData);
            languageData = await language.set(lanData);
            appUtils.update(languageData);
        });
    }

    return {
        init: init,
        auth: auth,
        database: database
    }
})();

export default auth;