# View Transitions: POC vs Portfolio Comparison

## Architecture Differences

### POC (view-transitions-poc)
- **Framework**: Next.js 15 with App Router
- **Navigation Type**: Cross-document (full page reload)
- **Routing**: File-based routing (`/` → `page.tsx`, `/blog/[id]` → `blog/[id]/page.tsx`)
- **Transition Trigger**: Browser-native via CSS rule
- **Server**: Next.js dev server (port 3000)

### Portfolio (portfolio-gabriel)
- **Framework**: Vite + React 18
- **Navigation Type**: SPA (Single Page Application)
- **Routing**: React Router v6 (`BrowserRouter`)
- **Transition Trigger**: JavaScript `startViewTransition()` API
- **Server**: Vite dev server (port 5173)

---

## Navigation Approach

### POC - Cross-Document Transitions
```tsx
// TransitionLink.tsx
export function TransitionLink({ href, children, className }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
```
- Uses native `<a>` tags
- Full page reload on navigation
- Browser handles transitions automatically
- Simpler implementation

### Portfolio - SPA Transitions
```tsx
// HomePage.tsx
const handleProjectClick = (slug: string) => {
  flushSync(() => {
    setActiveSlug(slug);
  });

  startTransition(() => {
    navigate(`/work/${slug}`);
  });
};
```
- Uses React Router's `navigate()`
- Client-side navigation (no reload)
- Manual `startViewTransition()` call
- Requires state management

---

## CSS Configuration

### POC
```css
/* globals.css */
@view-transition {
  navigation: auto;
}

[data-post-id="serving-atomic-styles-well"] {
  view-transition-name: post-title-serving-atomic-styles-well;
}
```
- Uses `@view-transition { navigation: auto; }` rule
- CSS-based view-transition-name assignment
- Browser handles everything automatically

### Portfolio
```css
/* App.css */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
}

/* No @view-transition rule - SPA doesn't need it */
```
- No automatic navigation transitions
- View-transition-names set via inline styles
- Manual JavaScript control

---

## Title Splitting

### POC - PostTitle Component
```tsx
export function PostTitle({ postId, children, className, as: Component = 'h2' }) {
  const words = children.split(' ');

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          style={{ viewTransitionName: `${postId}-word-${index}` }}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Component>
  );
}
```
- **Always** sets view-transition-name
- No conditional logic
- Simple slug-based naming: `${postId}-word-${index}`

### Portfolio - WorkList Component
```tsx
const titleSegments = getTitleSegments(project.slug, project.title);

{titleSegments.map((segment, index) => (
  <span
    key={segment.id}
    style={{ viewTransitionName: segment.viewTransitionName }}
  >
    {segment.text}
    {index < titleSegments.length - 1 ? ' ' : ''}
  </span>
))}
```
- **Always** sets view-transition-name (after fix)
- Uses utility function `getTitleSegments()`
- More complex naming: `work-title-${slug}-${normalized}-${index}`

---

## State Management

### POC
- **No state for transitions**
- No `activeSlug` or similar
- Pages are completely independent
- Each page loads fresh

### Portfolio
- **Active state tracking**: `const [activeSlug, setActiveSlug] = useState<string | null>(null)`
- Used for scroll positioning and focus management
- Session storage for last focused card
- Complex lifecycle with `useEffect` cleanup

---

## Key Differences Summary

| Feature | POC | Portfolio |
|---------|-----|-----------|
| Navigation | Native `<a>` tags | React Router |
| Page Load | Full reload | Client-side |
| Transition Trigger | CSS `@view-transition` | JS `startViewTransition()` |
| State Management | None | `activeSlug` state |
| Sync Method | Not needed | `flushSync()` required |
| Complexity | Simple | Complex |
| Browser Support | Same-document API | Cross-document API |

---

## Critical Implementation Details

### POC - Why It Works
1. Browser captures "before" snapshot (list page)
2. Full page navigation happens
3. New page loads with matching view-transition-names
4. Browser captures "after" snapshot (detail page)
5. Browser morphs between snapshots automatically

### Portfolio - Why It's Harder
1. Must manually call `startViewTransition()`
2. Must use `flushSync()` to force synchronous React updates
3. DOM must update DURING the transition callback
4. Both pages exist in the same component tree
5. Must manage which elements have transition names

---

## What Was Missing in Portfolio (Now Fixed)

✅ **Per-word splitting** - Added `getTitleSegments()` usage
✅ **Always-on view-transition-names** - Removed conditional
✅ **flushSync for state** - Added to `setActiveSlug()`
✅ **flushSync for navigation** - Added to `useViewTransition` hook
✅ **Inline display** - Changed spans from `inline-block` to `inline`

---

## Current Status

### POC
- ✅ Working perfectly
- ✅ Simple, reliable implementation
- ✅ Cross-document transitions

### Portfolio
- 🔄 Should now work with all fixes applied
- 🔄 More complex due to SPA architecture
- 🔄 Requires testing to confirm all transitions work

---

## Testing Checklist

- [ ] Words have view-transition-names in console (list page)
- [ ] Words have matching view-transition-names (detail page)
- [ ] `startViewTransition()` is called
- [ ] Each word morphs independently
- [ ] No duplicate view-transition-name errors
- [ ] Transitions work on back navigation too
