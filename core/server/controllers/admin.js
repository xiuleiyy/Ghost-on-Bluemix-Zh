var _             = require('lodash'),
    api           = require('../api'),
    errors        = require('../errors'),
    updateCheck   = require('../update-check'),
    config        = require('../config'),
    adminControllers;

adminControllers = {
    // Route: index
    // Path: /ghost/
    // Method: GET
    index: function (req, res) {
        /*jslint unparam:true*/

        function renderIndex() {
            res.render('default', {
                skip_google_fonts: config.isPrivacyDisabled('useGoogleFonts')
            });
        }

        updateCheck().then(function () {
            return updateCheck.showUpdateNotification();
        }).then(function (updateVersion) {
            if (!updateVersion) {
                return;
            }

            var notification = {
                type: 'success',
                location: 'top',
                dismissible: false,
                status: 'persistent',
                message: '有 <a href="http://www.ghostchina.com/download/">Ghost ' + updateVersion +
                '</a> 新版本可以升级！请赶紧 <a href="http://www.ghostchina.com/" target="_blank">升级</a> 吧。'
            };

            return api.notifications.browse({context: {internal: true}}).then(function (results) {
                if (!_.some(results.notifications, {message: notification.message})) {
                    return api.notifications.add({notifications: [notification]}, {context: {internal: true}});
                }
            });
        }).finally(function () {
            renderIndex();
        }).catch(errors.logError);
    }
};

module.exports = adminControllers;
