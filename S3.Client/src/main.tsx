import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage.tsx'
import InfoPage from './pages/InfoPage.tsx'
import BaseLayout from './layouts/BaseLayout.tsx'
import FileUploadDownloadPage from './pages/FileUploadDownloadPage.tsx'
import FileOperationsStore from './store/FileOperationsStore.ts'

type State= {
  store:FileOperationsStore;
}
const store = new FileOperationsStore();
export const StoreContext = createContext<State>({store});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={{store}}>
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<BaseLayout/>}>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/info' element={<InfoPage/>}/>
            <Route path='/file' element={<FileUploadDownloadPage/>}/>
          </Route> 
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
   
  </StrictMode>,
)
