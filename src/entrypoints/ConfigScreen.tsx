/* eslint-disable react-hooks/exhaustive-deps */
import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  Form,
  FieldGroup,
  TextField,
  Button,
  SelectField,
} from "datocms-react-ui";
import { useState, Fragment, useEffect, ChangeEvent } from "react";
import styles from "./styles.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const [pluginConfig, setPluginConfig] = useState(
    ctx.plugin.attributes.parameters
  );

  const [modelSlugOptions, setModelSlugOptions]: any = useState({});

  const updateConfigField = (newValue: string, event: ChangeEvent) => {
    setPluginConfig({
      ...pluginConfig,
      [event.target.id]: newValue,
    });
  };

  const updateSelectConfigField = (newValue: any, action: any) => {
    setPluginConfig({
      ...pluginConfig,
      [action.name]: newValue,
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

  const models = Object.values(ctx.itemTypes).filter(
    (type: any) => !type.attributes.modular_block
  );

  useEffect(() => {
    const fetchModelFields = async () => {
      const slugOptions: any = {};

      const allFields = await Promise.all(
        models.map(async (model: any) => {
          return { [model.id]: await ctx.loadItemTypeFields(model.id) };
        })
      );

      allFields.forEach((modelFields: any) => {
        const fieldsArray = (Object.values(modelFields)[0] as any).filter(
          (field: any) => field.attributes.field_type === "string"
        );

        slugOptions[Object.keys(modelFields)[0]] = fieldsArray.map(
          (field: any) => {
            return {
              label: field.attributes.label,
              value: field.attributes.api_key,
            };
          }
        );
      });

      setModelSlugOptions(slugOptions);
    };

    fetchModelFields();
  }, []);

  return (
    <Canvas ctx={ctx}>
      <Form onSubmit={saveConfig}>
        <FieldGroup>
          <TextField
            name={`plausible-site`}
            id={`plausible-site`}
            label={`Plausible Site`}
            value={(pluginConfig[`plausible-site`] as string) || ""}
            placeholder="ex: oddcamp.com"
            onChange={updateConfigField}
          />
          <p className={styles["settings-section"]}>URL patterns per model:</p>
          {models.map((model: any, i) => (
            <Fragment key={`fragment-${i + 1}`}>
              <TextField
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
              <br />
              <SelectField
                name={`${model.attributes.name}-slugField`}
                id={`${model.attributes.name}-slugField`}
                label={`${model.attributes.name} Slug Field`}
                value={
                  (pluginConfig[`${model.attributes.name}-slugField`] as any) ||
                  (modelSlugOptions[`${model.id}`] &&
                    modelSlugOptions[`${model.id}`][0]) ||
                  null
                }
                selectInputProps={{
                  options: modelSlugOptions[`${model.id}`],
                }}
                onChange={updateSelectConfigField}
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
