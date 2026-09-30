import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./providers/theme-provider"
import BaseLayout from "./layouts/BaseLayout"
import HomePage from "./pages/HomePage"
import InfoPage from "./pages/InfoPage"
import FileUploadDownloadPage from "./pages/FileUploadDownloadPage"
import FileOperationsStore from "./store/FileOperationsStore"
import { createContext } from "react"
import HelpPage from "./pages/HelpPage"

type State = {
  store: FileOperationsStore;
}

const store = new FileOperationsStore();

export const StoreContext = createContext<State>({store});

function App() {
  return (
    <StoreContext.Provider value={{store}}>
      <ThemeProvider defaultTheme='system' storageKey='theme-mode-key'>
        <BrowserRouter>
        <Routes>
          <Route index element={<HomePage/>}/>
          <Route path='/' element={<BaseLayout/>}>
            <Route path='/info' element={<InfoPage/>}/>
            <Route path='/file' element={<FileUploadDownloadPage/>}/>
            <Route path='/help' element={<HelpPage/>}/>
          </Route> 
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  )
}

export default App