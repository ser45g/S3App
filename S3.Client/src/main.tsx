import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import InfoPage from './pages/InfoPage.tsx'
import BaseLayout from './layouts/BaseLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BaseLayout/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/info' element={<InfoPage/>}/>
        </Route> 
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
