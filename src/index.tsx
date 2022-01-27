import { connect } from "datocms-plugin-sdk";
import { render } from "./utils/render";
import ConfigScreen from "./entrypoints/ConfigScreen";
import SidebarLink from "./entrypoints/SidebarLink";
import "datocms-react-ui/styles.css";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  itemFormSidebarPanels() {
    return [
      {
        id: "plausible",
        label: "Plausible Link",
      },
    ];
  },
  renderItemFormSidebarPanel(sidebarPaneId, ctx) {
    render(<SidebarLink ctx={ctx} />);
  },
});
