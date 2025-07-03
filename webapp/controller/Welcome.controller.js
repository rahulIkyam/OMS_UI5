sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function(Controller, History, MessageBox) {
    "use strict";

    return Controller.extend("oms1.controller.Welcome", {
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("welcomeRoute").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function(oEvent) {
            var oUserModel = this.getOwnerComponent().getModel("userData");
            // var oView = this.getView();
            this.getView().setModel(oUserModel);
            // oView.byId("page").setTitle("Welcome, " + oUserModel.getProperty("/userId"));
        },

        onNavButtonPress: function() {
            // Handle shell bar navigation button press
            this.byId("_IDGenToolPage").toggleSideContent();
        },

        onToggleSidebar: function() {
            this.byId("_IDGenToolPage").toggleSideContent();
        },

        onNavItemSelect: function(oEvent) {
            var sItemId = oEvent.getParameter("item").getId();
            MessageBox.show("Selected: " + sItemId.split("--")[1]);
            // Add actual navigation logic here
        },

        onBackToLogin: function() {
            // Clear auth data on logout
            localStorage.clear();
            this.getOwnerComponent().getModel("userData").setData({
                userId: null,
                token: null,
                company: null,
                companyName: null,
                role: null
            });
            
            // Navigate back to login
            this.getOwnerComponent().getRouter().navTo("loginRoute");
        }
    });
});