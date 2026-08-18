import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Post } from '../data/posts';
import { useEnterList } from '../hooks/useEnterList';
import { BlogPost } from './BlogPost';
import './BlogList.css';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const rootRef = useEnterList();

  return (
    <section className="blog-list home-block" id="build-log" ref={rootRef}>
      <div className="home-block__inner">
        <header className="home-block__header enter" data-enter>
          <h2 className="home-block__title">Build Log</h2>
          <p className="home-block__lede">
            Technical deep dives into engineering decisions, performance
            optimizations, and implementation details.
          </p>
        </header>

        <div className="blog-list__grid">
          {posts.map((post, index) => {
            const expanded = expandedPostId === post.id;
            const ordinal = String(index + 1).padStart(2, '0');

            return (
              <article
                key={post.id}
                className={`blog-card enter${expanded ? ' blog-card--expanded' : ''}`}
                data-enter
                style={{ '--enter-delay': `${index * 45}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="blog-card__header"
                  onClick={() => setExpandedPostId(expanded ? null : post.id)}
                  aria-expanded={expanded}
                  aria-controls={`blog-content-${post.id}`}
                >
                  <p className="rail-label">
                    <span>{ordinal}</span> {post.title}
                  </p>
                  <div className="blog-card__meta">
                    <time className="blog-card__date" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="blog-card__read-time">
                      {post.readTime}
                    </span>
                  </div>
                  <p className="blog-card__description">{post.description}</p>
                </button>

                {expanded && (
                  <div
                    className="blog-card__content"
                    id={`blog-content-${post.id}`}
                  >
                    <BlogPost post={post} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
