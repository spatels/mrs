// declare a variable to store user input
let title;
// declare variable to store available movie titles from title.json
let content = null;
// declare variable to store error message
let errorMessage;

// create function to load title.json into variable content
let loadAvailableMovies = (function() {
$.ajax({
  'async': false,
  'global': false,
  'url': "data/titles.json",
  'dataType': "json",
  'success': function(data) {
    content = data;
  }
});
return content;
})();

// auto complete search
$(document).ready(function () {
 
  $('.ui.search')
      .search({
        source: loadAvailableMovies
      });

});

// function to return userInput ()
    function returnTitle(){
  title = document.getElementById("userInput").value;
}

// function to call api to fetch the recommendations
async function search() {
title = document.getElementById("userInput").value.trim();
const url = "http://mrsapi.patel.us/recommend?title=" + encodeURIComponent(`${title}`);


// error message to display in toaster based on conditions
if(title == ""){
  errorMessage =`You forgot to type in the movie. Tell us a movie you enjoyed and we will create a personalized movie watchlist for you!`;
}  else {
  errorMessage =`We can't seem to give you any recommendations for ${title.bold()} because we do not have this movie in our system. Please try another movie!`;
};

// getting data and showing results on UI or displaying error if not results.
try {
  // document.getElementById("output").value = "Fetching...";
  const res = await fetch(url);
  if(!res.ok) throw new Error(errorMessage);
  const data = await res.json();
  // document.getElementById("output").value = JSON.stringify(data, null, 2);
  movieList = JSON.stringify(data, null, null);
  //movieListCleaned=movieList.replace(/"(\w+)"\s*:/g, '$1:');
  movieListParsed = JSON.parse(movieList)
  // display the data on the ui
  document.getElementById("recommendations").innerHTML = `
${movieListParsed.map(movieTemplate).join('')}
  `;
  // display error if no results
} catch(err) {
  $('body')
  .toast({
    class: 'red',
    showIcon: true,
    showIcon: 'frown open',
    displayTime: 0,
    closeIcon: true,
    title: 'Oops!',
    message: errorMessage
  })
;;
}
}

// creating functions to dynamically show movie recommendations on the ui

// function to iterate through genres
function genres(categories){
  return`
  ${categories.map(function(category){
    return `<div class="ui label genres">${category}</div>`
  }).join('')}</div>
  `
}

// functions to check if poster url is null
function poster(posterPath){
  if(posterPath == null){
    path ="assets/images/noposter.jpg"
  }  else {
    path = posterPath
  };
  return path
  }

// building the section to dispaly recommended movies as card
function movieTemplate(movie){
  return `
  <div class="ui raised  text container segment">
    <div class="ui divided items">
      <div class="item">
          <div class="image poster_url">
            <img src= ${poster(movie.poster_url)}>
          </div>
          <div class="content">
            <h2 class="ui medium header formated_title">
                ${movie.formated_title}
            </h2>
            <div class="meta">
                <span class="cinema release_date">
                <b>Release Date:</b> ${movie.release_date} </span>
            </div>
            <div class="meta">
                <span class="cinema runtime_in_minutes">
                <b>Runtime:</b> ${movie.runtime_in_minutes} Minutes </span>
            </div>
            <div class="meta">
                <span class="cinema average_rating">
                <b>Average Rating:</b> ${movie.average_rating}/10 </span>
            </div>
            <div class="description overview">
                <h4> <b>Movie Plot</b></h4>
                <p> ${movie.overview}</p>
            </div>
            <div class="extra">
                ${movie.genres ? genres(movie.genres) : ''}
            </div>
          </div>
      </div>
    </div>
  </div>
  `
}