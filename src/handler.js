const books = require('./bookshelf');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
    const { name = '', year = 0, author = '', summary = '', publisher = '', pageCount = 0, readPage = 0, reading = false } = request.payload; 

    if(name === ''){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    const id = nanoid(16);
    
    const insertedAt = new Date().toISOString();
    
    const updatedAt = insertedAt;
    
    let finished = false;
    
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }else if(pageCount === readPage){
        finished = true;
    };
    
    const newBook = {
       id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((books) => books.id === id).lenght > 0;

   if(isSuccess != 0){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    };
    const response = h.response({
        status: 'fail',
        message: 'unreachable'
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books,
    },
});

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    
    const book = books.filter((b) => b.id === id)[0];

    if(book != undefined){
        return {
            status: 'success',
            data: {
                books,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        messagae: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    
    const { name = '', year = 0, author = '', summary = '', publisher = '', pageCount = 0, readPage = 0, reading = false } = request.payload;

    if(name === null){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    };

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    
    if(index != 1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        messagae: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books.slice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
        response.code(200);
        return response;
    };

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
    deleteBookByIdHandler
};