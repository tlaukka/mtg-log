import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import StorageProvider from './storage'
import RouteProvider from './Providers/RouteProvider'
import CardSetProvider from './Providers/CardSetProvider'
import CardStorageProvider from './Providers/CardStorageProvider'

// https://dev.to/mandiwise/electron-apps-made-easy-with-create-react-app-and-electron-forge-560e

function RootContainer () {
  return (
    <StorageProvider>
      <CardStorageProvider>
        <CardSetProvider>
          <RouteProvider>
            <App />
          </RouteProvider>
        </CardSetProvider>
      </CardStorageProvider>
    </StorageProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RootContainer />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
