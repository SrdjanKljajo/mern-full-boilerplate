import GoogleLogin from 'react-google-login'
//const { REACT_APP_GOOGLE_CLIENT_ID } = process.env

const LoginGoogle = () => {
  const loginWithGoogle = async user => {
    try {
      const response = await fetch('/api/users/googlelogin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      return response.json()
    } catch (err) {
      return console.log(err)
    }
  }

  const authenticate = (data, next) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
    next()
  }

  const responseGoogle = response => {
    const tokenId = response.tokenId
    const user = { tokenId }
    loginWithGoogle(user).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        authenticate(data, () => {
          window.location = '/'
        })
      }
    })
  }

  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId=''
        buttonText='Prijavite se putem Google-a'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme='light'
      />
    </div>
  )
}

export default LoginGoogle
