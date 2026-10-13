export function getElement<T extends HTMLElement>(
  id: string
): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Required HTML element not found: ${id}`);
  }

  return element as T;
}
