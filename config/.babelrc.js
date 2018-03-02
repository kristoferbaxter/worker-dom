module.exports = function(context) {
  return {
    presets: [
      [
        '@babel/env', {
          targets: {
            browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
          },
          loose: true,
          modules: false
        }
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-object-rest-spread'],
      ['@babel/proposal-class-properties'],
    ]
  }
};