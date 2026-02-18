// Helper: escape quotes and special chars in JSX attribute values
export function escapeAttr(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Helper: unescape HTML entities that may have come through the editor
export function unescapeAttr(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Parse a JSX-like attribute string into an object
export function parseAttrs(attrString) {
  const attrs = {};
  if (!attrString) return attrs;
  // Match key="value" or key='value' pairs; keys are alphanumeric and underscores
  const regex = /(\w+)\s*=\s*(?:"([\s\S]*?)"|'([\s\S]*?)')/g;
  let m;
  while ((m = regex.exec(attrString)) !== null) {
    const key = m[1];
    const raw = m[2] !== undefined ? m[2] : m[3];
    attrs[key] = unescapeAttr(raw);
  }
  return attrs;
}

export function toAttrString(obj, orderedKeys = ['title', 'image', 'body', 'alt']) {
  const keys = orderedKeys.filter(k => obj[k])
    .concat(Object.keys(obj).filter(k => !orderedKeys.includes(k) && obj[k]));
  return keys
    .map(k => `${k}="${escapeAttr(obj[k])}"`)
    .join(' ');
}

export function updateRelativeLinks(htmlString) {
  // Parse string into DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Select all <a> elements with href
  const links = doc.querySelectorAll('a[href^="/"]');

  links.forEach(link => {
    const originalHref = link.getAttribute('href');

    // Calculate new prefix
    const newHref = getAdminHref(originalHref);

    // Replace href
    link.setAttribute('href', newHref);
  });

  // Return updated HTML
  return doc.body.innerHTML;
}

export function normalize(path) {
  if (!path) return '/';
  let p = path.replace(/\/$/, '') || '/';
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

// Helper to convert frontend URL to Decap admin URL
export function getAdminHref(frontendHref) {
  const path = normalize(frontendHref);
  if (path === '/') return '/admin#/collections/page/entries/index';

  const parts = path.split('/').filter(Boolean);
  if (parts.length === 1) {
    // Top level page
    return `/admin#/collections/page/entries/${parts[0]}`;
  } else if (parts.length === 2) {
    // Subfolder collection
    return `/admin#/collections/${parts[0]}/entries/${parts[1]}`;
  }
  return '#';
}