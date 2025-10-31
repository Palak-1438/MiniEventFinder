import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import EventList from './pages/EventList'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <EventList /> },
      { path: 'events/:id', element: <EventDetail /> },
      { path: 'create', element: <CreateEvent /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
