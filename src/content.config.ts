import {defineCollection, z} from "astro:content";
import {glob} from 'astro/loaders';

const page = defineCollection({
    loader: glob({
        base: './src/content', pattern: '**/*.{md,mdx}', generateId: ({entry, base}) => {
            return entry.replace(/\.[^/.]+$/, "");
        }
    }),
    schema: () =>
        z.object({
            slug: z.string()
        }),
});

export const collections = {page};
