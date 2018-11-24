export const addImplements = (
  txt,
  $implements = [],
  extendKeyword = "implements"
) => {
  if (!$implements || $implements.length === 0) return "";
  const header = extendKeyword ? [txt, extendKeyword].join(" ") : txt;
  return [header, writeImplements($implements)].join(" ");
};

const writeImplements = $implements => $implements.join(", ");
