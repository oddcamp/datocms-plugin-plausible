import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, FieldGroup, TextField, Button } from "datocms-react-ui";
import { ChangeEvent, Fragment, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const [pluginConfig, setPluginConfig] = useState(
    ctx.plugin.attributes.parameters
  );

  const updateConfigField = (newValue: string, event: ChangeEvent) => {
    setPluginConfig({
      ...pluginConfig,
      [event.target.id]: newValue,
    });
  };

  const saveConfig = async () => {
    try {
      await ctx.updatePluginParameters(pluginConfig);
      await ctx.notice("Settings Saved!");
    } catch (e) {
      await ctx.notice(`Unable to save settings: ${e}`);
    }
  };

  return (
    <Canvas ctx={ctx}>
      <p className={styles["settings-section"]}>URL patterns per model:</p>

      <Form onSubmit={saveConfig}>
        <FieldGroup>
          {Object.values(ctx.itemTypes)
            .filter((type: any) => !type.attributes.modular_block)
            .map((model: any, i) => (
              <Fragment key={`fragment-${i}`}>
                <TextField
                  key={`pattern-field-site-${i + 1}`}
                  name={`${model.attributes.name}-site`}
                  id={`${model.attributes.name}-site`}
                  label={`${model.attributes.name} Plausible Site`}
                  value={
                    (pluginConfig[`${model.attributes.name}-site`] as string) ||
                    ""
                  }
                  placeholder="ex: oddcamp.com"
                  onChange={updateConfigField}
                />
                <br />
                <TextField
                  key={`pattern-field-${i + 1}`}
                  name={`${model.attributes.name}-urlPattern`}
                  id={`${model.attributes.name}-urlPattern`}
                  label={`${model.attributes.name} URL Pattern`}
                  value={
                    (pluginConfig[
                      `${model.attributes.name}-urlPattern`
                    ] as string) || ""
                  }
                  placeholder="ex: ?page=%2F"
                  onChange={updateConfigField}
                />
              </Fragment>
            ))}
        </FieldGroup>
        <FieldGroup>
          <Button fullWidth buttonType="primary" type="submit">
            Save Settings
          </Button>
        </FieldGroup>
      </Form>
    </Canvas>
  );
}
