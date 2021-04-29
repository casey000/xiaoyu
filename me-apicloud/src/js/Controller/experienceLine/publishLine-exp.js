module.exports = angular.module('myApp')
    .controller('publishLineController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errorTip = '';
        $scope.editorDto = [];
        $scope.addMrFlow = false; //添加人员弹窗
        $rootScope.endLoading();
        if($stateParams.expId){
            $scope.id = $stateParams.expId;
            $rootScope.expId = $stateParams.expId;
        }else{
            $scope.id = $rootScope.expId;
        };
        var queryJSON = {
            pageSize: 20,
            pageIndex: 1,
            type:  $scope.searchType,
            inputValue:''
        };
        $scope.inspector = {
            nameAndId: '',
            approverName:'',
            approverSn:''
        };
        $scope.info = {
            title:'',
            acModel:'',
            acModelList:[],
            ataInfo: {},
            text:'',
            selectModel:[]
        };
        var lanConfig = require('../../../../i18n/lanConfig');
        $scope.holderValue = '请输入搜索内容';
        $scope.searchVal = '';

        var buttons = [
            {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                dataurl: function( commands, type,dataurl, button ) {
                    if( ! type.match(/^image/i) )
                        return;
                    console.log(commands);
                     commands.insertHTML( '<img src="'+dataurl+'" style="max-width:100%;max-height:20em;">' );
                     // commands.insertImage(dataurl);
                },
                attr: { // attributes
                    title: 'Insert image',
                },
            },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
            //     action: 'bold',
            //     hotkey: 'b',
            //     attr: { // attributes
            //         title: 'Bold (Ctrl+B)',
            //     },
            // },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>',
            //     action: 'italic',
            //     hotkey: 'i',
            //     attr: { // attributes
            //         title: 'Italic (Ctrl+I)',
            //     },
            // },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>',
            //     action: 'underline',
            //     hotkey: 'u',
            //     attr: { // attributes
            //         title: 'Underline (Ctrl+U)',
            //     },
            // },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"/></svg>',
            //     action: 'strikethrough',
            //     hotkey: 's',
            //     attr: { // attributes
            //         title: 'Strikethrough (Ctrl+S)',
            //     },
            // },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path fill-opacity=".36" d="M0 20h24v4H0z"/><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/></svg>',
            //     action: 'colortext',
            //     attr: { // attributes
            //         title: 'Text color',
            //     },
            // },
            // {
            //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path fill-opacity=".36" d="M0 20h24v4H0z"/></svg>',
            //     action: 'colorfill',
            //     attr: { // attributes
            //         title: 'Background color',
            //     },
            // },
            // {
            //     icon: '<span class="fa fa-subscript"></span>', // font-awesome demo
            //     action: 'subscript',
            //     attr: { // attributes
            //         title: 'Subscript',
            //     },
            // },
            // {
            //     icon: '<span class="fa fa-superscript"></span>', // font-awesome demo
            //     action: 'superscript',
            //     attr: { // attributes
            //         title: 'Superscript',
            //     },
            // },
            // {
            //     icon: '<span class="fa fa-list-ol"></span>', // font-awesome demo
            //     action: 'orderedlist',
            //     attr: { // attributes
            //         title: 'Ordered list',
            //     },
            // },
            // {
            //     icon: '<span class="fa fa-list-ul"></span>', // font-awesome demo
            //     action: 'unorderedlist',
            //     attr: { // attributes
            //         title: 'Unordered list',
            //     },
            // },
            // {
            //     icon: '<span class="fa fa-eraser"></span>', // font-awesome demo
            //     action: 'clearformat',
            //     attr: { // attributes
            //         title: 'Remove format',
            //     },
            // }
            ];
        var interceptenter = function()
        {
            return false;
        };
        var suggester = function( term, response )
        {
            return false ;
        }
        var editor;
        window.editor = wysiwyg( '#look_content', {
            toolbar: 'bottom',                           // 'top','bottom',null
            buttons: buttons,                       // buttons on toolbar
            selectionbuttons: buttons.slice(1,2),     // buttons on selection-toolbar
            suggester: suggester,  // handle suggestions
            interceptenter:interceptenter,         // intercept 'enter'
            hijackmenu: false                         // toolbar instead context menu
        });

        $scope.init = function(){
            server.maocGetReq('assembly/analysisDomainTypeByCode', {domainCode:'DA_ACREG_MP_ACTYPE'}).then(function (data) {
                console.info(data.data,'data');
                if (data.data.statusCode == 200) {
                    $scope.info.acModelList = data.data.data[0].DA_ACREG_MP_ACTYPE;
                    if($scope.id){
                        $scope.editInit()
                    }else{

                    }
                }

            }).catch(function (error) {

            });


        };
        $scope.init();
        $scope.modelChanged = function(){
            console.info($scope.info.selectModel)
            // if ($scope.info.acModel && $scope.info.acModel.length > 0) {
            //     $scope.noticesType = $scope.info.program.notices.join(',');
            // }
            // else {
            //     $scope.noticesType = '';
            // }
        };
        $scope.editInit = function (){

                $rootScope.startLoading();
                server.maocGetReq('airLineExp/getAirLineExpById', {id: $scope.id,isEdit:true}).then(function (data) {
                    if (data.status === 200) {
                        console.info('123');
                        $scope.respon = data.data.data[0];
                        $scope.editorDto = $scope.respon.participantUserVOS;
                        // for(var i in $scope.respon.participantUserVOS){
                        //     $scope.editorDto[i].approverName =  $scope.respon.participantUserVOS[i].name;
                        //     $scope.editorDto[i].approverSn =  $scope.respon.participantUserVOS[i].sn;
                        // }
                        // $scope.editorDto = $scope.respon.participantUserVOS;
                        for(var i in $scope.editorDto){
                            $scope.editorDto[i].approverName =  $scope.editorDto[i].name;
                            $scope.editorDto[i].approverSn =  $scope.editorDto[i].sn;
                        }
                        console.info($scope.editorDto);
                        $scope.info.ataInfo.value = $scope.respon.ata;
                        $scope.info.selectModel = $scope.respon.model.split(',');
                        $scope.info.title = $scope.respon.title;
                        window.editor.setHTML($scope.respon.content);
                        // var report = $scope.info.participantUserVOS;
                        // for (var i in report){
                        //     $scope.author += report[i].name;
                        //     if (i < report.length - 1) {
                        //         $scope.author += ',';
                        //     }
                        // };

                    }
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });

        };
        $scope.addEditor = function(){
            $scope.inspector = {
                nameAndId: '',
                approverName:'',
                approverSn:''
            };
            $scope.addMrFlow = true;
        };
        $scope.addSure = function(){
            if($scope.inspector.approverSn){
                if($scope.editorDto.length > 0){
                    for(var i in $scope.editorDto){
                        if( $scope.editorDto[i].approverSn == $scope.inspector.approverSn){
                            $rootScope.errTip = '不能添加重复作者';
                            break;
                        }else{
                            $scope.editorDto.push($scope.inspector);
                            $scope.addMrFlow = false;
                            break;
                        }
                    }
                }else{
                    $scope.editorDto.push($scope.inspector);
                    $scope.addMrFlow = false;
                }



            }else{
                $rootScope.errTip = '请选择下拉列表中的人员';
            }

        };
        $scope.cancelMr = function(){
            $scope.addMrFlow = false;
            $scope.inspector = {
                nameAndId: '',
                approverName:'',
                approverSn:''
            };
        };
        $scope.deleteEditor = function(event,index){
            $scope.editorDto.splice(index,1)
        };

        $scope.keyEvent = function (event) {
            if (event.keyCode === 13) {
                $scope.clickBtnSearch();
            }
        };
        $scope.submit = function(){
            $rootScope.startLoading();
            var person='';
            for (var i in $scope.editorDto){
                person += $scope.editorDto[i].approverSn;
                if (i < $scope.editorDto.length - 1) {
                    person += ',';
                }
            }
            var url = "airLineExp/addOrUpdateAirLineExp";
            var dataObj = {};
            dataObj['ata'] = $scope.info.ataInfo.value;
            dataObj['model'] = $scope.info.selectModel.join(',');
            dataObj['participantSn'] = person;
            dataObj['title'] = $scope.info.title;
            dataObj['content'] =  window.editor.getHTML();
            if($scope.id){
                dataObj['id'] = $scope.id;
            }
            // if(!dataObj['ata'] || dataObj['ata'] == ''){
            //     $rootScope.endLoading();
            //     alert('ATA必填');
            //     return ;
            // };
            // if(!dataObj['model'] || dataObj['model'] == ''){
            //     $rootScope.endLoading();
            //     alert('机型必填');
            //     return;
            // };
            if(!dataObj['title'] || dataObj['title'] == ''){
                $rootScope.endLoading();
                alert('标题必填');
                return;
            };
            if(!dataObj['content'] || dataObj['content'] == ''){
                $rootScope.endLoading();
                alert('内容必填');
                return;
            };
            if(!dataObj['participantSn'] || dataObj['participantSn'] == ''){
                $rootScope.endLoading();
                alert('参与作者必填');
                return;
            }
            console.info(dataObj);
            server.maocPostReq(url, dataObj, true).then(function (result) {
                $scope.submitState = false;
                if (200 === result.status) {
                    alert('发布成功')
                    $rootScope.go('back')
                }
                $rootScope.endLoading();
            }).catch(function (error) {
                $scope.submitState = false;
                $rootScope.endLoading();
            });
        }






        //输入搜索条件后回车返回搜索结果
        $scope.enter = function (ev, materialsearchTxt) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                $scope.clickBtnSearch(materialsearchTxt);
            }
        };
    }
    ]);
