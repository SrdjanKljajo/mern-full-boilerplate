import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ActivateAccount from './screens/ActivateAccount'
import NotFound from './screens/NotFound'
import ForgotPassword from './screens/ForgotPassword'
import Reset from './screens/ResetPassword'

const App = () => {
  return (
    <Router>
      <Header />
      <main className='container'>
        <Switch>
          <Route exact path='/' component={HomeScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/activate/:token' exact component={ActivateAccount} />
          <Route path='/password/forgot' exact component={ForgotPassword} />
          <Route path='/password/reset/:token' exact component={Reset} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </Router>
  )
}

export default App
