module.exports = (function () {
    angular.module('myApp')
        .controller('entryController', ['$window', '$scope', '$location', '$rootScope', 'server', 'airport', 'configInfo', 'mefilterFlightInfo', require('./entry-controller.js')])

        // .controller('favorflightController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', require('./flightInfo/favorflightController.js')])
        .controller('searchFlightController', ['$scope', 'airport', 'paramTransfer', 'flightInfo', 'favoriteFlight', '$rootScope', 'configInfo', '$stateParams', 'umengEventIdTransform', require('./flightInfo/searchFlightViewController.js')])
        .controller('reportController', ['$scope', '$location', function ($scope, $location) {
            $scope.title = '';
            $scope.content = '';
            $scope.add = function () {
                newsList.push({
                    id: newsList.length + 1,
                    title: $scope.title,
                    content: $scope.content,
                    date: new Date()
                });
                $location.path('list');
            };
        }])
        .controller('flightDetailController',
            ['$scope', 'server', 'airport', 'paramTransfer', '$stateParams', '$state', '$location', '$rootScope',
                require('./flightInfo/flightDetailController.js')
            ])
        .controller('searchMeJobController',
            ['$rootScope', '$scope', 'server', '$stateParams', 'meList',
                require('./me/searchJob-controller.js')
            ])
        .controller('meStatusController', ['$rootScope', '$scope', 'server', '$stateParams', '$sce', '$interval', require('./me/status-controller.js')])

        .controller('meFilterController', ['$rootScope', '$scope', '$location', '$localForage', '$stateParams', 'configInfo', '$filter', 'airport', 'paramTransfer', 'mefilterFlightInfo', 'meList', require('./me/filter-controller.js')])
        .controller('flightFilterController', ['$scope', 'airport', 'paramTransfer', 'flightInfo', 'filterFlightInfo', 'favoriteFlight', '$rootScope', 'configInfo', '$stateParams', '$filter', 'umengEventIdTransform', require('./flightInfo/flightFilterController.js')]);

    require('./mr/list-controller.js');
    require('./mr/detail-controller.js');
    require('./mr/add-controller.js');
    require('./mr/search-controller.js');
    require('./mr/new-search-controller.js');
    require('./mr/new-detail-controller.js');
    require('./mr/transfer-receiving-controller.js');
    require('./mr/receiving-detail-controller.js');
    require('./mr/search-by-number.js');
    require('./mr/dispatch-list.js');
    require('./mr/search-by-pn.js');
    require('./mr/dispatch-detail-controller.js');

    require('./flightInfo/flightInfoController.js');
    require('./flightInfo/cityWeatherReportController.js');
    require('./flightInfo/ddDetail-controller.js');

    require('./message/message-list-controller.js');
    require('./message/file-mess-detail-controller.js');
    require('./message/file-mess-pdf.js');
    require('./messageDetail/messageDetailCotroller.js');
    require('./me/list-controller.js');
    require('./me/releaseTask-controller.js');
    require('./me/form-controller.js');
    require('./me/take-materis-controller.js');
    require('./me/process-add-handle-controller.js');
    require('./me/followAircraftMaterial-controller.js');
    require('./me/wayBillDetails-controller.js');
    require('./tool/search-controller.js');
    require('./tool/record-controller.js');
    require('./fault/newfault-controller.js');
    require('./fault/restmakeup-controller.js');
    require('./fault/restmakeupnext-controller.js');

    require('./fault/close-controller.js');
    require('./fault/search-controller.js');
    require('./fault/add-handle-controller.js');
    require('./fault/add-mr-controller.js');
    require('./fault/add-edit-mr-controller.js');
    require('./fault/search-mr-material-controller.js');
    require('./fault/record-controller.js');
    require('./fault/fault-flightInfo-controller.js');
    require('./fault/flight-fault-filter-controller.js');
    require('./fault/fault-searchflight-controller.js');

    require('./ddi/base-controller.js');
    require('./ddi/proofreader-controller.js');
    require('./ddi/mytask-controller.js');
    require('./ddi/approve-controller.js');
    require('./ddi/mr-approve-controller.js');
    require('./ddi/flight-check.js');

    require('./tlb/add.js');
    require('./tlb/search-tlb.js');
    require('./tlb/tlb-detail.js');
    require('./tlb/doclist-controller.js');
    require('./tlb/search-airInfo.js');
    require('./cc/add-controller.js');
    require('./cc/ccInfo-controller.js');
    require('./ccNew/newAddcc-controller.js');
    require('./ccNew/newCCinfo-controller.js');


    require('./pending/pending-controller.js');
    require('./damage/damage-draft-list-controller.js');
    require('./damage/damage-draft-detail-controller');
    require('./damage/damage-location-controller');
    require('./damage/search-damage.js');
    require('./damage/damage-detail.js');
    require('./damage/damage-reference.js');
    require('./damage/search-damage-byhand');

    require('./special-vehicle/sv-list-controller.js');
    require('./special-vehicle/sv-detail-controller.js');
    require('./fixedInspect/fixed-list-controller.js');
    require('./fixedInspect/fixedDetail-controller.js');
    require('./fixedInspect/fixed-search-controller.js');
    require('./nrc/add-nrc.js');
    require('./nrcfeedbak/nrc_feedbak.js');
    require('./nrcfeedbak/nrc_taskfeedbak.js');
    require('./nrcfeedbak/to_process.js');
    require('./nrcfeedbak/pco_process.js');
    require('./nrcfeedbak/dd_process.js');
    require('./nrcfeedbak/cco_process.js');
    require('./nrcfeedbak/jc_process.js');
    require('./nrc/nrc-detail.js');
    require('./nrc/nrc-program.js');
    require('./nrc/nrcTaskController.js');
    require('./pitRepair/pitRepair-flight.js');
    require('./pitRepair/pitRepair-list.js');
    require('./experienceLine/experience-list.js');
    require('./experienceLine/defectHelp-list.js');
    require('./experienceLine/tmcExperience-list.js');
    require('./experienceLine/myPub.js');
    require('./experienceLine/publishLine-exp.js');
    require('./experienceLine/lineExpDetail.js');
    require('./experienceLine/tmcExpDetail.js');
    require('./experienceLine/defect-outline.js');
    require('./maintenance/planeMaintenance.js');
    require('./maintenance/HomeDispatchList.js');
    require('./apu/apuList.js');
    require('./apu/addOrEditApu.js');
    require('./nrcfeedbak/riirciProcess.js');
    require('./fault/pendToNrc.js');
    require('./nrcfeedbak/allProcessDetail.js');
    require('./nrcfeedbak/airLineProcessDetail.js');
    require('./nrcfeedbak/processImgRecord.js');

    require('./returnStore/return-list.js');
    require('./returnStore/addEditReturn.js');
    require('./returnStore/ccStockReturn.js');
    require('./callCar/callCar-list-controller.js');
    require('./callCar/addCallCarController.js');
    require('./callCar/callCarDetailController.js');
    require('./clockinFeedback/clockInFeedback.js');
    require('./clockinFeedback/clockInFeedbackList.js');

    //修理补片
    require('./nrcphysicalinfo/edit-controller.js');
})();