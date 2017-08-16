/**
 * Created by admin on 2017/7/27.
 */
const mysqlgen = require('../lib/mysql.server.generate.js'),
       mysqlQuery =  require('../lib/mysql.server.query.js');

exports.read = function(req, res, next) {
    "use strict";
    const queryArr = mysqlQuery.prepareQueryStrArr(req),
           countQueryArr = mysqlQuery.prepareQueryStrArr(req, true);
    console.log(req.query);
    mysqlgen.autorun(mysqlgen.serigen(queryArr, Number(req.query.pagesize) * (+ req.query.pagenum + 5)), (err, data) => {
        if (err) {
            //console.log('throw err', err);
            throw err;
            res.json({
                ri:{
                    rc: 0,
                    msg: '获取活动信息失败'
                }
            });
            return next(err);
        }
        //console.log('success', data.length);
        /*todo:查询符合条件的记录总数*/
        mysqlgen.autorun(mysqlgen.serigen(countQueryArr), (error, results) => {
            let count = 0;
            if (error) {
                throw error;
                return next(error);
            }
            count = results.reduce((sum, currentValue) => {
                        return sum + currentValue['COUNT(*)']
                    }, 0);
            res.json({
                ri:{
                    rc: 0,
                    msg: 'successs'
                },
                d: {
                    count: count,
                    value: data
                }
            });
        });
    });
};