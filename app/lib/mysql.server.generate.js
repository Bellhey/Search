/**
 * Created by admin on 2017/8/2.
 */
const mysqlDB = require('../../config/mysql.js'),
       thunkify = require('thunkify'),
       mysqlDBQueryThunk = thunkify(mysqlDB.query.bind(mysqlDB));

exports.serigen = function* (queryArr, resultLimit) {
    "use strict";
    let i = 0,
        length = queryArr.length,
        results = [];
    do {
        //console.info('querystr', queryArr[i] + (resultLimit ?  ' LIMIT ' + resultLimit : ''));
        const result = yield mysqlDBQueryThunk(queryArr[i] + (resultLimit ?  ' LIMIT ' + resultLimit : ''));
        if (result === null) {
        } else {
            console.log('back data', result, queryArr, i);
            resultLimit && (resultLimit = resultLimit - result.length);
            results.push(...result);
        }
        i += 1;
    } while (i < length && (resultLimit ? (results.length < resultLimit) ? true : false : true));
    return results;
};

exports.autorun = (gen, cb) => {
    "use strict";
    const next = (err, data) => {
        let result = null;
       if (err) {
           result = gen.next(null);
       } else {
           result = gen.next(data);
       }
        if (result.done) {
            //console.log('finished', result.value);
            cb(null, result.value);
        } else {
            //console.log('result value', result.value);
            result.value(next);
        }
    };
    next();
};