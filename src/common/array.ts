/** Remove same items in an array */
export function unique(arr: any[]) {
  const set = new Set();
  arr.filter((item) => {
    let dup = set.has(item);
    if (typeof item === "object") {
      if (set.size === 0) set.add(item);
      else {
        set.forEach((set_item) => {
          if (JSON.stringify(item) !== JSON.stringify(set_item)) {
            dup = false;
            return set.add(item);
          }
        });
      }
    } else {
      set.add(item);
    }
    return !dup;
  });
  return [...new Set(set)];
}
