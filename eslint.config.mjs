import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

const eslintConfigs = [
    { languageOptions: { globals: globals.browser }, extends: ['prettier'] },
    pluginJs.configs.recommended,
    pluginReactConfig
];
export default eslintConfigs;
