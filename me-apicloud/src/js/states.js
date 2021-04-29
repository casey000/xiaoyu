module.exports = (function () {
    angular.module('myApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('index', {
            url: '/',
            controller: 'entryController',
            templateUrl: 'entry.html',
            resolve: {
                airportSyn: [
                    'airport', 'mefilterFlightInfo', function (airport, mefilterFlightInfo) {
                        return airport.getAirport().then(function (data) {
                            return mefilterFlightInfo.initFilterParams();
                        }).catch(function (error) {
                            return;
                        });
                    }
                ]
            }
        }).state('flightStatus', {
            url: '/flightStatus',
            templateUrl: 'flightInfo/flight-list.html',
            controller: 'flightController',
            resolve: {
                airportSyn: [
                    'airport', 'filterFlightInfo', function (airport, filterFlightInfo) {
                        return airport.getAirport().then(function (data) {
                            return filterFlightInfo.initFilterParams();
                        }).catch(function (error) {
                            return;
                        });
                    }
                ],
                getBrand: ['brand', function (brand) {
                    return brand.initBrand();
                }]
            },
            params: {
                isNewFault: false,
                flightNo: ''
            }
        }).state('faultFlight', {
            url: '/faultFlight',
            templateUrl: 'flightInfo/flight-list.html',
            controller: 'faultFlightController',
            resolve: {
                airportSyn: [
                    'airport', 'filterFaultFlightInfo', function (airport, filterFaultFlightInfo) {
                        return airport.getAirport().then(function (data) {
                            return filterFaultFlightInfo.initFilterParams();
                        }).catch(function (error) {
                            return;
                        });
                    }
                ],
                getBrand: ['brand', function (brand) {
                    return brand.initBrand();
                }]
            },
            params: {
                isNewFault: false
            }
        }).state('faultFlight.flightDetail', {
                url: '/flightDetail',
                views: {
                    'detail': {
                        templateUrl: 'flightInfo/flight-detail.html',
                        controller: 'flightDetailController'
                    }
                },
                params: {
                    openInFlightInfo: '',
                    flightId: ''
                }
        }).state('flightStatus.flightDetail', {
            url: '/flightDetail',
            views: {
                'detail': {
                    templateUrl: 'flightInfo/flight-detail.html',
                    controller: 'flightDetailController'
                }
            },
            params: {
                openInFlightInfo: '',
                flightId: '',
            }
        }).state('flightStatus.flightDetailInWebView', {
            url: '/flightDetail/:flightId',
            views: {
                'detail': {
                    templateUrl: 'flightInfo/flight-detail.html',
                    controller: 'flightDetailController'
                }
            },
            params: {
                openInFlightInfo: '',
                flightId: ''
            }
        }).state('flightStatus.flightDetailPushWithNewPage', {
            url: '/flightDetail/:flightId/:openInNewPage/:newpage',
            views: {
                'detail': {
                    templateUrl: 'flightInfo/flight-detail.html',
                    controller: 'flightDetailController'
                }
            }
        }).state('flightStatus.flightFilter', {
            url: '/flightFilter',
            views: {
                'detail': {
                    controller: 'flightFilterController',
                    templateUrl: 'flightInfo/flight-filter.html'
                }
            },
            resolve: {
                acTypeSyn: ['airport', function (airport) {
                    return airport.getAcType();
                }]
            }
        })
        .state('faultFlight.flightFaultFilter', {
            url: '/flightFaultFilter',
            views: {
                'detail': {
                    controller: 'flightFaultFilterController',
                    templateUrl: 'fault/fault-filter.html'
                }
            },
            resolve: {
                acTypeSyn: ['airport', function (airport) {
                    return airport.getAcType();
                }]
            }
        }).state('search', {
            url: '/search',
            controller: 'searchFlightController',
            templateUrl: 'flightInfo/flight-list.html',
            params: {
                isNewFault: true
            }
        }).state('faultSearchFlight', {
                url: '/faultSearchFlight',
                controller: 'faultSearchFlightController',
                templateUrl: 'flightInfo/flight-list.html',
                params: {
                    isNewFault: true
                }
        })
        // state('flightFavorite', {
        //     url: '/flightFavorite',
        //     controller: 'favorflightController',
        //     templateUrl: 'flightInfo/flight-list.html'

        // }).
        .state('flightStatus.flightDetail.flightReport', {
            url: '/flightReport/:cityReport',
            views: {
                'detailSub': {
                    controller: 'cityWeatherReportController',
                    templateUrl: 'flightInfo/flight-report.html'
                }
            }
        }).state('flightStatus.flightDetail.ddDetail', {
            url: '/flightDD/:acReg',
            views: {
                'detailSub': {
                    controller: 'ddDetailController',
                    templateUrl: 'flightInfo/dd-detail.html'
                }
            },
            params: {
                acStatus: {}
            }

        }).state('report', {
            url: '/report/:flightId',
            controller: 'messageDetailCotroller',
            templateUrl: 'info-detail.html'
        }).state('faultFlight.newfault', {
            url: '/newFault',
            views: {
                'detail': {
                    templateUrl: 'fault/new-fault.html',
                    controller: 'newFaultController'
                }
            },
            params: {
                flight: {},
                tr: false,
            }
        }).state('addFaultHandle', {
            url: '/addFaultHandle',
            controller: 'addFaultHandleController',
            templateUrl: 'fault/add-fault-handle.html',
            params: {
                defectDetail: {
                    acReg: '',
                    itemId: '',
                    rii: false,
                    defectNo: '',
                    station: '',
                    cardId: '',
                    dmStatus:false,
                },
                pt: false,
                toList: [],
                faultReport: {}
            }
        }).state('processAddFaultHandle', {
            url: '/processAddFaultHandle',
            controller: 'processAddFaultHandleController',
            templateUrl: 'fault/process-add-fault-handle.html',
            params: {
                defectDetail: {
                    acReg: '',
                    itemId: '',
                    rii: false,
                    defectNo: '',
                    station: '',
                    cardId: '',
                    dmStatus:false,
                },
                pt: false,
                toList: [],
                faultReport: {},
                nonRoutineItem:{}
            }
        }).state('addFaultMr', {
            url: '/addFaultMr/:timeId',
            controller: 'addFaultMrController',
            templateUrl: 'fault/add-fault-mr.html',
            params: {
                defectDetail: null,
                mrInfo: null,
                sapTaskId:""
            }
        })
        .state('faultMrSearchMaterial', {
            url: '/faultMrSearchMaterial/:timeId',
            controller: 'faultMrSearchMaterialController',
            templateUrl: 'fault/search-material.html',
            params: {
                station: '',
                mrType: '',
                acReg:''
            }
        }).state('searchFault', {
            url: '/searchFault',
            controller: 'searchFaultController',
            templateUrl: 'fault/search-fault.html',
            params: {
                fromIndex: false,
                searchTxt: ''
            }
        }).state('searchFault.faultClose', {
            url: '/faultClose/:defectId',
            views: {
                'faultInfo': {
                    controller: 'faultCloseController',
                    templateUrl: 'fault/detail-close.html'
                }
            },
            params: {
                defectDetail: {},
                faultFlight: '',
                pt: '',
                navIdx: 1,
                handleIdx: 1,
                fromSearch: '',
                from: ''
            }
        }).state('mr', {
            url: '/mr/:searchTxt/:fromIndex/:jobDate',
            controller: 'mrController',
            templateUrl: 'mr/mr-list.html',
            params: {
                fromIndex: '',
                jobDate:""
            }
        }).state('mrAdd', {
            url: '/add/:timeId/:station/:sapTaskId/:jobDate/:assetNum',
            controller: 'mrAddController',
            templateUrl: 'mr/mr-add.html',
            params: {
                fromIndex: false,
                searchTxt: '',
                station:'',
                sapTaskId:'',
                jobDate:"",
                assetNum:""
            }
        })
        //     .state('mr.mrDetail', {
        //     url: '/mrDetail/:mrId/:cardId/:station/:sapTaskId',
        //     controller: 'mrDetailController',
        //     templateUrl: 'mr/mr-detail.html',
        //     params: {
        //         cardId: '',
        //         station:'',
        //         sapTaskId:'',
        //     }
        // })
            .state('mrDetail', {
                url: '/mrDetail/:mrId/:cardId/:station/:sapTaskId',
                controller: 'mrDetailController',
                templateUrl: 'mr/mr-detail.html',
                params: {
                    cardId: '',
                    station:'',
                    sapTaskId:'',
                }
            })
            .state('mrNewSearch.mrNewDtl', {
            url: '/mrNewDtl/:mrId',
            controller: 'mrNewDetailController',
            templateUrl: 'mr/mr-new-detail.html',
            params: {
                station: '',
                storeLoc:""
            }
        }).state('mrNewSearch', {
            url: '/mrNewSearch',
            controller: 'mrNewSearchController',
            templateUrl: 'mr/mr-search.html'
        }).state('searchMaterial', {
            url: '/searchMaterial/:timeId',
            controller: 'mrSearchController',
            templateUrl: 'mr/search-material.html',
            params: {
                station: '',
                pnNo: '',
                acReg: '',
                cardType:'',
            }
        }).state('searchTool', {
            url: '/searchTool',
            controller: 'searchToolController',
            templateUrl: 'tool/search-tool.html'
        }).state('searchTlb', {
            url: '/searchTlb',
            controller: 'searchTlbController',
            templateUrl: 'tlb/search-tlb.html',
            params: {
                searchTxt: '',
                from: ''
            }
        }).state('tlbDetail', {
            url: '/tlbDetail/:tlbId',
            controller: 'tlbDetailController',
            templateUrl: 'tlb/tlb-detail.html',
            // views: {
            //     'tlbDetail': {
            //         controller: 'tlbDetailController',
            //         templateUrl: 'tlb/tlb-detail.html'
            //     }
            // },
            params:{
                formData: {},
                finderInfo: {},
                riiSingerInfo: {},
                MECHSiner: {},
                //tlbNumber: '',
                //tlbId: '',
                getOtherInfo: false,
                zoneInfo:{},
                oilEwisInfo:{}
            }
        }).state('docNoList', {
            url: '/docNoList',
            controller: 'docNoListController',
            templateUrl: 'tlb/doc-list.html',
            params:{
                formData: {},
                finderInfo: {},
                riiSingerInfo: {},
                MECHSiner: {},
                zoneInfo:{},
                oilEwisInfo:{}
            }
        }).state('airInfoList', {
            url: '/airInfoList',
            controller: 'searchAirInfoController',
            templateUrl: 'tlb/search-airInfo.html',
            params:{
                formData: {},
                finderInfo: {},
                riiSingerInfo: {},
                MECHSiner: {},
                zoneInfo:{},
                oilEwisInfo:{}
            }
        }).state('damageDraftList',{
            url: '/damageDraftList',
            controller: 'damageDraftListController',
            templateUrl: 'damage/damage-draft-list.html',
            params: {

            }
        }).state('damageDraftDetail',{
            url: '/damageDraftDetail',
            controller: 'damageDraftDetailController',
            templateUrl: 'damage/damage-draft-detail.html',
            params: {
                listItemInfo: {},
                isCreate: false,
                needRequest: false,
                info: {}
            }
        }).state('damageLocation',{
            url: '/damageLocation',
            controller: 'damageLocationController',
            templateUrl: 'damage/damage-location-size.html',
            params: {
                listItemInfo: {},//损伤草稿列表单元数据
                damageInfo: {},//损伤草稿详情数据
                locationItem: {},//如果是查询状态。则需将位置与尺寸信息列表的查询单元传入
                from: '',//有两处入口，损伤草稿详情与损伤详情
                aircraftInfo: {}
            }
        }).state('searchDamage', {
            //abstract: true,
            url: '/searchDamage',
            controller: 'searchDamageController',
            templateUrl: 'damage/search-damage.html'
        }).state('searchDamageByHand.damageDetail', {
            url: '/damageDetail/:id',
            controller: 'damageDetailController',
            templateUrl: 'damage/damage-detail.html',
            params: {
                id: '',
                from: ''
            }
        }).state('searchDamageByHand.damageDetail.damageReference', {
            url: '/damageReference/:fileId/:acNumber',
            controller: 'damageReferenceController',
            templateUrl: 'damage/damage-reference.html',
            params: {
                info: {},
                type: 1 //1为图片附件，2为损伤二维码
            }
        }).state('searchDamageByHand', {
            url: '/searchDamageByHand',
            controller: 'searchDamageByHandController',
            templateUrl: 'damage/search-damage-byhand.html'
        }).state('searchTool.record', {
            url: '/record',
            views: {
                'record': {
                    controller: 'recordController',
                    templateUrl: 'tool/borrow-record.html'
                }
            }
        }).state('messageList',{
                url: '/messageList',
                controller:'messageListController',
                templateUrl:'message/mess-list.html',
                params: {
                    navIndex: 1
                }
            }
        ).state('fileMessageDetail',{
                url: '/fileMessageDetail',
                templateUrl: 'message/file-mess-detail.html',
                controller:'fileMessDetailController',
                params: {
                    recordItem: {},
                    navIndex: 1,
                }
            }
        ).state('fileMessPdf',{
            url: '/fileMessPdf',
            templateUrl: 'message/file-mess-pdf.html',
            controller: 'fileMessPdfController',
            params: {
                fileParam: {},
                recordItem: {},
                navIndex: 1
            }
        }).state('fileMessPdfIpad',{
            url: '/fileMessPdfIpad',
            templateUrl: 'message/file-mess-pdf-ipad.html',
            controller: 'fileMessPdfController',
            params: {
                fileParam: {},
                recordItem: {},
                navIndex: 1
            }
        }).state('messageDetail', {
            url: '/messageDetail/:flightId',
            controller: 'messageDetailCotroller',
            templateUrl: 'info-detail.html',
            params: {
                'flightId':'',
                'flightInfo': {},
                'flightNo': '',
                'acReg': ''
            }
        }).state('me', {
            url: '/me/:time',
            controller: 'meListController',
            templateUrl: 'me/me-list.html',
            resolve: {
                airportSyn: [
                    'airport', 'mefilterFlightInfo', function (airport, mefilterFlightInfo) {
                        return airport.getAirport().then(function (data) {
                            return mefilterFlightInfo.initFilterParams();
                        }).catch(function (error) {
                            return;
                        });
                    }
                ]
            }

        }).state('me.meStatus', {
            url: '/meStatus',
            views: {
                'detail': {
                    controller: 'meStatusController',
                    templateUrl: 'me/status.html'
                }
            },
            params: {
                acReg: '',
                flightId: '',
                time: ''
            }
        }).state('me.releaseTask', {
            url: '/releaseTask/:jobId',
            views: {
                'detail': {
                    controller: 'meReleaseTaskController',
                    templateUrl: 'me/me-releaseTask.html'
                }
            },
            params: {
                oneFlight: {},
                prFlag: ''//判断是航前还是航后
            }
        }).state('tlbAdd', {
            url: '/tlbAdd/:tlbId',
            templateUrl: 'tlb/add.html',
            controller: 'tlbAddController',
            params: {
                itemId: '',
                ata: '',
                acNo: '',
                lineJobId: '',
                flightId: '',
                flightNo: '',
                station: '',
                rii: 'n',
                cdnType: '',
                dm:'',
                dmValue:'',
                cdnNo: '',
                docNo: '',
                cdnId: '',
                tlbId: '',
                requireFeedback: '',
                routineItem:{},
                checkType: '',
                flightDate: '',
                minorModel:"",
            }
        }).state('me.releaseTask.meForm', {
            url: '/meFrom/:formId',
            views: {
                'subDetail': {
                    controller: 'meFormController',
                    templateUrl: function ($stateParam) {
                        return 'me/' + $stateParam.formId + '.html'
                    }
                }
            },
            params: {
                cardInfo: {},
                oneCardInfo: {},
                taskType: '',
                itemId: '',
                routineCardNumber: '',
                nonRoutineCardNumber: '',
                routineRequireFeedback: '',
                nonRoutineRequireFeedback: '',
                cardType: '',
                flowInstanceId: '',
                isRiiRequired: '',
                routineRequireLisence: '',
                dm:'',
                actionFileArr:[],
                actionImgSrcArr:[],
                actionRemark:'',
                isTlb2TO:false
            }
        }).state('me.releaseTask.takeMateris', {
            url: '/takeMateris/:cardId',
            views: {
                'subDetail': {
                    controller: 'takeMaterisController',
                    templateUrl: 'me/take-materisls.html'
                }
            },
            params: {
                cardInfo: {},
                cardType: '',
                cardNo: '',
                station: '',
                routineItem: {},
                tasks: {}
            }
        }).state('searchMeJob', {
            url: '/searchMeJob/:time',
            controller: 'searchMeJobController',
            templateUrl: 'me/me-list.html'
        }).state('me.meFilter', {
            url: '/meFilter',
            views: {
                'detail': {
                    controller: 'meFilterController',
                    templateUrl: 'me/me-filter.html'
                }
            },
            resolve: {
                acTypeSyn: ['airport', function (airport) {
                    return airport.getAcType();
                }]
            }
        }).state('flbDetail', {
            url: '/flbDetail/:lineJobId',
            controller: 'flbDetailController',
            templateUrl: 'me/me-flb-detail.html'
        }).state('ddi', {
            url: '/ddi',
            controller: 'ddiBaseController',
            templateUrl: 'ddi/ddi-base.html',
            params: {
                defectInfo: {},
                pendingInfo:null,
                dataInfo: {},
                faultReport: {}
            }
        }).state('proofreader', {
            url: '/proofreader',
            controller: 'ddiProofreaderController',
            templateUrl: 'ddi/ddi-proofreader.html'
        }).state('myTask', {
            url: '/mytask',
            controller: 'ddiMyTaskController',
            templateUrl: 'ddi/ddi-mytask.html'
        }).state('approve', {
            url: '/approve/:approveId',
            controller: 'ddiApproveController',
            templateUrl: 'ddi/ddi-approve.html',
            params: {
                approveId: "",
                dataInfo: {}
            }
        }).state('mrApprove', {
            url: '/mrApprove',
            controller: 'mrApproveController',
            templateUrl: 'ddi/mr-approve.html',
            params: {
                mrId: '',
                type: '',
                processId: ''
            }
        }).state('cc', {
            url: '/cc',
            controller: 'ccAddController',
            templateUrl: 'cc/cc-add.html',
            params: {
                defectInfo: {},
                tlbId: '',
                tlbNo: '',
                flightId: '',
                itemId: '',
                cc: {},
                docNo: '',
                docType: 'defect' //默认故障类型
            }
        }).state('newcc', {
            url: '/newcc/:sapTaskId',
            controller: 'newccAddController',
            templateUrl: 'ccNew/newcc-add.html',
            params: {
                defectInfo: {},
                sapTaskId:'',
                tlbId: '',
                tlbNo: '',
                flightId: '',
                itemId: '',
                editBase:{},
                editNext:[],
                prohibitList:[],
                cc: {},
                docNo: '',
                docType: 'defect' //默认故障类型
            }
        }).state('ccInfo', {  //从其它页面直接跳入详情页面时使用
            url: '/ccInfo',
            controller: 'ccInfoController',
            templateUrl: 'cc/fault-cc.html',
            params: {
                ccInfo: {},
                fromTlb: true
            }
        }).state('newccInfo', {  //从其它页面直接跳入详情页面时使用
            url: '/newccInfo',
            controller: 'newccInfoController',
            templateUrl: 'ccNew/newCC-info.html',
            params: {
                ccInfo: {},
                fromTlb: true
            }
        }).state('searchFault.faultClose.ccInfo', {
            url: '/ccInfo',
            views:{
                ccInfo: {
                    controller: 'ccInfoController',
                    templateUrl: 'cc/fault-cc.html'
                }
            },

            params: {
                ccInfo: {}
            }
        }).state('searchFault.faultClose.newccInfo', {
            url: '/newccInfo',
            views:{
                ccInfo: {
                    controller: 'newccInfoController',
                    templateUrl: 'ccNew/newCC-info.html'
                }
            },

            params: {
                ccInfo: {}
            }
        }).state('tlbToccFileRecord', {
            url: '/fileRecord',
            controller: 'faultFileRecordController',
            templateUrl: 'fault/file-record.html',
            params: {
                //isHandle: false,
                //isCc: false
                defectId: '',
                interfaceName: '',
                param:{}
            }
        }).state('searchFault.faultClose.ccInfo.fileRecord', {
            url: '/fileRecord',
            views: {
                record:{
                    controller: 'faultFileRecordController',
                    templateUrl: 'fault/file-record.html'
                }
            },
            params: {
                //isHandle: false,
                //isCc: false
                defectId: '',
                interfaceName: '',
                param:{}
            }
        }).state('searchFault.faultClose.faultFileRecord', {
            url: '/faultFileRecord',
            views: {
                ccInfo:{
                    controller: 'faultFileRecordController',
                    templateUrl: 'fault/file-record.html'
                }
            },
            params: {
                interfaceName: '',
                param:{}
            }
        }).state('ac', {
            url: '/ac',
            templateUrl: 'cc/select-ac.html'
        }).state('ccinstall', {
            url: '/ccinstall',
            templateUrl: 'cc/cc-install.html'
        }).state('ccreplace', {
            url: '/ccreplace',
            templateUrl: 'cc/cc-replace.html'
        }).state('ccremove', {
            url: '/ccremove',
            templateUrl: 'cc/cc-remove.html'
        }).state('ccswap', {
            url: '/ccswap',
            templateUrl: 'cc/cc-swap.html'
        }).state('ddiedi', {
            url: '/ddiedi',
            templateUrl: 'dd/ddi-edi.html'
        }).state('pending', {
            url: '/pending',
            controller: 'PendingController',
            templateUrl: 'pending/pending-add.html',
            params: {
                defectInfo: {},
                pendingInfo: null,
                faultReport: {}
            }
        }).state('pendToNrc', {
            url: '/pendToNrc',
            controller: 'pendToNrcController',
            templateUrl: 'fault/pendToNrc.html',
            params: {
                defectDetail: null,
                mrInfo: null
            }
        }).state('faultFileRecord', {
            url: '/faultFileRecord/:defectId',
            controller: 'faultFileRecordController',
            templateUrl: 'fault/file-record.html',
            params: {
                //isHandle: false,
                //isCc: false
                interfaceName: '',
                param:{}
            }
        }).state('svList',{
            url: '/svList',
            controller: 'svListController',
            templateUrl: 'special-vehicle/sv-list.html',
            params: {
                taskInfo:{} //航班信息对象
            }
        }).state('svDetail',{
            url: '/svDetail',
            controller: 'svDetailController',
            templateUrl: 'special-vehicle/sv-detail.html',
            params: {
                state: 1, //1、新建 2、详情状态 3、编辑状态
                listInfo: {},
                taskInfo: {} //航班信息对象
            }
        }).state('nrcfeedbak',{
            url: '/nrcfeedbak/:itemId',
            controller: 'nrcfeedbakController',
            templateUrl: 'nrcfeedback/nrc_feedbak.html',
            params: {
                nrcInfo: {},
            }
        }).state('nrc_taskfeedbak',{
            url: '/nrc_taskfeedbak/:itemId',
            controller: 'nrc_taskfeedbakController',
            templateUrl: 'nrcfeedback/nrc_taskfeedbak.html',
            params: {
                nrcInfo: {},
            }
        }).state('check_nrc',{    //定检类NRC
            url: '/check_nrc',
            controller: 'checknrcController',
            templateUrl: 'nrcfeedback/check_nrc.html',
            params: {}
        }).state('check_nrctask',{      //定检类NRCTASK
            url: '/check_nrctask',
            controller: 'check_nrctaskController',
            templateUrl: 'nrcfeedback/check_nrctask.html',
            params: {}
        }).state('toprocess',{
                url: '/toprocess/:itemId',
                controller: 'toprocessController',
                templateUrl: 'nrcfeedback/to_process.html',
                params: {
                    nrcInfo: {},
                }
            }).state('pcoprocess',{
            url: '/pcorocess/:itemId',
            controller: 'pcoprocessController',
            templateUrl: 'nrcfeedback/pco_process.html',
            params: {
                nrcInfo: {},
            }
        }).state('ddprocess',{
            url: '/ddrocess/:itemId',
            controller: 'ddprocessController',
            templateUrl: 'nrcfeedback/dd_process.html',
            params: {
                nrcInfo: {},
            }
        }).state('jcprocess',{
            url: '/jcrocess/:itemId',
            controller: 'jcprocessController',
            templateUrl: 'nrcfeedback/jc_process.html',
            params: {
                nrcInfo: {},
            }
        }).state('fixedInspect',{
            url: '/fixedInspect',
            controller: 'fixedInspectController',
            templateUrl: 'fixedInspect/fixedInspect-list.html',
            params: {

            }
        }).state('fixedDetail',{
            url: '/fixedDetail',
            controller: 'fixedDetailController',
            templateUrl: 'fixedInspect/fixedDetail.html',
            params: {
                fixedId: '',
                fixedFlightId: '',
                acReg: '',
                fixModel: '',
                fixAcid: '',
                fixWorkId: '',
                fixStatus: '',
                fixedFlightNo: '',
                fixedJobDate: '',
                fixedStation: '',
                fixedDmStatus: '',
                fixedRevtp: '',
            }
        }).state('fixedSearch',{
            url: '/fixedSearch',
            controller: 'fixedSearchController',
            templateUrl: 'fixedInspect/fixed-search.html',
            params: {

            }
        }).state('addNrc',{
            url: '/addNrc',
            controller: 'addNrcController',
            templateUrl: 'nrc/add-nrc.html',
            params: {
                fixAcreg:'',
                fixModel:'',
                fixAcid: '',
                fixWorkId: '',
                nrcId:'',

            }
        }).state('nrcDetail',{
            url: '/nrcDetail',
            controller: 'nrcDetailController',
            templateUrl: 'nrc/nrc-detail.html',
            params: {
                nrcId:'',
                status:'',
                processId:'',

            }
        }).state('nrcDetail.fileRecord', {
            url: '/processImgRecord',
            views: {
                record:{
                    controller: 'processImgRecordController',
                    templateUrl: 'nrcfeedback/processImgRecord.html'
                }
            },
            params: {
                imgArr:[]
            }
        }).state('nrcProgram',{
            url: '/nrcProgram',
            controller: 'nrcProgramController',
            templateUrl: 'nrc/nrc-program.html',
            params: {
                nrcId:'',

            }
        }).state('nrcTask',{
            url: '/nrcTask',
            controller: 'nrcTaskController',
            templateUrl: 'nrc/nrcTaskDet.html',
            params: {
                nrcId:'',

            }
        }).state('pitRepairFlight',{
            url: '/pitRepairFlight',
            controller: 'pitRepairFlightController',
            templateUrl: 'pitRepair/pitRepair-flight.html',
            params: {

            }
        }).state('pitRepairList',{
            url: '/pitRepairList',
            controller: 'pitRepairListController',
            templateUrl: 'pitRepair/pitRepair-list.html',
            params: {
                ac:''
            }
        }).state('experienceList',{
            url: '/experienceList',
            controller: 'experienceListController',
            templateUrl: 'experienceLine/experience-list.html',
            params: {
                fromIndex: false,
            }
        }).state('defectHelpList',{
            url: '/defectHelpList',
            controller: 'defectHelpListController',
            templateUrl: 'experienceLine/defectHelp-list.html',
            params: {
                fromIndex: false,
                ata:'',
                acReg:'',
                acModel:'',
                keywords:'',
                defectId:'',
            }
        }).state('myPub',{
            url: '/myPub',
            controller: 'myPubController',
            templateUrl: 'experienceLine/myPub.html',
            params: {

            }
        }).state('pubLine',{
            url: '/pubLine',
            controller: 'publishLineController',
            templateUrl: 'experienceLine/publishLine-exp.html',
            params: {
                expId:''
            }
        }).state('experienceList.lineExpDetail',{
            url: '/lineExpDetail',
            views:{
                'detail':{
                    controller: 'lineExpDetailController',
                    templateUrl: 'experienceLine/lineExpDetail.html',
                }
            },

            params: {
                 id :'',
                isEdit:''
            }
        }).state('experienceList.defectOutline',{
            url: '/defectOutline',
            views:{
                'detail':{
                    controller: 'defectOutlineController',
                    templateUrl: 'experienceLine/defect-outline.html',
                }

            },
            params: {
               defectId:'',
                from:''
            }
        }).state('experienceList.tmcExpDetail',{
            url: '/tmcExpDetail',
            views:{
                'detail':{
                    controller: 'tmcExpDetailController',
                    templateUrl: 'experienceLine/tmcExpDetail.html',
                }

            },
            params: {
                id:''
            }
        }).state('tmcExperienceList',{
            url: '/tmcExperienceList',
            controller: 'tmcExperienceListController',
            templateUrl: 'experienceLine/tmcExperience-list.html',
            params: {
                ata:'',
                acReg:'',
                acModel:'',
                keywords:'',
                srcType:'',
                relateddefectId:''
            }
        }).state('planeMaintenance',{
            url: '/planeMaintenance',
            controller: 'planeMaintenanceController',
            templateUrl: 'maintenance/planeMaintenance.html',
            params: {

            }
        }).state('returnList',{
            url: '/returnList/:returnOrderId',
            controller: 'returnListController',
            templateUrl: 'returnStore/return-list.html',
            params: {
                returnOrderId:'',
                workStation:'',
                rtFlightNo:'',
                rtFlightId:'',
            }
        }).state('addEditReturn',{
            url: '/addEditReturn/',
            controller: 'addEditReturn',
            templateUrl: 'returnStore/addEditReturn.html',
            params: {
                workStation:'',
                returnOrderId:'',
                rtFlightNo:'',
                rtFlightId:'',
                returnId:'',
                fromHome:''

            }
        }).state('ccStockReturn',{
            url: '/ccStockReturn/',
            controller: 'ccStockReturn',
            templateUrl: 'returnStore/ccStockReturn.html',
            params: {
                returnId:'',
            }
        }).state('ccoprocess',{
            url: '/ccorocess/:itemId/:sapTaskId',
            controller: 'ccoprocessController',
            templateUrl: 'nrcfeedback/cco_process.html',
            params: {
                nrcInfo: {},
            }
        }).state('followAircraftMaterial', {//随机航材
            url: '/followAircraftMaterial/:flightNo/:flightId',
            controller: 'followAircraftMaterialController',
            templateUrl: 'me/follow-aircraftMaterial.html',
            params: {
                flightNo:'',
                flightId:''
            }
        }).state('WayBillDetails', {//随机航材
            url: '/WayBillDetails',
            controller: 'WayBillDetailsController',
            templateUrl: 'me/waybill-details.html',
            params: {
                focFlightId:'',
                arrivalOrDeparture:'',
                requisitionId:''
            }
        }).state('apuList',{
            url: '/apuList/:jobId/:flightId/:workType',
            controller: 'apuListController',
            templateUrl: 'apu/apuList.html',
            params: {

            }
        }).state('addOrEditApu',{
            url: '/addOrEditApu',
            controller: 'addOrEditApuController',
            templateUrl: 'apu/addOrEditApu.html',
            params: {
                isFirst:'',
                isEdit:'',
                isSec:'',
                jobType:'',
                apuInfo:{}
            }
        }).state('riirciProcess',{
            url: '/riirciProcess',
            controller: 'riirciProcessController',
            templateUrl: 'nrcfeedback/riirciProcess.html',
            params: {
                type:'',
                businessId:'',
                taskId:'',
                rii:'',
                rci:'',
                subType:''

            }
        }).state('allProcessDetail',{
            url: '/allProcessDetail',
            controller: 'allProcessDetailController',
            templateUrl: 'nrcfeedback/allProcessDetail.html',
            params: {
                formId:'',
                cardInfo:'',
                oneCardInfo:''

            }
        }).state('airLineProcessDetail',{
            url: '/airLineProcessDetail/:workId/:cardType/:isEdit',
            controller: 'airLineProcessDetailController',
            templateUrl: 'nrcfeedback/airLineProcessDetail.html',
            params: {
                paramObj:{}

            }
        }).state('airLineProcessDetail.fileRecord', {
            url: '/processImgRecord',
            views: {
                record:{
                    controller: 'processImgRecordController',
                    templateUrl: 'nrcfeedback/processImgRecord.html'
                }
            },
            params: {
                imgArr:[]
            }
        }).state('searchFault.faultClose.fileRecord', {
            url: '/processImgRecord',
            views: {
                ccInfo:{
                    controller: 'processImgRecordController',
                    templateUrl: 'nrcfeedback/processImgRecord.html'
                }
            },
            params: {
                imgArr:[]

            }
        }).state('addEditFaultMr', {
            url: '/addEditFaultMr/:timeId/:sapTaskId',
            controller: 'addEditFaultMrController',
            templateUrl: 'fault/add-edit-fault-mr.html',
            params: {
                defectDetail: null,
                mrInfo: null,
                sapTaskId:""
            }
        }).state('transferReceiving',{
            url: '/transferReceiving/:station',
            controller: 'transferReceivingController',
            templateUrl: 'mr/transfer-receiving.html',
            params: {

            }
        }).state('receivingDetail',{
            url: '/receivingDetail/:orderNo/:orderItem',
            controller: 'receivingDetailController',
            templateUrl: 'mr/receiving-detail.html',
            params: {
                orderNo:'',
                orderItem:''
            }
        }).state('searchByNumber',{
            url: '/searchByNumber',
            controller: 'searchByNumberController',
            templateUrl: 'mr/search-by-number.html',
            params: {
            }
        }).state('HomeDispatchList',{
            url: '/HomeDispatchList',
            controller: 'HomeDispatchListController',
            templateUrl: 'maintenance/HomeDispatchList.html',
            params: {
                station:""
            }
        }).state('dispatchList',{
            url: '/dispatchList/:workOrderId/:station',
            controller: 'dispatchListController',
            templateUrl: 'mr/dispatch-list.html',
            params: {
                workOrderId:"",
                station:""
            }
        }).state('searchByPn',{
            url: '/searchByPn/:workOrderId/:station',
            controller: 'searchByPnController',
            templateUrl: 'mr/search-by-pn.html',
            params: {
                workOrderId:"",
                station:""
            }
        }).state('dispatchDetail',{
            url: '/dispatchDetail/:station/:pn/:mrNo/:needQty/:unt/:sapTaskId/:mrItem/:sentQty/:batchNo/:sn',
            controller: 'dispatchDetailController',
            templateUrl: 'mr/dispatch-detail-submit.html',
            params: {
                // pn:"",
                // mrNo:"",
                // needQty:"",
                // unit:"",
                // sapTaskId:"",
                // mrItem:"",
                // sentQty:"",
                // sn:"",
                // batchNo:"",
                // station:""
            }
        }).state('riirciProcess.processImgRecord', {
            url: '/processImgRecord',
            views: {
                record:{
                    controller: 'processImgRecordController',
                    templateUrl: 'nrcfeedback/processImgRecord.html'
                }
            },
            params: {
                imgArr:[]

            }
        }).state('tlbDetail.processImgRecord', {
            url: '/processImgRecord',
            views: {
                record:{
                    controller: 'processImgRecordController',
                    templateUrl: 'nrcfeedback/processImgRecord.html'
                }
            },
            params: {
                imgArr:[]

            }
        }).state('HomeDispatchList.dispatchDetail',{
            url: '/dispatchDetail/:station/:pn/:mrNo/:needQty/:unt/:sapTaskId/:mrItem/:sentQty/:batchNo/:sn',
            views: {
                record:{
                    controller: 'dispatchDetailController',
                    templateUrl: 'mr/dispatch-detail-submit.html',
                }
            },
            params: {
                // pn:"",
                // mrNo:"",
                // needQty:"",
                // unit:"",
                // sapTaskId:"",
                // mrItem:"",
                // sentQty:"",
                // sn:"",
                // batchNo:"",
                // station:""
            }
        }).state( 'nrcPhysicalInfo', {
            url: '/nrcPhysicalInfo',
            controller: 'nrcPhysicalInfoController',
            templateUrl: 'nrcphysicalinfo/nrcPhysicalInfo-edit.html',
            params: {
                nrcId: '',
                operate: '',
                phy: {}
            }
        }).state('flightReadyCheck',{
            url: '/flightReadyCheck/:id',
            controller: 'flightCheckController',
            templateUrl: 'ddi/flight-check.html',
            params: {
                id:''
            }
        }).state('callCarList',{
            url: '/callCarList',
            controller: 'callCarListController',
            templateUrl: 'callCar/callCar-list.html',
            params: {
            }
        }).state('addCallCar',{
            url: '/addCallCar',
            controller: 'addCallCarController',
            templateUrl: 'callCar/add-callCar.html',
            params: {
            }
        }).state('callCarDet',{
            url: '/callCarDet',
            controller: 'callCarDetailController',
            templateUrl: 'callCar/callCarDetail.html',
            params: {
                taskId:'',
                airportCode:''
            }
        }).state('restMakeUp', {
            url: '/restMakeUp/:id/:type',
            controller: 'restMakeUpController',
            templateUrl: 'fault/rest-make-up.html',
            params: {
                id:'',
                type:''
            }
        }).state('restMakeUpNext', {
            url: '/restMakeUpNext/:id',
            controller: 'restMakeUpNextController',
            templateUrl: 'fault/rest-make-up-next.html',
            params: {
                id:''
            }
        }).state('clockInFeedback',{
            url: '/clockInFeedback/:navIdx',
            controller: 'clockInFeedbackController',
            templateUrl: 'clockinFeedback/clock-in-feedback.html',
            params: {
                navIdx:"",
                id:"",
                recordDate:"",
                recordType:"",
                workType:"",
                station:""
            }
        }).state('clockInFeedbackList',{
            url: '/clockInFeedbackList',
            controller: 'clockInFeedbackListController',
            templateUrl: 'clockinFeedback/clock-in-feedback-list.html',
            params: {
                navIdx:""
            }
        })

    }])
})();