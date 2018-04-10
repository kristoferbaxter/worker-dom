import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const { DEBUG_BUNDLE, UGLIFY_BUNDLE } = process.env;

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @returns {Array<OutputConfig>} Rollup configurations for output.
 */
function output(esmodules, forMainThread) {
  const basePath = `${DEBUG_BUNDLE ? 'debugger/build' : 'build'}${(esmodules === true && '/esmodules') || ''}${forMainThread ? '/main-thread' : ''}`;

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
      outro: DEBUG_BUNDLE ? 'window.workerDocument = document();' : '',
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
    plugins: [
      ['@babel/plugin-proposal-object-rest-spread'],
      ['@babel/proposal-class-properties'],
      [
        'minify-replace',
        {
          replacements: [
            {
              identifierName: '__WORKER_DOM_URL__',
              replacement: {
                type: 'stringLiteral',
                value: 'build/esmodules/index.js',
              },
            },
          ],
        },
      ],
    ],
  };
}

export default [
  {
    input: 'src/output/worker-thread/index.js',
    output: output(false, false),
    plugins: [babel(babelConfiguration(false)), !!UGLIFY_BUNDLE && uglify()],
  },
  {
    input: 'src/output/worker-thread/index.js',
    output: output(true, false),
    plugins: [babel(babelConfiguration(true)), !!UGLIFY_BUNDLE && uglify()],
  },
  {
    input: 'src/output/main-thread/index.js',
    output: output(false, true),
    plugins: [babel(babelConfiguration(false)), !!UGLIFY_BUNDLE && uglify()],
  },
  {
    input: 'src/output/main-thread/index.js',
    output: output(true, true),
    plugins: [babel(babelConfiguration(true)), !!UGLIFY_BUNDLE && uglify()],
  },
];
