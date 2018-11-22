import 'inferno'
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router'

import GamesPage from './components/GamesPage'
import TemplatePage from './components/TemplatePage'
import TemplatesPage from './components/TemplatesPage'

import './modules/store'
import './modules/events'
import './registerServiceWorker'
import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/templates/:templateId" component={TemplatePage} />
      <Route path="/games/:gameId" component={TemplatesPage} />
      <Route path="/games" component={GamesPage} />
      <Redirect from="/" to="/games" />
    </Switch>
  </BrowserRouter>
)

export default App