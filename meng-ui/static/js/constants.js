/**
 * Created by tpeng on 2016/8/16.
 */
var RESULT_CODE = {
    SUCCESS_CODE: 200,
    ERROR_CODE: 500,
    MSG_ERROR: 907,
    NO_LOGIN_CODE: 100,
    ERR_PROC_DEF_DEPLOY: 3002
};

var Constant = {
    BASE_URL: "/api/",
    API_V1_URL: "/api/v1/",
    API_URL: "/api/v1/plugins/",
    CAMEL_CASE: "CamelCase",
    WEB_SOCKET_URL: "ws://" + window.location.host + "/websocket"  //localhost:8084
};
var SHOW_WINDOW_TYPE = "1"; //0:DIV 1:OPEN WINDOW
//@Deprecated
var KEY_RECORD_LOG = "_record_log_key";


/** ---- MSG_ERR ---- */
var MSG_ERR = {
    ERRMSG_COMMON_OPT_SUCCESS: "msg_err:ERRMSG.COMMON.OPT_SUCCESS"
};


var _C = {
    SYS_USER_LIST: 'UserListDataFilter',
    EM_MPD_FILES_ITEM_LIST: 'EmMpdFilesItemListFilter',
    MPD_FILES_LIST: 'EmMpdFilesListFilter'
};
