import asyncHandler from 'express-async-handler'
import { OAuth2Client } from 'google-auth-library'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import _ from 'lodash'
import User from '../models/userModel.js'
// sendgrid
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(
  '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'
)

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Email adresa ili lozinka nisu tačni')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = (req, res) => {
  const { name, email, password } = req.body

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Uneta email adresa je zauzeta',
      })
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    )

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Link za aktivaciju naloga`,
      html: `
                <h1>Upotrebite sledeći link da biste aktivirali vaš nalog</h1>
                <p>${process.env.CLIENT_URL}/activate/${token}</p>
                <hr />
            `,
    }

    sgMail
      .send(emailData)
      .then(sent => {
        // console.log('SIGNUP EMAIL SENT', sent)
        return res.json({
          message: `Email za aktivaciju je poslat na ${email}. Pratite instrukcije da biste aktivirali nalog`,
        })
      })
      .catch(err => {
        // console.log('SIGNUP EMAIL SENT ERROR', err)
        return res.json({
          message: err.message,
        })
      })
  })
}

export const accountActivation = (req, res) => {
  const { token } = req.body

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err)
          return res.status(401).json({
            error: 'Link za aktivaciju je istekao. Prijavite se ponovo',
          })
        }

        const { name, email, password } = jwt.decode(token)

        const user = new User({ name, email, password })

        user.save((err, user) => {
          if (err) {
            console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
            return res.status(401).json({
              error:
                'Greška prilikom memorisanja korisnika u bazu podataka. Pokušajte ponovo',
            })
          }
          return res.json({
            message: 'Registracija je uspešno obavljena. Možete se prijaviti',
          })
        })
      }
    )
  } else {
    return res.json({
      message: 'Nešto nije u redu, pokušajte ponovo',
    })
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'Korisnik je uspešno uklonjen' })
  } else {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.password = req.body.password || user.password
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      password: updatedUser.password,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('Korisnik nije pronađen')
  }
})

// @desc    Forgot password
// @route   PUT /api/users/forgot-password
// @access  Public
export const forgotPassword = (req, res) => {
  const { email } = req.body

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Korisnik sa unetom email adresom ne postoji',
      })
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: '10m',
      }
    )

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Link za resetovanje lozinke`,
      html: `
                <h1>Molimo iskoristite ovaj link da biste resetovali lozinku</h1>
                <p>${process.env.CLIENT_URL}/password/reset/${token}</p>
                <hr />
            `,
    }

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log('RESET PASSWORD LINK ERROR', err)
        return res.status(400).json({
          error: 'Greška u konekciji sa bazom podataka',
        })
      } else {
        sgMail
          .send(emailData)
          .then(sent => {
            // console.log('SIGNUP EMAIL SENT', sent)
            return res.json({
              message: `Email je poslat na ${email}. Pratite instrukcije da biste resetovali lozinku`,
            })
          })
          .catch(err => {
            // console.log('SIGNUP EMAIL SENT ERROR', err)
            return res.json({
              message: err.message,
            })
          })
      }
    })
  })
}

// @desc    Reset password
// @route   PUT /api/users/reset-password
// @access  Private
export const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: 'Link više nije validan. Pokušajte ponovo',
          })
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Došlo je do greške, pokušajte ponovo',
            })
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          }

          user = _.extend(user, updatedFields)

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Greška u procesu resetovanja lozinke',
              })
            }
            res.json({
              message: `Lozinka je uspešno resetovana! Možete se prijaviti pomoću nove lozinke`,
            })
          })
        })
      }
    )
  }
}

// @desc    Google Login
// @route   POST /api/users/goglelogin
// @access  Public
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const googleLogin = (req, res) => {
  const idToken = req.body.tokenId
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
      //console.log(response)
      const { email_verified, name, email, jti } = response.payload
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            return res.json({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              token: generateToken(user._id),
            })
          } else {
            let password = jti
            user = new User({ name, email, password })
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: 'Greška prilikom registracije',
                })
              }
              return res.json({
                _id: data._id,
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                token: generateToken(data._id),
              })
            })
          }
        })
      } else {
        return res.status(400).json({
          error: 'Google registracija neuspešna. Pokušajte ponovo',
        })
      }
    })
}

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  googleLogin,
}
