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

async function fetchBooksByCategory (category: string): Promise<RawItemDataInterface[]> {
  const maxResults = 40
  const url = `https://www.googleapis.com/books/v1/users/${C.BOOKS_UID}/bookshelves/${category}/volumes?maxResults=${maxResults}&key=${C.BOOKS_API_KEY}`

  const inner = async (startIndex: number): Promise<RawItemDataInterface[]> => {
    const response = await fetch(`${url}&startIndex=${startIndex}`)

    const { items }: RawBookDataInterface = await response.json()

    if (items.length >= maxResults) {
      return [...items, ...(await inner(startIndex + maxResults))]
    }

    return items
  }

  return await inner(0)
}

export default fetchBooksByCategory
