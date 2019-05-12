const paths = require("../paths");
const eslintDevConfig = require(paths.eslintDevConfig);

// Throw errors for things we only throwed warnings for in dev
module.exports = {
  ...eslintDevConfig,
  rules: {
    ...eslintDevConfig.rules,
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "no-console": "error",
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    "no-unused-labels": "error",
    "no-unused-vars": [
      "error",
      {
        args: "none",
        ignoreRestSiblings: true
      }
    ],
    "no-debugger": ["error"],
    "no-undef": "error",
    "max-statements": ["error", 15],
    "react/prop-types": "error",
    "sort-imports-es6-autofix/sort-imports-es6": [
      "error",
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
      }
    ]
  }
};
