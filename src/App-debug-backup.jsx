import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    try {
      setMessage('React is working!')
      console.log('App mounted successfully')
    } catch (error) {
      setMessage('Error: ' + error.message)
      console.error('Error in App:', error)
    }
  }, [])

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Debug Test</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
