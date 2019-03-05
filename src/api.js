import axios from 'axios';

let searchBooksSource;

let url = 'https://api.mylibrary.cool';

if(process.env.REACT_APP_USE_LOCAL_API) {
  url = 'http://localhost:3001';
}


export const searchBooks = (query) => {
  if(searchBooksSource) {
    searchBooksSource.cancel();
  }
  searchBooksSource = axios.CancelToken.source();

  return axios.get(`${url}/books`, {
    params: {
      q: query
    },
    cancelToken: searchBooksSource.token
  })
    .then((response) => {
      searchBooksSource = null;
      return response.data;
    })
    .catch(error => {
      searchBooksSource = null;
      if (!axios.isCancel(error)) {
        return Promise.reject(error);
      } else {
        return { canceled: true };
      }
    });
}

export const getMyBooks = () => {
  return axios.get(`${url}/my-books`)
    .then(response => response.data);
}

export const addToMyBooks = (book) => {
  return axios.post(`${url}/my-books`,
    {
      title: book.best_book.title,
      author: book.best_book.author,
      imageUrl: book.best_book.image_url,
      goodReadsId: book.best_book.id,
      publicationYear: book.original_publication_year,
      goodReadsRating: book.average_rating
    }
  )
    .then((response) => {
      return response.data;
    });
}