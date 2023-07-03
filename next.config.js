const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: function (config /*, options */) {
        config.plugins.push(new NodePolyfillPlugin());

        return config;
    }
}

module.exports = nextConfig
