module.exports = angular.module('myServers').service('airport',['server','localStorage','$localForage',
    function(server,localStorage,$localForage){
    var that = this;
    this._4codeCityName = {};
    this._3codeCityName = {};
    this._4codeTo3code = {};
    this._acTypeForFlightNo = {};

    this.getAirport = getAirport;
    this.getAcType = getAcType;

    var airPortData;
    var acTypeData;
    var primaryKey = 'airport4code';
    var primaryKey2 = 'acReg';

    function initAirPortDataBase(){
        console.log('开始初始化机场数据库');
        airPortData = $localForage.createInstance({
            name: 'new_airport'
        });
        acTypeData = $localForage.createInstance({
            name: 'acType_reg'
        });
    };
    initAirPortDataBase();

    var lastSynAirPortTimeKey = 'new_lastSynAirPortTime';
    var lastSynAcTypeTimeKey = 'new_lastSynAcTypeTime';

    /*
    * 同步机场信息接口，每天更新一次
    *
    *  */
    function getAirport() {
        console.log('开始获取机场');
        var data = localStorage.getVauleWithKey(lastSynAirPortTimeKey);
        if ((new Date()).toDateString() === data) {
            return airPortData.iterate(function(value, key, iterationNumber) {
                that._4codeCityName[key] = value.airportCHName;
                that._3codeCityName[value.airport3code] = value.airportCHName;
                that._4codeTo3code[value.airport4code] = value.airport3code;
            }).then(function (data) {

                console.log('获取机场成功');
            }).catch(function(error){
                console.log(error);
            });
        }else{
            return server.maocGetReq('common/findAirportInfo',{}).then(function (data) {
                if (200 === data.status && data.data.data instanceof Array) {
                    data.data.data.forEach(function (item, index) {
                        that._4codeCityName[item.airport4code] = item.airportCHName;
                        that._3codeCityName[item.airport3code] = item.airportCHName;
                        that._4codeTo3code[item.airport4code] = item.airport3code;
                        airPortData.setItem(item[primaryKey],item).then(function(data){

                        }).catch(function(error){
                            console.log('保存机场失败');
                        });
                    });

                    console.log('获取机场成功');
                    updateAirportSyncTime();
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    /*
     * 同步机号信息接口，每天更新一次
     *
     *  */
    function getAcType() {
        var data = localStorage.getVauleWithKey(lastSynAcTypeTimeKey);
        if ((new Date()).toDateString() === data) {
            return acTypeData.iterate(function(value, key, iterationNumber) {
                that._acTypeForFlightNo[key] = value.acTypeMarco;
            }).then(function (data) {
                console.log('机型机号转换');
            }).catch(function(error){
                console.log(error);
            });
        }else{
            return server.maocGetReq('/common/aircraftInfo',{}).then(function (data) {
                if (200 === data.status && data.data.data instanceof Array) {
                    data.data.data.forEach(function (item, index) {
                        that._acTypeForFlightNo[item.acReg] = item.acTypeMarco;
                        acTypeData.setItem(item[primaryKey2],item).then(function(data){

                        }).catch(function(error){
                            console.log('保存机型转换失败');
                        });
                    });
                    updateAcTypeSyncTime();
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    function updateAirportSyncTime(){
        localStorage.setVauleForKey((new Date()).toDateString(),lastSynAirPortTimeKey);
    };

    function updateAcTypeSyncTime(){
        localStorage.setVauleForKey((new Date()).toDateString(),lastSynAcTypeTimeKey);
    };


    /*接口暂时未用*/
    this.getAirportWithParams = function(params,success,error){

        airPortData.getAll(function(data){
            if (success) {
                success(data.filter(function(item){
                    return item[params.key].indexOf(params.value) == 0;
                }));
            }
        },function(data){
            if (error) {
                error(data);
            }
        });
    };

    /*
     * 搜索机场，给出搜索字段，会搜索所有缓存的机场，并匹配机场的所有字段，包括
     * 机场三字码，城市三字码，机场四字码，机场中文名，城市中文名，机场英文名称，
     * 城市英文名称
     * @param {String}  [searchValue] 搜索的字符串
     * @param {Function} {success}, 搜索成功后的回调函数，参数是搜索得到的机场数组
     * @param {Function} {error}, 搜索失败的回调函数，参数数据库操作失败的原因
     */
    this.searchAirport = function(searchValue, success,error){
        airPortData.getAll(function(data){
            if (success) {
                success(data.filter(function (item) {
                    var found = false;
                    for(key in item) {
                        if (item[key].indexOf(searchValue)) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                }));
            }
        },function (data) {
            if (error) {
                error(data);
            }
        });
    };


}]);
