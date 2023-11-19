import './App.css'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies'
import { useEffect, useState, useRef, useCallback } from 'react'
import debounce from "just-debounce-it"

function useSearch () {
  const [search, updateSearch] = useState("")
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {

    if (isFirstInput.current) {
      isFirstInput.current = search === "" 
      return
    }

    if (search == "") {
        setError("Escribe el nombre de la pelicula")
        return
      }
  
    if (search.match(/^\d+$/)) {
      setError("Oh... Debe poner letras de en ves de numeros")
      return
    }
  
    if (search.length < 3) {
      setError("Debe ser mayor a tres caracteres")
      return
    }
  
    setError(null)
    }, [search])
  
    return { search, updateSearch, error}
}

function App() { 

  const [ sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })


  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log("sear", search)
      getMovies({ search })
    }, 300)
    ,[getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies()
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event)  => {
    const newSearch = event.target.value
      updateSearch(newSearch)
      debouncedGetMovies(newSearch)
  } 

  return (
   <div className='page'>
 
    <header>
    <h1>Buscador de pelis</h1>
    <form className='form'onSubmit={handleSubmit}>
    <input 
    style={{
      border: "1px solid transparent"
    }} onChange={handleChange} value={search} name='query' placeholder='Avengers, star wars , the matrix...' 
    />
    <input type="checkbox" onChange={handleSort} checked={sort} />
    <button type='submit'>buscar</button>
    </form>
    {error && <p style={{ color: "red" }}>{error}</p>}
    </header>

    <main>
      {
        loading ? <p>cargando.. </p> :<Movies movies={movies} />
      }
    </main>
   </div>
  )
}

export default App
