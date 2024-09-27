import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const authSign = (() => {
    function login(auth, email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
            });
    }
    function logout(auth, languageData) {
        signOut(auth).then(() => {

        }).catch((error) => {
            console.log(error);
        });
    }
    function create(auth, email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                UpdateProfile(userCredential.user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
            });
    }
    function UpdateProfile(user) {
        updateProfile(user, { displayName: user.email.replace(/@.*?(?=@|$)/g, '') })
            .then(() => { })
            .catch(error => console.log(error));
    }
    function render(auth, languageData) {
        const sign = document.createElement('div');
        sign.className = 'sign';
        const container = document.createElement('div');
        container.className = 'container';
        const email = document.createElement('input');
        email.type = 'text';
        email.placeholder = languageData.auth.placeholder.email;
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
        action.addEventListener('click', () => {
            action.textContent === languageData.auth.action.login ?
                login(auth, email.value, password.value) : create(auth, email.value, password.value);
        });
        sign.addEventListener('keyup', e => {
            if (e.key === "Enter") {
                action.textContent === languageData.auth.action.login ?
                    login(auth, email.value, password.value) : create(auth, email.value, password.value);
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
    return { render, logout }
})();

export default authSign;