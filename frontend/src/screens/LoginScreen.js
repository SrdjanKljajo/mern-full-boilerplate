import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import LoginWithGoogle from '../components/LoginWithGoogle'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = e => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1 className='py-5'>Prijavite se</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <LoginWithGoogle />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email adresa</Form.Label>
          <Form.Control
            type='email'
            placeholder='Unesite email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Lozinka</Form.Label>
          <Form.Control
            type='password'
            placeholder='Unesite lozinku'
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Prihvati
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          <Link to='/password/forgot' className='btn btn-sm btn-outline-danger'>
            Zaboravili ste lozinku?
          </Link>
        </Col>
      </Row>

      <Row className='py-3'>
        <Col>
          Novi korisnik?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Registrujte se
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
