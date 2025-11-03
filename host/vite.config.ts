import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dependencies } from './package.json';

export default defineConfig(() => ({
	server: { fs: { allow: ['.', '../shared'] } },
	build: {
		target: 'chrome89',
	},
	plugins: [
		federation({
			name: 'host',
			exposes: {},
			filename: 'remoteEntry.js',
			shared: {
				react: {
					requiredVersion: dependencies.react,
					singleton: true,
				},
			},
		}),
		react(),
	],
}));
