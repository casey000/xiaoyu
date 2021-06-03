/*
    项目中无地方引用的JS, 梳理外站关键字段，清理冗余代码
 */

/*
/!**
 * 选择件号(For 外站)
 * @param $tpl
 *!/
function searchPn4OutStation($img, station, tail) {

    $img.click(function () {

        var defaultParmas = {};

        if (station && tail) {
            var newTail = tail.replace("B-", "B");
            var temp = station + "," + newTail;

            defaultParmas =
                {
                    'pageModel.qname': {0: "location"},
                    "pageModel.qoperator": {0: "in"},
                    'pageModel.qvalue': {0: temp}
                }
        } else {
            if (station) {
                defaultParmas =
                    {
                        'pageModel.qname': {0: "location"},
                        "pageModel.qoperator": {0: "equals"},
                        'pageModel.qvalue': {0: station}
                    }
            }
        }

        if ($("#cardType").val() != "TLB" && $("#cardType").val() != "NRC") {
            var $dlg = $(this).sfaQueryDialog({
                dialogId: "dlg_select_pn",
                dialogTitle: "Select PN(MAXIMO)",
                view: "V_INVASSET",
                dialogWidth: 1000,
                defaultParam: defaultParmas,
                qcOptions: {
                    qcBoxId: 'qc_box',
                    showSavedQueries: false,
                    toUpperCase: true,
                    ignoreCase: false
                },

                gridOptions: {
                    loadDataPostInit: false,
                    callback: function (rowdata, originalData) {

                        var isTail = originalData.aircraft;
                        if (isTail == 1) {
                            P.$.dialog.confirm('只有在当地库房无库存的情况下才选择飞机库房库存, 确认继续吗 ？', function () {

                                if (originalData.curbal <= 0 && $("#cardType").val().indexOf("LM") >= 0) {
                                    P.$.dialog.alert("件号 " + originalData.partNo + " 在 " + originalData.location + " 可用库存不足.");
                                    return;
                                }

                                fillItem($img, $dlg, originalData, "outStation");

                            }, function () {
                                //$.dialog.tips('执行取消操作');
                            })
                        } else {
                            if (originalData.curbal <= 0 && $("#cardType").val().indexOf("LM") >= 0) {
                                P.$.dialog.alert("件号 " + originalData.partNo + " 在 " + originalData.location + " 可用库存不足.");
                                return;
                            }

                            fillItem($img, $dlg, originalData, "outStation");
                        }
                    }
                }
            });
        }
    });
}

/!**
 * 选择件号(For 中心仓)
 * @param $tpl
 *!/
function searchPn4CenterStation($img, station) {

    $img.click(function () {

        var defaultParmas = {};

        if (station) {
            defaultParmas =
                {
                    'pageModel.qname': {0: "location"},
                    "pageModel.qoperator": {0: "equals"},
                    'pageModel.qvalue': {0: station},
                    "pageModel.orderById": false
                }
        }

        if ($("#cardType").val() != "TLB" && $("#cardType").val() != "NRC") {
            var $dlg = $(this).sfaQueryDialog({
                dialogId: "dlg_select_pn",
                dialogTitle: "Select PN(MAXIMO)",
                view: "V_InventoryBalance",
                dialogWidth: 1000,
                defaultParam: defaultParmas,
                qcOptions: {
                    qcBoxId: 'qc_box',
                    showSavedQueries: false,
                    toUpperCase: true,
                    ignoreCase: false
                },

                gridOptions: {
                    loadDataPostInit: false,
                    callback: function (rowdata, originalData) {
                        if (originalData.availableQty <= 0 && $("#cardType").val().indexOf("LM") >= 0) {
                            P.$.dialog.alert("件号 " + originalData.partNo + " 在 " + originalData.location + " 可用库存不足.");
                            return;
                        }

                        fillItem($img, $dlg, originalData, "centerStation");
                    }
                }
            });
        }
    });
}

/!**
 * 选择件号(For Defect 中心仓)
 * @param $tpl
 *!/
function searchDefectPn4CenterStation($img, station) {

    $img.click(function () {

        var defaultParmas = {};
        if (station.length == 3) {
            station = station + "S";
        }
        if (station) {
            defaultParmas =
                {
                    'pageModel.qname': {0: "location"},
                    "pageModel.qoperator": {0: "equals"},
                    'pageModel.qvalue': {0: station},
                    "pageModel.orderById": false
                }
        }

        var $dlg = $(this).sfaQueryDialog({
            dialogId: "dlg_select_pn",
            dialogTitle: "Select PN(MAXIMO)",
            view: "V_INVBALANCE",
            dialogWidth: 1000,
            defaultParam: defaultParmas,
            qcOptions: {
                qcBoxId: 'qc_box',
                showSavedQueries: false,
                toUpperCase: true,
                ignoreCase: false
            },

            gridOptions: {
                loadDataPostInit: false,
                callback: function (rowdata, originalData) {
                    /!*if(originalData.availableQty <= 0 && $("#cardType").val().indexOf("DEF") >= 0){
                        P.$.dialog.alert("件号 " + originalData.partNo + " 在 " + originalData.location + " 可用库存不足.");
                        return;
                    }
                    *!/
                    fillItem($img, $dlg, originalData, "centerStation");
                }
            }
        });
    });
}


/!**
 * 选择件号 (LMDEF AOG)
 * @param $search
 * @param multi
 *!/
function searchPn4Aog($search, multi) {
    var parameters = {};
    if (multi != undefined) {
        var parameters = {
            "ismultiselect": true
        };
    }
    var actionUrl = "common/select_parts_list.jsp";
    P.$.dialog({
        title: 'Part Search',
        width: '1100px',
        height: '600px',
        top: '100%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        lock: true,
        close: function () {
            if (this.data.selectedIds) {
                var selectedIds = this.data.selectedIds;
                var partno = this.data.partno;
                var chinesename = this.data.chinesename;
                var englishname = this.data.englishname;
                var itemnum = this.data.itemnum;
                var issueunit = this.data.issueunit;
                var altitemnum = this.data.altitemnum == 'null' ? '' : this.data.altitemnum;
                var name = chinesename + "/" + englishname;
                if ($($search).attr("id")) {
                    var partnos = "";
                    if (this.data.partnos) {
                        var _data = this.data.partnos;
                        for (i = 0; i < _data.length; i++) {
                            if (i != _data.length - 1) {
                                partnos += _data[i].partno + ",";
                            } else {
                                partnos += _data[i].partno;
                            }
                        }
                    }
                } else {
                    $($search).closest("tr").find("[name^=pn_]").val(partno);
                    $($search).closest("tr").find("[name^=pnname_]").val(name);
                    $($search).closest("tr").find("[name^=itemnum_]").val(itemnum);
                    //$($search).closest("tr").find("input.itemnum_").val(itemnum);
                    $($search).closest("tr").find("[name^=unit_]").val(issueunit);


                }

            }
        },
        content: 'url:' + actionUrl,
        data: parameters
    });
}

/!**
 * 选择件号
 * @param $tpl
 *!/
function attachSelectMaximoPn($img) {
    $img.click(function () {
        var parameters = {};
        var actionUrl = "pnrequest/part_number_list.jsp";
        P.$.dialog({
            title: 'Part Search',
            width: '1250px',
            height: '600px',
            top: '100%',
            esc: true,
            cache: false,
            max: false,
            min: false,
            parent: this,
            close: function (results) {
                if (this.data.partno) {
                    var selectedIds = this.data.selectedIds;
                    var partno = this.data.partno;
                    var partname = this.data.chinesename;
                    $img.closest("tr").find("[name^=pn_]").val(partname);
                    $img.closest("tr").find("[name^=pnname_]").val(partno);
                }
            },
            content: 'url:' + actionUrl,
            data: parameters
        });
    });
}


function fillItem($img, $dlg, originalData, type) {
    $img.closest("tr").find("[name^=pn_]").val(originalData.partNo);
    $img.closest("tr").find("[name^=itemnum_]").val(originalData.itemNum);
    $img.closest("tr").find("[name^=unit_]").val(originalData.unit);

    if ($("#cardType").val().indexOf("LM") >= 0 || $("#cardType").val() == "DEF") {
        if (type == "outStation") {
            $img.closest("tr").find("[name^=qty_]").attr("max", originalData.curbal);
        } else {
            $img.closest("tr").find("[name^=qty_]").attr("max", originalData.availableQty);
        }

        $img.closest("tr").find("[name^=pn_]").removeClass("validpn");
    }

    if ($("#cardType").val().indexOf("DEFREQ") >= 0) {
        if (type == "outStation") {
            $img.closest("tr").find("[name^=qty_]").attr("max_", originalData.curbal);
        } else {
            $img.closest("tr").find("[name^=qty_]").attr("max_", originalData.availableQty);
        }

        $img.closest("tr").find("[name^=pn_]").removeClass("validpn");
    }

    $img.closest("tr").find("[name^=pnname_]").val(originalData.description);

    if (originalData.location != null && originalData.location.indexOf("SSC") != 0) {
        $img.closest("tr").find("[name^=station_]").val(originalData.location);
    } else {
        $img.closest("tr").find("[name^=station_]").val(originalData.location);
    }

    //资产号
    $img.closest("tr").find("[name^=assetNum_]").val(originalData.assetNum);

    //序号
    $img.closest("tr").find("[name^=serialNum_]").val(originalData.serialNum);

    //批次号
    $img.closest("tr").find("[name^=lotNum_]").val(originalData.lotNum);

    $dlg.close();
}

/!**
 * 切换readonly状态
 * @param $p
 *!/
function cardTypeChangedCallback($p, clean) {
    var cardType = $("#cardType").val();
    var station = $("#station").val();
    var acFlag = $("#tailOrEng").val();
    var tail = "";

    if (acFlag == 0) {
        tail = $("#tailEng").val();
    }

    if (!cardType) {
        P.$.dialog.alert("Please Select Card Type !");
        return;
    }

    if (!station) {
        P.$.dialog.alert("Please Select Station !");
        return;
    }

    if ((cardType.indexOf("LM") != -1 && cardType != "LMDEF") || cardType.indexOf("DEF") != -1) {
        //航线类MR,分中心仓和外站
        toggleReadOnly($p.find("[name^=pn_]"), true);
        toggleReadOnly($p.find("[name^=unit_]"), true);
        toggleReadOnly($p.find("[name^=station_]"), true);

        toggleReadOnly($p.find("[name^=assetNum_]"), true);
        toggleReadOnly($p.find("[name^=serialNum_]"), true);
        toggleReadOnly($p.find("[name^=lotNum_]"), true);
        toggleReadOnly($p.find("[name^=satisfy_]"), true);

        if (clean) {
            $p.find("[name^=pn_]").val("");
            $p.find("[name^=pnname_]").val("");
            $p.find("[name^=unit_]").val("");
            $p.find("[name^=station_]").val("");
            $p.find("[name^=itemnum_]").val("");

            $p.find("[name^=assetNum_]").val("");
            $p.find("[name^=serialNum_]").val("");
            $p.find("[name^=lotNum_]").val("");
        }

        $p.find("[name^=pn_]").removeClass("validpn");
        $p.find(".select_pn").removeAttr("onclick");

        if(station == 'SZX' || station == 'HGH') {
            //中心仓    SZX/PEK/HGH
            $p.find("[name^=pn_]").parent().each(function (index, obj) {
                if (cardType == "DEFREQ") {
                    $p.find("[name^=station_]").removeAttr("maxlength");
                    searchDefectPn4CenterStation($(this).find(".select_pn"), station);
                } else {
                    searchPn4CenterStation($(this).find(".select_pn"), station);
                }
            });
        } else {
            //外站
            $p.find("[name^=pn_]").parent().each(function (index, obj) {
                if (cardType == "DEFREQ") {
                    $p.find("[name^=station_]").removeAttr("maxlength");
                    searchDefectPn4CenterStation($(this).find(".select_pn"), station);
                } else {
                    searchPn4OutStation($(this).find(".select_pn"), station, tail);
                }
            });
        }

    } else {
        //LMDEF(AOG)
        toggleReadOnly($p.find("[name^=pn_]"), true);
        toggleReadOnly($p.find("[name^=pnname_]"), false);
        toggleReadOnly($p.find("[name^=unit_]"), true);
        toggleReadOnly($p.find("[name^=station_]"), false);

        toggleReadOnly($p.find("[name^=assetNum_]"), true);
        toggleReadOnly($p.find("[name^=serialNum_]"), true);
        toggleReadOnly($p.find("[name^=lotNum_]"), true);
        toggleReadOnly($p.find("[name^=satisfy_]"), true);

        $p.find("[name^=qty_]").removeAttr("max");
        $p.find("[name^=pn_]").addClass("validpn");

        $p.find(".select_pn").unbind("click");
        $p.find(".select_pn").attr("onclick", "searchPn4Aog(this)");
    }
}

function toggleReadOnly($e, readonly) {
    if (readonly) {
        if ($e.is("select")) {
            $e.attr("disabled", true);
        } else {
            $e.attr("readonly", true);
        }
        $e.css("background-color", "#ebebeb");
    } else {
        if ($e.is("select")) {
            $e.attr("disabled", false);
        } else {
            $e.attr("readonly", false);
        }
        $e.css("background-color", "#fff");
    }
}*/
