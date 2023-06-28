const movieSearchBox = document.getElementById('search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
window.arr_fav = [];
const fav_load = document.getElementById('fav-load');

// Fetch movies data from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

// Function to find movies and handle the on key press in the search bar
function findMovies() {
  let searchTerm = movieSearchBox.value;
  console.log(searchTerm);
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

// Function to append all the search results to the list
function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
    movieListItem.classList.add('search-list-item');
    let moviePoster = movies[idx].Poster != "N/A" ? movies[idx].Poster : "image_not_available.png";

    movieListItem.innerHTML = `
      <div class="search-list-item-images">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-details">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
      </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

// Loading the details of a particular Movie
function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = "";
      const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
      const movieDetails = await result.json();
      console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

// Displaying the Details of that Movie
function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Ratings: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
        <li><button class="fav" id="fav">Add to Favourites</button></li>
      </ul>
      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors"><b>Actors: </b>${details.Actors}</p>
      <p class="plot"><b>Plot:</b> ${details.Plot}</p>
      <p class="language"><b>Language:</b> ${details.Language}</p>
      <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
  `;

  attachFavButtonListener(details);
}

// Attach event listener to the "Add to Favourites" button
function attachFavButtonListener(details) {
  const favButton = document.getElementById('fav');
  if (favButton) {
    favButton.addEventListener('click', function() {
        window.arr_fav.push(details);
        console.log(window.arr_fav);
        favButton.classList.add('hide');
    });
  }
}

fav_load.addEventListener('click',function(){
    const bottom = document.getElementById('bottom');
    bottom.classList.add('hide');
    const favList = document.getElementById('fav-list');
    favList.classList.remove('hide');
    favList.innerHTML = "";
    arr_fav.forEach((a)=>{
        let x = document.createElement('div');
        x.innerHTML = `
        <div class="fav-list-item">
            <img src="${a.Poster}" alt="">
            <div>
                <h1>${a.Title}</h1>
                <p>${a.Plot}</p>
            </div>
        </div>
        `;
        favList.append(x);


    }) 
})




movieSearchBox.addEventListener('keypress', findMovies);
