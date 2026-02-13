import { parseAttrs, toAttrString } from '../utils.js';

export const ImageBlock = {
    id: 'imageblock',
    label: 'ImageBlock',
    fields: [
        {label: 'Title', name: 'title', widget: 'string', required: false},
        {label: 'Image', name: 'image', widget: 'image'},
        {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
        {label: 'Body', name: 'body', widget: 'markdown'},
    ],
    // Match <ImageBlock title="..." image="..." body="..." alt="..." />
    pattern: /^<ImageBlock\s+([\s\S]*?)\s*\/>/m,
    fromBlock: function (match) {
        return parseAttrs(match[1]);
    },
    toBlock: function (obj) {
        return `<ImageBlock ${toAttrString(obj)} />`;
    },
    toPreview: function (obj) {
        return `
            <div class="ce_text block">
              <figure class="image_container float_right">
                <img src="${obj.image}" alt="${obj.alt || ''}" style="width: 300px;" />
              </figure>
              ${obj.title ? `<h1>${obj.title}</h1>` : ''}
              <div>${obj.body || ''}</div>
            </div>
        `;
    }
};
