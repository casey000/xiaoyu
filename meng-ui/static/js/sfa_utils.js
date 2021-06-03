//顶层弹出被遮罩处理
if (typeof (P) == "undefined") {
    if (frameElement != null && frameElement.api != null) {
        P = frameElement.api.opener;
    } else {
        P = this.window;
    }
}

(function ($) {
    // constructor for ...
    $.sfa = $.sfa || {};
    $.tools = $.tools || {};

    $.extend($.fn, {
        logger: function (options) {
            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && window.console) {
                    console.warn("nothing selected, can't show logs, returning nothing");
                }
                return;
            }
            //显示日志列表
            var logger = new $.logger(options, this[0]);
        },
        appendLogger: function (options) {
            //日志控制控件
            var logger = new $.logger(options);
            if (this.length) {
                logger.location = this[0];
            }

            //追加页面日志控制按钮
            logger.appendLogger();
        },
        selectBox: function (options) {
            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && window.console) {
                    console.warn("nothing selected, can't init selectBox, returning nothing");
                }
                return;
            }

            //构建selectBox
            $.each(this, function () {
                new $.sfa.selectBox(options, this);
            });
        },
        docs: function (options) {
            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && window.console) {
                    console.warn("no type, can't create doc, returning nothing");
                }
                return;
            }
            //显示日志列表
            var docs = new $.docs(options, this[0]);
        }
    });

    /**************************************************************************************************************
     * 工作流日志插件
     * 异步加载工作流审批log信息
     * 参数说明：
     *        flowIds 必填项 —— 流程实例Id，可以将多个id利用逗号分隔
     * @author sfhq313
     *************************************************************************************************************/
    // constructor for logger
    $.logger = function (options, location) {
        //属性合并
        this.settings = $.extend(true, {}, $.logger.defaults, options);
        if (location) {
            this.location = location;
            this.init();
        }
    };

    $.extend($.logger, {
        //default config
        defaults: {
            url: '/workflow/process/process_logger_list.action',
            flowIds: null,	// 流程实例Ids，可以用逗号进行多个id的分隔
            isLoad: false,		//是否装载日志明细
            type: '1',			//流程类型 1表示流程日志、2表示单节点任务日志
            pbusinessKey: null,
            businessType: null,
            pnonFlow: false
        },
        prototype: {
            init: function () {
                //流程实例id为未指定、日志显示位置没指定则不进行请求
                if (!this.settings.flowIds) {
                    this.clean();
                    if (window.console) {
                        console.warn("nothing flowIds, can't show logs, returning nothing");
                    }
                }

                //显示
                this.show();
            },
            show: function () {
                //加载日志文件
                $(this.location).load($.logger.getBasePath() + this.settings.url, this.getParams());
                //$(this.location).load($.logger.getBasePath()+this.settings.url,{'flowIds':this.settings.flowIds,'type':this.settings.type});
            },
            //构建请求参数
            getParams: function () {
                var _params = {
                    'flowIds': this.settings.flowIds,
                    'type': this.settings.type
                };

                //延期流程参数
                if (this.settings.pbusinessKey && this.settings.pbusinessType) {
                    var _businessKey = this.settings.pbusinessKey.split(',');
                    var _businessType = this.settings.pbusinessType.split(',');
                    var _nonFlow = null;
                    if (typeof (this.settings.pnonFlow) == 'boolean') {
                        _nonFlow = this.settings.pnonFlow;
                    } else {
                        _nonFlow = this.settings.pnonFlow.split(',');
                    }

                    //参数有效
                    if (_businessKey.length == _businessType.length) {
                        for (var i = 0; i < _businessKey.length; i++) {
                            var _bk = 'lstPostpone[' + i + '].businessKey';
                            var _type = 'lstPostpone[' + i + '].type';
                            var _flow = 'lstPostpone[' + i + '].nonFlow';

                            _params[_bk] = $.trim(_businessKey[i]);
                            _params[_type] = $.trim(_businessType[i]);
                            if (typeof (_nonFlow) == 'boolean') {
                                _params[_flow] = _nonFlow;
                            } else {
                                _params[_flow] = $.trim(_nonFlow[i]);
                            }
                        }
                    } else {
                        if (window.console) {
                            console.warn("The postpone number of parameters mismatch, can't show logs, returning nothing");
                        }
                    }
                }

                return _params;
            },
            //创建追加日志记录
            appendLogger: function () {
                var _panel = $('.logger_panel');
                if (!_panel || 0 == _panel.length) {
                    _panel = this.loggerPanel();

                    if (!this.location) {
                        $(document.body).append(_panel);
                    } else {
                        $(this.location).append(_panel);
                    }
                }

                //控制按钮显示
                var _self = this;
                var _base_uri = $.logger.getBasePath();
                $('.logger_panel_btn', _panel).toggle(function () {

                    $('.toggle_btn', this).attr('src', _base_uri + '/images/arrow_down.png');
                    $(".logger_details", _panel).slideDown();
                    //加载日志记录
                    if (!_self.settings.isLoad) {
                        $(".logger_details", _panel).load(_base_uri + _self.settings.url, _self.getParams());
                        //$(".logger_details", _panel).load(_base_uri+_self.settings.url,{'flowIds':_self.settings.flowIds});
                        _self.settings.isLoad = true;
                    }

                }, function () {

                    $('.toggle_btn', this).attr('src', _base_uri + '/images/arrow_up.png');
                    $(".logger_details", _panel).slideUp();

                });
            },
            //构建日志明细面板
            loggerPanel: function () {
                return $('<div style="margin:10px 5px;" class="logger_panel">'
                    + '<span style="cursor:pointer;" class="logger_panel_btn" >Process Logs ：<img class="toggle_btn" src="'
                    + $.logger.getBasePath() + '/images/arrow_up.png" width="15" height="15"/></span>'
                    + '<div id="logger_details" class="logger_details" style="display:none;">'
                    + '<img src="' + $.logger.getBasePath() + '/images/loading.gif">&nbsp;loading...</div>'
                    + '</div>');
            },

            clean: function () {
                $(this.location).html('');
            }
        },
        getBasePath: function () {
            //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
            var pathName = window.document.location.pathname;
            //获取带"/"的项目名，如：/ems
            pathName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

            if (pathName.indexOf("sfa-me-web") == -1) {
                pathName = '';
            }

            return pathName;
        }
    });


    /**************************************************************************************************************
     * 选取工程文件弹出选择框
     *        方式一：$.docs.create({
     * 						status : '5|-1|0',				---------过滤记录的状态值	5为(Active默认值)|-1为(Editing、Approving、Approved、Active)|0为所有状态的记录
     * 						type : 'EO|JC|TB|MP',			---------选择文件的类型EO|JC|TB|MP
     * 						conditions:{					---------默认的查询条件设置
     * 							'includeWaitting':false,	---------是否包含waitting状态的记录
     * 							'model':'B737',
     * 							'docNo':'文件编号',
     * 							'title':'标题',
     * 							'revNo':'版本号',
     * 							'exclude':true|false,		---------是否过滤掉已经有editing状态的改版数据的Active记录
     * 							'excludeIds':'5000,5001'	---------需要排除的工程文件Id
     * 							'conds' : {key1:value1, key2:value2}, -------------其他特殊过滤属性,key必须对应到实体类属性
     * 							'condHql' : 'and key!=value'
     * 						}，
     * 						callback : function(result){	---------选择记录后的回调函数，由实现者自行提供
     *
     * 						}
     * 				});
     *        方式二：$('type').docs({callback:function(result){}});
     *
     * @result {id:'',docNo:'',title:'',model:'',ata:'',revNo:'',status:''}
     * @author sfhq313
     *
     **************************************************************************************************************/
    //定义工程文件选择
    $.docs = function (options, typeObj) {
        //属性合并
        this.settings = $.extend(true, {}, $.docs.defaults, options);

        //根据type对象调用工程文件选择
        if (typeObj) {
            if (typeObj.value) {
                this.settings.type = typeObj.value;
            } else {
                $.docs.writeLogs("no selection type, can't create doc, returning nothing");
                return null;
            }
        }
        this.init();
    };

    //扩展$.docs的函数
    $.extend($.docs, {
        defaults: {
            dialog_width: 800,	// 宽度
            dialog_height: 550,	//	高度
            dialog_top: '30%',		//	弹出窗口据顶部距离
            dialog_title: 'Select Doc No',	//默认标题
            dialog_parent: null,		//	dialog的顶级窗口，防止弹出时在其他窗口的背后
            lock_parent: null,	    // 用于锁屏的上级窗口
            titles: ['Effectivity Type', 'Title', 'Model', 'ATA', 'Rev #', 'Status'],
            default_status: 5,	//	默认状态为Active活动状态
            selModel: 'radio',	//	表格的选择模式，分radio、checkbox
            docNo: {
                '1': 'EO NO',
                '2': 'JC NO',
                '3': 'TB NO',
                '4': 'MP Item',
                'EO': 'EO NO',
                'JC': 'JC NO',
                'TB': 'TB NO',
                'MP': 'MP Item'
            },
            //	默认查询列表条件
            default_conditions: {
                'model': 'sfaCommonVO.model',
                'docNo': 'sfaCommonVO.docNo',
                'title': 'sfaCommonVO.title',
                'revNo': 'sfaCommonVO.revNo',
                'exclude': 'sfaCommonVO.exclude',
                'excludeIds': 'sfaCommonVO.excludeIds',
                'conds': 'sfaCommonVO.conds',
                'condHql': 'sfaCommonVO.condHql',
                'includeWaitting': 'sfaCommonVO.includeWaitting'
            },
            callback: null,	//	回调函数，由实现者自己实现传入
        },
        prototype: {
            init: function () {
                //获取弹出框配置数据
                var _dialog_config = this.getDialogConfig();
                //窗口传递参数
                var _data = this.getDialogDatas();
                if (!_data) return;

                //传入弹出窗口参数
                $.extend(_dialog_config, {
                    data: _data
                });

                //显示数据框
                this.showDialog(_dialog_config);
            },
            showDialog: function (configs) {
                var _self = this;

                if (this.settings.lock_parent) {
                    $.extend(configs, {parent: this.settings.lock_parent});
                }

                //回调方法
                $.extend(configs, {
                    close: function () {
                        if (this.data['isOK']) {
                            //回调方法
                            _self.settings.callback && _self.settings.callback(this.data['result']);
                        }
                    }
                });

                //open员工窗口
                if (!this.settings.dialog_parent) {
                    P.$.dialog(configs);
                } else {
                    this.settings.dialog_parent.$.dialog(configs);
                }
            },
            //根据传入的type确定第一列表头
            getDialogDatas: function () {
                //选择文件类型	EO、JC、TB、MP
                var _type = this.settings.type;
                if (!_type) {
                    $.docs.writeLogs("nothing type, can't show logs, returning nothing");
                    return null;
                }

                //传入type错误
                if (!(_type in this.settings.docNo)) {
                    $.docs.writeLogs("error type, can't show logs, returning nothing");
                    return null;
                }

                //控制筛选数据的状态
                var _status = this.settings.status || this.settings.default_status;

                var _configs = {
                    'selModel': this.settings.selModel,
                    'type': _type,
                    'status': _status,
                    'is_show_cin': this.settings.is_show_cin || '' //是否显示构型号(true 显示)
                };

                var _conditions = {'type': _type, 'sfaCommonVO.status': _status};
                //默认搜索条件
                if (this.settings.conditions) {
                    var _value;
                    for (var key in this.settings.conditions) {

                        _value = this.settings.conditions[key];
                        if (!_value) continue;

                        //其他附带条件的处理
                        if ('conds' == key) {
                            var _prefix = this.settings.default_conditions[key];
                            for (var sub_key in _value) {
                                if (_value[sub_key])
                                    _conditions[$.tools.format("{0}['{1}']", _prefix, sub_key)] = _value[sub_key];
                            }

                            continue;
                        }

                        if (this.settings.default_conditions[key] && $.tools.isNotNull(_value))
                            _conditions[this.settings.default_conditions[key]] = _value;
                    }
                }
                _configs['conditions'] = _conditions;

                //表头列
                var _docNo = this.settings.docNo[_type];
                var _colNames = this.settings.titles;
                _colNames.unshift(_docNo);

                _configs['docNo'] = _docNo;
                _configs['gridConfigs'] = {
                    'colNames': _colNames
                };

                return _configs;
            },
            //获取弹窗的属性
            getDialogConfig: function () {
                return {
                    title: this.settings.dialog_title,
                    width: this.settings.dialog_width,
                    height: this.settings.dialog_height,
                    top: this.settings.dialog_top,
                    cache: false,
                    max: false,
                    min: false,
                    lock: true,
                    content: 'url:data/sfa_commons_documents.jsp'
                };
            }
        },
        //写日志
        writeLogs: function (message) {
            if (window.console) {
                console.warn(message);
            }
        }
    });

    //提供调用接口
    $.docs.create = function (options) {
        return new $.docs(options);
    };

    /**************************************************************************************************************
     * $.tools 定义公用方法
     *        isNull : 判定是否为null值，
     *        isNotNull : 与isNull相反
     *        format : 格式化字符串，填充占位符
     * @author sfhq313
     *************************************************************************************************************/
    $.extend($.tools, {
        defaults: {
            basePath: null,
            //null的定义范围
            nullRanges: {
                '0': false,
                'null': true,
                'undefined': true
            }
        },
        isNull: function (val) {
            if (!val) {
                return true;
            }
            //轻易为null的类别
            var _ranges = this.defaults.nullRanges;

            if (val instanceof String || typeof (val) === 'string') {
                //val存在于定义的null类别中
                if ((val in _ranges) && _ranges[val]) {
                    return true;
                }

                //数组
            } else if (val instanceof Array) {
                if (0 == val.length) {
                    return true;
                }

                //数字
            } else if (val instanceof Number) {
                if (0 == val) {
                    return true;
                }
            }

            return false;
        },
        isNotNull: function (val) {
            return !this.isNull(val);
        },
        //格式化字符串，填充占位符
        format: function (source, params) {
            if (arguments.length === 1) {
                return source;
            }
            if (arguments.length > 2 && params.constructor !== Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor !== Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
            });
            return source;
        },

        //获取当前页面项目名称路径
        getBasePath: function () {
            if (!this.defaults.basePath) {
                //获取主机地址之后的目录
                var pathName = window.document.location.pathname;
                //获取带"/"的项目名，如：/ems
                this.defaults.basePath = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

                if (this.defaults.basePath.indexOf("sfa-me-web") == -1) {
                    this.defaults.basePath = '';
                }
            }

            return this.defaults.basePath;
        },

        //记录js控制台日志信息
        writerLogs: function (content, params) {
            if (window.console && content) {
                var _content;

                //没有需要填充的占位值时直接输出content
                if (arguments.length == 1) {
                    _content = content;

                } else {
                    if (arguments.length > 2 && params.constructor !== Array) {
                        params = $.makeArray(arguments).slice(1);
                    }

                    if (params.constructor !== Array) {
                        params = [params];
                    }

                    //填充占位符
                    _content = this.format(content, params);
                }

                console.warn(_content);
            }
        }

    });


    /**************************************************************************************************************
     * $.sfa.selectBox
     *        定义：根据text文本框动态生成下来框样式,下拉图标会自动绑定文本框的click事件
     *        注释：使用时需要引入样式：css/sfa_commons.css;
     *            fixed函数在弹出窗口中会出现偏移的情况，改用buildHtml
     *
     * @author sfhq313
     *************************************************************************************************************/
    $.sfa.selectBox = function (options, location) {
        this.settings = $.extend(true, {}, $.sfa.selectBox.defaults, options);
        this.location = location;
        this.init();
    };

    $.extend($.sfa.selectBox, {
        defaults: {
            icon_width: 18,
            icon_heigth: 0,
            //图片位置
            icon_url: 'images/t_input.gif',
            //是否监听事件
            event_listener: true,
            //下拉框默认宽度、高度
            content_height: '230px',
            content_width: '160px',
            //选择框模式
            model: '',
            //级联关系
            chkboxType: null,
            //加载数据前是否显示加载图片
            showLoading: false,
            //动态加载数据,每一次点击都重新加载一次后台数据
            dynamic: false,
            //加载数据完成前方法
            onLoadBefore: null,
            //加载数据完成后回调方法
            onLoadSucess: null
        },
        prototype: {
            zTreeObj: null,
            init: function () {
                //重构下拉框
                var _html = this.buildHtml();

                //替换文本框
                $(this.location).replaceWith(_html);
            },
            //重新构建出选择框
            buildHtml: function () {
                var _self = this;
                var _width = $(this.location).width();
                var _container = '<span class="select_box"></span>';

                var _text = $(this.location).clone(true);
                _text.addClass('select_text').css({width: (_width - this.settings.icon_width - 4)});//减4为text的padding前后2px
                if (this.settings.model) {//'multiple' ==
                    _text.click(function () {
                        if (_self.settings.showLoading) {
                            $(this).closest('td').append('<img id="load_data_ing" src="../../css/images/loading.gif"></img>');
                            window.setTimeout(function () {
                                _self.listenerEvent(_text, _text.attr('id'));
                            }, 100)

                        } else {
                            _self.listenerEvent(_text, _text.attr('id'));
                        }
                    });
                }

                var _arrow = $('<span><span class="select_arrow"></span></span>');
                $('.select_arrow', _arrow).click(function () {	//绑定事件
                    _text.click();
                });

                return $(_container).css({width: _width}).append(_text).append(_arrow);
            },
            listenerEvent: function (self, id) {
                var _content = self.data('treeNodeDatas');

                this.settings.onLoadBefore && this.settings.onLoadBefore.call(this);
                //缓存中已经存在
                if (!_content || 0 == _content.length) {
                    var _random = Math.round(Math.random() * 10000);
                    var _contentId = id + "_content_" + _random;
                    var _ztreeId = id + "_" + _random;

                    _content = $.sfa.selectBox.buildTreeContent.initDivContent(_contentId, _ztreeId, this.settings.content_height, this.settings.content_width);
                    //追加到当前文档中
                    $(document.body).append(_content);
                    //缓存数据
                    self.data("treeNodeDatas", _content);
                    //请求列表数据
                    _datas = $.sfa.selectBox.buildTreeContent.loadDatas(this.settings.url, this.settings.conditions);

                    this.zTreeObj = $.fn.zTree.init($("#" + _ztreeId),
                        $.sfa.selectBox.buildTreeContent.getSettings(
                            {
                                'ztreeId': _ztreeId,
                                'inputId': id,
                                'hiddenId': this.settings.hiddenId,
                                'check': this.settings.model,
                                'chkboxType': this.settings.chkboxType
                            },
                            this.settings.checkCallback),
                        !this.settings.noCheckParent ? _datas : $.sfa.selectBox.buildTreeContent.noCheckParent(_datas));


                    this.settings.onLoadSucess && this.settings.onLoadSucess.call(this, _content, _ztreeId);
                } else if (this.settings.loadTaskCount) {
                    //重新加载树节点的描述 - 待办任务类型的树结构
                    if (this.zTreeObj) {
                        var _zTreeObj = this.zTreeObj;
                        var _datas = $.sfa.selectBox.buildTreeContent.loadDatas(this.settings.url, this.settings.conditions);
                        if (_datas && _datas.length > 0) {
                            var tNode;
                            $.each(_datas, function (i, e) {
                                tNode = _zTreeObj.getNodesByParam("id", e.id);
                                if (e && tNode && $(tNode)[0].count != e.count) {
                                    $(tNode)[0].name = e.name;
                                    $(tNode)[0].count = e.count;
                                    _zTreeObj.updateNode($(tNode)[0]);
                                }
                            })
                        }
                        this.settings.onLoadSucess && this.settings.onLoadSucess.call(this, _content, _ztreeId);
                    }
                } else if (this.settings.dynamic) {
                    //重新加载树节点的描述 - 待办任务类型的树结构
                    if (this.zTreeObj) {
                        var _zTreeObj = this.zTreeObj;
                        var _contentId = $(_content).attr('id');
                        var _ztreeId = $(_content).find('ul').attr('id');
                        var _datas = $.sfa.selectBox.buildTreeContent.loadDatas(this.settings.url, this.settings.conditions);
                        this.zTreeObj = $.fn.zTree.init($("#" + _ztreeId),
                            $.sfa.selectBox.buildTreeContent.getSettings(
                                {
                                    'ztreeId': _ztreeId,
                                    'inputId': id,
                                    'hiddenId': this.settings.hiddenId,
                                    'check': this.settings.model,
                                    'chkboxType': this.settings.chkboxType
                                },
                                this.settings.checkCallback),
                            !this.settings.noCheckParent ? _datas : $.sfa.selectBox.buildTreeContent.noCheckParent(_datas));

                        this.settings.onLoadSucess && this.settings.onLoadSucess.call(this, _content, _ztreeId);

                    }
                }
                if (this.settings.showLoading)
                    $(self).closest('td').find('#load_data_ing').remove();

                //显示
                $.sfa.selectBox.buildTreeContent.showMenu(id, _content.attr('id'));
            },
            //根据定位追加一个img
            fixed: function () {
                var _location = $(this.location);

                //追加img
                var _img = '<img src="{0}/{1}"/>';
                _img = $.tools.format(_img, $.sfa.selectBox.getBasePath(), this.settings.icon_url);
                _img = $(_img);

                //追加到_location的后面
                _location.after(_img);
                //重新定位
                _img.css(this.getPosition(_img));
                //添加事件
                this.addEvents(_img);
            },
            addEvents: function (img) {
                if (this.settings.event_listener) {
                    var _location = this.location;
                    //添加单机事件
                    img.click(function () {
                        _location.click();
                    });
                }
            },
            //获取当前位置
            getPosition: function (img) {
                var _location = $(this.location);

                //实际内部宽度
                var _width = _location.width();
                var _height = _location.height();

                //外部宽度，高度  包含变宽
                var _outer_width = _location.outerWidth();
                var _outer_height = _location.outerHeight();

                //填补边框值
                var _fill_width = (_outer_width - _width) / 2;

                //距离窗口位置
                var _left = _location.offset().left + _outer_width - _fill_width - img.width() - 1;
                var _top = _location.offset().top + (_outer_height - img.height()) / 2;

                return {'z-index': '999', position: 'absolute', left: _left, top: _top};
            }
        },
        //清除树的选中节点
        clearTreeCheck: function (treeId) {
            var zTree = null;
            if (!treeId) {
                return;
            }

            zTree = $.fn.zTree.getZTreeObj(treeId);
            if (!zTree) {
                var _treeId = $('.menuContent ul[id^="' + treeId + '"]').attr('id');
                zTree = $.fn.zTree.getZTreeObj(_treeId);
            }

            if (zTree) {
                zTree.checkAllNodes(false);
            }

        },
        getBasePath: function () {
            if (!basePath) {
                //获取主机地址之后的目录
                var pathName = window.document.location.pathname;
                //获取带"/"的项目名，如：/ems
                pathName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

                if (pathName.indexOf("sfa-me-web") == -1) {
                    pathName = '';
                }

                return pathName;
            }

            return basePath;
        },
        buildTreeContent: {
            getSettings: function (params, checkCallback) {
                var _checkObj, _callback = null;
                //单选或者多选
                if ('radio' == params.check) {
                    _checkObj = {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    }
                } else if ('view' == params.check) {
                    _checkObj = {
                        enable: false
                    }
                } else {

                    _checkObj = {
                        enable: true,
                        chkboxType: params.chkboxType || {
                            "Y": "ps",
                            "N": "ps"
                        }
                    }
                }
                //回调函数
                var _callback = function () {
                    var zTree = $.fn.zTree.getZTreeObj(params.ztreeId);
                    var nodes = zTree.getCheckedNodes(true);
                    var v = "", ids = "";
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        if (nodes[i].name && nodes[i].name.indexOf(' (') > 0) {
                            v += nodes[i].name.substring(0, nodes[i].name.indexOf(' (')) + ",";
                        } else {
                            v += nodes[i].name + ",";
                        }
                        ids += nodes[i].id + ",";
                    }
                    if (v.length > 0)
                        v = v.substring(0, v.length - 1);
                    if (ids.length > 0)
                        ids = ids.substring(0, ids.length - 1);
                    var cityObj = $("#" + params.inputId);
                    //设置显示值
                    cityObj.attr("value", v);
                    //设置隐藏id值
                    if (params.hiddenId)
                        $('#' + params.hiddenId).val(ids);

                    //更改选择后出发自定义事件
                    checkCallback && checkCallback({'ids': ids, 'values': v});
                };

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
                        onCheck: _callback
                    }
                };
            },
            /**
             * 下拉列表中，父级目录不显示选择框
             */
            noCheckParent: function (datas) {
                if (!datas) return null;
                $.each(datas, function (i, e) {
                    // 如果 是父级 目录
                    if (!e.pId || (e.pId && e.pId == "0") || (e.pId && e.pId == "-1")) {
                        e['nocheck'] = true;
                    }
                });
                return datas;
            },
            //初始化下拉框
            initDivContent: function (contentId, treeId, dropDownWidth, dropDownHeight) {
                return $("<div id='" + contentId + "' class='menuContent' style='display:none; position: absolute;'>"
                    + "<ul id='" + treeId + "' class='ztree' style='margin-top:0; width:" + dropDownWidth + "; height: "
                    + dropDownWidth + ";background-color:#F2F2F2'></ul></div>");
            },
            //显示下拉框
            showMenu: function (inputId, contentId) {
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
            //加载数据
            loadDatas: function (url, conditions) {
                if (!url)
                    return null;

                var _datas;
                //通过url获取数据
                $.ajax({
                    url: $.sfa.selectBox.getBasePath() + url,
                    data: conditions,
                    dataType: "json",
                    contentType: 'application/json;charset=utf-8',
                    type: 'GET',
                    cache: false,
                    async: false,

                    success: function (data, textStatus) {
                        try {
                            var jsonData = JSON.parse(obj);
                            if (jsonData.ajaxResult == 'exception') {
                                P.$.dialog.alert("Error:[" + jsonData.exceptionError + "]");
                            } else {
                                _datas = jsonData;
                            }
                        } catch (e) {
                            _datas = data;
                        }
                    }
                });
                return _datas;
            }
        }
    });

    /**
     * 增强版selectBox，对于显示上的优化
     *
     * $.sfa.extSelectBox
     */
    /*$.extend($.sfa.extSelectBox,{

        // 控件默认的属性值
        defaults : {

        },

        // 构建extSelectBox内容
        prototype : {
            //初始化方法，作为控件入口
            init : function(){

            },

            //加载数据
            _loadDatas : function(url, conditions){
                if(!url){
                    if(window.console)
                        console.warn( "nothing flowIds, can't show logs, returning nothing" );
                    return null;
                }

                var _datas;
                //通过url获取数据
                $.ajax({
                    url : $.tools.getBasePath() + url,
                    data : conditions,
                    dataType : "json",
                    contentType : 'application/json;charset=utf-8',
                    type : 'GET',
                    cache : false,
                    async : false,

                    success : function(data, textStatus) {
                        try{
                            var jsonData = JSON.parse(obj);
                            if (jsonData.ajaxResult == 'failure') {
                                P.$.dialog.alert("Error:[" + jsonData.errorMsg + "]");
                            }else{
                                _datas = jsonData;
                            }
                        }catch (e) {
                            _datas = data;
                        }
                    }
                });
                return _datas;
            }
        }
    });*/

}(jQuery));
