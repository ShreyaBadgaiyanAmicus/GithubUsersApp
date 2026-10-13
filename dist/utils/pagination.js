export function paginate(items, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const safePage = totalPages === 0
        ? 1
        : Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    return {
        items: items.slice(startIndex, startIndex + itemsPerPage),
        currentPage: safePage,
        totalPages
    };
}
