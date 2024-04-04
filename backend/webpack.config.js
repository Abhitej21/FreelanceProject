const path = require('path')

module.exports = {
    entry: {
        'push-notifications': './web/js/push-notifications.ts',
        'firebase-messaging-sw': './web/js/firebase-messaging-sw.ts',
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname,'public'),
    },
    resolve: {
        extensions: ['.ts']
    },
    // module: {
    //     rules: [{
    //         test: /\.js$/,
    //         exclude: /node_modules/,
    //         use:  'ts-loader'
    //     }]
    // }
}