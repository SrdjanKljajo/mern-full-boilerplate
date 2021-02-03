import { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.min.css'
//const { REACT_APP_API } = process.env

const Reset = ({ match }) => {
  // props.match from react router dom
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Resetujte lozinku',
  })

  useEffect(() => {
    let token = match.params.token
    let { name } = jwt.decode(token)

    if (token) {
      setValues({ ...values, name, token })
    }
  }, [])

  const { name, token, newPassword, buttonText } = values

  const handleChange = event => {
    setValues({ ...values, newPassword: event.target.value })
  }

  const clickSubmit = event => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Sačekajte trenutak...' })
    axios({
      method: 'POST',
      url: `http://localhost:5000/api/users/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then(response => {
        console.log('RESET PASSWORD SUCCESS', response)
        toast.success(response.data.message)
        setValues({ ...values, buttonText: 'Lozinka resetovana' })
      })
      .catch(error => {
        console.log('RESET PASSWORD ERROR', error.response.data)
        toast.error(error.response.data.error)
        setValues({ ...values, buttonText: 'Resetujte lozinku' })
      })
  }

  const passwordResetForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type='password'
          className='form-control'
          placeholder='Upišite novu lozinku'
          required
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
      <h3 className='p-5 text-center'>
        Pozdrav {name}, Upišite vašu novu lozinku
      </h3>
      {passwordResetForm()}
    </div>
  )
}

export default Reset
