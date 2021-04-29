module.exports = angular.module('myServers').service('checkDmInfo',['server',function(server) {
    var that = this;
    var everyPageSize = 20;

    this.getDmInfo = getDmInfo;

    function getDmInfo(params) {
        var interfaceUrl = 'maintainLimit/selectDmLimit';
        that.flights = [];
        return server.maocPostReq(interfaceUrl,params,true).then(function(data) {
            if(200 === data.status) {

                return {
                   data:data.data.data[0]
                };
            }else {

            }

        }).catch(function(error) {
            return error;
        });
    }


}]);
