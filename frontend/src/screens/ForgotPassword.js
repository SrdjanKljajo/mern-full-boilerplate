import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.min.css'
//const { REACT_APP_API } = process.env

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Zahtev za reset lozinke',
  })

  const { email, buttonText } = values

  const handleChange = name => event => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = event => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Sačekajte trenutak...' })
    axios({
      method: 'POST',
      url: `http://localhost:5000/api/users/forgot-password`,
      data: { email },
    })
      .then(response => {
        console.log('FORGOT PASSWORD SUCCESS', response)
        toast.success(response.data.message)
        setValues({ ...values, buttonText: 'Zahtev je poslat' })
      })
      .catch(error => {
        console.log('FORGOT PASSWORD ERROR', error.response.data)
        toast.error(error.response.data.error)
        setValues({ ...values, buttonText: 'Link za reset lozinke' })
      })
  }

  const passwordForgotForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Vaš email</label>
        <input
          onChange={handleChange('email')}
          value={email}
          type='email'
          className='form-control'
        />
      </div>

      <div>
        <button className='btn btn-primary' onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  )

  return (
    <div className='col-md-6 offset-md-3'>
      <ToastContainer />
      <h3 className='p-5 text-center'>Zaboravili ste lozinku?</h3>
      {passwordForgotForm()}
    </div>
  )
}

export default ForgotPassword
