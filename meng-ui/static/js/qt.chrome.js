
QtClient = {
    webSocket: null,
    isLock : false,
    isReady : false,
    port : 61689,
    env : "Dev",
    service:null,
    onWebSocketFail : null,
    ticket : {
        timeout : 20 * 60 * 1000,
        expire: 0,
        value : null,
        callback : null
    },

    /**
     * 初始化QT谷歌通道
     options : {
    port : 61688,
    onRefreshTicket: null,
    onWebSocketFail: null
  },
     */
    init: function (options) {
        // debugger;
        this.port = options.port;
        this.env = options.env;
        this.service=options.service;
        this.ticket.callback = options.onRefreshTicket;
        this.onWebSocketFail = options.onWebSocketFail;
    },

    /**
     * 创建WebSocket
     */
    createWebSocket: function(data){
        // debugger;
        var wsUri = "ws://localhost:" + QtClient.port;
        try {
            if ( QtClient.webSocket && QtClient.webSocket.readyState == 1 ) {
                QtClient.webSocket.close();
            }

            if (typeof MozWebSocket == 'function'){
                QtClient.webSocket = new WebSocket( wsUri );
            }else{
                QtClient.webSocket = new WebSocket( wsUri );
            }

            //日志
            QtClient.webSocket.onopen = function (evt) {
                QtClient.checkIsReady();
                console.log("CONNECTED");
            }

            QtClient.webSocket.onclose = function (evt) {
                QtClient.isReady=false;
                QtClient.webSocket=null;
                console.log("DISCONNECTED");
            }

            QtClient.webSocket.onmessage = function (evt) {
                QtClient.callback(evt.data);
                //console.log( evt.data );
            }

            QtClient.webSocket.onerror = function (evt) {
                if(QtClient.webSocket.readyState == 3){
                    window.location.href =  QtClient.service+ "://" + data;
                    setTimeout(()=>{
                        QtClient.createWebSocket(data);
                }, 500);
                }
                console.log('ERROR: ' + evt.data);
            }

        } catch (exception) {
            console.log('ERROR: ' + JSON.stringify(exception));
            QtClient.onWebSocketFail(exception.msg);
            return false;
        }
        return true;
    },

    callQt: function (options) {
        // debugger
        if(QtClient.isLock){
            QtClient.onWebSocketFail("三维客户端正在启动， 请勿重复点击...");
            return;
        }

        var interval = setInterval(async function(){
            try{
                //三维客户端未完成准备， 则锁定后续请求
                await QtClient.refreshTicket()

                var ticket=QtClient.ticket.value;
                if(ticket){
                    var base64 = new Base64();
                    var baseOperate = base64.encode(options);
                    var data = ticket + "/" + baseOperate;
                    if(!QtClient.isReady){
                        if(!QtClient.isLock){
                            QtClient.createWebSocket(data);
                        }
                        QtClient.isLock = true;
                        return;
                    }
                    clearInterval(interval);
                    QtClient.isLock = false;

                    var option = eval('(' + options + ')');
                    var object = option.object;
                    var methods = option.function;
                    var param = JSON.stringify(option.param);
                    //alert("谷歌发送消息给QT:"+object+","+methods+","+param);
                    // //alert("callQT ticket:"+QtClient.ticket);
                    // //QtClient.webInterface.CallChromePipe(options,QtClient.ticket );
                    QtClient.webSocket.send("request/" + data);
                }
            }catch(ex){
                QtClient.onWebSocketFail(ex);
                QtClient.isLock = false;
            }
        }, 50);
    },

    /**
     * 刷新Ticket
     * @returns ticket值
     */
    async refreshTicket(){
    var ticket = QtClient.ticket;
    if(ticket.value != null && new Date().getTime() <= ticket.expire){
        return ticket.value;
    }
    //ticket.value = await this.ticket.callback();
    //ticket.expire = new Date().getTime() + ticket.timeout;
    var temp= this.ticket.callback();
    setTimeout(function(){
        ticket.value=temp;
        ticket.expire=new Date().getTime() + ticket.timeout;
    },50);
},

/**
 * 接收QT的消息
 * @param str
 */
callback: function (str) {
    var option = eval('(' + str + ')');
    var object = option.object;
    var methods = option.function;
    var param = JSON.stringify(option.param);
    var result = eval('(' + param + ')');
    var param1 = result.param1;
    var param2 = result.param2;
    var paramString = null;
    if (param2) {
        paramString = JSON.stringify(param1) + "," + JSON.stringify(param2)
    } else {
        paramString = JSON.stringify(param1)
    }
    //alert("谷歌收到QT的消息："+object+"."+methods+ "("+paramString+")");
    eval(object + "." + methods + "(" + paramString + ")");
},

/**
 * 客户端检测结果反馈
 * {
    object: "QtClient",
    function: "onClientChecked",
    param: true/false
  };
 */
onClientChecked: function(ready) {
    QtClient.isReady = ready;
},

/**
 * 检测三维客户端状态
 */
checkIsReady(){
    setInterval(() =>{
        if(QtClient.webSocket){
        QtClient.webSocket.send("ClientIsReady/");
    }
}, 500);
}
};
window.$Q = QtClient;
