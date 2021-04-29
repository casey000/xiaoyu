module.exports = angular.module('myServers').service('brand',['$localForage','localStorage',function($localForage,localStorage) {
	var that = this;

	this.initBrand = initBrand;
	this.setBrand = setBrand;
	this.isNewBrand = true;

	brandDatabase = $localForage.createInstance({
		name: 'brand'
	});
	
	function setBrand(brandParam) {
		that.isNewBrand = brandParam;

		brandDatabase.setItem('brand',that.isNewBrand).then(function(){
		}).catch(function(error){
			console.log(error);
		})
		//存储到本地
	}

	function initBrand() {
		return brandDatabase.getItem('brand').then(function(data){
			that.isNewBrand = isNull(data) ? true : data;
			return;
		}).catch(function(error){
			console.log(error);
			return;
		})
	}
	
	function isNull(arg) {
	 return !arg && arg!==0 && typeof arg!=="boolean"?true:false;
	}
}]);