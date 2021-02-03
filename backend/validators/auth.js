import { check } from 'express-validator'

export const userSignupValidator = [
  check('name').not().isEmpty().withMessage('Ime je obavezno'),
  check('email')
    .isEmail()
    .withMessage('Email adresa mora biti ispravno napisana'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
]

export const userSigninValidator = [
  check('email')
    .isEmail()
    .withMessage('Email adresa mora biti ispravno napisana'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
]

export const forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Email adresa mora biti ispravno napisana'),
]

export const resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
]
