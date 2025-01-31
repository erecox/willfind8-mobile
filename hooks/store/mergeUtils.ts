type ItemWithId = number[];

/**
 * Merge function to remove duplicates based on the `id` field.
 * Ensures that the latest item in the incoming data overwrites existing ones.
 */
export const mergeById = (
  existing: number[],
  incoming: number[]
): number[] => {
  const newItems: number[] = existing;

  // Add existing data
  for (const item of incoming) {
    if (!existing.includes(item)) newItems.push(item);
  }
  return newItems;
};

export const mergeBy = <T>(
  existing: T[],
  incoming: T[],
  compareFn: (a: T, b: T) => boolean
): T[] => {
  const newItems: T[] = [...existing];

  for (const item of incoming) {
    const index = newItems.findIndex(existingItem => compareFn(existingItem, item));
    if (index !== -1) {
      newItems[index] = item;
    } else {
      newItems.push(item);
    }
  }

  return newItems;
};
