import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const { ROLLUP_WATCH } = process.env;

export default {
    input: 'src/content-editable.ts',
    output: {
        format: 'esm',
        file: 'dist/content-editable.js',
    },
    plugins: [resolve(), typescript(), commonjs(), !ROLLUP_WATCH && terser()],
    watch: {
        include: 'src/**',
    },
};
