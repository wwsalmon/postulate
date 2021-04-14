import {
    ELEMENT_IMAGE,
    getImageDeserialize,
    WithImageUploadOptions
} from "@udecode/slate-plugins-image";
import {getRenderElement, getSlatePluginTypes, SlatePlugin} from "@udecode/slate-plugins-core";
import {customWithImageUpload} from "./customWithImageUpload";

export const createCustomImagePlugin = (
    options: {uploadImage: (file: File) => Promise<string>}
): SlatePlugin => ({
    pluginKeys: ELEMENT_IMAGE,
    renderElement: getRenderElement(ELEMENT_IMAGE),
    deserialize: getImageDeserialize(),
    voidTypes: getSlatePluginTypes(ELEMENT_IMAGE),
    withOverrides: customWithImageUpload(options),
});
