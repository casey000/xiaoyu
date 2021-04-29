/**
 * Created by tate on 31/07/2017.
 */


module.exports = (function () {
    angular.module('myApp')
        .config(['$translateProvider', function($translateProvider) {
            var lan = window.navigator.language.indexOf('zh') !== -1 ? 'cn' : 'en' ;
            var tranCn = require('../../../i18n/cn.json');
            var tranEn = require('../../../i18n/en.json');

            $translateProvider
                .translations('cn',tranCn)
                .translations('en',tranEn)
                .preferredLanguage(lan)
                .useSanitizeValueStrategy('sanitize');
        }]);
})();