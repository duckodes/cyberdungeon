const languageType = (() => {
    function getType(languageData, key) {
        return languageData.languagetype[key] || null;
    }
    function getLength(languageData) {
        return Object.keys(languageData.languagetype).length;
    }
    function getKeys(languageData) {
        return Object.keys(languageData.languagetype);
    }
    function getValue(languageData) {
        return Object.values(languageData.languagetype);
    }
    return {
        getType: getType,
        getKeys: getKeys,
        getLength: getLength,
        getValue: getValue
    }
})();

export default languageType;