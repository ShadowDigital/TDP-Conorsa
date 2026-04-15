// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      "prettier/prettier": [
            "warn",
            {
                // "experimentalTernaries": false,
                // "experimentalOperatorPosition": "end", // "start"
                // "printWidth": 80, // 100, 120 
                "tabWidth": 4,
                // "useTabs": false,
                // "semi": true,
                // "singleQuote": false,
                // "quoteProps": "as-needed", // "consistent", "preserve"
                // "trailingComma": "all", // "es5", "none""
                // "bracketSpacing": true,
                "objectWrap": "collapse", // "collapse"
                // "bracketSameLine": false,
                // "arrowParens": "always", // "avoid"
                // "rangeStart": 0, 
                // "rangeEnd": Infinity,
                // "parser":
                "requirePragma": true, 
                // "insertPragma": false,
                "endOfLine": "auto",
                "singleAttributePerLine": true,
                "arrayElementNewline": [
                    "error",
                    {
                        "multiline": true,
                        "minItems": 1,
                        // "consistent": true
                    }
                ],
                // "noBracketSpacing": true
            }
       ]
    },
  },
);