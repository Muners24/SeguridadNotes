import { createRoot } from 'react-dom/client';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Notes from './views/Notes';
import EditNote from './views/EditNote';

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/notes' element={<Notes />} />
      <Route path='/notes/:id/edit' element={<EditNote />} />
    </Routes>
  </BrowserRouter>
);
