import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const { DEBUG_BUNDLE, UGLIFY_BUNDLE = false } = process.env;

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @param {string} filename
 * @returns {string} path to filename including filename.
 */
const path = (esmodules, forMainThread, filename) => {
  return [!!DEBUG_BUNDLE ? 'debugger' : undefined, 'build', esmodules === true ? 'esmodules' : undefined, forMainThread === true ? 'main-thread' : undefined, filename].reduce(
    (accumulator, currentValue) => {
      if (accumulator === undefined) {
        return currentValue || '';
      } else if (currentValue !== undefined) {
        return `${accumulator}/${currentValue}`;
      }

      return accumulator;
    },
  );
};

/**
 * @param {boolean} esmodules
 * @param {boolean} forMainThread
 * @returns {Array<OutputConfig>} Rollup configurations for output.
 */
const output = (esmodules, forMainThread) => {
  return [
    {
      file: path(esmodules, forMainThread, 'index.module.js'),
      format: 'es',
      sourcemap: true,
    },
    {
      file: path(esmodules, forMainThread, 'index.js'),
      format: 'iife',
      sourcemap: true,
      name: 'WorkerDom',
      outro: DEBUG_BUNDLE ? 'window.workerDocument = document;' : '',
    },
  ];
};

/**
 *
 * @param {boolean} esmodules
 * @returns {Object} Babel configuration for output.
 */
const babelConfiguration = esmodules => {
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
                value: path(esmodules, false, 'index.js'),
              },
            },
          ],
        },
      ],
    ],
  };
};

/**
 * @param {boolean} esmodules 
 * @returns {Array<Plugin>}
 */
const plugins = esmodules => (UGLIFY_BUNDLE === 'true' ? [babel(babelConfiguration(esmodules)), uglify()] : [babel(babelConfiguration(esmodules))]);

export default [
  {
    input: 'src/output/worker-thread/index.js',
    output: output(false, false),
    plugins: plugins(false),
  },
  {
    input: 'src/output/worker-thread/index.js',
    output: output(true, false),
    plugins: plugins(true),
  },
  {
    input: 'src/output/main-thread/index.js',
    output: output(false, true),
    plugins: plugins(false),
  },
  {
    input: 'src/output/main-thread/index.js',
    output: output(true, true),
    plugins: plugins(true),
  },
];
