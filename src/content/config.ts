import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    // 1. 필수 정보
    title: z.string(),
    
    // 2. 날짜 (문자열로 적어도 날짜로 자동 변환)
    publishDate: z.coerce.date().optional().or(z.date()).transform((val) => val || new Date()),
    date: z.coerce.date().optional(), // Jekyll 호환용

    // 3. 카테고리 (문자열 또는 배열 허용)
    category: z.string().optional(),
    categories: z.array(z.string()).optional(),

    // 4. 태그 (없으면 기본값 'blog')
    tags: z.array(z.string()).default(["blog"]),

    // 5. 작성자 (없으면 기본값 'Winter')
    author: z.string().default("Winter"),

    // 6. 이미지 (문자열 경로만 적어도 객체로 변환해주는 편의 기능은 유지)
    image: z.custom((val) => {
        if (typeof val === 'string') return { src: val, alt: 'Thumbnail' };
        if (typeof val === 'object') return val;
        return undefined;
    }).optional().default({}),

    // 7. 요약글 및 기타
    description: z.string().optional(),
    snippet: z.string().optional(),
    draft: z.boolean().default(false),
    
    // 8. 레거시 필드 (있어도 에러 안 나게 무시 처리)
    layout: z.string().optional(),
    comments: z.boolean().optional(),
    
    // [중요] related_posts: 이제 null 허용 안 함.
    // 파일에 이 줄이 아예 없거나, 있으면 무조건 배열이어야 함.
    related_posts: z.array(z.string()).optional(), 
  }),
});

export const collections = { blog };