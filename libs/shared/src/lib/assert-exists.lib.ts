export function assertExists<T>(
  element: T | null,
): asserts element is T {
  if (!element) {
    throw 'DoesNotExits';
  }
}
