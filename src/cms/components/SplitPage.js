import {parseAttrs, toAttrString} from '../utils.js';
import { marked } from "marked";

export const SplitPage = {
  id: 'splitpage',
  label: 'Split Page (2 Columns)',
  fields: [
    {label: 'Left Content', name: 'slot1', widget: 'markdown'},
    {label: 'Right Content', name: 'slot2', widget: 'markdown'},
  ],
  // Match <SplitPage>...</SplitPage> or <SplitPage slot1="..." slot2="..." />
  // Since MDX slots are usually handled with <Component><div slot="slot1">...</div></Component>
  // but Decap is better with attributes or body. 
  // However, MDX v2+ supports named slots.
  // For simplicity and matching common patterns in this repo:
  pattern: /^\s*<SplitPage>([\s\S]*?)<\/SplitPage>/m,
  fromBlock: function (match) {
    // This is tricky because we need to extract the slots from the body.
    // Let's assume a specific structure in MDX for Decap compatibility:
    // <SplitPage>
    //   <div slot="slot1">...</div>
    //   <div slot="slot2">...</div>
    // </SplitPage>
    const body = match[1];
    const slot1Match = body.match(/<div slot="slot1">([\s\S]*?)<\/div>/);
    const slot2Match = body.match(/<div slot="slot2">([\s\S]*?)<\/div>/);
    return {
      slot1: slot1Match ? slot1Match[1].trim() : '',
      slot2: slot2Match ? slot2Match[1].trim() : ''
    };
  },
  toBlock: function (obj) {
    return `<SplitPage>
  <div slot="slot1">
    ${obj.slot1 || ''}
  </div>
  <div slot="slot2">
    ${obj.slot2 || ''}
  </div>
</SplitPage>`;
  },
    toPreview: function (obj, getAsset) {
      // Convert markdown to HTML
      const slot1Html = marked.parse(obj.slot1 || '');
      const slot2Html = marked.parse(obj.slot2 || '');
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>${slot1Html}</div>
        <div>${slot2Html}</div>
      </div>
    `;
  }
};
