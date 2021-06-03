draw2d.UserTask=function(configPropCallback){
	draw2d.Task.call(this,configPropCallback);
	this.performerType=null;
	this.dueDate=null;
	this.priority=null;
	this.formKey = null;
	this.expression=null;
	this.isUseExpression=true;
	this.assignee=null;
	this.candidateUsers=new draw2d.ArrayList();
	this.candidateGroups=new draw2d.ArrayList();
	this.formProperties=new draw2d.ArrayList();
	this.taskListeners=new draw2d.ArrayList();
	this.setTitle("User Task");
};
draw2d.UserTask.prototype=new draw2d.Task();
draw2d.UserTask.prototype.type="draw2d.UserTask";
draw2d.UserTask.newInstance=function(userTaskXMLNode){
	var task = new draw2d.UserTask();
	task.id=userTaskXMLNode.attr('id');
	task.taskId=userTaskXMLNode.attr('id');
	task.taskName=userTaskXMLNode.attr('name');
	task.setContent(userTaskXMLNode.attr('name'));
	return task;
};
draw2d.UserTask.prototype.getIconClassName = function(){
	if(this.checkIFJoint()){
		return "user-task-icon-joint";
	}
	return "user-task-icon";
};
draw2d.UserTask.prototype.checkIFJoint = function(){
	return this.isSequential != '' ? true : false;
};
draw2d.UserTask.prototype.getStartElementXML=function(){
	var xml='<userTask ';
	xml=xml+this.getGeneralXML();
	xml=xml+this.getPerformersXML();
	xml=xml+'>\n';
	return xml;
};
draw2d.UserTask.prototype.getEndElementXML=function(){
	var xml = '</userTask>\n';
	return xml;
};
draw2d.UserTask.prototype.getDocumentationXML=function(){
	if(this.documentation==null||this.documentation=='')return '';
	var xml='<documentation>';
	xml=xml+this.documentation;
	xml=xml+'</documentation>';
	return xml;
};
draw2d.UserTask.prototype.getPerformersXML=function(){
	var props = {};
	//if(this.isUseExpression){
    	if(!this.isSequential && this.expression!=null && this.expression!=''){
			if(this.performerType=='assignee'){
				props['activiti:assignee'] = this.expression;
			}else if(this.performerType=='candidateUsers'){
				props['activiti:candidateUsers'] = this.expression;
			}else if(this.performerType=='candidateGroups'){
				props['activiti:candidateGroups'] = this.expression;
			}
		}
	//}
	if(this.dueDate!=null&&this.dueDate!=''){
		props['activiti:dueDate'] = this.dueDate;
	}
	if(this.formKey != null && this.formKey != ""){
		props['activiti:formKey'] = this.formKey;
	}
	if(this.priority!=null&&this.priority!=''){
		props['activiti:priority'] = this.priority;
	}
	//设置了会签属性 //&& (this.jointCollectionType == 'BLRY' || this.jointCollectionType == 'YWFW')){ this._elementAsAssignee == 'Y'
    if(this.isSequential&& this._elementVariable){
		props['activiti:assignee'] = '${'+this._elementVariable+'}';
	}
	var xml = '';
	for(var key in props){
		xml += (xml == '' ? '' : ' ') + key + '="'+props[key]+'"';
	}
	return xml;
};
draw2d.UserTask.prototype.getExtensionElementsXML=function(){
	if(this.taskListeners.getSize()==0&&this.formProperties.getSize()==0)return '';
	var xml = '<extensionElements>\n';
	xml=xml+this.getFormPropertiesXML();
	xml=xml+this.getListenersXML();
	xml=xml+'</extensionElements>\n';
	return xml;
};
draw2d.UserTask.prototype.getListenersXML=function(){
	var xml = draw2d.Task.prototype.getListenersXML.call(this);
	for(var i=0;i<this.taskListeners.getSize();i++){
		var listener = this.taskListeners.get(i);
		xml=xml+listener.toXML();
	}
	return xml;
};
draw2d.UserTask.prototype.getFormPropertiesXML=function(){
	var xml = '';
	for(var i=0;i<this.formProperties.getSize();i++){
		var formProperty = this.formProperties.get(i);
		xml=xml+formProperty.toXML();
	}
	return xml;
};
draw2d.UserTask.prototype.toXML=function(){
	var xml=this.getStartElementXML();
	xml=xml+this.getDocumentationXML();
	xml=xml+this.getExtensionElementsXML();
	xml=xml+this.getMultiInstanceXML();
	xml=xml+this.getEndElementXML();
	return xml;
}
draw2d.UserTask.prototype.getCandidateUser=function(sso){
	for(var i=0;i<this.candidateUsers.getSize();i++){
		var candidate = this.candidateUsers.get(i);
		if(candidate.sso===sso){
			return candidate;
		}
	}
	return null;
};
draw2d.UserTask.prototype.deleteCandidateUser=function(sso){
	var candidate = this.getCandidateUser(sso);
	this.candidateUsers.remove(candidate);
};
draw2d.UserTask.prototype.addCandidateUser=function(user){
	if(this.getCandidateUser(user.sso)==null)
		this.candidateUsers.add(user);
};
draw2d.UserTask.prototype.getCandidateGroup=function(name){
	for(var i=0;i<this.candidateGroups.getSize();i++){
		var candidate = this.candidateGroups.get(i);
		if(candidate===name){
			return candidate;
		}
	}
	return null;
};
draw2d.UserTask.prototype.deleteCandidateGroup=function(name){
	var candidate = this.getCandidateGroup(name);
	this.candidateGroups.remove(candidate);
};
draw2d.UserTask.prototype.addCandidateGroup=function(name){
	if(!this.candidateGroups.contains(name))
		this.candidateGroups.add(name);
};
draw2d.UserTask.prototype.getTaskListener=function(id){
	for(var i=0;i<this.taskListeners.getSize();i++){
		var listener = this.taskListeners.get(i);
		if(listener.getId()=== id){
			return listener;
		}
	}
};
draw2d.UserTask.prototype.deleteTaskListener=function(id){
	var listener = this.getTaskListener(id);
	this.taskListeners.remove(listener);
};
draw2d.UserTask.prototype.addTaskListener=function(listener){
	this.taskListeners.add(listener);
};
draw2d.UserTask.prototype.setTaskListeners=function(listeners){
	this.taskListeners = listeners;
};
draw2d.UserTask.prototype.getFormProperties=function(id){
	for(var i=0;i<this.formProperties.getSize();i++){
		var prop = this.formProperties.get(i);
		if(prop.id== id){
			return prop;
		}
	}
};
draw2d.UserTask.prototype.deleteFormProperties=function(id){
	var prop = this.getFormProperties(id);
	this.formProperties.remove(prop);
};
draw2d.UserTask.prototype.addFormProperties=function(prop){
	this.formProperties.add(prop);
};
draw2d.UserTask.prototype.setFormProperties=function(props){
	this.formProperties = props;
};