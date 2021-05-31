import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
    files: 'tests/**/*.ts',
    plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
    nodeResolve: true,
    coverageConfig: {
        report: true,
        reportDir: 'coverage',
        threshold: {
            statements: 60,
            lines: 60,
            branches: 50,
            functions: 70,
        },
    },
};
