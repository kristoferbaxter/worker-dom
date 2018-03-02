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
			exclude: 'node_modules/**'
		}),
		nodeResolve({ jsnext:true }),
		commonjs(),
	]
};
