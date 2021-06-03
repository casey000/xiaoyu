/**
 * Created by tpeng on 2016/5/20.
 */
$.validator.setDefaults({
    highlight: function (e) {
        $(e).closest("tr").removeClass("has-success").addClass("has-error")
    }, success: function (e) {
        e.closest("tr").removeClass("has-error").addClass("has-success")
    }, errorElement: "span", errorPlacement: function (e, r) {
        // e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
        e.html("<i class='fa fa-times-circle'></i> " + e.html());
        e.appendTo(r.closest("td"));
    }, errorClass: "help-block m-b-none", validClass: "help-block m-b-none"
});