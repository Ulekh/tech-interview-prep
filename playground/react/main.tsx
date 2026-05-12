import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [Exercise, setExercise] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'react';
    const name = params.get('name');

    if (name) {
      // Use dynamic import with glob-like pattern for Vite to pick it up
      const exercises = import.meta.glob('../../exercises/**/*.{tsx,ts}');
      const path = `../../exercises/${category}/${name}/index.tsx`;
      
      if (exercises[path]) {
        exercises[path]()
          .then((module: any) => {
            setExercise(() => module.default || Object.values(module)[0]);
          })
          .catch((err) => {
            console.error(err);
            setError(`Error loading exercise "${name}": ${err.message}`);
          });
      } else {
        setError(`Could not find exercise "${name}" in category "${category}" at path ${path}`);
      }
    } else {
      import('./index.tsx').then((module) => {
          setExercise(() => module.PlaygroundApp);
      });
    }
  }, []);

  if (error) return (
    <div style={{ color: 'red', padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
      <h3>❌ Error</h3>
      <p>{error}</p>
      <p>Try adding <code>?name=exercise-name</code> to the URL.</p>
    </div>
  );
  
  if (!Exercise) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="exercise-container">
       <Exercise />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
