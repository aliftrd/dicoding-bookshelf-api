const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('./controller/BookController')
const { resolveForFailedResponseWith } = require('./helper/ResponseHelper')

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBook
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return resolveForFailedResponseWith(h, {
        code: 404,
        message: 'Halaman tidak ditemukan'
      })
    }
  }
]

module.exports = routes
