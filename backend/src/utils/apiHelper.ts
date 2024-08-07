import axios, {AxiosInstance} from "axios";

const openLibraryApi: AxiosInstance = axios.create({
  baseURL: 'https://openlibrary.org/search.json'
});

interface BookResponse {
  title: string,
  author: Array <string>,
  published_year: number,
  publisher: Array <string>,
  isbn: Array <string>,
  language: Array <string>,
  number_of_pages: number,
  cover_url?: string
}
export const getBooksByTitle  = async (title: string): Promise <Array <BookResponse> | undefined > => {
  try {
    console.log(title)
    const { data } = await openLibraryApi.get(`/`, {params: {title, limit: 15}});
    return data.docs.map((book: any) => { console.log(Object.keys(book)) 
      return {
        //coverId: book.cover_i,
        title: book.title, 
        author: book.author_name,
        published_year: book.first_publish_year,
        publisher: book.publisher,
        isbn: book.isbn,
        language: book.language,
        number_of_pages: book.number_of_pages_median,
        ...(book.cover_i ? {cover_url: `https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`} : { })
      } as BookResponse})
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}



