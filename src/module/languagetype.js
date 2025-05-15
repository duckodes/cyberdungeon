const languagetype = (() => {
    function getType(languageData) {
        return languageData.languagetype[document.documentElement.lang] || null;
    }
    return {
        getType: getType
    }
})();

export default languagetype;