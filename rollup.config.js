import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default function (commandOptions) {
    const basePath = commandOptions.dev ? 'examples/dist' : 'dist';
    return {
        input: 'src/content-editable.ts',
        output: {
            format: 'esm',
            file: `${basePath}/content-editable.js`,
        },
        plugins: [
            resolve(),
            typescript(),
            commonjs(),
            !commandOptions.watch && terser(),
        ],
        watch: {
            include: 'src/**',
        },
    };
}
