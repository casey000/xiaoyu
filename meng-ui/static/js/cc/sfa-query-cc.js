var cc_pamras = {
    cc_type: {'1': 'Remove', '2': 'Install', '3': 'Replace', '4': 'Swap', '': ''},
    cc_status: {'n': '已执行', 'y': '已确认'}
};

var customModelSettings = {
    "CC": {
        // 列表项配置
        gridOptions: {
            allColModels: {}
        }
    },

    "COMP_CC": {
        // 列表项配置
        gridOptions: {
            allColModels: {
                'ccType': {
                    formatter: ccTypeFn,
                    formatType: 'map',
                    pattern: cc_pamras['cc_type']
                },
                'status': {
                    formatter: ccStatusFn,
                    formatType: 'map',
                    pattern: cc_pamras['cc_status']
                },
            }
        }
    }
};

function ccStatusFn(v, ops, obj) {

    if (v) {
        return cc_pamras['cc_status'][v] || '';
    }
    return v;
}

function ccTypeFn(v, ops, obj) {

    if (v) {
        return cc_pamras['cc_type'][v] || '';
    }
    return v;
}

