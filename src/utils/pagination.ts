export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): PaginationResult<T> {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const safePage =
    totalPages === 0
      ? 1
      : Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;

  return {
    items: items.slice(startIndex, startIndex + itemsPerPage),
    currentPage: safePage,
    totalPages
  };
}
