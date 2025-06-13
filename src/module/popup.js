

const popup = (() => {
    function render(app) {
        const popupBase = document.createElement('div');
        popupBase.className = 'popup-base';
        popupBase.classList.add('fade-in');
        popupBase.addEventListener('animationend', () => {
            popupBase.classList.remove('fade-in');
        });
        const popupPanel = document.createElement('div');
        popupPanel.className = 'popup-panel';
        popupPanel.classList.add('slide-in');
        popupPanel.addEventListener('animationend', () => {
            popupPanel.classList.remove('slide-in');
        });
        popupBase.addEventListener('click', (e) => {
            if (popupPanel.contains(e.target)) return;
            removePanel();
        });
        function removePanel() {
            popupPanel.classList.add('slide-out');
            popupPanel.addEventListener('animationend', () => {
                popupBase.remove();
            });
            popupBase.classList.add('fade-out');
            popupBase.addEventListener('animationend', () => {
                popupBase.classList.remove('fade-out');
            });
        }

        popupBase.appendChild(popupPanel);

        app.appendChild(popupBase);
        return {
            popupPanel: popupPanel,
            removePanel: removePanel
        }
    }
    function renderCheck(app) {
        const popupCheck = render(app);
        popupCheck.popupPanel.classList.add('popup-panel-confirm-check');
        const confirmCancel = document.createElement('div');
        confirmCancel.className = 'confirm-cancel';
        const confirm = document.createElement('button');
        const cancel = document.createElement('button');

        confirmCancel.appendChild(confirm);
        confirmCancel.appendChild(cancel);
        return {
            popupPanel: popupCheck.popupPanel,
            removePanel: popupCheck.removePanel,
            confirmCancel: confirmCancel,
            confirm: confirm,
            cancel: cancel,
            render: () => {
                popupCheck.popupPanel.appendChild(confirmCancel);
            }
        }
    }
    return {
        render: render,
        renderCheck: renderCheck
    }
})();

export default popup;