const { nanoid } = require('nanoid')
const { resolveForSuccessResponseWith, resolveForFailedResponseWith } = require('../helper/ResponseHelper')
const books = require('../database/books')

const getAllBooks = (request, h) => {
  const { reading, finished, name } = request.query

  if (name) {
    const checkNameBook = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    )

    return resolveForSuccessResponseWith(h, {
      message: 'Buku berhasil ditemukan',
      data: {
        books: checkNameBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
  }

  if (reading) {
    const checkReadingBook = books.filter(
      (book) => Number(book.reading) === Number(reading)
    )

    return resolveForSuccessResponseWith(h, {
      data: {
        books: checkReadingBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
  }

  if (finished) {
    const checkFinishedBook = books.filter(
      (book) => Number(book.finished) === Number(finished)
    )

    return resolveForSuccessResponseWith(h, {
      data: {
        books: checkFinishedBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
  }

  return resolveForSuccessResponseWith(h, {
    message: 'Buku berhasil ditemukan',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
}

const getBookById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book === undefined) {
    return resolveForFailedResponseWith(h, {
      code: 404,
      message: 'Buku tidak ditemukan'
    })
  }

  return resolveForSuccessResponseWith(h, {
    message: 'Buku berhasil ditemukan',
    data: {
      book
    }
  })
}

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, readingPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, readingPage, finished, reading, insertedAt, updatedAt
  }

  if (!name) {
    return resolveForFailedResponseWith(h, {
      code: 400,
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
  }

  if (readPage > pageCount) {
    return resolveForFailedResponseWith(h, {
      code: 400,
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  books.push(newBooks)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (!isSuccess) {
    return resolveForFailedResponseWith(h, {
      code: 400,
      message: 'Buku gagal ditambahkan'
    })
  }

  return resolveForSuccessResponseWith(h, {
    code: 201,
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  })
}

const updateBook = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, readingPage, reading } = request.payload

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    return resolveForFailedResponseWith(h, {
      code: 404,
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
  }

  if (!name) {
    return resolveForFailedResponseWith(h, {
      code: 400,
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
  }

  if (readPage > pageCount) {
    return resolveForFailedResponseWith(h, {
      code: 400,
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    readingPage,
    reading,
    updatedAt
  }

  return resolveForSuccessResponseWith(h, {
    message: 'Buku berhasil diperbarui'
  })
}

const deleteBook = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    return resolveForFailedResponseWith(h, {
      code: 404,
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
  }

  books.splice(index, 1)

  return resolveForSuccessResponseWith(h, {
    message: 'Buku berhasil dihapus'
  })
}

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
}
