module.exports = {
    components: ['src/Annotation.tsx', 'src/AnnotationForeign.tsx'],
    styleguideDir: 'docs',
    webpackConfig: {
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                }
            ]
        }
    }
};
