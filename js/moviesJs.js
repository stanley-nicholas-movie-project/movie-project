"use strict"

const dbURL = "https://pine-inexpensive-honeysuckle.glitch.me/movies";

let selectedId;
let selectedTitle;
let selectedGenre;
let selectedPlot;
let selectedRating;
let selectedDirector;
let movies = [];
let uniqueId;
let sortedMovies;
let searchRating = "all";



//only returns movies with IDs
function setMovies(){
    $(`#moviesList`).addClass(`blur`);
    $(`#loadingBox`).removeClass("invisible");
    setTimeout(() => {
        fetch(`${dbURL}`).then((response) => response.json()).then((data) => {
            $(`#moviesList`).removeClass(`blur`);
            $(`#loadingBox`).addClass("invisible");
            let fData = data.filter((m) => {
                return (m.id != null || m.id !== undefined);
            }); movies = fData;
            setUniqueId();
            console.log(uniqueId);
            return fData;
        }).then(() => {displayMovies(movies);
        });
    }, 2000);
}

// function getPosters(){
//     $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?",
//         New
//     11:08
//     $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?", function(json) {
//         if (json != "Nothing found."){
//             console.log(json);
// }

function displayMovies(movies){
    $(`#movieCards`).empty();
    movies.forEach((m) => {
        console.log(m.rating);
        let stars = ratingStars(m.rating);
        $(`#movieCards`).append(`<div class="col my-3 ">
                <div class="card click-me" id="${m.id}">
                    <img src="${m.poster}" class="card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${m.title}</h5>
                        <p class="card-text">${m.plot}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Genre: ${m.genre}</li>
                        <li class="list-group-item">Director: ${m.director}</li>
                        <li class="list-group-item">Rating: ${m.rating} <img id="ratingStarsImg" src=${stars} class="img-fluid" alt=""></li>
                    </ul>
                    <div class="card-body d-flex justify-content-between">
                        <a href="#" class="btn btn-primary editMovieBtn" data-bs-toggle="modal" data-bs-target="#editMovieModal">Edit Movie</a>
                        <button type="button" class="btn btn-danger deleteMovieBtn " data-bs-toggle="modal" data-bs-target="#deleteMovieModal">Delete Movie</button>
                    </div>
                </div>
            </div>`)
    })
    updateEventHandlers()};

setMovies();


//functions for sorting

function searchByTitle(searchValue){
    sortedMovies = movies;
    if (searchRating !== "all"){
        sortedMovies = sortedMovies.filter((e) =>{
            if(e.rating === searchRating){
                return true;
            }
        })
    }
    if(searchValue !== "") {
        let filter = sortedMovies.filter((m) => {
            if (m.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return true;
            }
        });
        displayMovies(filter)
    }else {
        displayMovies(sortedMovies)
    };
}

$(`#movieSearchByTitle`).keyup(function(){
    searchByTitle($(this).val())
})

$(`#movieSearchByRating`).change(function(){
    searchRating = $(this).val();
    searchByTitle($(`#movieSearchByTitle`).val());
    
})


$('#confirmDelete').click(function(){
    deleteMovie(selectedId);
})


//listener to grab info when clicking on a card
function updateEventHandlers(){
    $(`.click-me`).click(function(event){
        $(`#toDeleteTitle`).empty();
        selectedId = $(this).attr('id');
        movies.forEach((m) => {
            if(m.id == selectedId) {
                selectedTitle = m.title;
                selectedGenre = m.genre;
                selectedPlot = m.plot;
                selectedRating = m.rating;
                selectedDirector = m.director;
            }
        });
        $(`#toDeleteTitle`).append(`<p>Do you want to delete ${selectedTitle}?</p>`)
    })
    
    $(".editMovieBtn").click(function(){
        $(`#editMovieModal`).addClass(`blur`);
        $(`#loadingBox`).removeClass("invisible");
        setTimeout(() => {
            editModalPreload();
            $(`#editMovieModal`).removeClass(`blur`);
            $(`#loadingBox`).addClass("invisible");
        }, 2000);
    })
};

//function to delete a movie
function deleteMovie(id){
    fetch(`${dbURL}/${id}`, {
        method: `DELETE`
    }).then(() => {
        setMovies();
    })
}

//function to open edit modal with pre-loaded values
function editModalPreload(){
    $("#editMovieTitle").val(selectedTitle)
    $("#editMovieGenre").val(selectedGenre)
    $("#editMovieRating").val(selectedRating)
    $("#editMovieDirector").val(selectedDirector)
    $("#editMovieDescription").val(selectedPlot)
    $("#editRatingOutput").val(selectedRating)
}

function sendEditedMovie(){
    let editedMovie = {
        title: $("#editMovieTitle").val(),
        genre: $("#editMovieGenre").val(),
        rating: $("#editMovieRating").val(),
        director: $("#editMovieDirector").val(),
        plot: $("#editMovieDescription").val(),
        id: selectedId,
    }
    changeData(editedMovie.id, editedMovie.title, editedMovie.director, editedMovie.rating, editedMovie.genre, editedMovie.plot)
}


//function to update a movie object on the db
function changeData( id, title, director, rating, genre, plot){
    let poster;
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    fetch("http://www.omdbapi.com/?apikey=91940b5a&t="+ title, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.Error === "Movie not found!") {
                
                poster = "../assets/N:A.jpeg"
            }
            else{
                poster = result.Poster
            }
            
        }).then(()=>{
        let raw =
            {
                title: title,
                director: director,
                rating: rating,
                genre: genre,
                plot: plot,
                id: id,
                poster: poster,
            }
        ;
    
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(raw),
        };
    
        fetch(`https://pine-inexpensive-honeysuckle.glitch.me/movies/${selectedId}`, requestOptions)
            .then( response => setMovies());
            
    })
    
    
    
}

$("#editMovieSubmit").click(function(){
    console.log("submitted")
    sendEditedMovie();
})




//function to create a new movie object
function addNewMovie(url, title, director, rating, genre, plot){
    let poster;
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    fetch("http://www.omdbapi.com/?apikey=91940b5a&t="+ title, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.Error === "Movie not found!") {
        
               poster = "../assets/N:A.jpeg"
            }
            else{
                poster = result.Poster
            }
        
        })
        .then(() => {
            let raw =
                {
                    poster: poster,
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
        }).then(()=>{
        $("#newMovieTitle").val("")
           $("#newMovieGenre").val("")
            $("#movieRating").val("")
           $("#newMovieDirector").val("")
          $("#newMovieDescription").val("")
    })
    
    
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
    if (movies.length > 0){
        let temp = movies.filter((n) => n.id);
        temp.sort();
        uniqueId = temp[temp.length - 1].id +1;
    }
    else{
        uniqueId = 1;
    }
    
}

//js for movie rating slider number
document.addEventListener("input",
    function(e) {
        if (document.forms.addMovieForm == e.target.form)
            e.target.form.output.value =
                parseFloat(e.target.form.movieRating.value);
    }, true);

document.addEventListener("input",
    function(e) {
        if (document.forms.editMovieForm == e.target.form)
            e.target.form.output.value =
                parseFloat(e.target.form.editMovieRating.value);
    }, true);


//function for ratings stars
function ratingStars(rating){
    if(rating == 5){
        return "../assets/5stars.png"
    }else if(rating == 4.5){
        return "../assets/4_5stars.png"
    }else if(rating == 4){
        return "../assets/4stars.png"
    }else if(rating == 3.5){
        return "../assets/3_5stars.png"
    }else if(rating == 3){
        return "../assets/3stars.png"
    }else if(rating == 2.5){
        return "../assets/2_5stars.png"
    }else if(rating == 2){
        return "../assets/2stars.png"
    }else if(rating == 1.5){
        return "../assets/1_5stars.png"
    }else if(rating == 1){
        return "../assets/1star.png"
    }else if(rating == .5){
        return "../assets/halfStar.png"
    }else if(rating == 0) {
        return "../assets/0stars.png"
    }
}
