
import './App.css';
import Dashboard from './components/Dashboard'
import ChartDashboard from './components/ChartDashboard';
import HeaderBar from './components/HeaderBar'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
    <div className="App">
      <HeaderBar/>
      <div>
        <Switch>
          <Route exact path="/">
            <Dashboard/>
          </Route>
          <Route path="/analytics">
          <ChartDashboard/>
          </Route>
        </Switch>
      </div>
      
    </div>
    </Router>
  );
}

export default App;
