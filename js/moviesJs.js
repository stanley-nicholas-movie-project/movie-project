"use strict"

const dbURL = "https://pine-inexpensive-honeysuckle.glitch.me/movies";

let selectedId;
let selectedTitle;
let selectedGenre;
let selectedPlot;
let selectedRating;
let selectedDirector;
let selectedPoster;
let movies = [];
let randomOrder = [];
let uniqueId;
let sortedMovies;
let searchRating = "all";
let searchGenre = "all";


// poster = "../assets/N:A.jpeg"

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
            randomOrder = movies;
            setUniqueId();
            return fData;
        }).then(() => {displayMovies(movies);
        });
    }, 2000);
}


//function to build the cards for the movies
function displayMovies(movies){
    $(`#movieCards`).empty();
    movies.forEach((m) => {
        let stars = ratingStars(m.rating);
        let imdbStars = ratingStars(m.iRating);
        $(`#movieCards`).append(`<div class="col my-3 ">
                <div class="card click-me h-100" id="${m.id}">
                    <img src="${m.poster}" class="card-img-top img-fluid" alt="">
                    <div class="card-body">
                        <h4 class="card-title">${m.title}</h4>
                        <p class="card-text">${m.plot}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Genre: ${m.genre}</li>
                        <li class="list-group-item">Director: ${m.director}</li>
                        <li class="list-group-item">My Rating: ${m.rating} <img id="ratingStarsImg" src=${stars} class="img-fluid" alt=""></li>
                        <li class="list-group-item">IMDb Rating: ${m.iRating} <img id="ratingStarsImg" src=${imdbStars} class="img-fluid" alt=""></li>
                    </ul>
                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-primary editMovieBtn" data-bs-toggle="modal" data-bs-target="#editMovieModal">Edit Movie</button>
                        <button type="button" class="btn btn-danger deleteMovieBtn " data-bs-toggle="modal" data-bs-target="#deleteMovieModal">Delete Movie</button>
                    </div>
                </div>
            </div>`)
    })
    updateEventHandlers()};


//displays cards on the page on load
setMovies();


//function for filtering
function searchByTitle(searchValue){
    sortedMovies = movies;
    if (searchRating !== "all"){
        sortedMovies = sortedMovies.filter((e) =>{
            if(e.rating === searchRating){
                return true;
            }
        })
    }
    if (searchGenre !== "all"){
        sortedMovies = sortedMovies.filter((e) =>{
            if(e.genre === searchGenre){
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


//All page listeners
$(`#movieSearchByTitle`).keyup(function(){
    searchByTitle($(this).val())
})

$(`#movieSearchByRating`).change(function(){
    searchRating = $(this).val();
    searchByTitle($(`#movieSearchByTitle`).val());
})

$(`#movieSearchByGenre`).change(function(){
    searchGenre = $(this).val();
    searchByTitle($(`#movieSearchByTitle`).val());
})

$('#confirmDelete').click(function(){
    deleteMovie(selectedId);
})

$("#editMovieSubmit").click(function(){
    sendEditedMovie();
})

$('#sortTitleBtn').click(function(){
    resetSortByRating();
    sortByTitle();
})

$(`#sortRatingBtn`).click(function(){
    resetSortByTitle();
    sortByRating();
})

$("#addMovieSubmit").click(function(){
    sendNewMovie();
})

$(`#addNewBtn`).click(function(){
    $(`#autofillHelp`).remove();
    $(`.reset`).val("");
    $(`#previewImg`).attr("src", "");
    $("#ratingBadge").removeClass (function (index, className) {
        return (className.match (/(^|\s)rating\S+/g) || []).join(' ');
    }).addClass("rating25").val(2.5);
    $(`#addMovieSubmit`).addClass("invisible");
})

$(`#resetSort`).click(function(){
    $(`#movieSearchByTitle`).val("");
    $('#movieSearchByRating').val("all")
    $('#movieSearchByGenre').val("all")
    searchGenre = "all";
    searchRating = "all";
    resetSortByTitle();
    resetSortByRating();
    nameDefault = false;
    nameZ = true;
    sortByTitle();
    ratingDefault = false;
    ratingUp = true;
    sortByRating();
})


//function for sorting by title
let nameDefault = true;
let nameA = false;
let nameZ = false;

function resetSortByTitle(){
    nameDefault = true;
    nameA = false;
    nameZ = false;
    $(`#sortTitleType`).text(" - ")
}

function sortByTitle(){
    if (nameDefault){
        $(`#sortTitleType`).text("A-Z")
        nameDefault = false;
        nameA = true;
        movies = movies.sort((a,b) =>{
            if (a.title.toLowerCase() < b.title.toLowerCase()){
                return -1;
            }
            else if (a.title.toLowerCase() > b.title.toLowerCase()){
                return +1;
            }
            else if (a.title.toLowerCase() === b.title.toLowerCase()){
                return 0;
            }
        })
    }
    else if (nameA)
        {
            $(`#sortTitleType`).text("Z-A")
            nameA = false;
            nameZ = true;
            movies = movies.sort((a,b) =>{
                if (a.title.toLowerCase() > b.title.toLowerCase()){
                    return -1;
                }
                else if (a.title.toLowerCase() < b.title.toLowerCase()){
                    return +1;
                }
                else if (a.title.toLowerCase() === b.title.toLowerCase()){
                    return 0;
                }
            })
    }
    else if (nameZ)
        {
            $(`#sortTitleType`).text(" - ")
            nameZ = false;
            nameDefault = true;
            movies = movies.sort((a,b) =>{
                if(a.id < b.id){
                    return -1;
                } else if (a.id > b.id){
                    return +1;
                }
            })
    }
        searchByTitle($(`#movieSearchByTitle`).val());
}


//function for sorting by rating
let ratingDefault = true;
let ratingUp = false;
let ratingDown = false;

function resetSortByRating(){
    ratingDefault = true;
    ratingUp = false;
    ratingDown = false;
    $(`#sortRatingType`).text(" - ")
}

function sortByRating(){
    if (ratingDefault){
        $(`#sortRatingType`).text("5-1")
        ratingDefault = false;
        ratingDown = true;
        movies = movies.sort((a,b) =>{
            if (a.rating < b.rating){
                return +1;
            }
            else if (a.rating > b.rating){
                return -1;
            }
            else if (a.rating === b.rating){
                return 0;
            }
        })
    }
    else if (ratingDown)
    {
        $(`#sortRatingType`).text("1-5")
        ratingDown = false;
        ratingUp = true;
        movies = movies.sort((a,b) =>{
            if (a.rating > b.rating){
                return +1;
            }
            else if (a.rating < b.rating){
                return -1;
            }
            else if (a.rating === b.rating){
                return 0;
            }
        })
    }
    else if (ratingUp)
    {
        $(`#sortRatingType`).text(" - ")
        ratingUp = false;
        ratingDefault = true;
        movies = movies.sort((a,b) =>{
            if(a.id < b.id){
                return -1;
            } else if (a.id > b.id){
                return +1;
            }
        })
    }
    searchByTitle($(`#movieSearchByTitle`).val());
}


//function that updates listeners for dynamically loaded buttons
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
                selectedPoster = m.poster;
            }
        });
        $(`#toDeleteTitle`).append(`<p>Do you want to delete ${selectedTitle}?</p>`)
    })
    
    $(".editMovieBtn").click(function(){
        $(`#innerEditMovieModal`).addClass(`blur`);
        $(`#loadingMovies`).removeClass("invisible");
        setTimeout(() => {
            editModalPreload();
            $(`#innerEditMovieModal`).removeClass(`blur`);
            $(`#loadingMovies`).addClass("invisible");
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
    $("#editRatingOutput").val(selectedRating).removeClass (function (index, className) {
        return (className.match (/(^|\s)rating\S+/g) || []).join(' ');
    }).addClass(removeDecimals(selectedRating));
}


//function to remove decimals from rating
function removeDecimals(rating){
    let removedDecimals = rating.replace(/\./g, '');
    let ratingClass = "rating" + removedDecimals;
    if (rating === "0.5"){
        ratingClass = "ratingHalf"
    }
    return ratingClass;
}


//function to send edits from the edit modal to the function that updates the server for that movie
function sendEditedMovie(){
    let editedMovie = {
        title: $("#editMovieTitle").val(),
        genre: $("#editMovieGenre").val(),
        rating: $("#editMovieRating").val(),
        director: $("#editMovieDirector").val(),
        plot: $("#editMovieDescription").val(),
        id: selectedId,
        poster: selectedPoster,
    }
    changeData(editedMovie.id, editedMovie.title, editedMovie.director, editedMovie.rating, editedMovie.genre, editedMovie.plot, editedMovie.poster)
}
//// autofill

$(`#autofill`).click(function(){
    $(`#autofillHelp`).remove();
    autoFill($(`#newMovieTitle`).val(),$(`#newMovieYear`).val());
});

function autoFill(title, year){
    $(`#innerAddMovieModal`).addClass(`blur`);
    $(`#fetchingPoster`).removeClass("invisible");

    let poster;
    let director;
    let plot;
    let iRating;

    let url;
    if (year ===""){
        url = `http://www.omdbapi.com/?apikey=91940b5a&t=${title}`;
    }
    else{
        url = `http://www.omdbapi.com/?apikey=91940b5a&t=${title}&y=${year}`
    }


    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then((response) =>{
            if (response.Error === "Movie not found!"){
                return Promise.reject(response);
            }
            else{
                return response
            }
        })
        .then(result => {
            director = result.Director;
            poster = result.Poster;
            plot = result.Plot;
            iRating = parseInt(result.imdbRating) / 2;
        }).then(()=>{
            $(`#newMovieDirector`).val(director);
            $(`#newMovieDescription`).val(plot);
            $(`#imdbRating`).val(iRating);
            $(`#previewImg`).attr("src", poster).before(`<div id="autofillHelp" class="form-text">Not the movie you were thinking? Try adding a year and search again.</div>`);
            $(`#posterPreview`).removeClass("invisible");
            $(`#innerAddMovieModal`).removeClass(`blur`);
            $(`#fetchingPoster`).addClass("invisible");
            $(`#addMovieSubmit`).removeClass("invisible");
        }).catch((err) =>{
            console.log(err)
            alert("Your Movie could not be found!");
            poster = "../assets/N:A.jpeg"
            $(`#previewImg`).attr("src", poster);
            $(`#innerAddMovieModal`).removeClass(`blur`);
            $(`#fetchingPoster`).addClass("invisible");
    })
}

//function to update a movie object on the db
function changeData( id, title, director, rating, genre, plot, poster){
            let raw =
            {
                id: id,
                poster: poster,
                title: title,
                director: director,
                rating: rating,
                genre: genre,
                plot: plot,
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

}


//function to create a new movie object
function addNewMovie(url, title, director, rating, genre, plot, poster, iRating){

                let raw =
                {
                    id: uniqueId,
                    poster: poster,
                    title: title,
                    director: director,
                    rating: rating,
                    genre: genre,
                    plot: plot,
                    iRating: iRating
                }
            ;
    
            let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(raw),
            };

            fetch(url, requestOptions)
                .then( response => setMovies())
                .then(()=>{
                            $("#newMovieTitle").val("")
                               $("#newMovieGenre").val("")
                                $("#movieRating").val("")
                               $("#newMovieDirector").val("")
                              $("#newMovieDescription").val("")
    });

}


//function to send info from new movie modal to the function that updates the server creating the new movie object
function sendNewMovie(){
    let newMovie = {
        title: $("#newMovieTitle").val(),
        genre: $("#newMovieGenre").val(),
        rating: $("#movieRating").val(),
        director: $("#newMovieDirector").val(),
        plot: $("#newMovieDescription").val(),
        poster: $("#previewImg").attr("src"),
        iRating: $("#imdbRating").val(),
    }
    addNewMovie(dbURL, newMovie.title, newMovie.director, newMovie.rating, newMovie.genre, newMovie.plot, newMovie.poster, newMovie.iRating)
}


//function for generating a uniqueId
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


//js for movie rating slider number badge
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


//regex taken from here https://stackoverflow.com/questions/2644299/jquery-removeclass-wildcard
$(`#movieRating`).change(function(){
    $("#ratingBadge").removeClass (function (index, className) {
        return (className.match (/(^|\s)rating\S+/g) || []).join(' ');
    });
    if($(`#movieRating`).val() === "0.5"){
        $(`#ratingBadge`).addClass("ratingHalf");
    } else if($(`#movieRating`).val() === "1") {
        $(`#ratingBadge`).addClass("rating1");
    } else if($(`#movieRating`).val() === "1.5") {
        $(`#ratingBadge`).addClass("rating15");
    } else if($(`#movieRating`).val() === "2") {
        $(`#ratingBadge`).addClass("rating2");
    } else if($(`#movieRating`).val() === "2.5") {
        $(`#ratingBadge`).addClass("rating25");
    } else if($(`#movieRating`).val() === "3") {
        $(`#ratingBadge`).addClass("rating3");
    } else if($(`#movieRating`).val() === "3.5") {
        $(`#ratingBadge`).addClass("rating35");
    } else if($(`#movieRating`).val() === "4") {
        $(`#ratingBadge`).addClass("rating4");
    } else if($(`#movieRating`).val() === "4.5") {
        $(`#ratingBadge`).addClass("rating45");
    } else if($(`#movieRating`).val() === "5") {
        $(`#ratingBadge`).addClass("rating5");
    }
})

$(`#editMovieRating`).change(function(){
    $("#editRatingOutput").removeClass (function (index, className) {
        return (className.match (/(^|\s)rating\S+/g) || []).join(' ');
    });
    if($(`#editMovieRating`).val() === "0.5"){
        $(`#editRatingOutput`).addClass("ratingHalf");
    } else if($(`#editMovieRating`).val() === "1") {
        $(`#editRatingOutput`).addClass("rating1");
    } else if($(`#editMovieRating`).val() === "1.5") {
        $(`#editRatingOutput`).addClass("rating15");
    } else if($(`#editMovieRating`).val() === "2") {
        $(`#editRatingOutput`).addClass("rating2");
    } else if($(`#editMovieRating`).val() === "2.5") {
        $(`#editRatingOutput`).addClass("rating25");
    } else if($(`#editMovieRating`).val() === "3") {
        $(`#editRatingOutput`).addClass("rating3");
    } else if($(`#editMovieRating`).val() === "3.5") {
        $(`#editRatingOutput`).addClass("rating35");
    } else if($(`#editMovieRating`).val() === "4") {
        $(`#editRatingOutput`).addClass("rating4");
    } else if($(`#editMovieRating`).val() === "4.5") {
        $(`#editRatingOutput`).addClass("rating45");
    } else if($(`#editMovieRating`).val() === "5") {
        $(`#editRatingOutput`).addClass("rating5");
    }
})


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

