const node_dir = __dirname + '/node_modules';

module.exports = {
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    resolve: {
        alias: {
            'stompjs': node_dir + '/stompjs/lib/stomp.js',
        }
    },
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties']
                }

            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.css/, /\.json$/],
                loader: 'file-loader',
                options: {
                    name: '/media/[name].[hash:8].[ext]',
                    publicPath: '/built/media',
                    outputPath: '/src/main/resources/static/built/media'
                },
            },
        ]
    }
};