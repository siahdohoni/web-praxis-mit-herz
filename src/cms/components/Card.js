import {parseAttrs, toAttrString} from '../utils.js';

export const Card = {
  id: 'card',
  label: 'Card',
  fields: [
    {label: 'Title', name: 'title', widget: 'string', required: false},
    {label: 'Image', name: 'image', widget: 'image'},
    {label: 'Alt Text', name: 'alt', widget: 'string', required: false},
    {label: 'Link (URL)', name: 'href', widget: 'string', required: false},
    {label: 'Body', name: 'body', widget: 'markdown'},
  ],
  // Match <Card title="..." image="..." body="..." href="..." alt="...">content</Card>
  pattern: /^\s*<Card\s+([^>]*?)>([\s\S]*?)\s*<\/Card>/m,
  fromBlock: function (match) {
    return {
      ...parseAttrs(match[1]),
      body: match[2]
    };
  },
  toBlock: function (obj) {
    const { body, ...rest } = obj;
    return `<Card ${toAttrString(rest, ['title', 'image', 'href', 'alt'])}>
${body.trim() || ''}
</Card>`;
  },
  toPreview: function (obj) {
    return `
<div class="ce_text grid1 block">
  <figure class="image_container float_above">
    <a href="${obj.href || ''}" title="${obj.title || ''}">
      <img src="${obj.image}" alt="${obj.alt || ''}" style="width: 300px;" />
    </a>
  </figure>
    ${obj.body || ''}
</div>`;
  }
};
