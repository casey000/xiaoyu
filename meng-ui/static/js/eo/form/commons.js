/*var api = frameElement.api, W = api.opener;
api.button(
	{
		name: 'Save',
		callback: function(){
			addSelected();
			return false;
			W.$.dialog({
				title:"Window",  
				icon: 'success.gif', 
				content: 'Save Success!',
				lock:true
			}).button({name:"OK"});
		}
	},
	{
		name: 'Close'
	}
);*/

function title_formatter(value, node) {
    var content = '<input name="set_power" id="aircraft_' + node.id + '" onclick="set_power_status(this,' + node.id + ')" class="set_power_status" type="checkbox" value="' + node.id + '" _acId="' + node.acId + '"/>' + value;
    return content;
}

function check_formatter(value, node) {
    var content = '<input name="set_power" id="engine_' + node.id + '" onclick="component_check(this,' + node.id + ')" class="set_power_status" type="checkbox" value="' + node.id + '" />' + value;
    return content;
}

function set_power_status(obj, menu_id) {
    var nodes = $("#table_aircraft").treegrid("getChildren", menu_id);
    var _this = $(obj);
    for (var i = 0; i < nodes.length; i++) {
        if (_this.prop("checked")) {
            $("#aircraft_" + nodes[i].id).prop("checked", true);
        } else {
            $("#aircraft_" + nodes[i].id).prop("checked", false);
        }
    }

}

function component_check(obj, menu_id) {
    var nodes = $("#table_engine_component").treegrid("getChildren", menu_id);
    var _this = $(obj);
    for (var i = 0; i < nodes.length; i++) {
        if (_this.prop("checked")) {
            $("#engine_" + nodes[i].id).prop("checked", true);
        } else {
            $("#engine_" + nodes[i].id).prop("checked", false);
        }
    }

} 