const books = require('./books');
const { nanoid } = require('nanoid');
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  //cek Name jika kosong
  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: false,
      reading,
      insertedAt,
      updatedAt,
    };

    //   validasi page start
    if (pageCount === readPage) {
      const hasFinish = { ...newBook, finished: true };
      books.push(hasFinish);
    } else if (pageCount > readPage) {
      books.push(newBook);
    } else if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    //validasi page end
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name } = request.query;
  // const book = books.filter((n) => n.name === name);
  if (name !== undefined) {
    const filteredBook = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const searchBook = (array, search) => {
      return array.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    };

    const result = searchBook(filteredBook, name);
    // console.log(result);
    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    // console.log(filteredBook.length);
    return response;
  }
  const filteredBook = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: filteredBook,
    },
  });
  return response;
};
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  //   console.log(bookId);
  const book = books.filter((n) => n.id === bookId)[0];
  //   console.log(book);
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  //   console.log('awl', bookId);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  //cek Name jika kosong

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else {
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((note) => note.id === bookId);
    // console.log(index);
    if (index !== -1) {
      if (pageCount === readPage) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished: true,
          reading,
          updatedAt,
        };
      } else if (pageCount > readPage) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished: false,
          reading,
          updatedAt,
        };
      } else if (pageCount < readPage) {
        const response = h.response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
      }
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((note) => note.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
