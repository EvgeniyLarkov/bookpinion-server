import { body, query, param } from 'express-validator'
import C from '../config/constants'

// TO-DO
// Добавить константы вместо магических цифр
// Убрать дублирование

export const userDataValidator = [
  body('name', 'Enter first name').isString().withMessage('Invalid name')
    .isAlpha('en-US').withMessage('Name can contain only english language symbols')
    .isLength({ min: 2, max: 30 }).withMessage('Name is too long or too short. Minimum 2, Maximum 30'),
  body('surname', 'Enter second name').isString().withMessage('Invalid surname')
    .isAlpha('en-US').withMessage('Surname can contain only english language symbols')
    .isLength({ min: 2, max: 30 }).withMessage('Surname is too long or too short. Minimum 2, Maximum 30'),
  body('username', 'Pick a username').isString().withMessage('Username should be a string')
    .isLength({ min: 2, max: 40 }).withMessage('Username is too long or too short. Minimum 2, Maximum 30')
]

export const userRegDataValidator = [
  ...userDataValidator,
  body('password', 'Enter password').isString().withMessage('Invalid password')
    .isLength({ min: 6, max: 40 }).withMessage('Password is too long or too short. Minimum 6, Maximum 40')
]

export const articleCreateValidator = [
  body('username', 'Pick a username').isString().withMessage('Username should be a string')
    .isLength({ min: 2, max: 40 }).withMessage('Username is too long or too short. Minimum 6, Maximum 40'),
  body('bookId', 'Book id').isString().withMessage('Invalid book id')
    .isLength({ min: 2, max: 40 }).withMessage('Book id is too long or too short. Minimum 2, Maximum 40'),
  body('article', 'Text content of the article').isString().withMessage('Invalid symbols')
    .isLength({ min: 30, max: 2000 }).withMessage('Article is too long or too short. Minimum 30, Maximum 2000'),
  body('rating', 'Rate this book').isNumeric().withMessage('Not a rating')
    .isFloat({ min: 0, max: 10 }).withMessage('Out of rating range. Rating range is between 0 and 10'),
  body('createdAt', 'Date of article creation').optional().isAscii().withMessage('Not a date')
]

export const articleQueryValidator = [
  query('authors', 'Authors of the book').optional().isArray().withMessage('Not an authors name'),
  // .isLength({ min: C.MIN_AUTHOR_CHARS, max: C.MAX_AUTHOR_CHARS })
  // .withMessage(`Author name is too long or too short. Minimum ${C.MIN_AUTHOR_CHARS}, Maximum ${C.MAX_AUTHOR_CHARS}`),
  query('start').optional().isNumeric().withMessage('Not a number')
    .isFloat({ min: C.MIN_QUERYARTICLE_LIMIT, max: C.MAX_QUERYARTICLE_LIMIT }).withMessage('Value should be positive and less than 1000'),
  query('end').optional().isNumeric().withMessage('Not a number')
    .isFloat({ min: C.MIN_QUERYARTICLE_LIMIT, max: C.MAX_QUERYARTICLE_LIMIT }).withMessage('Value should be positive and less than 1000'),
  query('rating', 'User rating of the book').optional().isNumeric().withMessage('Not a rating')
    .isFloat({ min: C.MIN_BOOK_RATING, max: C.MAX_BOOK_RATING })
    .withMessage(`Out of rating range. Rating range is between ${C.MIN_BOOK_RATING} and ${C.MAX_BOOK_RATING}`),
  query('bookId', 'Book id').optional().isString().withMessage('Invalid book id')
    .isLength({ min: C.MIN_BOOKID_CHARS, max: C.MAX_BOOKID_CHARS })
    .withMessage(`Book id is too long or too short. Minimum ${C.MIN_BOOKID_CHARS}, Maximum ${C.MAX_BOOKID_CHARS}`),
  query('username').optional().isString().withMessage('Username should be a string')
    .isLength({ min: C.MIN_USERNAME_CHARS, max: C.MAX_USERNAME_CHARS })
    .withMessage(`Username is too long or too short. Minimum ${C.MIN_USERNAME_CHARS}, Maximum ${C.MAX_USERNAME_CHARS}`)
]

export const userGetValidator = [
  param('username').isString().withMessage('Username should be a string')
    .isLength({ min: C.MIN_USERNAME_CHARS, max: C.MAX_USERNAME_CHARS })
    .withMessage(`Username is too long or too short. Minimum ${C.MIN_USERNAME_CHARS}, Maximum ${C.MAX_USERNAME_CHARS}`)
]

export const bookQueryValidator = [
  query('author', 'Author of the book').optional().isString().withMessage('Not an author name')
    .isLength({ min: C.MIN_AUTHOR_CHARS, max: C.MAX_AUTHOR_CHARS })
    .withMessage(`Author name is too long or too short. Minimum ${C.MIN_AUTHOR_CHARS}, Maximum ${C.MAX_AUTHOR_CHARS}`),
  query('title', 'Label of the book').optional().isString().withMessage('Invalid title')
    .isLength({ min: C.MIN_BOOKNAME_CHARS, max: C.MAX_BOOKNAME_CHARS })
    .withMessage(`Author name is too long or too short. Minimum ${C.MIN_BOOKNAME_CHARS}, Maximum ${C.MAX_BOOKNAME_CHARS}`),
  query('start').optional().isNumeric().withMessage('Not a number')
    .isFloat({ min: C.MIN_QUERYARTICLE_LIMIT, max: C.MAX_QUERYARTICLE_LIMIT }).withMessage('Value should be positive and less than 1000'),
  query('end').optional().isNumeric().withMessage('Not a number')
    .isFloat({ min: C.MIN_QUERYARTICLE_LIMIT, max: C.MAX_QUERYARTICLE_LIMIT }).withMessage('Value should be positive and less than 1000')
]

export const bookParamValidator = [
  param('id').isString().withMessage('Id should be a string')
    .isLength({ min: C.MIN_BOOKID_CHARS, max: C.MAX_BOOKID_CHARS })
    .withMessage(`Id is too long or too short. Minimum ${C.MIN_BOOKID_CHARS}, Maximum ${C.MAX_BOOKID_CHARS}`)
]
