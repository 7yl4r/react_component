const parameter_library = require('./parameter_library.json');
console.log(parameter_library);

const parameterRecommend = (paramQuery) => {
    // First get matches by split standard_name
    const paramQuerySplit = paramQuery.split(' ');
    const stdnMatches = parameter_library.filter((pdef) => {
        const stdSplit = pdef.standard_name.split('_');
        const includeResult = stdSplit.findIndex(e => e.includes(paramQuery));
        let includeSplitResult = -1;
        for (let i = 0; i < paramQuerySplit.length; i++) {
            const tempIncludeSplitResult = stdSplit.findIndex(e => e.includes(paramQuerySplit[i]));
            includeSplitResult = tempIncludeSplitResult > includeResult ? tempIncludeSplitResult : includeSplitResult;
        }
        return (includeResult !== -1 || includeSplitResult !== -1);
    });

    // Then get matches from display_description

    const descMatches = parameter_library.filter((pdef) => {
        const disdesc = pdef.display_description?.en;
        if (disdesc === null || disdesc === undefined) {
            return false;
        }
        const descSplit = pdef.display_description.en.split(' ');
        const includeResult = descSplit.findIndex(e => e.includes(paramQuery));
        return (includeResult !== -1);
    });

    const retParams = stdnMatches.concat(descMatches);
    const retParamsByStandardName = {};
    for (let i = 0; i < retParams.length; i++) {
        retParamsByStandardName[retParams[i].standard_name] = retParams[i];
    }
    const retParamsArr = [];
    for (const p in retParamsByStandardName) {
        retParamsArr.push(retParamsByStandardName[p]);
    };
    return retParamsArr;
    
};

export default parameterRecommend;