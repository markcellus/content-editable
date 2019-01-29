import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/content-editable.ts',
    output: {
        format: 'esm',
        file: 'dist/content-editable.js'
    },
    plugins: [resolve(), typescript(), commonjs()],
    watch: {
        include: 'src/**'
    }
};
