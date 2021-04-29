angular.module('myApp')
    .directive('switchTitle', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    var lanConfig = require('../../../../i18n/lanConfig');
                    var title = angular.element(document.getElementsByClassName('navbar-brand')).children();
                    title.removeClass('title-active');
                    element.addClass('title-active');
                    scope.type = element.attr('data-type');
                    scope.requestURL = element.attr('data-url');

                    if (scope.type == 'lend') {
                        if (scope.oldLendSearchTxt) {
                            scope.searchTxt = scope.oldLendSearchTxt;
                        }
                        //scope.acRegType = true;
                        scope.holderValue = lanConfig.inputLimitPnPlusWorkNo;

                    } else {
                        if (scope.oldStockSearchTxt) {
                            scope.searchTxt = scope.oldStockSearchTxt;
                        }
                        //scope.acRegType = false;
                        scope.holderValue = lanConfig.inputLimitPn;
                    }

                    scope.$apply();

                });

            }
        };
    }])
    //	.directive('listDetail', function() {
    //		return {
    //			restrict: 'AE',
    //			replace: true,
    //			templateUrl:'tool/list-detail.html'
    //		};
    //	})
    .directive('viewToolDetails', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    scope.$apply(function () {
                        scope.$parent.$parent.showMask = true;
                        scope.$parent.$parent.popCardData = scope.oneInfo;
                    })
                });

            }
        };
    })
    .directive('cancelToolDetails', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    scope.$apply(function () {
                        scope.showMask = false;
                    })
                });

            }
        };
    })
    /*.directive('chooseType', function() {
        return {
            restrict: 'AE',
            link: function(scope, element, attr) {
                element.on('click', function() {
                    var typeSearch = angular.element(document.getElementsByClassName('type-search'));
                    var typeList = angular.element(document.getElementsByClassName('search-type-list'));
                    typeSearch.html(element.html());
                    typeList.css('display','none');

                    scope.searchType = element.attr('data-search-type');
                    scope.$apply()
                });

            }
        };
    })*/
    //	.directive('showTypeList', function() {
    //		return {
    //			restrict: 'AE',
    //			link: function(scope, element, attr) {
    //				element.on('click', function(e) {
    //					var typeList = angular.element(document.getElementsByClassName('search-type-list'));
    //					typeList.css('display','block');
    //					e.stopPropagation();
    //					scope.$apply()
    //				});
    //
    //			}
    //		};
    //	})
    //	.directive('hideTypeList', function() {
    //		return {
    //			restrict: 'AE',
    //			link: function(scope, element, attr) {
    //				element.on('click', function() {
    //					var typeList = angular.element(document.getElementsByClassName('search-type-list'));
    //					typeList.css('display','none')
    //					scope.$apply()
    //				});
    //
    //			}
    //		};
    //	})
    .directive('unborrowedRecordTips', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    var lanConfig = require('../../../../i18n/lanConfig');
                    if (!scope.myLendingCount) {
                        $rootScope.errTip = lanConfig.noRecord;
                    } else {
                        scope.go('searchTool.record');
                    }
                    scope.$apply();
                });

            }
        };
    }]);