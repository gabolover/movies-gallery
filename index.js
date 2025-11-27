const apiKey = "f2e1c256";
import moviesResponse from "./movies.json" with { type: "json" };
import noResults from "./no-results.json" with { type: "json" };
const url = `http://www.omdbapi.com/?apikey=${apiKey}`;
//===HTML ELEMENTS===
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const containerMovies = document.getElementById("movie-container");
const modalContent = document.getElementById("modal-content");
const modal = document.getElementById("modal");
modal.classList.add("hidden");
const movies = moviesResponse.Search;
const hasMovies = movies?.length > 0;
movies.filter((movie) => movie.Poster);
console.log("hola");

const searchMovie = async () => {
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue === "") return;
  try {
    const response = await fetch(`${url}&s=${searchValue}`);
    const data = await response.json();
    if (data.Response === "True") {
      const filterMovies = data.Search.filter((movie) =>
        movie.Title.toLowerCase().includes(searchValue),
      );
      renderMovies(filterMovies);
    } else {
      renderMovies([]);
    }
  } catch {
    console.error("error");
    renderMovies([]);
  }
};

const renderMovies = (moviesList = movies) => {
  if (!moviesList.length)
    return (containerMovies.innerHTML = "<p>Movie not found</p>");
  const list = moviesList
    .map(
      (movie) => `
    <div class="card">
      <h2 class="card-title">${movie.Title}</h2>
      <img src="${movie.Poster}">
      <p>Year: ${movie.Year}</p>
      <p>Genre: ${movie.Type}</p>
      <button data-id="${movie.imdbID}" class="show-more">Show More</button>
    </div>
    `,
    )
    .join("");
  containerMovies.innerHTML = list;
};
const getOneMovie = async (e) => {
  if (e.target.classList.contains("show-more")) {
    const movieId = e.target.dataset.id;
    try {
      console.log(movieId);
      const response = await fetch(`${url}&i=${movieId}`);
      const data = await response.json();
      console.log(data);
      if (data.Response === "False") {
        console.log("movie not found");
      } else {
        modal.classList.remove("hidden");
        modal.classList.add("modal");
        modalContent.innerHTML = `<div class="card">
          <h2 class="card-title">${data.Title}</h2>
          <img src="${data.Poster}">
          <p>Year: ${data.Year}</p>
          <p>Genre: ${data.Type}</p>
        </div>`;
      }
    } catch {
      console.log("error");
    }
  }
  console.log(e.target);
};
//===Listeners===
searchButton.addEventListener("click", searchMovie);
document.addEventListener("DOMContentLoaded", () => renderMovies());

containerMovies.addEventListener("click", getOneMovie);

modal.addEventListener("click", (e) => {
  // e.target es el elemento que se clickeó
  // Si clickeaste sobre el overlay (modal) y no sobre el contenido
  if (e.target === modal) {
    modal.classList.remove("modal");
    modal.classList.add("hidden");
    console.log(e.target);
  }
});
