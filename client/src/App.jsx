import React from 'react'
import UserHomePage from './pages/user/UserHomePage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div>
      <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#1f2937',
                        color: '#f9fafb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                      success: {
                        style: {
                          background: '#059669',
                        },
                      },
                      error: {
                        style: {
                          background: '#dc2626',
                        },
                      },
                    }}
                  />
                  
                  {/* The main UserHomePage component that now consumes all the contexts */}
                  <UserHomePage />
    </div>
  )
}

export default App
