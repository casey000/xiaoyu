
/*************************************************************************
 * conditions: userName（用户名）、workNumber（工号）、groupId（组Id）、departName（部门名称）
 *
 * 工作流处理中对处理人员User的选择公用组件
 *
 * 	可以根据传入的conditions初始化结果集
 *
 *  传入params参数格式：
 *  	@Params {'userName' : null,'workNumber' : null,'groupId' : null,'deptId' : null,'deptName' : null}
 *
 *  方法调用后可以通过UserUtils.getResult()返回如下格式数据：
 *  	@Result {'userId':'001','userName':'huhu','workNumber':'N0001','deptId':'0001','deptName':'No1 dept'}
 *
 *  实例：
 *  	A:	当没有任务参数传入并且需要回显值的控件名id为userId、userName时则调用此方法即可；
 *  		UserUtils.showDialog();
 *
 *  	B:	当有默认参数传入时指定值到params中但key值必须保持一致；
 *  		UserUtils.showDialog({params:{'groupId':415401,'userName':''}});	or
 *  		UserUtils.showDialog({params:new UserParams(groupId,deptName,userName,workNumber,deptId)});
 *
 *  	C:	当需要在窗口关闭之后进行函数回调的扩展时：
 *  		UserUtils.showDialog({callback:function(){//待自己实现}});
 *
 *  	D:	当只需要更改回显控件时：
 *  		UserUtils.showDialog({callback_options:{inputUserId:'userId',inputUserName:function(){//特殊处理后返回userName}}});
 *
 ************************************************************************/

var UserUtils = {
    //action_url:'security/user/select_user_list.jsp',
    action_url:'/views/personSelect/personSelect.shtml',
    dialog_width : 850,	// 宽度
    dialog_height : 500,	//	高度
    dialog_top : '30%',		//	弹出窗口据顶部距离
    inputId: null,
    dialog_title : 'Select User',	//默认标题
    select_result : null,		// 选择结果
    default_callback : true,	//	是否进行默认回显选择值，默认为true
    dialog_parent : null,		//	dialog的顶级窗口，防止弹出时在其他窗口的背后
    lock_parent : null,	    // 用于锁屏的上级窗口
    is_clean : false,
    sel_model : 'radio',	//	表格的选择模式，分radio、checkbox
    exclude_self : true,
    ok: function(){
        // console.log($('#sysUserList').datagrid('getSelected'));
        var userListId = $("#sysUserList",this.iframe.contentWindow.document)//.attr("name")//.content()//.find("#sysUserList");
        // var a = $("iframe[name=" + result +"]").find("#sysUserList");
        //var result = userListId//.datagrid("options");
        //var result=this.iframe.api.opener;
        console.log(this.iframe.contentWindow.getUserSelections());
        $("#"+UserUtils.inputId).val(UserUtils.buildResult(this.iframe.contentWindow.getUserSelections()));
        $("#"+UserUtils.inputId).siblings("input[type='hidden']").val(this.iframe.contentWindow.getUserSelections() && this.iframe.contentWindow.getUserSelections()[0].sn);
    },
    cancel:true,
    //	定义回显控件id和显示的值key
    //	userId为需要回显的用户Id控件的id :11000
    //	userName为需要回显的用户名和工号 :sfhq313(abc)
    default_name_fun : function(datas){
        if(!datas) return null;
        var _name = datas['userName'];
        if(datas['workNumber']){
            _name += '(' + datas['workNumber'] + ')';
        }
        return _name;
    },
    callback_options : {
        userId : 'userId',
        userName : function(datas){
            if(!datas) return null;
            var _name = datas['userName'];
            if(datas['workNumber']){
                _name += '(' + datas['workNumber'] + ')';
            }
            return _name;
        }
    },
    postParams : {},
    //传入参数
    params : {
        'userName' : null,
        'workNumber' : null,
        'groupId' : null,
        'deptId' : null,
        'deptName' : null,
        'userType':null,
        'status' : null
    },
    //	回调方法，可以由自己定义扩展
    callback : function(data){	//默认实现回调方法
        if(this.default_callback && this.callback_options){
            var _result = this.getResult();
            //处理结果集为多选时不进行填充
            if(_result && $.isArray(_result))
                return;

            var _obj,_func,_val;
            for(var key in this.callback_options){
                _obj = $('#'+key);
                _func = this.callback_options[key];
                if(_obj && _obj.length!=0 && _func){
                    //函数处理
                    if(typeof(_func) === 'string'){
                        _val = _result[this.callback_options[key]];
                    }else if(typeof(_func) === 'function'){
                        _val = _func(this.getResult());
                    }
                    //设置回显值
                    if(_val)
                        _obj.val(_val);
                }
            }
        }
    },
    //	显示人员列表
    showDialog : function(options){
        //初始化
        this.init(options);

        var _self = this;

        //获取dialog参数
        var _dialog_config = this.getDialogConfig();
        if(this.lock_parent){
            $.extend(_dialog_config,{parent:this.lock_parent});
        }
        //回调方法
        $.extend(_dialog_config,{
            close:function(){
                /* 实在不知道这个if判断有什么用,暂时给他加个else, wxw*/
                if(this.data['isOK']){
                    _self.select_result = this.data['result'];
                    //回调方法
                    _self.callback && _self.callback(_self.getResult());
                }else{
                    let callback_data = this.iframe.contentWindow.getUserSelections()
                    _self.callback(callback_data)
                }
            }
        });

        //open员工窗口
        if(!this.dialog_parent){
            $.dialog(_dialog_config);
        }else{
            this.dialog_parent.$.dialog(_dialog_config);
        }
    },
    //获取传入参数格式化
    getParams : function(){
        var _params = {};
        if(this.params){
            _params = new UserParams(this.params.groupId,this.params.deptName,this.params.userName,this.params.workNumber,this.params.deptId,this.params.userType,this.params.status);
        }
        if(this.postParams){
            _params = $.extend(_params,this.postParams);
        }
        //选择模式
        _params['sel_model'] = this.sel_model;
        //排除自己
        _params['exclude_self'] = this.exclude_self?1:0;

        return _params;
    },
    //	获取选择结果
    getResult : function(data){
        /* 为什么这个函数一旦调用就会关闭窗口??? */
        return data
        // if(!this.select_result) return null;
        //
        // //非数组处理
        // if($.isArray(this.select_result)){
        //     var _self = this , _results = [];
        //     $.each(this.select_result, function(){
        //         _results.push(_self.buildResult(this));
        //     });
        //
        //     return _results;
        // }
        //
        // return this.buildResult(this.select_result);
    },

    //构建选择结果集
    buildResult : function(data){
        var _result = '';
        if(data.length){
            _result = data[0].userName + '('  +  data[0].sn + ')';
        }
        return _result;
        // var _result = {};
        //
        // _result['userId'] = data.id;
        // _result['userName'] = data.name;
        // if(data.sn != null && data.sn != "")
        // {
        //     _result['workNumber'] = data.sn;
        // }else if(data.loginName != null && data.loginName != "")
        // {
        //     _result['workNumber'] = data.loginName;
        // }
        // _result['deptId'] = data['deptId'];
        // _result['deptName'] = data['deptName'];
        // _result['groupId'] = data['groupId'];
        //
        // return _result;
    },

    //初始化函数
    init : function(options){
        this.select_result = null;
        //重载传入值
        if(options)
            $.extend(this,options);
    },
    //获取弹窗的属性
    getDialogConfig : function(){
        return {
            title : this.dialog_title,
            width : this.dialog_width,
            height : this.dialog_height,
            top : this.dialog_top,
            cache:false,
            max: false,
            min: false,
            lock:true,
            ok: this.ok,
            cancel:true,
            content:'url:'+this.action_url,
            data : this.getParams()
        };
    }
};

/**
 * 用户构建User传入参数
 * @param groupId
 * @param deptName
 * @param userName
 * @param deptId
 * @param workNumber
 * @param userType
 */
function UserParams(groupId,deptName,userName,workNumber,deptId,userType,status){
    this['user.name'] = userName;
    this['user.sn'] = workNumber;
    this['user.deptName'] = deptName;
    this['user.deptId'] = deptId;
    this['user.groupId'] = groupId;
    this['user.userType'] = userType;
    this['user.status'] = status;
}
