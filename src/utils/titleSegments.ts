export interface TitleSegment {
  id: string;
  text: string;
  viewTransitionName: string;
}

export function getTitleSegments(slug: string, title: string): TitleSegment[] {
  const tokens = title.match(/\S+/g) ?? [title];

  return tokens.map((token, index) => {
    // Use simple naming like the POC: ${slug}-word-${index}
    const viewTransitionName = `${slug}-word-${index}`;

    return {
      id: `${slug}-word-${index}`,
      text: token,
      viewTransitionName,
    } satisfies TitleSegment;
  });
}
