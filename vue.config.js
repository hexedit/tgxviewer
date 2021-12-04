module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.ts'
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
};
