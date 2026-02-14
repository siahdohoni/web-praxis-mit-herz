import {parseAttrs, toAttrString} from '../utils.js';

export const ImageBlock = {
  id: 'imageblock',
  label: 'ImageBlock',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
    {
      label: 'Position',
      name: 'position',
      widget: 'select',
      options: ['left', 'right'],
      default: 'right'
    },
    {label: 'Width', name: 'width', widget: 'number', default: 300, value_type: 'int'},
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
    return `<ImageBlock ${toAttrString(rest, ['image', 'href', 'alt', 'position', 'width'])}>
${body.trim() || ''}
</ImageBlock>`;
  },
  toPreview: function (obj) {
    const floatClass = obj.position === 'left' ? 'float_left' : 'float_right';
    const width = obj.width || 300;
    return `
            <div class="ce_text block">
              <figure class="image_container ${floatClass}">
                <img src="${obj.image}" alt="${obj.alt || ''}" style="width: ${width}px;" />
              </figure>
              <div>${obj.body || ''}</div>
            </div>
        `;
  }
};
