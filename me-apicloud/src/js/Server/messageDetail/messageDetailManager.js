//var IDBStore = require('../lib/myidbstore.js');
module.exports =  angular.module('myServers').service('messageDetailManager',['configInfo','$localForage',function (configInfo,$localForage) {
	 var that = this;

	 this.initMessageDataBase = initMessageDataBase;
	 this.getAllMessage = getAllMessage;
	 this.saveNewMessage = saveNewMessage;

	 var messageDataBase;
	 var primaryKey = 'id';

	 function initMessageDataBase(success) {
	 	console.log('开始初始化数据库');
	 	if (!messageDataBase) {
	 		messageDataBase =  $localForage.createInstance({
      			name: (configInfo.userCode||'noUser')+'_messageDetail'
    		});
	 	}
	 	
    	if (success) {
    		success();
    	}
	};


	function getAllMessage(flightId,success,error) {
		console.log('开始获取本地消息');
		//var rangeObject = messageDataBase.makeKeyRange({lower:flightId,upper:flightId});
		//messageDataBase.query(success,{index:'flightId',keyRange:rangeObject,onError:error});
		messageDataBase.getItem(flightId).then(function(value) {
			if (success&&value) {
				success(value);	
			}
		    console.log(value);
		}).catch(function(err) {
		    console.log(err);
		});
	};

	function saveNewMessage(data, flightId, refresh) {
		 var dataToDataBase = [];
		 angular.copy(data, dataToDataBase);
		 dataToDataBase.forEach(function(item,idex){
 				item.read = true;
 				item.flightId = flightId;
		 });
		if (refresh) {
            messageDataBase.setItem(flightId, data);
		} else {
            messageDataBase.getItem(flightId).then(function(value) {
                if (value) {
                    dataToDataBase = dataToDataBase.concat(value);
                }
                messageDataBase.setItem(flightId, dataToDataBase).then(function (value) {
                    console.log(value);
                }).catch(function(err) {
                    console.log(err);
                });
            }).catch(function(err) {
                console.log(err);
            });
		}
	};
}]);

