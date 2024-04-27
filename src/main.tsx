import { render } from 'preact'
import { AppRouter } from './components/AppRouter';
import './index.css'
import './app.css'

const rootElement = document.getElementById('app')!
render(<AppRouter />, rootElement)
