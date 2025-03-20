
export let loadHaForm = async () => {
  if (customElements.get("ha-checkbox") && customElements.get("ha-slider") && customElements.get("ha-combo-box")) return;

  await customElements.whenDefined("partial-panel-resolver");
  let ppr = document.createElement('partial-panel-resolver');
  ppr.hass = {
    panels: [{
      url_path: "tmp",
      component_name: "config",
    }]
  };
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();

  await customElements.whenDefined("ha-panel-config");
  let cpr = document.createElement("ha-panel-config");
  await cpr.routerOptions.routes.automation.load();
}