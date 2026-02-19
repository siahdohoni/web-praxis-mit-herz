import {parseAttrs, toAttrString} from '../utils.js';

export const Img = {
  id: 'img',
  label: 'Image',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: true},
    {
      label: 'Position',
      name: 'position',
      widget: 'select',
      options: ['left', 'center', 'right'],
      default: 'left'
    },
    {label: 'Width', name: 'width', widget: 'number', default: 300, value_type: 'int'},
    {label: 'Rahmen hinzufügen', name: 'frame', widget: 'boolean', default: false},
  ],
  // Match <Img image="..." alt="..." position="..." width="..." frame="..." />
  pattern: /^\s*<Img\s+([^>]*?)\/>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1])
    };
  },
  toBlock: function (obj) {
    return `<Img ${toAttrString(obj, ['image', 'alt', 'position', 'width', 'frame'])}/>`;
  },
  toPreview: function (obj, getAsset) {
    const image = obj.image ? getAsset(obj.image)?.toString() : '';
    const width = obj.width || 300;
    const withFrame = obj.frame === "true";
    const alignmentStyle = (pos) => {
      switch (pos) {
        case 'left':
          return 'text-align: left;';
        case 'right':
          return 'text-align: right;';
        case 'center':
          return 'text-align: center;';
        default:
          return 'text-align: left;';
      }
    };
    return withFrame ?
      `<div style="${alignmentStyle(obj.position)}">
        <figure class="image_container">
          <img src="${image}" alt="${obj.alt}" title="${obj.alt}" style="width: ${width}px;"/>
        </figure>
      </div>` : `<p style="${alignmentStyle(obj.position)}">
        <img src="${image}" alt="${obj.alt}" title="${obj.alt}" style="width: ${width}px;"/>
      </p>`
  }
};
