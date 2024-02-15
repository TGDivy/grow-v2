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
