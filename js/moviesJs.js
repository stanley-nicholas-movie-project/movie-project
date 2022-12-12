"use strict"

const dbURL = "https://pine-inexpensive-honeysuckle.glitch.me/movies";

let selectedId;
let selectedTitle;
let movies = [];
let uniqueId;



//only returns movies with IDs
function setMovies(){
    fetch(`${dbURL}`).then((response) => response.json()).then((data) => {
        $(`#moviesList`).removeClass(`blur`);
        $(`#loadingBox`).addClass("invisible");
        let fData = data.filter((m) => {
            return (m.id != null || m.id !== undefined);
        }); movies = fData;
        setUniqueId();
        console.log(uniqueId);
        return fData;
    }).then(() => {displayMovies();
    });
}

// function getPosters(){
//     $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?",
//         New
//     11:08
//     $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?", function(json) {
//         if (json != "Nothing found."){
//             console.log(json);
// }

function displayMovies(){
    $(`#movieCards`).empty();
    console.log(movies);
    movies.forEach((m) => {
        $(`#movieCards`).append(`<div class="col my-3 ">
                <div class="card click-me" id="${m.id}">
                    <img src="https://i.ebayimg.com/images/g/GtEAAOSw1W9eN1cY/s-l1600.jpg" class="card-img-top fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${m.title}</h5>
                        <p class="card-text">${m.plot}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Genre: ${m.genre}</li>
                        <li class="list-group-item">Director: ${m.director}</li>
                        <li class="list-group-item">Rating: ${m.rating}</li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="btn btn-primary">Edit Movie</a>
                        <button type="button" class="btn btn-danger deleteMovieBtn" data-bs-toggle="modal" data-bs-target="#deleteMovieModal">Delete Movie</button>
                    </div>
                </div>
            </div>`)
    })
updateEventHandlers()};

setMovies();

//listener to grab info when clicking on a card
function updateEventHandlers(){
    $(`.click-me`).click(function(event){
        $(`#toDeleteTitle`).empty();
        selectedId = $(this).attr('id');
        movies.forEach((m) => {
            if(m.id == selectedId) {
                selectedTitle = m.title;
            }
        });
        $(`#toDeleteTitle`).append(`<p>Do you want to delete ${selectedTitle}</p>`)
    })
    $('#confirmDelete').click(function(){
        deleteMovie(selectedId);
    })
};

//function to delete a movie
function deleteMovie(id){
    fetch(`${dbURL}/${id}`, {
        method: `DELETE`
    }).then(() => {
        setTimeout(() => {
            //loading screen
        }, 500);
        setMovies();
    })
}

//function to update a movie object on the db
function changeData(url, id, title, director, rating, genre, plot){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = [
        {
            "title": title,
            "director": director,
            "rating": rating,
            "genre": genre,
            "plot": plot,
            "id": id
        }
    ];

    let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`https://pine-inexpensive-honeysuckle.glitch.me/movies/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//function to create a new movie object
function addNewMovie(url, title, director, rating, genre, plot){

    let raw =
        {
            title: title,
            director: director,
            rating: rating,
            genre: genre,
            plot: plot,
            id: uniqueId,
        }
    ;

    let requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(raw),
    };
    console.log(raw);


    fetch(url, requestOptions)
        .then( response => setMovies());
}

function sendNewMovie(){
    let newMovie = {
        title: $("#newMovieTitle").val(),
        genre: $("#newMovieGenre").val(),
        rating: $("#movieRating").val(),
        director: $("#newMovieDirector").val(),
        plot: $("#newMovieDescription").val(),
    }
    addNewMovie(dbURL, newMovie.title, newMovie.director, newMovie.rating, newMovie.genre, newMovie.plot)
}

$("#addMovieSubmit").click(function(){
    console.log("submitted")
    sendNewMovie();
})

//function for a uniqueId
function setUniqueId(){
    let temp = movies.filter((n) => n.id);
    temp.sort();
    uniqueId = temp[temp.length - 1].id +1;
}

//js for movie rating slider number
document.addEventListener("input",
    function(e) {
        if (document.forms.addMovieForm == e.target.form)
            e.target.form.output.value =
                parseFloat(e.target.form.movieRating.value);
    }, true);