;(function($){
    $.fn.zoneSelect = function(option, value,inde){
        if(typeof option != "string"){
            return
        }
        if(option == "init"){
            return new Zone(this, value)
        }else{
            this.combobox(option, value)
        }

        function Zone(jq_obj, model){
            this.zone = jq_obj;
            this.zone_flag = 0;
            this.zone_id = "";
            this.zone_no = "";
            this.model = model;
            this.init = function(){
                this.zone.combobox({
                    data: [],
                    panelHeight: '150px',
                    valueField: 'zone',
                    textField: 'zone',
                    onSelect: item=>{
                        this.zone_id = item.id;
                        this.zone_no = item.zone;
                        this.zone_flag = 1;
                    },
                    onChange: item=>{
                        this.zone_flag = 0;
                    }
                });
                this.zone.next("span").children("input:first").blur(()=>{
                    if(!this.zone_flag){
                        this.zone.combobox("clear")
                    }
                });
                axios.get("/api/v1/eo_zone/list/?model=" + this.model).then(response => {
                    this.zone.combobox({
                        data: response.data.data.eoZoneList,
                        onLoadSuccess:function () {
                            if(inde){
                                $(this).combobox("setValue",inde);
                            }
                        }

                    })
                }).catch(err=>{
                })
            }
            this.init();
        }
    }
})($)