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
        console.log('query string${i}', queryArr[i]);
        const result = yield mysqlDBQueryThunk(queryArr[i]);
        results.push(...result);
        i += 1;
    } while (i < length && (resultLimit ? (results.length < resultLimit) : true));
    return results;
};

exports.autorun = (gen, cb) => {
    "use strict";
    const next = (err, data) => {
               if (err) {
                   cb(err);
               } else {
                   console.log('cb in');
                   const result = gen.next(data);
                   if (result.done) {
                       console.log('finished');
                       cb(null, result.value);
                   } else {
                       console.log('result value', result.value);
                       result.value(next);
                   }
               }
           };
           next();
};