module.exports = angular.module('myServers').service('localStorage',function(){
	this.setVauleForKey = setVauleForKey;
	this.getVauleWithKey = getVauleWithKey;
	this.removeItem = removeItem;

	var storage = window.localStorage;
	function setVauleForKey(value, key){
		if (storage) {
			storage.setItem(key,value);	
		}else {
			alert("不支持localStorage");
		}
	};

	function getVauleWithKey(key) {
		if (storage) {
			return storage.getItem(key);	
		}else {
			return "";
		}
		
	};

	function removeItem(key){
		if (storage) {
			storage.removeItem(key);
		}else {
			alert("不支持localStorage");
		}
	}
});
