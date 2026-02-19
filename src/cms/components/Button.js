import {parseAttrs, toAttrString} from "../utils.js";

export const Button = {
  id: 'button',
  label: 'Button',
  fields: [
    {name: 'text', label: 'Button Text', widget: 'string'},
    {name: 'href', label: 'Button URL', widget: 'string'},
    {name: 'title', label: 'Button Title (Hover Text)', widget: 'string'}
  ],
  pattern: /<Button\s+([^>]*?)\s*\/>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1])
    };
  },
  toBlock: function (obj) {
    const {...attr} = obj;
    return `<Button ${toAttrString(attr, ['text', 'href', 'alt'])}/>`;
  },
  toPreview: function (obj) {
    return `<div style="text-align: center">
  <a href="${obj.url}" title="${obj.title}" target="_blank" rel="noopener" class="pmh-button">Termin online buchen</a>
</div>`;
  }
};
