import {parseAttrs, toAttrString} from '../utils.js';
import { marked } from "marked";

export const Card = {
  id: 'card',
  label: 'Card',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
    {label: 'Link (URL)', name: 'href', widget: 'string', required: false},
    {label: 'Body', name: 'body', widget: 'markdown'},
  ],
  // Match <Card image="..." href="..." alt="...">content</Card>
  pattern: /^\s*<Card\s+([^>]*?)>([\s\S]*?)\s*<\/Card>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1]),
      body: match[2]
    };
  },
  toBlock: function (obj) {
    const {body, ...rest} = obj;
    return `<Card ${toAttrString(rest, ['image', 'href', 'alt'])}>
${body.trim() || ''}
</Card>`;
  },
  toPreview: function (obj, getAsset) {
    const image = obj.image ? getAsset(obj.image)?.toString() : '';

    // Convert markdown to HTML
    const bodyHtml = marked.parse(obj.body || '');

    return `
<div class="ce_text grid1 block">
  <figure class="image_container float_above">
    <a href="${obj.href || ''}" title="${obj.alt || ''}">
      <img src="${image}" alt="${obj.alt || ''}" title="${obj.alt || ''}" style="width: 300px;" />
    </a>
  </figure>
    ${bodyHtml}
</div>`;
  }
};
