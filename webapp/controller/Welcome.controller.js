sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function(Controller, History, MessageBox) {
    "use strict";

    return Controller.extend("oms1.controller.Welcome", {
        onInit: function() {
            // Initialize view model for page tracking
            var oViewModel = new sap.ui.model.json.JSONModel({
                currentPage: "dashboard"
            });
            this.getView().setModel(oViewModel, "viewModel");

            // Set router and handle routing
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("welcomeRoute").attachPatternMatched(this._onRouteMatched, this);
            
            // Expand sidebar by default
            this.byId("_IDGenToolPage").setSideExpanded(true);
            
            // Load user data
            var oUserModel = this.getOwnerComponent().getModel("userData");
            this.getView().setModel(oUserModel);
        },

        _onRouteMatched: function() {
            // Set dashboard as default selected
            this._setActivePage("dashboard");
        },

        onNavItemSelect: function(oEvent) {
            var oItem = oEvent.getParameter("item");
            var sItemId = oItem.getId();
            
            // Extract the base ID without component prefixes
            var sBaseId = sItemId.split("--").pop();
            
            switch(sBaseId) {
                case "dashboardItem":
                    this._setActivePage("dashboard");
                    break;
                case "ordersItem":
                    this._setActivePage("orders");
                    break;
                case "profileItem":
                    this._setActivePage("profile");
                    break;
                case "reportsItem":
                    this._setActivePage("reports");
                    break;
            }
        },
        
        _setActivePage: function(sPage) {
            // Update view model
            this.getView().getModel("viewModel").setProperty("/currentPage", sPage);
            
            // Get the navigation list items correctly
            var oNavList = this.byId("_IDGenNavigationList");
            var aItems = oNavList.getItems();
            
            // Update selection - NavigationListItem doesn't have setSelected, so we use setSelectedItem
            var sItemToSelect = sPage + "Item";
            aItems.forEach(function(oItem) {
                var sItemId = oItem.getId().split("--").pop();
                if (sItemId === sItemToSelect) {
                    oNavList.setSelectedItem(oItem);
                }
            });
            
            // Force update of bindings
            this.getView().getModel("viewModel").refresh(true);
        },

        onBackToLogin: function() {
            localStorage.clear();
            this.getOwnerComponent().getModel("userData").setData({
                userId: null,
                token: null,
                company: null,
                companyName: null,
                role: null
            });
            this.getOwnerComponent().getRouter().navTo("loginRoute");
        }
    });
});