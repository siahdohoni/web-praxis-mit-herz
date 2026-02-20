import {defineCollection, z} from "astro:content";
import {glob} from 'astro/loaders';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import navigation from "./settings/navigation.json";

const baseContentDir = './src/content';

function getAllContentFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllContentFiles(fullPath));
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const contentFileToPathMap = new Map<string, string>();
const allFiles = getAllContentFiles(baseContentDir);

allFiles.forEach(fullPath => {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const match = fileContents.match(/^---\s*[\s\S]*?^slug:\s*(['"]?)(.*?)\1\s*$/m);
    const slug = match ? match[2] : null;
    if (slug) {
        const relativeDir = path.relative(baseContentDir, path.dirname(fullPath));
        let finalPath = "/" + (relativeDir ? relativeDir + "/" : "") + slug;
        finalPath = finalPath.replace(/\/+/g, '/');
        if (finalPath === '/index') finalPath = '/';
        if (finalPath.endsWith('/') && finalPath.length > 1) finalPath = finalPath.slice(0, -1);

        const relativeFile = path.relative(baseContentDir, fullPath);
        contentFileToPathMap.set(finalPath, relativeFile);
    }
});

function normalizeHref(href: string) {
    let p = href || '/';
    p = p.replace(/\/+$/, '');
    if (p === '') p = '/';
    if (!p.startsWith('/')) p = '/' + p;
    return p;
}

function resolveEntryForHref(href: string) {
    const norm = normalizeHref(href);
    const rel = norm === '/' ? '' : norm.slice(1);
    if (rel === '') {
        const idxMdx = path.join(baseContentDir, 'index.mdx');
        const idxMd = path.join(baseContentDir, 'index.md');
        if (fs.existsSync(idxMdx)) return 'index.mdx';
        if (fs.existsSync(idxMd)) return 'index.md';
        return null;
    }
    const fileMdx = path.join(baseContentDir, rel + '.mdx');
    const fileMd = path.join(baseContentDir, rel + '.md');
    if (fs.existsSync(fileMdx)) return rel + '.mdx';
    if (fs.existsSync(fileMd)) return rel + '.md';
    const dirIndexMdx = path.join(baseContentDir, rel, 'index.mdx');
    const dirIndexMd = path.join(baseContentDir, rel, 'index.md');
    if (fs.existsSync(dirIndexMdx)) return path.join(rel, 'index.mdx');
    if (fs.existsSync(dirIndexMd)) return path.join(rel, 'index.md');
    return null;
}

const navigationPaths = Array.from(new Set(
    navigation.links.flatMap(link => [
        link.href,
        ...(link.sublinks || []).map(sub => sub.href)
    ])
));

const allowedEntries = navigationPaths
    .map(href => {
        if (href.startsWith('http')) return null;
        const norm = normalizeHref(href);
        const entry = contentFileToPathMap.get(norm);
        if (!entry) {
            // Check if it exists as a physical .astro file in src/pages
            const rel = norm === '/' ? '' : norm.slice(1);
            const astroFile = path.join('./src/pages', rel + '.astro');
            const astroDirIndex = path.join('./src/pages', rel, 'index.astro');
            if (fs.existsSync(astroFile) || fs.existsSync(astroDirIndex)) {
                console.info(`Found .astro file for href "${href}".`);
                return null;
            }
            console.warn(`Navigation warning: No content file found for href "${href}". Skipping...`);
            return null;
        }
        return entry;
    })
    .filter((p): p is string => typeof p === 'string');

const page = defineCollection({
    loader: glob({
        base: './src/content',
        pattern: allowedEntries,
        generateId: ({entry, base}: { entry: string; base: string | URL }) => {
            const basePath = base instanceof URL ? fileURLToPath(base) : base;
            const fullPath = path.join(basePath, entry);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const match = fileContents.match(/^---\s*[\s\S]*?^slug:\s*(['"]?)(.*?)\1\s*$/m);
            const slug = match ? match[2] : null;
            if (!slug)
                throw new Error(`No slug found in ${fullPath}`);
            const pathPrefix = entry.match(/.*\//)?.[0] || '';
            return pathPrefix + slug;
        }
    }),
    schema: () =>
        z.object({
            name: z.string(),
            slug: z.string()
        }),
});

export const collections = {page};
