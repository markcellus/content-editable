'use strict';
module.exports = {
    build: {
        dist: 'dist',
        files: {
            'dist/inline-edit.js': ['src/inline-edit.js']
        },
        browserifyOptions: {
            standalone: 'InlineEdit'
        },
        minifyFiles: {
            'dist/inline-edit-min.js': ['dist/inline-edit.js']
        },
        bannerFiles: ['dist/*']
    }
};
