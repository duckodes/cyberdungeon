const prompter = (() => {
    let isRender = false;
    function render(boxText, confirmText) {
        const prompter = document.createElement('div');
        prompter.className = 'prompter';
        prompter.addEventListener('click', (e) => {
            e.target !== box && prompter.remove();
            isRender = false;
        });
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = boxText;
        const confirm = document.createElement('button');
        confirm.textContent = confirmText;

        prompter.appendChild(box);
        prompter.appendChild(confirm);
        document.body.appendChild(prompter);
        isRender = true;
    }
    return {
        render,
        get isRender() {
            return isRender;
        }
    }
})();

export default prompter;