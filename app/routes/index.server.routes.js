/**
 * Created by admin on 2017/7/25.
 */
module.exports = function(app) {
    "use strict";
    const index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};