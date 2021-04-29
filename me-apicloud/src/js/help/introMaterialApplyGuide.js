module.exports = angular.module('myServers').service('introMaterialApplyGuid',['allUserGuideFlagData', function(allUserGuideFlagData){
  var guideVersion = 1;
	//设置数据库对象
	allUserGuideFlagData.getItem('MaterialApplyGuide').then(function(data){
		if(!data || guideVersion > data){
			console.log('需要显示帮助');
			//调用新手指引方法
			startIntro();
		}else{
			console.log('不显示帮助');
		}
	}).catch(function(error){
		console.log(error);
	});
	
	function setHaveShowToolGuide(){
		allUserGuideFlagData.setItem('MaterialApplyGuide',guideVersion).then(function(data){
			console.log('工具帮助文档已经显示');
		}).catch(function(error){
			console.log('设置工具帮助文档显示出错');
		});
	}
	
	function startIntro(){
            	
				introJs().setOptions({
                //帮助步骤对应的按钮
                prevLabel:"上一步", 
                nextLabel:"下一步",
                skipLabel:"跳过",
                doneLabel:"结束",
                //对应的数组，顺序出现每一步引导提示
                steps: [
                    {
                        //第一步引导
                        //这个属性类似于jquery的选择器， 可以通过jquery选择器的方式来选择你需要选中的对象进行指引
                        element: '#add-mr',
                        //这里是每个引导框具体的文字内容，中间可以编写html代码
                        intro: '从这里添加航材',
                        //这里可以规定引导框相对于选中对象出现的位置 top,bottom,left,right
                        position: 'left'
                    }]
            }).oncomplete(function(){
                //点击跳过按钮后执行的事件(这里保存对应的版本号到cookie,并且设置有效期为30天）
               setHaveShowToolGuide();
            }).onexit(function(){
                //点击结束按钮后， 执行的事件
                setHaveShowToolGuide();
            }) .start();
			};
			
			
}]);
