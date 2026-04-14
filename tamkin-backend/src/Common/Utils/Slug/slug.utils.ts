import slugify from 'slugify';

export function createSlug(text: string): string {
  const slug = slugify(text, { lower: true, strict: true });
  return slug;
}
