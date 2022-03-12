import './App.css';
import { lazy, Suspense } from 'react';
import { Route } from 'wouter';
import 'antd/dist/antd.css';
import { Loading } from './components/Loading';

const Home = lazy(() => import('./pages/Home'));

function App() {
  return (
    <div>
      <main>
        <Suspense fallback={<Loading />}>
          <Route path="/">
            <Home />
          </Route>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
