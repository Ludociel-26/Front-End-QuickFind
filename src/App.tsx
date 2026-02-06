import { ToastContainer } from 'react-toastify';
import '@cloudscape-design/global-styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from '@/router/AppRouter';

function App() {
  return (
    <div>
      <ToastContainer />
      {/* Toda la lógica de rutas ahora vive en AppRouter */}
      <AppRouter />
    </div>
  );
}

export default App;
