;<script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
function settimeoutdo(num,fn,delay){		
    var counter = 0;
    var d = jQuery.Deferred();
  
    var doIncrease = function() {
      if(counter < num){
          counter++;
          setTimeout(fn, delay);			//执行需要settimeout的函数
          setTimeout(doIncrease, delay);
      } else {
        d.resolve();
      }
    };
    doIncrease();
    return d.promise();
  };
  
  settimeoutdo(1,() => {console.log('123')},1000).then(function() {
    console.log(456);
  });