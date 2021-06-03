/*************************************************************************
 *
 *页面ATA选择组件
 *
 * params: model(机型，多个机型之间用，分隔)、level(显示几级ATA，可选1或2或3)、isRadio(是否需要单选，默认是多选)、
 * isCheckFirstLevelAta(这个属性是为重要事件模块设置，默认true,如果改为false的话，全选时，第一级菜单的Value不被填充到Input框中)、
 * ataDropDownWidth(下拉列表的宽度，默认是130px)、ataDropDownHeight(下拉列表的高度，默认是130px)
 *
 * 传入params参数格式(Example)：
 *    params:{model:'B737,B757',level:2,isCheckFirstLevelAta:false,isRadio:false,ataDropDownWidth:'330px',ataDropDownHeight:'200px'}
 *
 * 调用方式：
 * <1>.如果当前页面只有一个ATA选择框，则直接调用(Example)
 * 　　$("#ataInput").initAtaList(params);
 * <2>.如果当前页面有两个或两个以上的ATA选择:
 *     a.每一个的参数可能都不一样(有的需要单选，有的需要多选，则需要分开调用，以两个为例):
 *         params1{model:'B737',level:2,isCheckFirstLevelAta:false,isRadio:true,ataDropDownWidth:'330px',ataDropDownHeight:'200px'};
 *         params2{model:'B737',level:3,isCheckFirstLevelAta:true,isRadio:false,ataDropDownWidth:'330px',ataDropDownHeight:'200px'};
 *         //分别调用
 *         $("#ataInput1").initAtaList(params1);
 *         $("#ataInput2").initAtaList(params2);
 *
 *     b.参数都一样的调用方式:
 *       params{model:'B737',level:2,isCheckFirstLevelAta:false,isRadio:true,ataDropDownWidth:'330px',ataDropDownHeight:'200px'};
 *       $("#ataInput1,#ataInput2,#ataInput3,#ataInput4").initAtaList(params);
 *
 ************************************************************************/
//用于缓存相同的Model和Level的数据
var ata_cache_data = {};

(function () {
    $.fn.extend({

        initAtaList: function (params) {

            var _self = this;

            var initParam = {
                //如果没有参数，则查询所有的Model
                model: '',
                //如果没有参数，则默认三级都显示
                level: 3,
                //是否显示一级ATA选中时所选择的Value,默认是显示
                isCheckFirstLevelAta: true,
                //是否单选
                isRadio: false,
                //只有isRadio为false的时候才生效
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                },
                //显示下拉列表的宽度
                ataDropDownWidth: '130px',
                //显示下拉列表的高度
                ataDropDownHeight: '200px',
                //是否给当前对象绑定click事件
                bindingClick: true
            };

            //合并参数
            $.extend(initParam, params);

            if (_self != undefined && _self != null) {

                $.each(this, function (key, value) {

                    _self.ata_invok($(value), initParam);
                });
            }
        },

        ata_invok: function (_self, initParam) {

            //生成当前ID的目的是为了可以支持一个页面同时存在多个ATA选择框
            var currentAtaContentId = $(_self).attr("id") + "_ataContent";

            var currentAtaListId = $(_self).attr("id") + "_ataList";

            // 给当前页面添加隐藏的Div
            $(this.initAtaDivContent(currentAtaContentId, currentAtaListId, initParam.ataDropDownWidth, initParam.ataDropDownHeight)).appendTo(_self.closest("body"));

            // 如果缓存中取不到数据才从服务器上加载数据
            if (ata_cache_data[initParam.model + "_" + initParam.level] == null || ata_cache_data[initParam.model + "_" + initParam.level] == undefined) {
                // 获取下拉框model 、 type数据
                $.ajax({
                    url: basePath + "/data/ata_chapter_getAtaByModelAndLevel.action",
                    cache: false,
                    dataType: "json",
                    async: false,
                    data: {
                        level: initParam.level,
                        model: initParam.model
                    },
                    success: function (data) {

                        // 表示是单选
                        if (initParam.isRadio) {

                            if (null != data) {

                                $.each(data, function (k, v) {

                                    if (v['value'] != null && v['value'] != "") {

                                        // 如果是二级，则需要删除第一级的RadioBox
                                        if (initParam.level == 2) {

                                            if (v['value'].length < 4) {

                                                v['nocheck'] = true;
                                            }
                                        }

                                        // 如果是三级，则需要删除第一、二级的RadioBox
                                        if (initParam.level == 3) {

                                            if (v['value'].length < 7) {

                                                v['nocheck'] = true;
                                            }
                                        }
                                    }
                                });
                            }
                        }

                        // 缓存当前返回的data
                        ata_cache_data[initParam.model + "_" + initParam.level] = data;
                    },//success function end
                    error: function () {
                        $.dialog.alert("获取ATA下拉列表数据失败!");
                    }
                });// ajax request end
            }//end if

            // 初始化ATA的数据(getRadioSetting/getSetting)
            var _ataTreeObject = $.fn.zTree.init($("#" + currentAtaListId), _self.getAtaSettings(currentAtaContentId, currentAtaListId, $(_self).attr("id"), initParam.isCheckFirstLevelAta, initParam.isRadio, initParam.chkboxType), ata_cache_data[initParam.model + "_" + initParam.level]);

            if (_self.val()) {

                $.each(_self.val().split(","), function (i, _value) {

                    var _findAtaNode = _ataTreeObject.getNodeByParam("value", _value, null);

                    if (_findAtaNode) {

                        _ataTreeObject.checkNode(_findAtaNode, true, true);
                    }
                });
            }

            _self.showAtaMenu($(_self).attr("id"), currentAtaContentId);
            /**
             * 给当前对象绑定click事件
             *//*
			if(initParam.bindingClick){
				
				$(_self).live("click", function() {

				});
			}else{
				
				_self.showAtaMenu($(_self).attr("id"),currentAtaContentId);
			}*/
        },

        getAtaSettings: function (currentAtaContentId, contentUlId, inputId, isCheckFirstLevelAta, isRadio, _chkboxType) {

            var _checkObj = "";

            if (isRadio) {
                _checkObj = {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                }
            } else {
                _checkObj = {
                    enable: true,
                    chkboxType: _chkboxType
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
                        for (var i = 0, l = nodes.length; i < l; i++) {

                            //不显示第一级所选中的ATA的值
                            if (!isCheckFirstLevelAta) {

                                if (nodes[i].value.length > 2) {

                                    v += nodes[i].value + ",";
                                }
                            } else {

                                v += nodes[i].value + ",";
                            }
                        }

                        if (v.length > 0) {
                            v = v.substring(0, v.length - 1);
                        }

                        var cityObj = $("#" + inputId);

                        cityObj.attr("value", v);
                        if (isRadio) {
                            //隐藏ata下拉菜单
                            $("#" + currentAtaContentId).hide();
                            //输入框重新获取焦点
                            cityObj.focus();
                        }
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
        showAtaMenu: function (inputId, contentId) {

            var cityObj = $("#" + inputId);
            var cityOffset = cityObj.offset();

            $("#" + contentId).css({
                left: cityOffset.left + "px",
                top: cityOffset.top + cityObj.outerHeight() + 1 + "px"
            }).slideDown("fast");

            $("body").bind("mousedown", function (event) {
                if (!(event.target.id == "menuBtn" || event.target.id == inputId
                    || event.target.id == contentId || $(event.target).parents(
                        "#" + contentId).length > 0)) {
                    $("#" + contentId).fadeOut("fast");
                }
            });
        },

        initAtaDivContent: function (ataContentId, ataListId, ataDropDownWidth, ataDropDownHeight) {

            var ataDiv = "<div id='" + ataContentId + "' class='menuContent' style='display:none; position: absolute;'>"
                + "<ul id='" + ataListId + "' class='ztree' style='margin-top:0; width:" + ataDropDownWidth + "; height: " + ataDropDownHeight + ";background-color:#F2F2F2'></ul>"
                + "</div>";
            return ataDiv;
        }
    });
})(jQuery);