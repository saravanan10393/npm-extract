import React from 'react';
const RemoteButton = React.lazy(() => import('remote/Button'));

const App = () => (
  <div>
    <h1>Bi-Directional</h1>
    <h2>
      Host App
    </h2>
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
    </React.Suspense>
  </div>
);

export default App;