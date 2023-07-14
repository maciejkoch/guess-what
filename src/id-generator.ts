export function idGenerator() {
  let id = 0;
  return () => ++id;
}
