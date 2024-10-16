import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/main/App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Tournament from './routes/tournament/App.tsx';


const router = createBrowserRouter([
  {
    path:'/',
    element:(
        <App />
    )
  },
  {
    path:'/tournament',
    element:<Tournament/>
  }
])




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </StrictMode>,
)
