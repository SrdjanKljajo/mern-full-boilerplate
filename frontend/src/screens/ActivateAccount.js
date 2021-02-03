import { useState, useEffect } from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.min.css'
//const { REACT_APP_API } = process.env

const ActivateAccount = ({ match, history }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    show: true,
  })

  useEffect(() => {
    let token = match.params.token
    let { name } = jwt.decode(token)

    if (token) {
      setValues({ ...values, name, token })
    }
  }, [])

  const { name, token } = values

  const clickSubmit = event => {
    event.preventDefault()
    axios({
      method: 'POST',
      url: `http://localhost:5000/api/users/account-activation`,
      data: { token },
    })
      .then(response => {
        console.log('AKTIVACIJA NALOGA', response)
        setValues({ ...values, show: false })
        toast.success(response.data.message)
        setTimeout(() => {
          history.push('/login')
        }, 5000)
      })
      .catch(error => {
        console.log(
          'GREŠKA PRILIKOM AKTIVACIJE NALOGA',
          error.response.data.error
        )
        toast.error(error.response.data.error)
      })
  }

  const activationLink = () => (
    <div className='text-center'>
      <h1 className='p-5'>
        Pozdrav {name}, Vaš alog je spreman za aktivaciju?
      </h1>
      <button className='btn btn-outline-primary' onClick={clickSubmit}>
        Aktivirajte nalog
      </button>
    </div>
  )

  return (
    <div className='col-md-6 offset-md-3'>
      <ToastContainer />
      {activationLink()}
    </div>
  )
}

export default ActivateAccount
