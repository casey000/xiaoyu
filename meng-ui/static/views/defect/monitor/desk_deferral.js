<script type="text/javascript">
    let html_content = `
        <table cellpadding="0" cellspacing="0" class="moduleMargin">
            <tr>
                <td class="moduleHeader_left"></td>
                <td class="moduleHeader_middle"><strong>${item.name}</strong></td>
                <td width="73" class="moduleHeader_middle align_right">
                   <img src="../images/btn_refresh_16.gif" id="mccRefresh" style="cursor: pointer;" onclick="refresh${item.id}()" />
                </td>
                <td class="moduleHeader_right"></td>
            </tr>
            <tr height="192px">
                <td colspan="4" style="border-left: 1px solid #ccc;border-right: 1px solid #ccc;">
                    <div class="listbox" style="min-height: 180px">
                        <div class="gridbox">
                            <div class="grid_tab">
                                <table id="common_list_grid${item.id}"></table>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="more" colspan="4">
                    <a id="show_more" href="javascript:void(0)" onclick="showMore${item.id}()">more...</a>
                </td>
            </tr>
            <tr>
                <td class="b_border" colspan="4">
                    <table cellpadding="0" cellspacing="0" class="moduleBottom">
                        <tr>
                            <td class="moduleBottom_left"></td>
                            <td></td>
                            <td class="moduleBottom_right"></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `
    P = window;
    $("#common_list_grid${item.id}").sfaQuery({
        view : '${item.viewNameSmall}',
        defaultParam : {
            "id" : "${item.id}"
        },
        gridOptions : {
            gridId : 'common_list_grid${item.id}',
            jqGridSettings : {
                rowNum : 5,
                rownumbers:false,
                multiselect:false
            }
        }
    });
    
    function refresh${item.id}() {
        
        $("#common_list_grid${item.id}").sfaQuery().reloadQueryGrid();
    }
    
    function showMore${item.id}(){
        P = window;
        var dlg = $("#show_more").sfaQueryDialog({
            dialogId : "common_list_dialog_${item.id}",
            dialogTitle : "${item.name}",
            view : '${item.viewNameLarge}',
            lock:true,
            defaultParam : {
                "id" : "${item.id}"
            },
            qcOptions :{
                qcBoxId : 'qc_box',
                showSavedQueries : false
            },
            gridOptions : {
                gridId : 'common_list_grid',
                jqGridSettings : {
                    rowNum : 15,
                    multiselect:false
                }
            },
            exportOptions : {
                showExport : true,
                fileName : "${item.name}.xls"
            }
        });
    }
</script>