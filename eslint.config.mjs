import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  // The WordPress theme and plugin are plain PHP/JavaScript, built and tested separately from the Next.js app.
  { ignores: ["wordpress/**"] }
];

export default eslintConfig;
