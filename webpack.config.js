const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry,
        frontend: './src/frontend.js',
        backend: './src/backend.js',
        admin_backend: './src/admin_backend.js',
    },
};
