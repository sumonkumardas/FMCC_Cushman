angular
    .module("services", [])
    .service("PopUp", function () {
        function Popup(modal) {
            this.modal = {};
            this.popup = {};
            if (!modal) {
                this.popup = angular.element("<section class=\"ui-popup\"></section>");
            }
            else {
                this.modal = angular.element("<section class=\"ui-mask\"></section>");
                this.popup = angular.element("<section class=\"ui-popup\"></section>");
            }
        }
        return Popup;
    })


var popup = new PopUp(true);
$document[0].body.append(popup.popup[0]);
if (popup.modal) {
    popup.modal.addClass("faded");
    popup.popup.append(angular.element("<div class=\"popup-head clearfix\"><h5> Confirmation Popup </h5><i class=\"fa fa-times pull-right\"></i></div>"));
    popup.popup.append(angular.element("<div class=\"popup-body\"><i class=\"fa fa-warning\"></i> Press yes for your confirmation.</div>"));
    var ybtn = angular.element("<button style=\"min-width:100px;margin-right:5px;\" class=\"btn btn-default btn-sm\">Yes</button>");
    var nbtn = angular.element("<button style=\"min-width:100px;\" class=\"btn btn-default btn-sm\">Cancel</button>");
    var foot = angular.element("<div class=\"popup-foot\"></div>");
    foot.append(ybtn).append(nbtn);
    popup.popup.append(foot);
    $document[0].body.append(popup.modal[0]);
}