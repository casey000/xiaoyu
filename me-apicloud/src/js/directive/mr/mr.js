angular.module('myApp')
    .directive('onInputCardno', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {

                function cardnoLimit() {
                    var cardType = scope.mrInfo.cardType;
                    var cardNo = element.val();
                    // var reg1 = /[^\w\.\/]/ig;
                    var reg1 = /[^a-zA-Z0-9]/g;
                    var reg2 = /\D/g;

                    cardType == "LMNRC" ? (
                        cardNo = cardNo.replace(reg1, '')
                    ) : '';
                    cardType == "LMTLB" ? (
                        cardNo = cardNo.replace(reg2, '')
                    ) : '';
                    scope.cardType = cardType;
                    scope.mrInfo.cardNo = cardNo;
                }

                element.on('keyup', function () {
                    scope.$apply(function () {
                        cardnoLimit();
                    })
                });
                element.on('blur', function () {
                    scope.$apply(function () {
                        cardnoLimit();
                        // scope.mrInfo.cardNo = angular.uppercase(scope.mrInfo.cardNo);
                    })
                });
            }
        };
    }])
    .directive('onInputWorkno', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                function worknoLimit() {
                    // var workNo = scope.mrInfo.worknoTxt;
                    var workNo = element.val();
                    var reg = /\D/g;
                    workNo = workNo.replace(reg, '');
                    scope.mrInfo.worknoTxt = workNo;
                }

                element.on('keyup', function () {
                    scope.$apply(function () {
                        worknoLimit();
                    })
                });
                element.on('blur', function () {
                    scope.$apply(function () {
                        worknoLimit();
                    })
                });
            }
        };
    }])
    .directive('onInputAc', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {

                function acLimit() {
                    var acInfo = element.val();
                    var reg = /[^a-zA-Z0-9]/g;
                    acInfo = acInfo.replace(reg, '');
                    scope.mrInfo.acInfo = acInfo;
                }

                element.on('keyup', function () {
                    scope.$apply(function () {
                        acLimit();
                    })
                });
                element.on('blur', function () {
                    scope.$apply(function () {
                        acLimit();
                    })
                });
            }
        };
    }])
    /*.directive('inputMaterialNum', ['$rootScope', function($rootScope) {
        return {
            restrict: 'AE',
            scope: {
              inputFunction: '&' // This function is expected to return a future
            },
            link: function(scope, element, attr) {
                console.log(event)
                element.on('input', function() {
                    scope.inputFunction();
                });

            }
        };
    }])*/
    //确定添加航材
    .directive('sureAdd', ['$rootScope', '$filter', function ($rootScope, $filter) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    console.log(scope.item);
                    if(scope.item.cardType && scope.item.cardType == 'LM' && scope.item.pnType != 3){
                        $rootScope.errTip = 'LM类型，仅限选择消耗件';
                        return;
                    }
                    var aircraft = scope.item.aircraft||'';

                    if (aircraft === 1) {

                        api.confirm({
                            title: '只有在当地库房无库存的情况下才选择飞机库房库存',
                            msg:"确认继续么?",
                            buttons: ['确定', '取消']
                        }, function(ret, err) {
                            var index = ret.buttonIndex;
                            if (index === 1) {

                                mrDataBase.getItem(scope.$parent.timeId).then(function (value) {
                                    var sameKey;
                                    if (!value) {
                                        var value = {item: []};
                                    } else {
                                        if (!value.item) {
                                            value.item = [];
                                        } else {
                                            angular.forEach(value.item, function (val, key) {
                                                if (val.pn == scope.item.partNo &&
                                                    ((val.serialNum && val.serialNum == scope.item.serialNum)
                                                        || (!val.serialNum && val.lotNum && val.lotNum == scope.item.lotNum)
                                                        || (!val.serialNum && !val.lotNum))
                                                ) {
                                                    sameKey = key;
                                                    return false;
                                                }
                                            })
                                        }
                                    }
                                    if (typeof sameKey != 'undefined') { //如果已经添加过同个航材，再添加数量相加
                                        var addNum = Number(value.item[sameKey].qty);
                                        value.item[sameKey].qty = (addNum + Number(scope.item.needMaterialNumber)).toFixed(2);
                                        if (Number(value.item[sameKey].qty) > Number(scope.item.availableQty) && Number(scope.item.availableQty) !=0) {
                                            scope.$parent.$parent.showMask = true;
                                            // scope.$parent.$parent.addNum = addNum; //已经添加数量
                                            // scope.$parent.$parent.blance = scope.item.availableQty - addNum;
                                            scope.$parent.$parent.blockNum = {
                                                'addNum': $filter('number')(addNum, 2),
                                                'blance': $filter('number')(scope.item.availableQty - addNum, 2)
                                            };
                                            return false;
                                        }
                                    } else {

                                        var tempObj = {
                                            pn: scope.item.partNo,
                                            pnname: scope.item.description,
                                            unit: scope.item.orderUnit || scope.item.unit,
                                            // station: scope.item.location.substring(0, 3),
                                            station: scope.item.location,
                                            qty: Number(scope.item.needMaterialNumber), //需要的数量
                                            availableQty: (!scope.item.availableQty || scope.item.availableQty == 'null') ? scope.item.curbal : scope.item.availableQty, //库存
                                            itemNum: scope.item.itemNum,
                                            recommendQty: 0, //建议数量     LM类型的MR只能为0
                                            ar: 0	//1.视情，0不视情 （LM类型的MR只能为0）
                                        }
                                        tempObj.availableQty = tempObj.availableQty || 0

                                        if (scope.item.serialNum) {
                                            tempObj.serialNum = scope.item.serialNum;
                                        }
                                        if (scope.item.lotNum) {
                                            tempObj.lotNum = scope.item.lotNum;
                                        }
                                        if (scope.item.assetNum) {
                                            tempObj.assetNum = scope.item.assetNum;
                                        }

                                        value.item.push(tempObj);

                                    }
                                    scope.item.delCard = true;
                                    mrDataBase.setItem(scope.$parent.timeId, value);


                                }).catch(function (err) {
                                    // This code runs if there were any errors
                                    console.log(err);
                                });
                            }

                        });
                    }
                    else {
                        mrDataBase.getItem(scope.$parent.timeId).then(function (value) {
                            var sameKey;
                            if (!value) {
                                var value = {item: []};
                            } else {
                                if (!value.item) {
                                    value.item = [];
                                } else {
                                    angular.forEach(value.item, function (val, key) {
                                        if (val.pn == scope.item.partNo &&
                                            ((val.serialNum && val.serialNum == scope.item.serialNum)
                                                || (!val.serialNum && val.lotNum && val.lotNum == scope.item.lotNum)
                                                || (!val.serialNum && !val.lotNum))
                                        ) {
                                            sameKey = key;
                                            return false;
                                        }
                                    })
                                }
                            }
                            if (typeof sameKey != 'undefined') { //如果已经添加过同个航材，再添加数量相加
                                var addNum = Number(value.item[sameKey].qty);
                                value.item[sameKey].qty = (addNum + Number(scope.item.needMaterialNumber)).toFixed(2);
                                if (Number(value.item[sameKey].qty) > Number(scope.item.availableQty) && Number(scope.item.availableQty) !=0) {
                                    scope.$parent.$parent.showMask = true;
                                    // scope.$parent.$parent.addNum = addNum; //已经添加数量
                                    // scope.$parent.$parent.blance = scope.item.availableQty - addNum;
                                    scope.$parent.$parent.blockNum = {
                                        'addNum': $filter('number')(addNum, 2),
                                        'blance': $filter('number')(scope.item.availableQty - addNum, 2)
                                    };
                                    return false;
                                }
                            } else {

                                var tempObj = {
                                    pn: scope.item.partNo,
                                    pnname: scope.item.description,
                                    unit: scope.item.orderUnit || scope.item.unit,
                                    allunits: scope.item.allunit || [],
                                    // station: scope.item.location.substring(0, 3),
                                    station: scope.item.station,
                                    qty: Number(scope.item.needMaterialNumber), //需要的数量
                                    // availableQty: (!scope.item.availableQty || scope.item.availableQty == 'null') ? scope.item.curbal : scope.item.availableQty, //库存
                                    itemNum: scope.item.itemNum,
                                    // recommendQty: 0, //建议数量     LM类型的MR只能为0
                                    // ar: 0	//1.视情，0不视情 （LM类型的MR只能为0）
                                }
                                // tempObj.availableQty = tempObj.availableQty || 0

                                // if (scope.item.serialNum) {
                                //     tempObj.serialNum = scope.item.serialNum;
                                // }
                                //批次号
                                // if (scope.item.lotNum) {
                                //     tempObj.lotNum = scope.item.lotNum;
                                // }
                                // if (scope.item.assetNum) {
                                //     tempObj.assetNum = scope.item.assetNum;
                                // }

                                value.item.push(tempObj);

                            }
                            scope.item.delCard = true;
                            // console.log("插入的id"+scope.$parent.timeId);
                            // console.log("选择的数据"+JSON.stringify(value));
                            mrDataBase.setItem(scope.$parent.timeId, value);


                        }).catch(function (err) {
                            // This code runs if there were any errors
                            console.log(err);
                        });
                    }


                });

            }
        };
    }])
    //	滑动删除功能
    .directive('swipeDelete', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AEC',
            link: function (scope, element, attr) {
                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    })
                   .on("touchmove", function (e) {
                        var moveEndX = e.changedTouches[0].pageX,
                            moveEndY = e.changedTouches[0].pageY,
                            X = moveEndX - startX,
                            Y = moveEndY - startY;

                        if (Math.abs(X) > Math.abs(Y) && X < 0 && scope.mrListItem.timeId) {
                            //alert("right 2 left");
                            element.addClass('swipe-left');
                        } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                            element.removeClass('swipe-left');
                        }
                        if(Math.abs(Y) < 10){
                            e.preventDefault();
                        }

                   })
                    .on('touchend', function(e){
                        var moveEndX = e.changedTouches[0].pageX,
                            moveEndY = e.changedTouches[0].pageY;
                        X = moveEndX - startX;
                        Y = moveEndY - startY;

                        if (X == 0 && Y == 0) {
                            if (e.target.className.indexOf('delete') != -1) {
                                e.preventDefault();
                                scope.$parent.deleteSaved(element, scope.mrListItem.timeId);
                            } else {
                                e.preventDefault();
                                //未提交成功的转入到add-mr页面
                                if (scope.mrListItem.timeId) {
                                    setTimeout(function(){
                                        $rootScope.go('mrAdd', 'slideLeft', {
                                            timeId: scope.mrListItem.timeId,
                                            station:scope.mrListItem.station,
                                            sapTaskId: scope.mrListItem.sapTaskId,
                                        })
                                    }, 400)

                                } else {//提交成功的进入详情页面
                                    setTimeout(function() {
                                        $rootScope.go('mrDetail', 'slideLeft', {
                                            mrId: scope.mrListItem.sapTaskId,
                                            cardId: scope.mrListItem.cardId,
                                            station: scope.mrListItem.station,
                                        })
                                    }, 400)
                                }

                            }
                        }

                    });
            }
        }
    }])
    //addmr滑动删除
    .directive('swipeDel', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        //alert("right 2 left");
                        element.addClass('swipe-left');
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('swipe-left');
                    }
                });


            }
        }
    }])
    .directive('damageSwipeDel', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        //alert("right 2 left");
                        element.addClass('damage-swipe-left');
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('damage-swipe-left');
                    }
                });


            }
        }
    }])
    .directive('swipeCancelFocus', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        //alert("right 2 left");
                        element.addClass('swipe-left-cancel-focus');
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('swipe-left-cancel-focus');
                    }
                });


            }
        }
    }])
    .directive('pinchZoom', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {

                var elWidth, elHeight;

                // mode : 'pinch' or 'swipe'
                var mode = '';

                // distance between two touche points (mode : 'pinch')
                var distance = 0;
                var initialDistance = 0;

                // image scaling
                var scale = 1;
                var relativeScale = 1;
                var initialScale = 1;
                var maxScale = parseInt(attrs.maxScale, 10);
                if (isNaN(maxScale) || maxScale <= 1) {
                    maxScale = 3;
                }

                // position of the upper left corner of the element
                var positionX = 0;
                var positionY = 0;

                var initialPositionX = 0;
                var initialPositionY = 0;

                // central origin (mode : 'pinch')
                var originX = 0;
                var originY = 0;

                // start coordinate and amount of movement (mode : 'swipe')
                var startX = 0;
                var startY = 0;
                var moveX = 0;
                var moveY = 0;

                var image = new Image();
                image.onload = function() {
                    elWidth = element[0].clientWidth;
                    elHeight = element[0].clientHeight;

                    element.css({
                        '-webkit-transform-origin' : '0 0',
                        'transform-origin'         : '0 0'
                    });

                    element.on('touchstart', touchstartHandler);
                    element.on('touchmove', touchmoveHandler);
                    element.on('touchend', touchendHandler);
                };

                if (attrs.ngSrc) {
                    image.src = attrs.ngSrc;
                } else {
                    image.src = attrs.src;
                }

                /**
                 * @param {object} evt
                 */
                function touchstartHandler(evt) {
                    var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

                    startX = touches[0].clientX;
                    startY = touches[0].clientY;
                    initialPositionX = positionX;
                    initialPositionY = positionY;
                    moveX = 0;
                    moveY = 0;
                }

                /**
                 * @param {object} evt
                 */
                function touchmoveHandler(evt) {
                    var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

                    if (mode === '') {
                        if (touches.length === 1 && scale > 1) {

                            mode = 'swipe';

                        } else if (touches.length === 2) {

                            mode = 'pinch';

                            initialScale = scale;
                            initialDistance = getDistance(touches);
                            originX = touches[0].clientX -
                                parseInt((touches[0].clientX - touches[1].clientX) / 2, 10) -
                                element[0].offsetLeft - initialPositionX;
                            originY = touches[0].clientY -
                                parseInt((touches[0].clientY - touches[1].clientY) / 2, 10) -
                                element[0].offsetTop - initialPositionY;

                        }
                    }

                    if (mode === 'swipe') {
                        evt.preventDefault();

                        moveX = touches[0].clientX - startX;
                        moveY = touches[0].clientY - startY;

                        positionX = initialPositionX + moveX;
                        positionY = initialPositionY + moveY;

                        transformElement();

                    } else if (mode === 'pinch') {
                        evt.preventDefault();

                        distance = getDistance(touches);
                        relativeScale = distance / initialDistance;
                        scale = relativeScale * initialScale;

                        positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
                        positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

                        transformElement();

                    }
                }

                /**
                 * @param {object} evt
                 */
                function touchendHandler(evt) {
                    var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

                    if (mode === '' || touches.length > 0) {
                        return;
                    }

                    if (scale < 1) {

                        scale = 1;
                        positionX = 0;
                        positionY = 0;

                    } else if (scale > maxScale) {

                        scale = maxScale;
                        relativeScale = scale / initialScale;
                        positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
                        positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

                    } else {

                        if (positionX > 0) {
                            positionX = 0;
                        } else if (positionX < elWidth * (1 - scale)) {
                            positionX = elWidth * (1 - scale);
                        }
                        if (positionY > 0) {
                            positionY = 0;
                        } else if (positionY < elHeight * (1 - scale)) {
                            positionY = elHeight * (1 - scale);
                        }

                    }

                    transformElement(0.1);
                    mode = '';
                }

                /**
                 * @param {Array} touches
                 * @return {number}
                 */
                function getDistance(touches) {
                    var d = Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
                        Math.pow(touches[0].clientY - touches[1].clientY, 2));
                    return parseInt(d, 10);
                }

                /**
                 * @param {number} [duration]
                 */
                function transformElement(duration) {
                    var transition  = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '';
                    var matrixArray = [scale, 0, 0, scale, positionX, positionY];
                    var matrix      = 'matrix(' + matrixArray.join(',') + ')';

                    element.css({
                        '-webkit-transition' : transition,
                        transition           : transition,
                        '-webkit-transform'  : matrix + ' translate3d(0,0,0)',
                        transform            : matrix
                    });
                }

            }
        }
    }]);


