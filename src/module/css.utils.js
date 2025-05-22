const cssUtils = (() => {
    function updateCSSVariable(targetHref, variableName, variableValue) {
        const styleSheets = document.styleSheets;

        let targetStyleSheet = null;
        for (const sheet of styleSheets) {
            if (sheet.href && sheet.href.includes(targetHref)) {
                targetStyleSheet = sheet;
                break;
            }
        }

        if (targetStyleSheet) {
            let ruleFound = false;

            for (let i = 0; i < targetStyleSheet.cssRules.length; i++) {
                const rule = targetStyleSheet.cssRules[i];

                if (rule.selectorText === ':root') {
                    rule.style.setProperty(variableName, variableValue);
                    ruleFound = true;
                    break;
                }
            }

            if (!ruleFound) {
                targetStyleSheet.insertRule(`:root { ${variableName}: ${variableValue}; }`, targetStyleSheet.cssRules.length);
            }
        } else {
            console.warn('Error sheet href not found');
        }
    }
    function getCSSVariable(targetHref, variableName) {
        const styleSheets = document.styleSheets;

        let targetStyleSheet = null;
        for (const sheet of styleSheets) {
            if (sheet.href && sheet.href.includes(targetHref)) {
                targetStyleSheet = sheet;
                break;
            }
        }

        if (targetStyleSheet) {
            let variableValue = '';

            for (let i = 0; i < targetStyleSheet.cssRules.length; i++) {
                const rule = targetStyleSheet.cssRules[i];

                if (rule.selectorText === ':root') {
                    variableValue = rule.style.getPropertyValue(variableName).trim();
                    break;
                }
            }

            return variableValue;
        } else {
            console.warn('Error sheet href not found');
            return '';
        }
    }
    function getRootProperty(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(property);
    }
    return {
        updateCSSVariable: updateCSSVariable,
        getCSSVariable: getCSSVariable,
        getRootProperty: getRootProperty
    }
})();

export default cssUtils;