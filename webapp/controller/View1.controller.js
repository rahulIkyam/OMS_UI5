sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], (Controller, History) => {
    "use strict";

    return Controller.extend("oms1.controller.View1", {
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("main").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function(oEvent) {
            var oCredModel = this.getOwnerComponent().getModel("cred");
            var sUsername = oCredModel.getProperty("/username");
            
            this.getView().byId("page").setTitle("Welcome, " + sUsername);
            this.getView().setModel(oCredModel, "cred");
          }
    });
});