export function createCache<T>() {
  const cache: Record<string, T> = {};

  return {
    get: (id: string) => cache[id],
    set: (id: string, value: T) => {
      cache[id] = value;
      return cache[id];
    },
  };
}
