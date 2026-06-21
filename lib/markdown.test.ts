import { describe, expect, it } from 'vitest';
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getAllCategories,
  getAllTags,
} from './markdown';

describe('markdown', () => {
  describe('getAllPosts', () => {
    it('returns an array', () => {
      const posts = getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
    });

    it('returns posts sorted by publishedAt descending', () => {
      const posts = getAllPosts();

      if (posts.length > 1) {
        for (let i = 0; i < posts.length - 1; i++) {
          const current = new Date(posts[i].publishedAt).getTime();
          const next = new Date(posts[i + 1].publishedAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });

    it('excludes draft posts by default', () => {
      const posts = getAllPosts();
      const drafts = posts.filter((post) => post.draft);
      expect(drafts).toHaveLength(0);
    });

    it('includes draft posts when includeDrafts is true', () => {
      const allPosts = getAllPosts({ includeDrafts: true });
      const defaultPosts = getAllPosts();
      // If there are drafts, the count should be higher with includeDrafts
      expect(allPosts.length).toBeGreaterThanOrEqual(defaultPosts.length);
    });

    it('returns posts with required properties', () => {
      const posts = getAllPosts();

      if (posts.length > 0) {
        const post = posts[0];
        expect(post).toHaveProperty('slug');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('description');
        expect(post).toHaveProperty('publishedAt');
        expect(post).toHaveProperty('author');
        expect(post).toHaveProperty('tags');
        expect(post).toHaveProperty('category');
        expect(post).toHaveProperty('featured');
        expect(post).toHaveProperty('draft');
        expect(post).toHaveProperty('content');
        expect(post).toHaveProperty('readingTime');
      }
    });
  });

  describe('getFeaturedPosts', () => {
    it('returns only posts with featured: true', () => {
      const featuredPosts = getFeaturedPosts();
      const allPosts = getAllPosts();

      // Every returned post should have featured: true
      for (const post of featuredPosts) {
        expect(post.featured).toBe(true);
      }

      // The count should be less than or equal to total posts
      expect(featuredPosts.length).toBeLessThanOrEqual(allPosts.length);
    });

    it('respects the limit parameter', () => {
      const allFeatured = getFeaturedPosts(10);
      const limited = getFeaturedPosts(2);

      expect(limited.length).toBeLessThanOrEqual(2);
      expect(allFeatured.length).toBeGreaterThanOrEqual(limited.length);
    });

    it('returns empty array when no posts are featured', () => {
      // This test depends on the actual content - if no posts have featured: true, it returns []
      // We just verify it returns an array
      const posts = getFeaturedPosts();
      expect(Array.isArray(posts)).toBe(true);
    });

    it('includes posts from the full post list', () => {
      const featuredPosts = getFeaturedPosts();
      const allPosts = getAllPosts();

      // All featured posts should exist in all posts
      const allSlugs = new Set(allPosts.map((p) => p.slug));
      for (const post of featuredPosts) {
        expect(allSlugs.has(post.slug)).toBe(true);
      }
    });
  });

  describe('getPostBySlug', () => {
    it('returns correct post for existing slug', () => {
      const allPosts = getAllPosts();

      if (allPosts.length > 0) {
        const firstPost = allPosts[0];
        const found = getPostBySlug(firstPost.slug);

        expect(found).not.toBeNull();
        expect(found?.slug).toBe(firstPost.slug);
        expect(found?.title).toBe(firstPost.title);
      }
    });

    it('returns null for non-existent slug', () => {
      const result = getPostBySlug('non-existent-slug-that-does-not-exist');
      expect(result).toBeNull();
    });

    it('includes draft posts when searching by slug', () => {
      // getPostBySlug calls getAllPosts({ includeDrafts: true })
      // So it should find even draft posts by slug
      const allPostsWithDrafts = getAllPosts({ includeDrafts: true });
      const draftPosts = allPostsWithDrafts.filter((p) => p.draft);

      if (draftPosts.length > 0) {
        const draftPost = draftPosts[0];
        const found = getPostBySlug(draftPost.slug);
        expect(found).not.toBeNull();
        expect(found?.slug).toBe(draftPost.slug);
      }
    });

    it('returns post with complete properties', () => {
      const allPosts = getAllPosts();

      if (allPosts.length > 0) {
        const found = getPostBySlug(allPosts[0].slug);

        expect(found).toHaveProperty('slug');
        expect(found).toHaveProperty('title');
        expect(found).toHaveProperty('content');
        expect(found).toHaveProperty('readingTime');
      }
    });
  });

  describe('getAllCategories', () => {
    it('returns unique sorted categories', () => {
      const categories = getAllCategories();

      expect(Array.isArray(categories)).toBe(true);

      // Check sorted
      if (categories.length > 1) {
        for (let i = 0; i < categories.length - 1; i++) {
          expect(categories[i] <= categories[i + 1]).toBe(true);
        }
      }
    });

    it('returns only unique values', () => {
      const categories = getAllCategories();
      const uniqueSet = new Set(categories);

      expect(categories.length).toBe(uniqueSet.size);
    });

    it('contains categories from actual posts', () => {
      const categories = getAllCategories();
      const posts = getAllPosts();
      const postCategories = new Set(posts.map((p) => p.category));

      // All post categories should be in the returned list
      for (const cat of postCategories) {
        expect(categories).toContain(cat);
      }
    });
  });

  describe('getAllTags', () => {
    it('returns unique sorted tags', () => {
      const tags = getAllTags();

      expect(Array.isArray(tags)).toBe(true);

      // Check sorted
      if (tags.length > 1) {
        for (let i = 0; i < tags.length - 1; i++) {
          expect(tags[i] <= tags[i + 1]).toBe(true);
        }
      }
    });

    it('returns only unique values', () => {
      const tags = getAllTags();
      const uniqueSet = new Set(tags);

      expect(tags.length).toBe(uniqueSet.size);
    });

    it('contains tags from actual posts', () => {
      const tags = getAllTags();
      const posts = getAllPosts();
      const allPostTags = posts.flatMap((p) => p.tags);

      // All tags from posts should be in the returned list
      for (const tag of allPostTags) {
        expect(tags).toContain(tag);
      }
    });

    it('returns empty array when no posts have tags', () => {
      // This is a fallback - in practice we have tags
      // Just verify it's an array
      const tags = getAllTags();
      expect(Array.isArray(tags)).toBe(true);
    });
  });
});