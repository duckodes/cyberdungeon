import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import language from "./language.js";

import auth from "./auth.js";

import appUtils from "./app.utils.js";
import prompter from "./prompter.js";

const authSign = (() => {
    function registerWindowEvent() {
        const checkToken = () => {
            console.log('check token processing..');
            if (authSign.checkToken()) return;
        }
        window.addEventListener('focus', checkToken);

        window.addEventListener('close', () => localStorage.removeItem('USER_EMAIL'));
    }
    function login(email, password) {
        signInWithEmailAndPassword(auth.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('USER_EMAIL', email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
            });
    }
    function logout() {
        signOut(auth.auth)
            .catch((error) => {
                console.log(error);
            });
    }
    function create(email, password) {
        createUserWithEmailAndPassword(auth.auth, email, password)
            .then((userCredential) => {
                updateProfiles(userCredential.user, user.email.replace(/@.*?(?=@|$)/g, ''));
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
            });
    }
    function updateProfiles(user, value) {
        updateProfile(user, { displayName: value })
            .catch(error => console.log(error));
    }
    function checkToken() {
        if (prompter.isRender) return false;
        if (!auth.auth.currentUser) return;
        auth.auth.currentUser.getIdToken()
            .catch(async (error) => {
                const languageData = await language.cache(document.documentElement.lang);
                logout();
                appUtils.forceRevokeApp();
                prompter.render(languageData.prompter.timeout, languageData.prompter.confirm);
                console.log(error);
            });
        return true;
    }
    function render(languageData) {
        const sign = document.createElement('div');
        sign.className = 'sign';
        const container = document.createElement('div');
        container.className = 'container';
        const email = document.createElement('input');
        email.type = 'text';
        email.placeholder = languageData.auth.placeholder.email;
        email.value = localStorage.getItem('USER_EMAIL');
        email.addEventListener('input', (e) => {
            const v = e.target.value;
            if (v.includes('@') && !v.endsWith('@gmail.com')) {
                e.target.value = v.split('@')[0] + '@gmail.com';
                password.focus();
            }
        });
        const password = document.createElement('input');
        password.type = 'password';
        password.placeholder = languageData.auth.placeholder.password;
        const switchDisplay = document.createElement('div');
        switchDisplay.className = 'switch-display';
        const switchAction = document.createElement('div');
        switchAction.className = 'switch-action';
        switchAction.textContent = languageData.auth.switchAction.register;
        switchAction.addEventListener('click', () => {
            switchAction.textContent =
                switchAction.textContent === languageData.auth.switchAction.register ?
                    languageData.auth.switchAction.login : languageData.auth.switchAction.register;
            action.textContent =
                switchAction.textContent === languageData.auth.switchAction.register ?
                    languageData.auth.action.login : languageData.auth.action.create;
        });
        const action = document.createElement('button');
        action.className = 'action';
        action.textContent = languageData.auth.action.login;
        action.addEventListener('click', async () => {
            action.textContent === languageData.auth.action.login ?
                login(email.value, password.value) : create(email.value, password.value);
        });
        sign.addEventListener('keyup', async (e) => {
            if (e.key === "Enter") {
                action.textContent === languageData.auth.action.login ?
                    login(email.value, password.value) : create(email.value, password.value);
            }
        });

        switchDisplay.appendChild(switchAction);

        container.appendChild(email);
        container.appendChild(password);
        container.appendChild(switchDisplay);
        container.appendChild(action);

        sign.appendChild(container);

        document.body.appendChild(sign);
        return sign;
    }
    return {
        render: render,
        logout: logout,
        checkToken: checkToken,
        registerWindowEvent: registerWindowEvent,
        updateProfiles: registerWindowEvent
    }
})();

export default authSign;