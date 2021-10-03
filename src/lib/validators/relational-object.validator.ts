export const RelationalObjectValidator = (
  array: Array<any>,
  nullable: boolean
) => {
  if (nullable && typeof array == undefined) {
    return true;
  }
  if (Array.isArray(array)) {
    let validate = true;
    for (const item of array) {
      if (typeof item !== "object") {
        validate = false;
        break;
      }
      if (!("id" in item)) {
        validate = false;
        break;
      }
    }

    if (!validate) {
      throw new Error("Object malformed");
    }
    return true;
  }
  throw new Error("Object should be a array");
};
