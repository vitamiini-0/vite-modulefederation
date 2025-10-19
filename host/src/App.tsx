import React, { lazy, Suspense, useEffect, useState } from 'react';
import { of, tap } from 'rxjs';
import './App.css';
import Counter from './components/Counter';

// Lazy-load remote safely
const loadRemoteSafely = async () => {
	try {
		// @ts-ignore - module federation import
		const module = await import('remote/remote-app');
		return module;
	} catch (err) {
		console.warn('Remote "remote/remote-app" failed to load:', err);
		// Fallback module: a simple local component
		return {
			default: () => (
				<div
					style={{
						border: '1px solid #ccc',
						padding: '1rem',
						borderRadius: '8px',
						marginTop: '1rem',
						background: '#f8d7da',
						color: '#842029',
					}}
				>
					Remote app unavailable. Please try again later.
				</div>
			),
		};
	}
};

const Remote = lazy(loadRemoteSafely);

export default function App() {
	useEffect(() => {
		of('emit')
			.pipe(tap(() => console.log("I'm RxJs from host")))
			.subscribe();
	}, []);

	return (
		<>
			<div className="host">
				<div className="card">
					<div className="title">I'm the host app</div>
					<Counter />
				</div>
			</div>

			<Suspense fallback={<div>Loading remote...</div>}>
				<Remote />
			</Suspense>
		</>
	);
}
