import {parseAttrs, toAttrString} from '../utils.js';

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
        {label: 'Titel (Lightbox)', name: 'title', widget: 'string'},
        {label: 'Alt Text', name: 'alt', widget: 'string'},
      ]
    },
  ],
  // Match <ImageGallery images='[{"src":"...","href":"...","title":"...","alt":"..."}]' />
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
  toPreview: function (obj) {
    const images = obj.images || [];
    return `
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script src="/src/scripts/colorbox.min.js"></script>
      <script>
  function initColorbox() {
    if (window.jQuery && jQuery().colorbox) {
      jQuery('a.cboxElement').colorbox({
        rel: 'lb271',
        maxWidth: '95%',
        maxHeight: '95%',
        photo: true
      });
    } else {
      setTimeout(initColorbox, 50);
    }
  }
  initColorbox();
      </script>
      <ul class="cols_3">
        ${images.map((img, index) => `
          <li class="row_0 row_first row_last even col_${index} ${index === 0 ? 'col_first' : ''} ${index === images.length - 1 ? 'col_last' : ''}">
            <figure class="image_container">
              <a href="${img.src}" title="${img.title}" class="cboxElement">
                <img src="${img.src}" alt="${img.alt}" style="width: 250px; height: 250px; object-fit: cover; display: block;" />
              </a>
            </figure>
          </li>
        `).join('')}
      </ul>
    `;
  }
};
