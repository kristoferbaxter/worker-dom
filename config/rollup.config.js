import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/output/index.js',
	output: [
    {
      file: 'build/index.module.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'build/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'build/index.js',
      format: 'iife',
      sourcemap: true,
      name: 'WorkerDom'
    }
  ],
	external: [],
	plugins: [
		babel({
      exclude: 'node_modules/**',
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
    }),
		nodeResolve({ jsnext:true }),
		commonjs(),
	]
};
