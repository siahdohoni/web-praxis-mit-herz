import {parseAttrs, toAttrString} from '../utils.js';
import { marked } from "marked";

export const Card = {
  id: 'card',
  label: 'Card',
  fields: [
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: true},
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
    return `<Card ${toAttrString(rest, ['image', 'alt', 'href'])}>
${body.trim() || ''}
</Card>`;
  },
  toPreview: function (obj, getAsset) {
    const image = obj.image ? getAsset(obj.image)?.toString() : '';

    // Convert markdown to HTML
    const bodyHtml = marked.parse(obj.body || '');

    const imgTag = `<img src="${image}" alt="${obj.alt || ''}" title="${obj.alt || ''}" style="width: 300px;" />`;
    const imageContent = obj.href && obj.href.trim() !== ''
      ? `<a href="${obj.href}" title="${obj.alt || ''}">${imgTag}</a>`
      : imgTag;

    return `
<div class="ce_text grid1 block">
  <figure class="image_container float_above">
    ${imageContent}
  </figure>
    ${bodyHtml}
</div>`;
  }
};
