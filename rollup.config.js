import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/editable-content.ts',
    output: {
        format: 'esm',
        file: 'dist/editable-content.js'
    },
    plugins: [resolve(), typescript(), commonjs()],
    watch: {
        include: 'src/**'
    }
};
