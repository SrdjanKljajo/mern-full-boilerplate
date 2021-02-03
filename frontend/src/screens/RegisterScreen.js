import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import LoginWithGoogle from '../components/LoginWithGoogle'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.min.css'

const RegisterScreen = ({ location, history }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    buttonText: 'prihvati',
    message: null,
  })

  const { name, email, password, confirmPassword, message, buttonText } = values

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const userRegister = useSelector(state => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = e => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setValues({ ...values, message: 'Lozinke se ne podudaraju' })
    } else {
      setValues({ ...values, buttonText: 'Sačekajte momenat...' })
      axios({
        method: 'POST',
        url: `http://localhost:5000/api/users`,
        data: { name, email, password },
      })
        .then(response => {
          console.log('REGISTRACIJA USPEŠNA', response)
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            buttonText: 'pogledajte vaš email',
            message: null,
          })
          toast.success(response.data.message)
        })
        .catch(error => {
          console.log('GREŠKA PRI REGISTRACIJI', error.response.data)
          setValues({ ...values, buttonText: 'Prihvati' })
          toast.error(error.response.data.error)
        })
    }
  }

  return (
    <FormContainer>
      <ToastContainer />
      <h1 className='py-5'>Registrujte se</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <LoginWithGoogle />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Ime</Form.Label>
          <Form.Control
            type='name'
            placeholder='Unesite ime'
            value={name}
            onChange={handleChange('name')}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email adresa</Form.Label>
          <Form.Control
            type='email'
            placeholder='Unesite email'
            value={email}
            onChange={handleChange('email')}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Lozinka</Form.Label>
          <Form.Control
            type='password'
            placeholder='Unesite lozinku'
            value={password}
            onChange={handleChange('password')}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Potvrdite lozinku</Form.Label>
          <Form.Control
            type='password'
            placeholder='Unesite istu lozinku'
            value={confirmPassword}
            onChange={handleChange('confirmPassword')}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          {buttonText}
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Već imate nalog?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Prijavite se
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
