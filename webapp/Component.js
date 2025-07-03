sap.ui.define([
    "sap/ui/core/UIComponent",
    "oms1/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("oms1.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            sap.ui.getCore().attachInit(function () {
                sap.ushell.Container.getRenderer().setHeaderVisibility(false, false);
            });
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            this.setModel(new sap.ui.model.json.JSONModel({
                userId: null,
                token: null,
                company: null,
                companyName: null,
                role: null
            }), "userData");

            // enable routing
            this.getRouter().initialize();
            if (!localStorage.getItem("token")) {
                this.getRouter().navTo("loginRoute");
            }
        }
    });
});