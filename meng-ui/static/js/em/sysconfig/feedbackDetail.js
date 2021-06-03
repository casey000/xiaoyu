
/**
 *  功能描述:  初始化列表
 *  2019/10/30
 */
function initConfigFeedbackDetail(id, recordId) {

    InitFuncCodeRequest_({
        data: {
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE",
            domainCode: "EM_MODULE_ORG_ORG_ID,CONFIG_FEEDBACK_STATUS"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['orgId'] = DomainCodeToMap_(jdata.data["EM_MODULE_ORG_ORG_ID"]);
                PAGE_DATA['feedbackStatus'] = DomainCodeToMap_(jdata.data["CONFIG_FEEDBACK_STATUS"]);
                initDataGridFeedbackDetail(id, recordId);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });


}

function initDataGridFeedbackDetail(id, recordId) {

    $("#" + id).MyDataGrid({
        identity: 'configFeedbackDetail',
        url: '/api/v1/emSysConfigFeedback/querySysconfigFeedbackDetailList?configFeedbackId=' + recordId,
        method: 'get',
        sortable: true,
        singleSelect: true,
        pagination: false,
        fitColumns: false,
        resize: function () {
            return {width: 780, height: 235};
        },
        columns: [
            {field: 'sendDept', title: '通知部门', width: 120, formatter: sendDeptFormatter},
            {field: 'receiverName', title: '接收人', width: 120},
            {field: 'status', title: '反馈状态', width: 120, formatter: statusFormatter},
            {field: 'feedbackDate', title: '反馈时间', width: 120,formatter:feedbackDateFormatter},
            {field: 'feedbackDesc', title: '反馈描述', width: 120},
            {field: 'attachment', title: '附件', width: 120, formatter: attachmentFormatter}
        ],
        onLoadSuccess: function (data) {

        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
        }
    });

}


function sendDeptFormatter(value, row, index) {

    return PAGE_DATA['orgId'][value];
}

function feedbackDateFormatter(value, row, index) {

    return changeDateFormatExt(value);
}


function statusFormatter(value, row, index) {

    return PAGE_DATA['feedbackStatus'][value];
}

function attachmentFormatter(value, row, index) {
    var attachments = row.wsAttachmentInfoList;
    if (!attachments || attachments.length == 0) {
        return "";
    }

    var result = ['<ul>'];
    for (var i = 0; i < attachments.length; i++) {
        var attachment = attachments[i];
        var fileId = attachment.pkid;
        var filename = attachment.orgName;
        result.push('<li><a onclick="downFile(' + fileId + ')" href="javascript:void(0);">' + filename + '</a></li>');
    }
    result.push('</ul>');
    return result.join('');
}