import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureMock } from './api'
import { App } from './App'
import './index.css'

// Dev helpers: ?fail=0.5 sets the mock failure rate, ?latency=0 removes the delay.
if (import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search)
  const fail = params.get('fail')
  const latency = params.get('latency')
  if (fail !== null && !Number.isNaN(Number(fail))) configureMock({ failureRate: Number(fail) })
  if (latency !== null && !Number.isNaN(Number(latency))) {
    configureMock({ minDelay: Number(latency), maxDelay: Number(latency) })
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
