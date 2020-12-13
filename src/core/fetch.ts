import fetch from 'node-fetch'
import C from '../config'

export interface RawItemDataInterface {
  id: string
  volumeInfo: {
    title: string
    authors: string[]
    description: string
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
    previewLink: string
  }
}

export interface RawBookDataInterface {
  items: RawItemDataInterface[]
}

async function fetchBooks<T> (): Promise<T> {
  const url = `https://www.googleapis.com/books/v1/users/${C.BOOKS_UID}/bookshelves/1001/volumes?key=${C.BOOKS_API_KEY}`

  const response = await fetch(url)

  return await response.json()
}

export default fetchBooks
