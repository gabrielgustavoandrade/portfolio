import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Post } from '../data/posts';
import { useEnterList } from '../hooks/useEnterList';
import { BlogPost } from './BlogPost';
import { RailLabel } from './system/RailLabel';
import { SectionHeader } from './system/SectionHeader';
import './BlogList.css';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const rootRef = useEnterList();

  return (
    <section className="sys-section" id="build-log" ref={rootRef}>
      <div className="sys-section__inner">
        <SectionHeader index="03" title="Build Log">
          <p className="sys-kicker">
            Technical deep dives into engineering decisions, performance
            optimizations, and implementation details.
          </p>
        </SectionHeader>

        <div className="sys-grid">
          {posts.map((post, index) => {
            const expanded = expandedPostId === post.id;
            const ordinal = String(index + 1).padStart(2, '0');

            return (
              <article
                key={post.id}
                className={`work-card enter${expanded ? ' blog-card--expanded' : ''}`}
                data-enter
                style={{ '--enter-delay': `${index * 45}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="sys-card-block blog-card__header"
                  onClick={() => setExpandedPostId(expanded ? null : post.id)}
                  aria-expanded={expanded}
                  aria-controls={`blog-content-${post.id}`}
                >
                  <RailLabel index={ordinal}>{post.title}</RailLabel>
                  <div className="blog-card__meta">
                    <time className="sys-meta" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="sys-meta">{post.readTime}</span>
                  </div>
                  <p className="sys-kicker">{post.description}</p>
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
