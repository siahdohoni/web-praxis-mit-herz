import {parseAttrs, toAttrString} from '../utils.js';

export const ImageBlock = {
  id: 'imageblock',
  label: 'ImageBlock',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
    {label: 'Body', name: 'body', widget: 'markdown'},
  ],
  // Match <ImageBlock image="..." alt="...">content</ImageBlock>
  pattern: /^\s*<ImageBlock\s+([^>]*?)>([\s\S]*?)\s*<\/ImageBlock>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1]),
      body: match[2]
    };
  },
  toBlock: function (obj) {
    const {body, ...rest} = obj;
    return `<ImageBlock ${toAttrString(rest, ['image', 'href', 'alt'])}>
${body.trim() || ''}
</ImageBlock>`;
  },
  toPreview: function (obj) {
    return `
            <div class="ce_text block">
              <figure class="image_container float_right">
                <img src="${obj.image}" alt="${obj.alt || ''}" style="width: 300px;" />
              </figure>
              <div>${obj.body || ''}</div>
            </div>
        `;
  }
};
