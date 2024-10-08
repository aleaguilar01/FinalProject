import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";

export interface IBook extends IBookUser {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publishedYear?: number;
  publisher?: string;
  imageUrl: string;
  rating?: number;
  firstSentence: string;
  numberOfPages?: number;
  createdAt: Date;
  genres?: Array<{ id: string; name: string }>;
  relatedBooks?: Array<Omit<IBook, "relatedBooks">>;
  bookComments?: Array<IComment>
}

export interface IComment {
  user: {
    email: string
  };
  id: string;
  comment: string;
}
export interface IBookUser {
  isFavorite?: boolean;
  readingStatus: string;
  myRating?: number;
  comments?: number;
}

interface IBookContext {
  myBooks: Array<IBook>;
  favoriteBooks: Array<IBook>;
  activeBooks: Array<IBook>;
  isLoading: boolean;
  refetch: VoidFunction;
  currentBook?: IBook;
  selectCurrentBook: (bookId?: string) => void;
}

const BookContext = createContext<IBookContext>({
  myBooks: [],
  isLoading: false,
  refetch: () => {},
  favoriteBooks: [],
  activeBooks: [],
  currentBook: undefined,
  selectCurrentBook: () => {},
});

const BookProvider = ({ children }) => {
  const [currentBookId, setCurrentBookId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [myBooks, setData] = useState<Array<IBook>>([]);

  const api = useApi();

  const fetchData = async () => {
    api
      .get("/book")
      .then((res) => {
        const mapped = res.data.map(({ createdAt, ...rest }) => ({
          ...rest,
          createdAt: new Date(createdAt),
        }));
        setData(mapped);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  const favoriteBooks = useMemo(() => {
    return myBooks.filter((book) => book.isFavorite && !!book.imageUrl);
  }, [myBooks]);

  const activeBooks = useMemo(() => {
    return myBooks.filter((book) => book.readingStatus === "READING");
  }, [myBooks]);

  const currentBook = useMemo(() => {
    if (!currentBookId) return undefined;
    return myBooks.find((book) => book.id === currentBookId);
  }, [currentBookId, myBooks]);

  return (
    <BookContext.Provider
      value={{
        isLoading,
        myBooks,
        refetch,
        favoriteBooks,
        selectCurrentBook: (bookId?: string) => setCurrentBookId(bookId),
        currentBook,
        activeBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
export const useBook = () => {
  return useContext(BookContext);
};

export default BookProvider;
