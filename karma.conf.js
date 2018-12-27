module.exports = function(config) {
    config.set({
        files: ['src/**/*.ts', 'tests/**/*.js'],

        preprocessors: {
            'tests/**/*.js': ['rollup'],
            'src/**/*.ts': ['rollup', 'typescript']
        },
        typescriptPreprocessor: {
            options: {
                sourceMap: false,
                target: 'es6',
                module: 'esnext'
            }
        },
        rollupPreprocessor: {
            output: {
                format: 'umd',
                sourcemap: 'inline'
            },
            plugins: [
                require('rollup-plugin-node-resolve')(),
                require('rollup-plugin-typescript2')(),
                require('rollup-plugin-commonjs')
            ]
        },
        reporters: ['progress'],
        frameworks: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity
    });
};
