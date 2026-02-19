import {parseAttrs} from '../utils.js';

export const ImageGallery = {
  id: 'imagegallery',
  label: 'ImageGallery',
  fields: [
    {
      label: 'Bilder',
      name: 'images',
      widget: 'list',
      fields: [
        {label: 'Bild', name: 'src', widget: 'image'},
        {label: 'Alt Text', name: 'alt', widget: 'string', required: true},
        {label: 'Titel (Lightbox)', name: 'title', widget: 'string'},
      ]
    },
  ],
  // Match <ImageGallery images='[{"src":"...","alt":"...","title":"..."}]' />
  pattern: /^\s*<ImageGallery\s+([^>]*?)\/>/m,
  fromBlock: function (match) {
    const attrs = parseAttrs(match[1]);
    return {
      images: attrs.images ? JSON.parse(attrs.images) : []
    };
  },
  toBlock: function (obj) {
    const imagesJson = JSON.stringify(obj.images || []);
    return `<ImageGallery images='${imagesJson.replace(/'/g, "&apos;")}' />`;
  },
  toPreview: function (obj, getAsset) {
    const images = obj.images || [];
    return `
<div class="ce_gallery" style="display: inline-block;">
  <ul class="cols_3">
    ${images.map((img, index) => {
      const asset = img.src ? getAsset(img.src)?.toString() : null;
      const url = asset ? asset.toString() : '';
      return `
          <li class="row_0 row_first row_last even col_${index} ${index === 0 ? 'col_first' : ''} ${index === images.length - 1 ? 'col_last' : ''}">
            <figure class="image_container">
              <a href="${url}" title="${img.title || ''}" class="cboxElement">
                <img src="${asset}" alt="${img.alt || img.title || ''}" style="width: 250px; height: 250px; object-fit: cover; display: block;" />
              </a>
            </figure>
          </li>
        `
    }).join('')}
  </ul>
</div>`;
  }
};
