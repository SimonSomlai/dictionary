const restrictedGlobals = require("confusing-browser-globals");
const paths = require("../paths");
const prettierConfig = require(paths.prettierConfig);

module.exports = {
  root: true,

  parser: "babel-eslint",

  plugins: [
    "import",
    "sort-imports-es6-autofix",
    "prettier",
    "flowtype",
    "jsx-a11y",
    "react",
    "smells"
  ],

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended",
    "plugin:prettier/recommended"
  ],

  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    react: {
      version: "16.6"
    }
  },

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },

  rules: {
    // http://eslint.org/docs/rules/
    "array-callback-return": "error",
    "default-case": [
      "error",
      {
        commentPattern: "^no default$"
      }
    ],
    "dot-location": ["error", "property"],
    eqeqeq: ["error", "smart"],
    "new-parens": "error",
    "no-array-constructor": "error",
    "no-caller": "error",
    "no-cond-assign": ["error", "except-parens"],
    "no-const-assign": "error",
    "no-control-regex": "error",
    "no-delete-var": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty-character-class": "error",
    "comma-dangle": ["warn", "never"],
    "no-empty-pattern": "error",
    "no-eval": "error",
    "no-ex-assign": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-fallthrough": "error",
    "no-func-assign": "error",
    "no-implied-eval": "error",
    "no-invalid-regexp": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": [
      "error",
      {
        allowLoop: true,
        allowSwitch: false
      }
    ],
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-mixed-operators": [
      "error",
      {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"]
        ],
        allowSamePrecedence: false
      }
    ],
    "no-multi-str": "error",
    "no-native-reassign": "error",
    "no-negated-in-lhs": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-restricted-syntax": ["error", "WithStatement"],
    "no-script-url": "error",
    "no-self-assign": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-undef": "warn",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "no-unused-expressions": [
      "warn",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    "no-unused-labels": "warn",
    "no-unused-vars": [
      "warn",
      {
        args: "none",
        ignoreRestSiblings: true
      }
    ],
    "no-use-before-define": [
      "error",
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-useless-rename": [
      "error",
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false
      }
    ],
    "no-with": "error",
    "no-console": "warn",
    "no-whitespace-before-property": "error",
    "require-yield": "error",
    "rest-spread-spacing": ["error", "never"],
    strict: ["error", "never"],
    "unicode-bom": ["error", "never"],
    "use-isnan": "error",
    "valid-typeof": "error",
    "no-restricted-properties": [
      "error",
      {
        object: "require",
        property: "ensure",
        message:
          "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      },
      {
        object: "System",
        property: "import",
        message:
          "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      }
    ],
    "getter-return": "error",
    "max-statements": ["warn", 15],
    "max-depth": ["warn", 2],
    complexity: ["error", 10],
    "no-debugger": ["warn"],

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    "import/first": "error",
    "import/no-amd": "error",
    "import/no-webpack-loader-syntax": "error",

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    "react/forbid-foreign-prop-types": [
      "error",
      {
        allowInPropTypes: true
      }
    ],
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": [
      "error",
      {
        ignoreCase: true
      }
    ],
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": [
      "error",
      {
        allowAllCaps: true,
        ignore: []
      }
    ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-danger-with-children": "error",
    // Disabled because of undesirable errorings
    // See https://github.com/facebook/create-react-app/issues/5204 for
    // blockers until its re-enabled
    // 'react/no-deprecated': 'error',
    "react/no-direct-mutation-state": "error",
    "react/no-is-mounted": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-render-return": "error",
    "react/style-prop-object": "error",
    "react/no-string-refs": "error",
    "react/prop-types": "warn",

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    "jsx-a11y/accessible-emoji": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        aspects: ["noHref", "invalidHref"]
      }
    ],
    "jsx-a11y/aria-activedescendant-has-tabindex": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/iframe-has-title": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/no-access-key": "error",
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/scope": "error",

    // https://github.com/gajus/eslint-plugin-flowtype
    "flowtype/define-flow-type": "error",
    "flowtype/require-valid-file-annotation": "error",
    "flowtype/use-flow-type": "error",
    "flowtype/require-return-type": "error",

    // https://github.com/elijahmanor/eslint-plugin-smells
    "smells/no-this-assign": "warn",
    "smells/no-complex-string-concat": "error",

    // prettier
    "prettier/prettier": ["error", prettierConfig],
    quotes: ["warn", "double", { allowTemplateLiterals: true }],
    "sort-imports-es6-autofix/sort-imports-es6": [
      "warn",
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
      }
    ]
  }
};
