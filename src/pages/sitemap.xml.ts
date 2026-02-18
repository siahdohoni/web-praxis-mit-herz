import type { APIRoute } from "astro";
import navigation from "../settings/navigation.json";

export const GET: APIRoute = async ({ site }) => {
    if (!site) {
        throw new Error("Site URL not defined. Add 'site' in astro.config.mjs");
    }

    const lastmod = new Date().toISOString();

    // Flatten navigation (main links + sublinks)
    const pages = navigation.links.flatMap((link: any) => {
        const mainPage = {
            path: link.href,
            priority: link.priority ?? 0.5,
        };

        const subPages =
            link.sublinks?.map((sub: any) => ({
                path: sub.href,
                priority: sub.priority ?? 0.5,
            })) ?? [];

        return [mainPage, ...subPages];
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
        .map(
            (page) => `
  <url>
    <loc>${new URL(page.path, site).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`
        )
        .join("")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
