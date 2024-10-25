const prompter = (() => {
    function render(languageData) {
        const tooltip = document.createElement('div');
        tooltip.className = 'prompter';
        tooltip.addEventListener('click', (e) => {
            e.target !== box && tooltip.remove();
        });
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = languageData.prompter.timeout;
        const confirm = document.createElement('button');
        confirm.textContent = languageData.prompter.confirm;

        tooltip.appendChild(box);
        tooltip.appendChild(confirm);
        document.body.appendChild(tooltip);
    }
    return {
        render
    }
})();

export default prompter;