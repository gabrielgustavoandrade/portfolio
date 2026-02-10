import { useState } from 'react';
import type { Post } from '../data/posts';
import { BlogPost } from './BlogPost';
import './BlogList.css';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handlePostClick = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <section className="blog-list" id="build-log">
      <div className="blog-list__container">
        <div className="blog-list__header">
          <h2 className="blog-list__title">Build Log</h2>
          <p className="blog-list__subtitle">
            Technical deep dives into engineering decisions, performance
            optimizations, and implementation details.
          </p>
        </div>

        <div className="blog-list__grid">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`blog-card ${expandedPostId === post.id ? 'blog-card--expanded' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                type="button"
                className="blog-card__header"
                onClick={() => handlePostClick(post.id)}
                aria-expanded={expandedPostId === post.id}
                aria-controls={`blog-content-${post.id}`}
              >
                <div className="blog-card__meta">
                  <time className="blog-card__date">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span className="blog-card__read-time">{post.readTime}</span>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__description">{post.description}</p>
                <div className="blog-card__tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="blog-card__expand-icon">
                  {expandedPostId === post.id ? '−' : '+'}
                </span>
              </button>

              {expandedPostId === post.id && (
                <div className="blog-card__content" id={`blog-content-${post.id}`}>
                  <BlogPost post={post} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
