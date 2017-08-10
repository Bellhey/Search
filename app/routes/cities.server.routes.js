/**
 * Created by admin on 2017/7/26.
 */
module.exports = function(app) {
    "use strict";
    const cities = require('../controllers/cities.server.controller');
    app.route('/cities')
        .get(cities.read);
};