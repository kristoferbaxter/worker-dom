import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const enableUglify = true;

/**
 * @param {boolean} esmodules
 * @returns {Array<OutputConfig>} Rollup configurations for output.
 */
function outputConfiguration(esmodules) {
  const basePath = `build${(esmodules === true && '/esmodules') || ''}`;

  return [
    {
      file: `${basePath}/index.module.js`,
      format: 'es',
      sourcemap: true,
    },
    {
      file: `${basePath}/index.js`,
      format: 'iife',
      sourcemap: true,
      name: 'WorkerDom',
    },
  ];
}

/**
 *
 * @param {boolean} esmodules
 * @returns {Object} Babel configuration for output.
 */
function babelConfiguration(esmodules) {
  const targets = (esmodules === true && { esmodules: true }) || { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] };

  return {
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/env',
        {
          targets: targets,
          loose: true,
          modules: false,
        },
      ],
    ],
    plugins: [['@babel/plugin-proposal-object-rest-spread'], ['@babel/proposal-class-properties']],
  };
}

export default [
  {
    input: 'src/output/index.js',
    output: outputConfiguration(false),
    plugins: [babel(babelConfiguration(false)), enableUglify && uglify()],
  },
  {
    input: 'src/output/index.js',
    output: outputConfiguration(true),
    plugins: [babel(babelConfiguration(true)), enableUglify && uglify()],
  },
];
