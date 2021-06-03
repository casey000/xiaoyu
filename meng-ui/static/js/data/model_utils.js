/*************************************************************************
 *
 *页面Model选择组件
 *
 * params: level(显示几级ATA，可选1或2或3)、isCheckParentModel(当我们选择数据时，是否也加上父级的数据)、isRadio(是否需要单选，默认是多选)、
 * open(是否是展开所有的节点)、
 * modelDropDownWidth(下拉列表的宽度，默认是160px)、modelDropDownHeight(下拉列表的高度，默认是230px)
 *
 * 传入params参数格式(Example)：
 *    params:{level:2,isCheckParentModel:false,isRadio:false,open:false,ataDropDownWidth:'160px',ataDropDownHeight:'230px'}
 *
 * 调用方式：
 * <1>.如果当前页面只有一个Model选择框，则直接调用(Example)
 * 　　$("#modelInput").initModelList(params);
 * <2>.如果当前页面有两个或两个以上的Model选择:
 *     a.每一个的参数可能都不一样(有的需要单选，有的需要多选，则需要分开调用，以两个为例):
 *         params1{level:2,isCheckParentModel:false,isRadio:true,open:false,modelDropDownWidth:'300px',modelDropDownHeight:'100px'};
 *         params2{level:3,isCheckParentModel:true,isRadio:false,open:true,modelDropDownWidth:'200px',modelDropDownHeight:'150px'};
 *         //分别调用
 *         $("#modelInput1").initModelList(params1);
 *         $("#modelInput2").initModelList(params2);
 *
 *     b.参数都一样的调用方式:
 *       params{level:2,isCheckParentModel:false,isRadio:true,open:true,modelDropDownWidth:'330px',modelDropDownHeight:'200px'};
 *       $("#modelInput1,#modelInput2,#modelInput3,#modelInput4").initModelList(params);
 *
 ************************************************************************/
//用于缓存相同的Model和Level的数据
var model_cache_data = {};
(function () {

    //全局参数对象
    var _modelUtils;

    $.fn.extend({

        initModelList: function (params) {

            var _self = this;

            var initParam = {
                loadUrl: '/data/model_getModelByLevelAndModel.action',
                //根据Model查询Model下的子Model
                models: "",
                //如果没有参数，则默认三级都显示
                level: 3,
                //当我们选择数据时，是否也加上父级的数据
                isCheckParentModel: true,
                //是否单选
                isRadio: false,
                //只有isRadio为false的时候才生效
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                },
                //是否是展开所有的节点
                open: false,
                //显示下拉列表的宽度
                modelDropDownWidth: '160px',
                //显示下拉列表的高度
                modelDropDownHeight: '230px',
                //是否给当前对象绑定click事件
                bindingClick: true,
                _value: '',
                //选值后回调(重写的方法中可以接收两个参数:value是指选中的值，nodes是选中的节点,zTree是节点树)
                _callback: null
            };

            var Keys = {

                modelKeys: {

                    "MODEL_LEVEL1": "MINI_SPEC_MODEL",

                    "MODEL_LEVEL2": "MINI_SPEC_MINOR_MODEL",

                    "MODEL_LEVEL3": "MINI_SPEC_SUB_MINOR_MODEL"
                },
                levelKeys: {

                    "LEVEL1": 1,

                    "LEVEL2": 2,

                    "LEVEL3": 3
                }
            };

            //合并参数
            _modelUtils = $.extend(initParam, params, Keys);

            if (_self != undefined && _self != null) {

                $.each(this, function (key, value) {

                    _self.model_invok($(value), initParam);
                });
            }
        },

        model_invok: function (_self, initParam) {

            //生成当前ID的目的是为了可以支持一个页面同时存在多个Model选择框
            var currentModelContentId = $(_self).attr("id") + "_modelContent";

            var currentModelListId = $(_self).attr("id") + "_modelList";

            // 给当前页面添加隐藏的Div
            $(this.initModelDivContent(currentModelContentId, currentModelListId, initParam)).appendTo(_self.closest("body"));

            // 如果缓存中取不到数据才从服务器上加载数据
            if (model_cache_data[initParam.models + "_" + initParam.level] == null || model_cache_data[initParam.models + "_" + initParam.level] == undefined) {
                // 获取下拉框model 、 type数据
                $.ajax({
                    url: basePath + initParam.loadUrl,
                    cache: false,
                    dataType: "json",
                    async: false,
                    data: {
                        level: initParam.level,
                        models: initParam.models
                    },
                    success: function (data) {

                        if (null != data) {

                            // 表示是单选
                            if (initParam.isRadio) {

                                $.each(data, function (k, v) {

                                    if (initParam.open) {

                                        v.open = true;
                                    }

                                    if (v.value) {

                                        //如果显示层级是2，则删除第一级的Radio Box
                                        if (initParam.level == initParam.levelKeys.LEVEL2 && v.key == initParam.modelKeys.MODEL_LEVEL1) {

                                            v.nocheck = true;
                                        }

                                        //如果显示层级是3，则删除第一级和第二级的Radio Box
                                        if (initParam.level == initParam.levelKeys.LEVEL3 && (v.key == initParam.modelKeys.MODEL_LEVEL1 || v.key == initParam.modelKeys.MODEL_LEVEL2)) {

                                            v.nocheck = true;
                                        }
                                    }
                                });
                            } else {

                                $.each(data, function (k, v) {

                                    if (initParam.open) {

                                        v['open'] = true;
                                    }
                                });
                            }

                        }//data end if

                        // 缓存当前返回的data
                        model_cache_data[initParam.models + "_" + initParam.level] = data;
                    }
                });// ajax request end
            }//end if

            // 初始化Model的数据(getRadioSetting/getSetting)
            var _modelTreeObject = $.fn.zTree.init($("#" + currentModelListId), _self.getModelSettings(currentModelListId, $(_self).attr("id"), initParam), model_cache_data[initParam.models + "_" + initParam.level]);

            if (_self.val()) {

                $.each(_self.val().split(","), function (i, _value) {

                    var _findModelNode = _modelTreeObject.getNodeByParam("value", _value, null);

                    if (_findModelNode) {

                        _modelTreeObject.checkNode(_findModelNode, true, true);
                    }
                });
            }

            /**
             * 给当前对象绑定click事件
             */
            if (initParam.bindingClick) {

                $(_self).live("click", function () {

                    _self.showModelMenu($(_self).attr("id"), currentModelContentId);
                });
            } else {

                _self.showModelMenu($(_self).attr("id"), currentModelContentId);
            }
        },

        getModelSettings: function (contentUlId, inputId, initParam) {

            var _checkObj = "";

            if (initParam.isRadio) {
                _checkObj = {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                }
            } else {
                _checkObj = {
                    enable: true,
                    chkboxType: initParam.chkboxType
                }
            }

            return {
                check: _checkObj,
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function () {

                        var zTree = $.fn.zTree.getZTreeObj(contentUlId);

                        var nodes = zTree.getCheckedNodes(true);

                        var v = "";

                        $.each(nodes, function (_i, _v) {

                            if (!initParam.isCheckParentModel && initParam.level > 1) {

                                //如果是第二级则不显示第一级的Value
                                if (initParam.level == initParam.levelKeys.LEVEL2 && _v.key == initParam.modelKeys.MODEL_LEVEL2) {

                                    v += _v.value + ",";
                                }

                                //如果是第三级则不显示第二级和第一级的Value
                                if (initParam.level == initParam.levelKeys.LEVEL3 && _v.key == initParam.modelKeys.MODEL_LEVEL3) {

                                    v += _v.value + ",";
                                }

                            } else {

                                v += _v.value + ",";
                            }
                        });

                        if (v.length > 0) {

                            v = v.substring(0, v.length - 1);
                        }

                        var cityObj = $("#" + inputId);

                        cityObj.attr("value", v);

                        //v是指回调传入的选中的值，nodes是选中的节点,zTree是节点树
                        _modelUtils && _modelUtils._callback && _modelUtils._callback.call(this, v, nodes, zTree);
                    }
                }
            };
        },

        /**
         * 显示Menu的公共方法
         *
         * @param inputId
         * @param contentId
         */
        showModelMenu: function (inputId, contentId) {

            var cityObj = $("#" + inputId);

            var cityOffset = cityObj.offset();

            $("#" + contentId).bind('');

            $("#" + contentId).css({
                left: cityOffset.left + "px",
                top: cityOffset.top + cityObj.outerHeight() + 1 + "px"
            }).slideDown("fast");

            $("body").bind("mousedown", function (event) {
                if (!(event.target.id == "menuBtn" || event.target.id == inputId
                    || event.target.id == contentId || $(event.target).parents("#" + contentId).length > 0)) {
                    $("#" + contentId).fadeOut("fast");
                }
            });
        },

        initModelDivContent: function (modelContentId, modelListId, initParam) {

            var modelDiv = "<div id='" + modelContentId + "' class='menuContent' style='display:none; position: absolute;'>"
                + "<ul id='" + modelListId + "' class='ztree' style='margin-top:0; width:" + initParam.modelDropDownWidth + "; height: " + initParam.modelDropDownHeight + ";background-color:#F2F2F2'></ul>"
                + "</div>";
            return modelDiv;
        }
    });
})(jQuery);