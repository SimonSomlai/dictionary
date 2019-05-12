const paths = require("./config/paths");

module.exports = {
  defaultSeverity: "warning",
  extends: ["stylelint-config-recommended", "stylelint-config-prettier"],
  plugins: ["stylelint-order"],
  fix: true,
  // Ignore vendor styles
  ignoreFiles: [
    "node_modules",
    `${paths.stylesPath}/2-core/_2-grid.scss`,
    `${paths.stylesPath}/4-vendor/*.scss`,
    `${paths.databasePath}/**/*.scss`,
    `${paths.databasePath}/**/*.css`
  ],
  rules: {
    "selector-max-specificity": [
      "0,2,1",
      {
        message: `Max specificity exception! Specificity = [0,2,1]

        Rules:
        * Id's are not allowed
        * Class and pseudo class selectors have a max-specificity of 2
        * Only 1 pseudo element specificity allowed`,
        severity: "error"
      }
    ],
    "order/order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "rules",
      "at-rules"
    ],
    "order/properties-order": [
      {
        groupName: "core",
        emptyLineBefore: "always",
        properties: [
          "display",
          "float",
          "position",
          "top",
          "right",
          "bottom",
          "left",
          "z-index"
        ]
      },
      {
        groupName: "dimensions",
        emptyLineBefore: "always",
        properties: [
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height"
        ]
      },
      {
        groupName: "box model",
        emptyLineBefore: "always",
        properties: [
          "box-sizing",
          "padding",
          "padding-top",
          "padding-right",
          "padding-bottom",
          "padding-left",
          "margin",
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left"
        ]
      },
      "overflow",
      "overflow-x",
      "overflow-y",
      "clip",
      "clear",
      "font",
      "font-family",
      "font-size",
      "font-style",
      "font-weight",
      "font-variant",
      "font-size-adjust",
      "font-stretch",
      "font-effect",
      "font-emphasize",
      "font-emphasize-position",
      "font-emphasize-style",
      "font-smooth",
      "hyphens",
      "line-height",
      "color",
      "text-align",
      "text-align-last",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-style",
      "text-emphasis-position",
      "text-decoration",
      "text-indent",
      "text-justify",
      "text-outline",
      "text-overflow",
      "text-overflow-ellipsis",
      "text-overflow-mode",
      "text-shadow",
      "text-transform",
      "text-wrap",
      "letter-spacing",
      "word-break",
      "word-spacing",
      "word-wrap",
      "tab-size",
      "white-space",
      "vertical-align",
      "list-style",
      "list-style-position",
      "list-style-type",
      "list-style-image",
      "pointer-events",
      "fill",
      "fill-opacity",
      "stroke",
      "stroke-opacity",
      "stroke-width",
      "shape-rendering",
      "cursor",
      "visibility",
      "zoom",
      "flex-direction",
      "flex-order",
      "flex-pack",
      "flex-align",
      "table-layout",
      "empty-cells",
      "caption-side",
      "border-spacing",
      "border-collapse",
      "content",
      "quotes",
      "counter-reset",
      "counter-increment",
      "resize",
      "user-select",
      "nav-index",
      "nav-up",
      "nav-right",
      "nav-down",
      "nav-left",
      "background",
      "background-color",
      "background-image",
      "filter",
      "background-repeat",
      "background-attachment",
      "background-position",
      "background-position-x",
      "background-position-y",
      "background-clip",
      "background-origin",
      "background-size",
      "border",
      "border-color",
      "border-style",
      "border-width",
      "border-top",
      "border-top-color",
      "border-top-style",
      "border-top-width",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-style",
      "border-bottom-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
      "border-image",
      "border-image-source",
      "border-image-slice",
      "border-image-width",
      "border-image-outset",
      "border-image-repeat",
      "outline",
      "outline-width",
      "outline-style",
      "outline-color",
      "outline-offset",
      "box-shadow",
      "opacity",
      "transition",
      "transition-delay",
      "transition-timing-function",
      "transition-duration",
      "transition-property",
      "transform",
      "transform-origin",
      "animation",
      "animation-name",
      "animation-duration",
      "animation-fill-mode",
      "animation-play-state",
      "animation-timing-function",
      "animation-delay",
      "animation-iteration-count",
      "animation-direction"
    ],
    "declaration-no-important": [
      true,
      {
        message: "!important statements aren't allowed"
      }
    ],
    indentation: 2,
    "unit-whitelist": [
      ["rem", "em", "%", "vh", "vw", "s", "deg", "px"],
      {
        ignoreProperties: {
          px: ["font-size", "/^border/"]
        }
      }
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "value",
          "each",
          "for",
          "if",
          "else",
          "function",
          "return"
        ]
      }
    ],
    "selector-class-pattern": [
      "^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?(?:\\[.+\\])?$",
      {
        severity: "error",
        message: `Expected selector to match all lowercase BEM-selectors. Read more at http://getbem.com/naming/

        Allowed examples;
        * .block-selector
        * .block-selector123
        * .block-selector__child-selector
        * .block-selector--block-modifier
        * .block-selector__child-selector--block-modifier

        Not-allowed examples;
        * .UPPERCASESELECTOR
        * .snake_case_selector
        * .camelCaseSelector
        * .block-selector__child__grandchild
        `
      }
    ]
  }
};
