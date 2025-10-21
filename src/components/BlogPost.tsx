import { Post } from '../data/posts';
import './BlogPost.css';

interface BlogPostProps {
  post: Post;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="blog-post">
      <p className="blog-post__intro">{post.content.intro}</p>

      {post.content.sections.map((section, index) => (
        <section key={index} className="blog-post__section">
          <h4 className="blog-post__section-title">{section.title}</h4>
          <p className="blog-post__section-content">{section.content}</p>

          {section.metrics && (
            <div className="blog-post__metrics">
              {section.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="blog-post__metric">
                  <span className="blog-post__metric-label">{metric.label}</span>
                  <span className="blog-post__metric-value">
                    {metric.value}
                    {metric.improvement && (
                      <span className="blog-post__metric-improvement">
                        {metric.improvement}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {section.code && (
            <div className="blog-post__code">
              <pre>
                <code className={`language-${section.code.language}`}>
                  {section.code.snippet}
                </code>
              </pre>
            </div>
          )}

          {section.list && (
            <ul className="blog-post__list">
              {section.list.map((item, itemIndex) => (
                <li key={itemIndex} className="blog-post__list-item">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="blog-post__conclusion">
        <h4 className="blog-post__conclusion-title">Conclusion</h4>
        <p className="blog-post__conclusion-content">{post.content.conclusion}</p>
      </div>

      <div className="blog-post__takeaways">
        <h4 className="blog-post__takeaways-title">Key Takeaways</h4>
        <ul className="blog-post__takeaways-list">
          {post.content.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="blog-post__takeaways-item">
              {takeaway}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
