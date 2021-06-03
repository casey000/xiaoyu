
$(function() {
    var options = {
        view : 'V_DEFECT_OPEN_MONITOR_LAGGER',
        qcOptions :{
            qcBoxId : 'qc_box' 
        },
        defaultParam: {
            id: 32
        },
        gridOptions :{
            gridId : 'common_list_grid',
            optsFirst : true,
            optsCols : [],     //可能要加权限控制      
            jqGridSettings :{
                multiselect : false,
                id : "id",
            }
        }
    };
    
    $(document).sfaQuery(options);
});