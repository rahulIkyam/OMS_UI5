sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], function (Controller, JSONModel, BusyIndicator) {
    "use strict";

    return Controller.extend("oms1.controller.Welcome", {
        onInit: function () {
            // Initialize view model
            var oViewModel = new JSONModel({
                currentPage: "dashboard"
            });
            this.getView().setModel(oViewModel, "viewModel");

            // Load user data
            var oUserModel = this.getOwnerComponent().getModel("userData");
            this.getView().setModel(oUserModel);

            // Expand sidebar by default
            this.byId("toolPage").setSideExpanded(true);

            // Set default selection (Dashboard)
            var oNavList = this.byId("sideNavList");
            var oDashboardItem = this.byId("dashboardItem");
            oNavList.setSelectedItem(oDashboardItem);
        },

        onNavItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sItemId = oItem.getId();

            console.log("Selected item:", sItemId);

            // Optional: highlight selected item
            this.byId("sideNavList").setSelectedItem(oItem);

            // Determine which page to show based on ID
            var sPageKey = "";
            switch (sItemId) {
                case this.createId("dashboardItem"):
                    sPageKey = "dashboard";
                    break;
                case this.createId("ordersItem"):
                case this.createId("employeeOrdersItem"):
                    sPageKey = "orders";
                    this._loadOrderData();
                    break;
                case this.createId("profileItem"):
                    sPageKey = "profile";
                    break;
                case this.createId("reportsItem"):
                    sPageKey = "reports";
                    break;
            }

            // Set current page in view model
            this.getView().getModel("viewModel").setProperty("/currentPage", sPageKey);
        },

        onToggleSidebar: function () {
            var oToolPage = this.byId("toolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onBackToLogin: function () {
            localStorage.clear();
            this.getOwnerComponent().getModel("userData").setData({
                userId: null,
                token: null,
                company: null,
                companyName: null,
                role: null
            });
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("loginRoute", {}, true);
        },

        _loadOrderData: function () {
            var oUserModel = this.getView().getModel(); // default model is userData
            var sUserId = oUserModel.getProperty("/userId");
            var sToken = oUserModel.getProperty("/token");

            BusyIndicator.show();

            if (!sUserId || !sToken) {
                console.error("User ID or Token not found");
                BusyIndicator.hide();
                return;
            }

            var sUrl = "https://ordermanagement-empathic-mandrill-be.cfapps.us10-001.hana.ondemand.com/api/GSUS/order_master/get_all_ordermaster_by_customer/" + sUserId;

            var that = this;
            fetch(sUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + sToken
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP status " + response.status);
                    }
                    return response.json();
                })
                .then(aData => {
                    that.getView().getModel("viewModel").setProperty("/orderData", aData);
                })
                .catch(error => {
                    console.error("Failed to load orders:", error);
                    sap.m.MessageBox.error("Failed to load orders: " + error.message);
                })
                .finally(() => {
                    BusyIndicator.hide();
                });
        },

        onOrderSelected: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("viewModel");
            var oSelectedOrder = oContext.getObject();

            this.getView().getModel("viewModel").setProperty("/selectedOrder", oSelectedOrder);
            this.getView().getModel("viewModel").setProperty("/currentPage", "orderItems");
        },

        onBackToOrders: function () {
            this.getView().getModel("viewModel").setProperty("/currentPage", "orders");
        }


    });
});