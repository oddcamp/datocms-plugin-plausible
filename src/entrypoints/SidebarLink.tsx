import { RenderItemFormSidebarPanelCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import styles from "./styles.module.css";
import plausibleLogo from "../assets/plausible-logo.svg";

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function SidebarLink({ ctx }: PropTypes) {
  const modelPlausibleSite = ctx.plugin.attributes.parameters[`plausible-site`];

  const modelPlausibleUrlPattern =
    ctx.plugin.attributes.parameters[
      `${ctx.itemType.attributes.name}-urlPattern`
    ];

  const modelPlausibleSlugField: any =
    ctx.plugin.attributes.parameters[
      `${ctx.itemType.attributes.name}-slugField`
    ];

  const modelPlausibleSlug =
    modelPlausibleSlugField &&
    modelPlausibleSlugField.value &&
    ctx.item &&
    ctx.item.attributes[modelPlausibleSlugField.value];

  return (
    <Canvas ctx={ctx}>
      {modelPlausibleSite && modelPlausibleUrlPattern && modelPlausibleSlug ? (
        <a
          className={styles["plausible-link"]}
          target="_blank"
          href={`https://plausible.io/${modelPlausibleSite}${modelPlausibleUrlPattern}${modelPlausibleSlug
            .toLowerCase()
            .replaceAll(` `, `_`)}`}
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
          No pattern, site or slug available for this model, add it in plausible
          link plugin settings
        </p>
      )}
    </Canvas>
  );
}
