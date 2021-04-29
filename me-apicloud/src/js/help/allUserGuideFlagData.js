module.exports = angular.module('myServers').service('allUserGuideFlagData',['$localForage', function($localForage){

    //设置数据库对象
    var userGuideDb = $localForage.createInstance({name:'allUserguideFlag'});
    this.getItem = function (item) {
        return userGuideDb.getItem(item);
    }
    
    this.setItem = function (key,value) {
        return userGuideDb.setItem(key,value);
    }
}]);
