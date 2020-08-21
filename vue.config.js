const path = require("path");

module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'stylus',
            patterns: ['\\src\\styles\\imports.styl']
        }
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3366/',
                ws: true,
                changeOrigin: true
            },
        }
    }
}
