export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Required HTML element not found: ${id}`);
    }
    return element;
}
