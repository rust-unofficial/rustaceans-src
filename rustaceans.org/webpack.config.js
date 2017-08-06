module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "./out/rustaceans.out.js",
    libraryTarget: 'var',
    library: 'Rustaceans'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devServer: {
    contentBase: '.',
    historyApiFallback: true
  },
  devtool: 'source-map'
}
