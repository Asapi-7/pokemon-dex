import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPokemonData = async () => {
      //すべてのポケモンデータを取得
      let res = await getAllPokemon(initialURL);  
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      //console.log(res.next);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setTotalPageCount(Math.ceil(res.count / itemsPerPage));
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchPokemonData();
  } , []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handlePageChange = async (pageNumber) => {
    if(pageNumber === currentPage) return;
    setLoading(true);
    const offset = (pageNumber - 1) * itemsPerPage;
    const url = `${initialURL}?offset=${offset}&limit=${itemsPerPage}`;
    const data = await getAllPokemon(url);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setCurrentPage(pageNumber);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const handleNextPage = async () => {
    if(!nextURL) return;
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setCurrentPage(currentPage + 1);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const handlePrevPage = async () => {
    if(!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setCurrentPage(currentPage - 1);
    setLoading(false);
    window.scrollTo(0,0);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if(totalPageCount <= maxPagesToShow){
      startPage = 1;
      endPage = totalPageCount;
    }else{
      if(currentPage <= Math.floor(maxPagesToShow / 2) + 1){
        startPage = 1;
        endPage = maxPagesToShow;
      }else if(currentPage + Math.floor(maxPagesToShow / 2) > totalPageCount){
        startPage = totalPageCount - maxPagesToShow +1;
        endPage = totalPageCount;
      }else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow/2);
      }
    }

    if(startPage > 1){
      pageNumbers.push(1);
      if(startPage > 2){
        pageNumbers.push('...');
      }
    }

    for(let i = startPage; i <= endPage; i++){
      pageNumbers.push(i);
    }

    if(endPage < totalPageCount){
      if(endPage < totalPageCount - 1){
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPageCount);
    }
    return pageNumbers;
  };

  return (
    <>
    <Navbar />
  <div className="App">
    {loading ? (
      <h1> ロード中・・・</h1>
    ) : (
      <>
        <div className="pokemonCardContainer">
          {pokemonData.map((pokemon, i) => {
            return <Card key={i} pokemon={pokemon}/>;
          })}
        </div>
        <div className="btn">
          <button onClick={handlePrevPage}>前へ</button>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={page === currentPage ? 'active' : ''}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          <button onClick={handleNextPage}>次へ</button>
        </div>
      </>
    )}
  </div>
  </>
  );
}

export default App;
