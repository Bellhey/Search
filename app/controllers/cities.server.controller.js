/**
 * Created by admin on 2017/7/26.
 */
const mysqlDB = require('../../config/mysql.js');
exports.read = function(req, res, next) {
    "use strict";
    mysqlDB.query('SELECT * FROM cellinfo_v2_nm_city', (err, results) => {
        console.log(JSON.stringify(results));
        if (err) {
            res.json({
                ri:{
                    rc: 0,
                    msg: '获取城市信息失败'
                }
            });
            return next(err);
        }
        res.json({
            ri: {
                rc: 1,
                msg: 'success'
            },
            d: results
        });
    });
};