const popup = (() => {
    function render(parent) {
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
        let isPoint = false;
        popupBase.addEventListener('mousedown', () => {
            isPoint = true;
        });
        popupPanel.addEventListener('mouseleave', () => {
            isPoint = false;
        });
        popupBase.addEventListener('click', (e) => {
            if (popupPanel.contains(e.target)) return;
            if (!isPoint) return;
            removePanel();
            isPoint = false;
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
        const whiteLine = document.createElement('div');
        whiteLine.className = 'white-line';
        popupPanel.appendChild(whiteLine);
        move(popupPanel);
        function move(element) {
            let startY = 0;
            let currentY = 0;
            let dragging = false;
            let initialTranslateY = 0;
            let isPointerDown = false;

            function getTranslateY() {
                const transform = window.getComputedStyle(element).transform;
                const matrix = new DOMMatrix(transform);
                return matrix.m42 || 0;
            }

            function startDrag(y) {
                initialTranslateY = getTranslateY();
                startY = y;
                isPointerDown = true;
                dragging = true;
                element.style.transition = 'none';
            }

            function moveDrag(y) {
                if (isPointerDown) dragging = true;
                if (!dragging) return;
                currentY = y;
                const deltaY = currentY - startY;
                if (deltaY + initialTranslateY >= 0) {
                    element.style.transform = `translateY(${deltaY + initialTranslateY}px)`;
                }
            }

            function endDrag() {
                isPointerDown = false;
                dragging = false;
                const deltaY = currentY - startY + initialTranslateY;
                if (deltaY > 200) {
                    popupBase.classList.add('fade-out');
                    popupBase.addEventListener('animationend', () => {
                        popupBase.remove();
                    });
                } else if (deltaY > 70) {
                    element.style.transition = 'all 200ms ease-out';
                    element.style.transform = `translateY(70%)`;
                } else {
                    element.style.transition = 'all 200ms ease-out';
                    element.style.transform = `translateY(0)`;
                }
            }

            function except(value) {
                if (!dragging) return;
                dragging = value;
            }

            // Pointer Events (桌面與部分手機瀏覽器)
            element.addEventListener('pointerdown', (e) => startDrag(e.clientY));
            document.addEventListener('pointermove', (e) => moveDrag(e.clientY));
            document.addEventListener('pointerup', () => endDrag());
            document.addEventListener('pointerout', () => except(false));
            document.addEventListener('pointercancel', () => except(false));

            // Touch Events (手機)
            element.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    startDrag(e.touches[0].clientY);
                }
            }, { passive: true });

            element.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    moveDrag(e.touches[0].clientY);
                }
            }, { passive: true });

            element.addEventListener('touchend', () => endDrag());
        }

        popupBase.appendChild(popupPanel);

        parent.appendChild(popupBase);
        return {
            popupPanel: popupPanel,
            removePanel: removePanel
        }
    }
    function renderCheck(parent) {
        const popupCheck = render(parent);
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