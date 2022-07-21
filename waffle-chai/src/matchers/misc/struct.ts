export const isStruct = (arr: any[]) => {
  if (!Array.isArray(arr)) return false;
  const keys = Object.keys(arr);
  const hasAlphaNumericKeys = keys.some((key) => key.match(/^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/));
  const hasNumericKeys = keys.some((key) => key.match(/^\d+$/));
  return hasAlphaNumericKeys && hasNumericKeys;
};

export const convertStructToPlainObject = (struct: any[]): any => {
  const keys = Object.keys(struct).filter((key: any) => isNaN(key));
  return keys.reduce(
    (acc: any, key: any) => ({
      ...acc,
      [key]: isStruct(struct[key])
        ? convertStructToPlainObject(struct[key])
        : struct[key]
    }),
    {}
  );
};
