const nonAlphaNumeric = /[^a-z0-9]+/g;

export interface TitleSegment {
  id: string;
  text: string;
  viewTransitionName: string;
}

const normalize = (value: string) =>
  value.toLowerCase().trim().replace(nonAlphaNumeric, '-');

export function getTitleSegments(slug: string, title: string): TitleSegment[] {
  const tokens = title.match(/\S+/g) ?? [title];

  return tokens.map((token, index) => {
    const normalized = normalize(token) || `segment-${index}`;
    const viewTransitionName = `work-title-${slug}-${normalized}-${index}`;

    return {
      id: `${slug}-${index}`,
      text: token,
      viewTransitionName,
    } satisfies TitleSegment;
  });
}
