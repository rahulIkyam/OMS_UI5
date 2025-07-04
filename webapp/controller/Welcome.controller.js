sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function(Controller, History, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("oms1.controller.Welcome", {
        onInit: function() {
            // Initialize view model for page tracking
            var oViewModel = new JSONModel({
                currentPage: "dashboard",
                orderData: []
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
                    this._loadOrderData();
                    break;
                case "profileItem":
                    this._setActivePage("profile");
                    break;
                case "reportsItem":
                    this._setActivePage("reports");
                    break;
            }
        },

        _loadOrderData: function() {
            var aOrders = [
                {
                    "orderId": "ORD_00157",
                    "contactPerson": "Hassan",
                    "orderDate": "17/06/2025",
                    "total": 4000.0,
                    "status": "No customer master record exists for sold-to party 1000000174"
                },
                {
                    "orderId": "ORD_00161",
                    "contactPerson": "Hassan",
                    "orderDate": "18/06/2025",
                    "total": 4000.0,
                    "status": "No customer master record exists for sold-to party 1000000174"
                },
                {
                    "orderId": "ORD_00165",
                    "contactPerson": "Hassan",
                    "orderDate": "18/06/2025",
                    "total": 4060.0,
                    "status": "No customer master record exists for sold-to party 1000000174"
                }
            ];

            this.getView().getModel("viewModel").setProperty("/orderData", aOrders);
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
        },

        onOrderSelected: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("viewModel");
            var sOrderId = oContext.getProperty("orderId");
            
            MessageBox.show("Selected order: " + sOrderId, {
                title: "Order Selected"
            });
        }
    });
});