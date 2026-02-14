import {parseAttrs, toAttrString} from '../utils.js';

export const Image = {
  id: 'img',
  label: 'Image',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
    {
      label: 'Position',
      name: 'position',
      widget: 'select',
      options: ['left', 'center', 'right'],
      default: 'left'
    },
    {label: 'Width', name: 'width', widget: 'number', default: 300, value_type: 'int'},
  ],
  // Match <Image image="..." alt="..." position="..." width="..." />
  pattern: /^\s*<Image\s+([^>]*?)\/>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1])
    };
  },
  toBlock: function (obj) {
    // Replace spaces in image path with %20
    if (obj.image) {
      obj.image = obj.image.replace(/ /g, '%20');
    }
    return `<Image ${toAttrString(obj, ['image', 'alt', 'position', 'width'])}/>`;
  },
  toPreview: function (obj) {
      const width = obj.width || 300;
      const imageSrc = obj.image ? obj.image.replace(/ /g, '%20') : '';
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
      return `
            <p style="${alignmentStyle(obj.position)}">
                <img src="${imageSrc}" alt="${obj.alt || ''}" style="width: ${width}px;" />
            </p>
        `;
    }
  };
