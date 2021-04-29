module.exports = (function () {
	var EXIF = require('../lib/small-exif');
  angular.module('myServers',[])
	.factory('paramTransfer',function(){
		var parmObject = {};
		function set(data) {
			parmObject = data;
		}
		function get() {
		  return angular.copy(parmObject,{});
		}
		return {
		  set: set,
		  get: get
		}
	})
	.factory('b64ToBlob',function(){
		return function dataToBlob(b64Data, mimeString) {
			var byteString = atob(b64Data);
			mimeString = mimeString || 'audio/*';
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], {
				type: mimeString
			});
		}
	})
  .factory('UrlToBase64',function(){
	  return function dataToBlob(image) {
		 	var canvas = document.createElement("canvas");
		 	canvas.width = image.width;
		  	canvas.height = image.height;
		  	var ctx = canvas.getContext("2d");

		  var width = image.width;
		  var height = image.height;

		  var MAX_WIDTH = width>2500 ?  width/2 : 2500;
		  var MAX_HEIGHT = height>2500 ? height/2 : 2500;
		  if (width > height) {
			  if (width > MAX_WIDTH) {
				  height *= MAX_WIDTH / width;
				  width = MAX_WIDTH;
			  }
		  } else {
			  if (height > MAX_HEIGHT) {
				  width *= MAX_HEIGHT / height;
				  height = MAX_HEIGHT;
			  }
		  }

		  canvas.width = width ;
		  canvas.height = height;

		  ctx.drawImage(image,0,0,width,height);
		  	var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
		  	var dataUrl = canvas.toDataURL("image/jpeg",'0.8');
		  	return {
		  		dataURL : dataUrl,
				type:"image/" + ext
			}
	  }
  })

	//上传文件预览
	.factory('fileReader', ['$q', '$log', function($q, $log) {
		var dataURItoBlob = function(dataURI) {  
	        // convert base64/URLEncoded data component to raw binary data held in a string  
	        var byteString;  
	        if (dataURI.split(',')[0].indexOf('base64') >= 0)  
	            byteString = atob(dataURI.split(',')[1]);  
	        else  
	            byteString = unescape(dataURI.split(',')[1]);  
	  
	        // separate out the mime component  
	        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];  
	  
	        // write the bytes of the string to a typed array  
	        var ia = new Uint8Array(byteString.length);  
	        for (var i = 0; i < byteString.length; i++) {  
	            ia[i] = byteString.charCodeAt(i);  
	        }  
	  
	        return new Blob([ia], {  
	            type: mimeString  
	        });  
	   }; 
		 
 		
		var onLoad = function(reader, deferred, scope,file) {
			return function() {
				scope.$apply(function() {
					 var img = new Image();
					var orientation = null;

					EXIF.getData(file, function() {
						orientation = EXIF.getTag(this, 'Orientation');
					});

					//前端压缩图片
					img.onload = function(){ 
		                //resize the image using canvas  
		                var canvas = document.createElement("canvas");  
		                var ctx = canvas.getContext("2d");  
		                var width = img.width;  
		                var height = img.height; 
		                
		                var MAX_WIDTH = width>2500 ?  width/2 : 2500;  
		                var MAX_HEIGHT = height>2500 ? height/2 : 2500;
		                if (width > height) {  
		                    if (width > MAX_WIDTH) {  
		                        height *= MAX_WIDTH / width;  
		                        width = MAX_WIDTH;  
		                    }  
		                } else {  
		                    if (height > MAX_HEIGHT) {  
		                        width *= MAX_HEIGHT / height;  
		                        height = MAX_HEIGHT;  
		                    }  
		                }
	
		                canvas.width = width ;  
		                canvas.height = height; 

						//对图片方向进行判断,解决ios下图片会有旋转90度的问题
						if(orientation && orientation != 1){
							switch(orientation){
								case 6: // 旋转90度
									canvas.width = height;
									canvas.height = width;
									ctx.rotate(Math.PI / 2);
									// (0,-imgHeight) 从旋转原理图那里获得的起始点
									ctx.drawImage(this, 0, -height, width, height);
									break;
								case 3:  // 旋转180度
									ctx.rotate(Math.PI);
									ctx.drawImage(this, -width, -height, width, height);
									break;
								case 8: // 旋转-90度
									canvas.width = height;
									canvas.height = width;
									ctx.rotate(3 * Math.PI / 2);
									ctx.drawImage(this, -width, 0, width, height);
									break;
							}
						}else {
							ctx.drawImage(img, 0, 0, width, height);
						}
						
						var dataURL = canvas.toDataURL('image/jpeg', 1);
						var blob = dataURItoBlob(dataURL); 
						if(blob.size > 2000 * 1024){
							dataURL = canvas.toDataURL('image/jpeg', .2);
						}else if(blob.size > 1000 * 1024){
							dataURL = canvas.toDataURL('image/jpeg', .5);
							
						}else{
							dataURL = canvas.toDataURL('image/jpeg', .8);
						}
						blob = dataURItoBlob(dataURL);
						deferred.resolve(blob);
					}
					img.src = URL.createObjectURL(file);


				});
			};
		};

		var onError = function(reader, deferred, scope) {
			return function() {
				scope.$apply(function() {
					deferred.reject(reader.result);
				});
			};
		};

		var onProgress = function(reader, scope) {
			return function(event) {
				scope.$broadcast("fileProgress", {
					total: event.total,
					loaded: event.loaded
				});
			};
		};

		var getReader = function(deferred, scope, file) {
			var reader = new FileReader();
			reader.onload = onLoad(reader, deferred, scope,file);
			reader.onerror = onError(reader, deferred, scope);
			reader.onprogress = onProgress(reader, scope);
			return reader;
		};

		var readAsDataURL = function(file, scope) {
			var deferred = $q.defer();
			var reader = getReader(deferred, scope,file);
			reader.readAsDataURL(file);

			return deferred.promise;
		};

		return {
			readAsDataUrl: readAsDataURL
		};
	}]);

	require('./common/httpConfig.js')
	require('./common/server.js')
	require('./common/localStorage.js')
	require('./common/airportManager.js')
	require('./common/configInfo.js')
	require('./common/umengEvenIdTransform.js')
	require('./flightInfo/brand.js')
	require('./flightInfo/favoriteFlight.js')
	require('./flightInfo/filterFlightInfo.js')
	require('./flightInfo/flightInfo.js')
	require('./fault/filterFaultFlightInfo.js')
	require('./fault/flightFaultInfo.js')
	require('./fault/checkDm.js')
	require('./messageDetail/messageDetailManager.js')
	require('./me/me-list.js');	
	require('./me/mefilterFlightInfo.js');
	//require('../help/allUserGuideFlagData.js');
	//require('../help/introToolGuide.js');
	//require('../help/introMaterialApplyGuide.js');
})();