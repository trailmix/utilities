export function isObject(item: Record<string, unknown> | unknown[] | string) {
  return (item && typeof item === "object" && !Array.isArray(item));
}

export function mergeDeep(
  target: any,
  source: Record<string, string | any>,
) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!isObject(target[key])) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
