import { lazy, Suspense, useEffect } from 'react';
import { of, tap } from 'rxjs';
import './App.css';
import Counter from './components/Counter';
import { loadRemote, registerRemotes } from '@module-federation/enhanced/runtime';


const loadRemoteComponent = async (): Promise<{ default: React.ComponentType<any> }> => {
	registerRemotes([
		{
			name: 'remote',
			type: 'module',
			entry: 'http://localhost:4174/remoteEntry.js',
		},
	])

	try {
		const module = await loadRemote('remote/remote-app')
		return module as { default: React.ComponentType<any> }
	}
	catch (err) {
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

const Remote = lazy(loadRemoteComponent);

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
