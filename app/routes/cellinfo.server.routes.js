/**
 * Created by admin on 2017/7/27.
 */
module.exports = function (app) {
    "use strict";
    const cellinfo = require('../controllers/cellinfo.server.controller');
    app.route('/cellinfo')
        .get(cellinfo.read);
};