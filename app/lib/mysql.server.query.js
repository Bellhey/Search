/**
 * Created by admin on 2017/8/3.
 */
exports.getDate = datestr => {
    "use strict";
    const strarr = datestr.split('-');
    return new Date(strarr[0], strarr[1], strarr[2]);
};

exports.getTableNameObjes = (tableNamePrestr, dateStrarr) => {
    "use strict";
    console.log('in dateStrarr', dateStrarr);
    const startDateObj = new Date(dateStrarr[0]),
           endTime = new Date(dateStrarr[1]).getTime(),
           tableObjes = [];
    let startTime = startDateObj.getTime();
    console.log('endTime and startTime', endTime, startTime);
    while (endTime >= startTime) {
         console.log('in compare');
         let year = startDateObj.getFullYear(),
         month  = startDateObj.getMonth().toString().length === 1 ? '0' + (startDateObj.getMonth() + 1).toString() : (startDateObj.getMonth() + 1),
         date = startDateObj.getDate().toString().length === 1 ? '0' + startDateObj.getDate().toString() : startDateObj.getDate();
         console.log('year month date', year, month, date);
         tableObjes.push({
             name: tableNamePrestr + year + month + date,
             timeFieldPre: year + '-' + month + '-' + date
         });
        startDateObj.setDate(startDateObj.getDate() + 1);
        startTime = startDateObj.getTime();
     }
    return tableObjes;
};

exports.prepareTimeQueryStrarr = (tableNameObjes, dateStrarr) => {
    "use strict";
    let length = tableNameObjes.length,
        timeQueryStrArr = [];
    if (length === 1) {
        return [" (`timestamp` BETWEEN '" + dateStrarr[0] + "' AND '" + dateStrarr[1] + "') "];
    } else {
        for (let i = 0; i < length; i ++) {
            let timeQueryStr = '';
            if (i === 0) {
                timeQueryStr = " (`timestamp` BETWEEN '" + dateStrarr[0] + "' AND '" + tableNameObjes[i].timeFieldPre +  " 23:59:59') ";
            } else if (i === length -1) {
                timeQueryStr = " (`timestamp` BETWEEN '" + tableNameObjes.timeFieldPre +  " 00:00:00" + "' AND '" + dateStrarr[1] + "') " ;
            } else {
                timeQueryStr = "";
            }
            timeQueryStrArr.push(timeQueryStr);
        }
    }
    return timeQueryStrArr;
};

exports.prepareQueryStrArr = (req, isCountQuery) => {
    "use strict";
    console.log("i'm in");
    let tableNameObjes = [],
         timeQueryStrarr = [],
         queryStrarr = [],
         commonQueryStr = '';
    const query = req.query;
    if (query.time) {
        console.log('have time');
        const dateStrarr = query.time.split(' - ');
        tableNameObjes = this.getTableNameObjes('log_', dateStrarr);
        timeQueryStrarr = this.prepareTimeQueryStrarr(tableNameObjes, dateStrarr);
    } else {
        const now = new Date(),
               start = now.setDate(now.getDate() - 15),
               startStr = start.toLocaleDateString() + ' ' + start.toLocaleTimeString(),
               end = now.setDate(now.getDate() + 15),
               endStr = end.toLocaleDateString() + ' ' + end.toLocaleTimeString(),
               dateStrarr = [startStr, endStr];
        tableNameObjes = this.getTableNameObjes('log_', dateStrarr);
        timeQueryStrarr = this.prepareTimeQueryStrarr(tableNameObjes, dateStrarr);
    }
    console.log('tableNameObjes', tableNameObjes);
    console.log('timeQueryStrarr', timeQueryStrarr);
    if (query.preId) {
        commonQueryStr += "id > " + query.preId;
    }
    if (query.imsi) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND"
        }
        commonQueryStr += " IMSI =" + query.imsi;
    }
    if (query.imei) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND"
        }
        commonQueryStr += " IMEI =" + query.imei;
    }
    if (query.msisdn) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND "
        }
        commonQueryStr += " MSISDN = " + query.msisdn;
/*        if (query.district) {
            commonQueryStr += " AND district = " + query.district;
            if (query.township && query.township === query.district) {
                commonQueryStr += " AND township = []";
            } else if (query.township) {
                commonQueryStr += " AND township = " + query.township;
            }
        }*/
    }
    if (query.mcc) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND"
        }
        commonQueryStr += " mcc =" + query.mcc;
    }
    if (query.mnc) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND"
        }
        commonQueryStr += " mnc =" + query.mnc;
    }
    if (query.ci) {
        if (commonQueryStr.length > 0) {
            commonQueryStr += " AND"
        }
        commonQueryStr += " ci =" + query.ci;
    }
    for (let i = 0, length = tableNameObjes.length; i < length; i += 1) {
        console.log('in combat');
        let queryStr = '';
        if (isCountQuery) {
            queryStr += "SELECT COUNT(*) FROM " +
                tableNameObjes[i].name + " tb0 " +
                "INNER JOIN cellinfo_v2_nm_copy tb1 ON tb0.ULI = tb1.uli" +
                ' AND' + commonQueryStr +
                (timeQueryStrarr[i] ? " WHERE" + timeQueryStrarr[i] : '');
        } else {
            queryStr += "SELECT tb0.*, tb1.addr, tb1.mcc, tb1.mnc, tb1.ci FROM " +
                tableNameObjes[i].name + " tb0 " +
                "INNER JOIN cellinfo_v2_nm_copy tb1 ON tb0.ULI = tb1.uli" +
                " AND" + commonQueryStr +
                (timeQueryStrarr[i] ? " WHERE" + timeQueryStrarr[i] : '');
        }
            queryStrarr.push(queryStr);
    }
    return queryStrarr;
};