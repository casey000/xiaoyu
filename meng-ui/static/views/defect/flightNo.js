var TextCount = (function(){
  //私有方法，外面将访问不到
  var _bind = function(that){
    that.input.on('keyup',function(){
      that.render();
    });
  }
 
  var _getNum = function(that){
    return that.input.val().length;
  }
 
  var TextCountFun = function(config){
 
  }
 
  TextCountFun.prototype.init = function(selector) {
    this.input = $(selector);
    _bind(this);
 
    return this;
  };
 
  TextCountFun.prototype.render = function() {
    var num = _getNum(this);
 
    if ($('#J_input_count').length == 0) {
      this.input.after('');
    };
 
    $('#J_input_count').html(num+'个字');
  };
  //返回构造函数
  return TextCountFun;
 
})();

var mytest = {

}

export default mytest