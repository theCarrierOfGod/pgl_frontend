import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './user/dashboard/Dashboard';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      return true;
    }
  }, [location.key]);


  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <Dashboard />
        }
      />
    </Routes>
  );
}

export default App;
