import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

/* ============================================
   App — Root Component
   ============================================ */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
