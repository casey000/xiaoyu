$(function() {
    var defect_location_dic = {};
    InitFuncCodeRequest_({
        async: false,
        data: {
            domainCode: "DEFECT_LOCATION",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                jdata.data["DEFECT_LOCATION"].forEach(function(o){
                    defect_location_dic[o.VALUE] = o.TEXT;
                });
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
	var ewis_defect_type_list = [
		{
			value: "0",
			label: "磨损/破损",
			name: "ewis_defect_type_0",
		},
		{
			value: "1",
			label: "割伤/划伤",
			name: "ewis_defect_type_1",
		},
		{
			value: "2",
			label: "污染/腐蚀",
			name: "ewis_defect_type_2",
		},
		{
			value: "3",
			label: "部件丢失",
			name: "ewis_defect_type_3",
		},
		{
			value: "4",
			label: "松动",
			name: "ewis_defect_type_4",
		},
		{
			value: "5",
			label: "烧蚀",
			name: "ewis_defect_type_5",
		},
		{
			value: "6",
			label: "功能故障/损坏",
			name: "ewis_defect_type_6",
		},
		{
			value: "7",
			label: "其它",
			name: "ewis_defect_type_other7",
		},
		{
			value: "8",
			label: "断裂/断丝",
			name: "ewis_defect_type_8",
		},
		{
			value: "9",
			label: "非标准施工",
			name: "ewis_defect_type_9",
		}
	];
	var options = {
		view : 'V_DEFECT_EWIS',
		qcOptions : {
			qcBoxId : 'qc_box'
			//showConnector : true
		},
		gridOptions :{
			gridId : 'common_list_grid',
			optsFirst : true,
			jqGridSettings :{
				multiselect : false,
				id : "id",
			},
			allColModels:{
				'dataType': {
					formatter: function (value,options ,row) {
						if (row.dataType){
							var no = "";
							if ("DEFECT"==row.dataType){
								no = row.defectNo||'';
							}else if("NRC"==row.dataType){
								no = row.nrcNo||'';
							}else{
								no = row.tlbNo||'';
							}
							return row.dataType+" ："+no;
						}
						return "";
					}
				},
				'ewisType': {
					formatter: function (value) {
						if (value){
							var listStr = value.split(",");
							var params = [];
							for(let i = 0;i<listStr.length;i++){
								var param = ewis_defect_type_list[listStr[i]].label;
								if(!param){
									continue;
								}
								params.push(ewis_defect_type_list[listStr[i]].label);
							}
                          return params.join(",");
						}
						return "";
					}
				},
				'lineEquipmentType': {
					formatter: "select",
					editoptions: {
						value: {"1":"线号","2":"设备号"}
					},
					formatType: 'map',
					pattern: {
						"1": "线号",
						"2": "设备号"
					}
				},
				'treatmentMethod': {
					formatter: "select",
					editoptions: {
						value: {"1":"接线处理","2":"更换","3":"其它标准处理"}
					},
					formatType: 'map',
					pattern: {
						"1": "接线处理",
						"2": "更换",
						"3": "其它标准处理"
					}
				},
				'defectLocation': {
                    formatter: function (value,options ,row) {
                        if (row.defectLocation){
                            return defect_location_dic[value];
                        }else{
                            return '';
                        }
                    }
				},
				attachment:{
					formatter: function (value,options ,row) {
						if (row.attachments){
							var html = '';
							for(let i in row.attachments){
								html += `<span style="color:#FF6600;cursor: pointer" onclick = "downFile(${row.attachments[i].pkid},${row.attachments[i].pkid})">${row.attachments[i].fileName}</span><br>`
							}
							return html;
						}else{
							return ''
						}

					}
				}
			}
		}
	};
	$(document).sfaQuery(options);
});

