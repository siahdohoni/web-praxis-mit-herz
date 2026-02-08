import {defineCollection, z} from "astro:content";
import {glob} from 'astro/loaders';

const page = defineCollection({
    loader: glob({base: './src/content', pattern: '**/*.{md,mdx}'}),
    schema: () =>
        z.object({
            title: z.string()
        }),
});

export const collections = {page};
