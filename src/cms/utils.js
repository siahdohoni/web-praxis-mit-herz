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
