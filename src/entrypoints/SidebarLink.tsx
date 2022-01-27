import { RenderItemFormSidebarPanelCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import styles from "./styles.module.css";
import plausibleLogo from "../assets/plausible-logo.svg";

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function SidebarLink({ ctx }: PropTypes) {
  const modelPlausibleSite =
    ctx.plugin.attributes.parameters[`${ctx.itemType.attributes.name}-site`];

  const modelPlausibleUrlPattern =
    ctx.plugin.attributes.parameters[
      `${ctx.itemType.attributes.name}-urlPattern`
    ];

  return (
    <Canvas ctx={ctx}>
      {modelPlausibleSite && modelPlausibleUrlPattern ? (
        <a
          className={styles["plausible-link"]}
          target={"_blank"}
          href={`https://plausible.io/${modelPlausibleSite}${modelPlausibleUrlPattern}${(
            ctx.item && (ctx.item.attributes.first_name as any)
          ).toLowerCase()}`}
          rel="noreferrer"
        >
          <img
            className={styles["plausible-logo"]}
            src={plausibleLogo}
            alt="Plausible logo"
          />
          {ctx.item && (ctx.item.attributes.first_name as any)}
        </a>
      ) : (
        <p>
          No pattern or site available for this model, add it in plausible link
          plugin settings
        </p>
      )}
    </Canvas>
  );
}
