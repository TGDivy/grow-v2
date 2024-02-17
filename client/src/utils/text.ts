export const formatText = (text: string) => {
  const camelCaseRegex = /((?<=\p{Ll})\p{Lu})/gu;
  const snakeCaseRegex = /(_)/g;
  const dotRegex = /(\.)/g;
  const dashRegex = /(-)/g;
  return text
    .replace(camelCaseRegex, " $1")
    .replace(snakeCaseRegex, " ")
    .replace(dotRegex, " ")
    .replace(dashRegex, " ")
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

// function to recurse through an object/ array and change all date strings to date objects
export const convertDateStringsToDates = (input: unknown): unknown => {
  if (typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((value) => convertDateStringsToDates(value));
  }

  if (input === null) {
    return input;
  }

  return Object.keys(input as Record<string, unknown>).reduce(
    (obj: Record<string, unknown>, key: string) => {
      obj[key] = convertDateStringsToDates(
        (input as Record<string, unknown>)[key]
      );
      if (
        key.toLowerCase().includes("date") ||
        (key.toLowerCase().includes("time") && typeof obj[key] === "string")
      ) {
        obj[key] = new Date(obj[key] as string);
      }
      return obj;
    },
    {}
  );
};
