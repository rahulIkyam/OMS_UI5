sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"
], function (Controller, MessageBox, BusyIndicator) {
    "use strict";

    return Controller.extend("oms1.controller.Login", {

        base_url: "https://ordermanagement-empathic-mandrill-be.cfapps.us10-001.hana.ondemand.com/api",

        onInit: function () {
            if(localStorage.getItem("token")) {
                this._navigateBasedOnRole();
            }
        },

        onLoginPress: function () {
            var oView = this.getView();
            var sUsername = oView.byId("usernameInput").getValue();
            var sPassword = oView.byId("passwordInput").getValue();

            // Simple validation
            if (!sUsername || !sPassword) {
                MessageBox.error("Please enter both username and password");
                return;
            }

            this._authenticateUser(sUsername, sPassword);
        },


        _authenticateUser: function(sUsername, sPassword) {
            BusyIndicator.show();

            var oPayload = {
                userName: sUsername,
                password: sPassword
            };

            jQuery.ajax({
                url: this.base_url + "/public/user_master/login-authenticate",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPayload),
                success: this._handleLoginSuccess.bind(this),
                error: this._handleLoginError.bind(this)
            });
        },

        _handleLoginSuccess: function(oData) {
            BusyIndicator.hide();

            if (oData.error) {
                this._showLoginError(oData.code);
                return;
            }

            this._storeAuthData(oData);

            this._navigateBasedOnRole();
        },

        _handleLoginError: function(jqXHR) {
            BusyIndicator.hide();
            MessageBox.error("Login failed: " + (jqXHR.responseJSON?.message || "Unknown error"));
        },

        _showLoginError: function(sCode) {
            switch(sCode) {
                case '401':
                    MessageBox.error("Invalid Password");
                    break;
                case '404':
                    MessageBox.error("User not found");
                    break;
                case '403':
                    MessageBox.error("Account inactive");
                    break;
                default:
                    MessageBox.error("Login failed");
            }
        },

        _storeAuthData: function(oData) {
            localStorage.setItem('userId', oData.userId);
            localStorage.setItem('token', oData.token);
            localStorage.setItem('company', oData.company);
            localStorage.setItem('companyName', oData.companyName);
            localStorage.setItem('role', oData.role);
            
            // Also store in component model
            this.getOwnerComponent().getModel("userData").setData({
                userId: oData.userId,
                token: oData.token,
                company: oData.company,
                companyName: oData.companyName,
                role: oData.role
            });
        },

        _navigateBasedOnRole: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            var sRole = localStorage.getItem("role") || "";
            
            // Navigate to welcome screen with user data
            oRouter.navTo("welcomeRoute", {
                username: localStorage.getItem("userId")
            });
        }
    });
});