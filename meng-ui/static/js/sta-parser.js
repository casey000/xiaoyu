/*
 * @Author 刘志(667096)
 * Copyright 2017 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */

/**
 * STA解释器
 * 将737/767机型的500A/500B/500+22等类型的STA信息解释为真实的STA信息
 */
STAParser = {

    config : {},

    sections : [],

    init : function(model){
        var config = {
            "stadef": {
                "757-200": {
                    "STAConfig": "100,200,300,400,500,570,800,1000,1270,1440,1620,1850.5"
                },
                "737-300": {
                    "STAOffet": "#500/0,500A/20,500B/20,500C/20,500D/20,520/0##727/0,727A/20,727B/20,727C/20,727D/20,727E/20,747/0#",
                    "STAConfig": "100,200,400,500A,500D,570,727A,727E,800,1000,1270,1440"
                },
                "737-400": {
                    "STAOffet": "#500/0,500A/22,500B/22,500C/22,500D/22,500E/22,500F/22,500G/20,520/0##727/0,727A/20,727B/20,727C/20,727D/22,727E/22,727F/22,727G/22,747/0#",
                    "STAConfig": "100,200,400,500A,500G,570,727A,727G,800,1000,1270,1440"
                },
                "767-300": {
                    "STAOffet": "#654/0,654+22/22,654+44/22,654+66/22,654+88/22,654+110/22,654+121/11,676/0##1197/0,1197+22/22,1197+44/22,1197+66/22,1197+88/22,1197+110/22,1197+132/22,1219/0#",
                    "STAConfig": "92.5,100,200,300,400,434,500,654,654+22,654+121,676,785.9,1065,1197,1197+22,1197+132,1219,1582,1952"
                }
            },
            "colorBeltConfig": [{
                "dyeValue": "4",
                "color": "1 0 0"
            },
                {
                    "dyeValue": "3",
                    "color": "1 1 0"
                },
                {
                    "dyeValue": "2",
                    "color": "0.6 0.6 1"
                },
                {
                    "dyeValue": "1",
                    "color": "0 0.8 0"
                },
                {
                    "dyeValue": "0",
                    "color": "0.792157 0.819608 0.933333"
                }],

            "dyeRadiusConfig" : "15",

            "sectiondef": {
                "sectionsConf": {
                    "SecAll": {
                        "val": "",
                        "label": "ALL",
                        "onclick" : "seleAll",
                        "category" : [800, 900]
                    },
                    "SEC41": {
                        "val": 41,
                        "label": "SECTION 41",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "SEC43": {
                        "val": 43,
                        "label": "SECTION 43",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "SEC44": {
                        "val": 44,
                        "label": "SECTION 44",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "SEC45": {
                        "val": 45,
                        "label": "SECTION 45",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "SEC46": {
                        "val": 46,
                        "label": "SECTION 46",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "SEC48": {
                        "val": 48,
                        "label": "SECTION 48",
                        "onclick" : "sele",
                        "category" : [100,1500]
                    },
                    "WING": {
                        "val": "WING",
                        "label": "WING",
                        "onclick" : "sele",
                        "category" : [6000,6100,6200,6300,6400,6500,6600,6700,6800,6900]
                    }
                },
                "737": ["SecAll","SEC41","SEC43","SEC46","SEC48","WING"],
                "747": ["SecAll","SEC41","SEC43","SEC44","SEC46","SEC48","WING"],
                "757": ["SecAll","SEC41","SEC43","SEC44","SEC46","SEC48","WING"],
                "767": ["SecAll","SEC41","SEC43","SEC45","SEC46","SEC48","WING"]
            }
        };


        if(!model){
            model = $("#openAppliance").val();

            if(model == ""){
                if (isShowAir == 1) {
                    model = $("#newair").combotree('getValue');
                } else {
                    model = $("#aircraftId").combotree('getValue');
                }
            }
        }

        if(model){
            model = model.replace("B", "").substr(0,7).replace("_", "-");
        }

        var staConfig = config.stadef[model];
        if(staConfig != null){
            this.parsing(staConfig.STAOffet);
        }
    },

    parsing : function(offsetConfig){

        if(offsetConfig == null){
            return;
        }

        this.sections = [];

        var regSection = /#(.*?)#/g;
        var regNode = /([0-9]+)[+]*([0-9a-zA-Z]*)\/([0-9]+)/g;

        while(tmpSection = regSection.exec(offsetConfig)){
            var section = {
                nMinPos : null,
                nMaxPos : null,
                nOffset : 0,
                nList:[]
            };

            //解析航站偏移配置
            while(tmpNode = regNode.exec(tmpSection[0])){
                section.nList.push();
                var node = {};
                node.nPos = parseFloat(tmpNode[1], 10);
                node.strToken = tmpNode[2].toUpperCase();
                node.nOffset = parseFloat(tmpNode[3], 10);
                if(section.nMinPos == null || node.nPos < section.nMinPos){
                    section.nMinPos = node.nPos;
                }

                if(section.nMaxPos == null || node.nPos > section.nMaxPos){
                    section.nMaxPos = node.nPos;
                }

                section.nList.push(node);
            }

            //对数组进行排序
            section.nList.sort(function(node1, node2){
                if (node1.nPos == node2.nPos){
                    if(node1.strToken.match('[0-9]+')){
                        return parseFloat(node1.strToken) > parseFloat(node2.strToken);
                    }
                    return node1.strToken > node2.strToken;
                }
                else{
                    return node1.nPos > node2.nPos;
                }
                return node1.nPos > node2.nPos;
            });

            this.sections.push(section);
        }

        //Section排序
        this.sections.sort(function(section1,section2){
            return section1.nMinPos > section2.nMinPos;
        });

        //计算总偏移量
        var nOffset = 0;
        this.sections.forEach(function(section){
            section.nList.forEach(function(node){
                nOffset += node.nOffset;
                section.nOffset += node.nOffset;
                node.nCalcPos = node.nPos + nOffset;
            });
        });
    },

    /**
     * 获取修正后的STA
     * @param strMark	STA标签
     * @param offset	STA偏移
     * @returns 修正后的STA
     */
    getFixLength : function(strMark, offset){

        var hasResult = false;
        var result = 0;
        var node = this.marker2Node(strMark);

        if(!this.hasNode(node) == false && node.strToken != ""){
            return -1;
        }

        if (this.sections.length == 0){
            return -(node.nPos + node.nOffset);
        }

        //在第一个偏移区间左边，则直接返回
        if (node.nPos < this.sections[0].nMinPos){
            return -(node.nPos + node.nOffset);
        }

        //输入的标签刚好在解析标签里面，则直接使用标签开始位置+偏移量
        this.sections.forEach(function(sectionItem){
            sectionItem.nList.forEach(function(nodeItem){
                if (node.nPos == nodeItem.nPos && node.strToken == nodeItem.strToken){
                    result = nodeItem.nCalcPos + node.nOffset + offset;
                    hasResult = true;
                    return false;
                }
            });
        });

        if (hasResult) {
            return -result;
        }

        //输入标签不在解析标签里面
        var nTotalOffset = 0;
        this.sections.forEach(function(sectionItem){
            //落在偏移区间右侧，则累计偏移量
            if(node.nPos > sectionItem.nMaxPos){
                nTotalOffset += sectionItem.nOffset;
                return true;
            }
            return false;
        });

        //加上累计偏移量返回
        return -(node.nPos + node.nOffset + nTotalOffset);
    },

    /**
     * 将输入的标签转换为节点
     * @param strMark	STA标签
     * @param offset	STA偏移
     * @returns
     */
    getSrcLength : function(nFixLength){
        var hasResult = false;

        var result = {
            nPos : 0,
            nOffset : 0
        };

        if (nFixLength <= 0 || this.sections.length == 0){
            result.nPos = nFixLength.toFixed(1);
            return result;
        }

        //修正值落在标签右侧则累计偏移值
        var nTotalOffset = 0;
        var preNode;

        this.sections.forEach(function(sectionItem){
            var nSectionStartPos = sectionItem.nList[0].nCalcPos;
            var nSectionEndPos = sectionItem.nList[sectionItem.nList.length - 1].nCalcPos;

            //在偏移区间左侧则退出遍历
            if(nFixLength <= nSectionStartPos){
                return false;
            }

            //在偏移区间右侧则累计偏移量
            if(nFixLength >= nSectionEndPos){
                nTotalOffset += sectionItem.nOffset;
                return true;
            }

            //在偏移区间中间则直接获取
            sectionItem.nList.forEach(function(nodeItem){
                if (nFixLength < nodeItem.nCalcPos){
                    result.nOffset = nFixLength - preNode.nCalcPos;
                    if(preNode.strToken.match('[0-9]+')){
                        result.nPos = preNode.nPos;
                        result.nOffset += parseFloat(preNode.strToken);
                    }else{
                        result.nPos = preNode.nPos + preNode.strToken;
                    }
                    result.nOffset = result.nOffset;
                    hasResult = true;
                    return false;
                }
                preNode = nodeItem;
            });

            return false;
        });

        if(hasResult){
            if(typeof (result.nPos) != 'string'){
                result.nPos = result.nPos.toFixed(1);
            }
            result.nOffset = result.nOffset.toFixed(1);
            return result;
        }

        result.nPos = (nFixLength - nTotalOffset).toFixed(1);
        result.nOffset = result.nOffset.toFixed(1);
        return result;
    },

    /**
     * 将输入的标签转换为节点
     *
     * @param strMark	STA标签
     * @param offset	STA偏移
     * @returns
     */
    marker2Node : function(marker){
        var regNode = /([0-9]+)[+]*([0-9a-zA-Z]*)/;
        var tmp = regNode.exec(marker);
        var node = {
            nPos : parseFloat(tmp[1], 10),
            strToken : tmp[2].toUpperCase(),
            nOffset : 0
        };
        return node;
    },

    /**
     * 判断节点是否存在
     *
     * @param node	传入节点
     * @returns	找到的节点
     */
    hasNode : function(node2Find){
        var found = false;
        this.sections.forEach(function(section){
            section.nList.forEach(function(node){
                if (node.nPos == node2Find.nPos && node.strToken == node2Find.strToken){
                    found = true;
                }
            });
        });
        return false;
    }
}

