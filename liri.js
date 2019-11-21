//require & import  modules
let dotenv = require("dotenv").config();
let axios = require('axios');
let spotify = require('node-spotify-api');
let moment = require('moment');
let keys = require("./keys.js");
let fs = require("fs");

let spotifyKey = new spotify(keys.spotify);

// Store all of the arguments in an array
const nodeArgs = process.argv;
//divider for improved readability of console logs and files
const divider = `------------------------------------------------------------`;
const dividerWRtn = `------------------------------------------------------------
`;


// Create an empty variable for holding the movie name
let searchTerm = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (let i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        searchTerm = searchTerm + "+" + nodeArgs[i];
    }
    else {
        searchTerm += nodeArgs[i];
    }
}



//define functions
//bands in town
function bit(searchTerm) {
    console.log(divider);
    console.log("Search Bands-In-Town for: " + searchTerm);
    console.log(divider);
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
        .then(function(response) {
            //            console.log("Response length = " + response.data.length);
            // for (let i = 0; i < response.data.length; i++) {
            for (let i = 0; i < 5; i++) { //limit resonse to 5
                console.log("Venue: " + response.data[i].venue.name);
                if (response.data[i].venue.region == '') {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                }
                else {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
                };
                console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'));
                console.log(divider);
            }
        }).catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

//funtion using spotify api
function song(searchTerm) {
    // Artist(s),  The song's name, A preview link of the song from Spotify, The album that the song is from, If no song is provided then your program will default to "The Sign" by Ace of Base.
    console.log(divider);
    console.log("Search Spotify for: " + searchTerm);
    console.log(divider);
    let spotifyClient = new spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });
    // spotifyClient.search({ type: 'track', query: 'All the Small Things', limit: '1' }, function(err, data) {
    spotifyClient.search({ type: 'track', query: searchTerm, limit: '1' }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
// console.log(divider);
// console.log("href = " + data.tracks.href);
// console.log("data =");
// console.log(data);
// console.log(divider);
// console.log("tracks = ");
// console.log(data.tracks);
// console.log(divider);
// console.log("items = ");
// console.log(data.tracks.items); //array
        console.log(divider);

        console.log("artist = ");
        console.log(data.tracks.items[0].album.artists[0].name);

        console.log("Song name = " + searchTerm);

        console.log("Preview link:  ");
        console.log(data.tracks.items[0].album.artists[0].href);

        console.log("album = ");
        console.log(data.tracks.items[0].album.name);

        ////////
        // console.log("start of tracks property console loop");
        // for (let property in data.tracks) {
        //     console.log(property + "=" + data.tracks.property);
        // }
        // console.log("...end of property tracks console loop");
        // console.log("start of items property console loop");
        // for (let property in data.tracks.items[0]) {
        //     console.log(property + "=" + data.tracks.items[0].property);
        // }
        // console.log("...end of items property console loop");
        // console.log("start of album property console loop");
        // for (let property in data.tracks.items[0].album) {
        //     console.log(property + "=" + data.tracks.items[0].album.property.album_type);
        // }
        // console.log("...end of album property console loop");
        // console.log("start of artists property console loop");
        // for (let property in data.tracks.items[0].artists) {
        //     console.log(property + "=" + data.tracks.items[0].artists.property);
        // }
        // console.log("...end of artists property console loop");
        // // console.log(data.tracks.items.album.album_type);
        // console.log(data.tracks.items.album.album_type);
        // console.log("item artists = " + data.tracks.items.artists);
        // console.log(data.tracks.items.artists);

        // console.log(JSON.stringify(data));
        // let songData = JSON.stringify(data);
        console.log(divider);
        // const songData = `
        // Artist(s)               : ${response.data.Title}
        // Song:                   : ${response.data.Year}
        // Spotify Preview link    : ${response.data.imdbRating}
        // Album                   : ${response.data.Country}
        // `;
        // fs.appendFile("log.txt", divider + songData, err => {
        //     if (err) throw err;
        //     //                console.log(movieData);
        // });

    });
}

//function using movie database api OMDB
function movie(searchTerm) {
    console.log(divider);
    console.log("Search Online Movie Database for: " + searchTerm);
    console.log(divider);
    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
            // console.log(response.data);
            let ratings = JSON.parse(response.data.Ratings[0]);
            // // console.log("ratings Source length = " + response.data.Ratings.length);
            if (response.data.Ratings.length == 0) {
                console.log("Rotten Tomatoes rating: Not available");
            }
            else {
                for (let i = 0; i < response.data.Ratings.length; i++) {
                    let ratings = JSON.parse(response.data);
                    console.log("Parsed obj = " + ratings);
                    console.log("Source = " + ratings.Source[i]);
                    if (response.data.Ratings.Source[i] == "Rotten Tomatoes") {
                        console.log("Rotten Tomatoes rating: " + response.data.Ratings.Source[i].Value);
                    }
                }
            };
            console.log(divider);
            const movieData = `
                    Movie Title             : ${response.data.Title}
                    Year Released           : ${response.data.Year}
                    IMDB rating             : ${response.data.imdbRating}
                    Produced in             : ${response.data.Country}
                    Language                : ${response.data.Language}
                    Plot                    : ${response.data.Plot}
                    Actors                  : ${response.data.Actors}
                    `;
            fs.appendFile("log.txt", divider + movieData, err => {
                if (err) throw err;
                //                console.log(movieData);
            });
        }
    ).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
        }
        else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

//function calls
if (process.argv[2] == "concert-this") {
    // node liri.js concert-this <artist/band name here>
    //     This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    //     Name of the venue
    //     Venue location
    //     Date of the Event (use moment to format this as “MM/DD/YYYY”)

    // let artist = process.argv[3];
    bit(searchTerm);
}

if (process.argv[2] == "spotify-this-song") {
    // node liri.js spotify-this-song  '<song name here>'
    //   This will show the following information about the song in your terminal/bash window
    //   Artist(s)
    //   The song’s name
    //   A preview link of the song from Spotify
    //   The album that the song is from
    //   If no song is provided then your program will default to “The Sign” by Ace of Base.
    song(searchTerm);
}

if (process.argv[2] == "movie-this") {
    // node liri.js movie-this '<movie name here>'

    //    This will output the following information to your terminal/bash window:
    //    * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Rotten Tomatoes Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.
    //    If the user doesn’t type a movie in, the program will output data for the movie ‘Mr. Nobody.’
    // let movie = process.argv[3];

    // Then run a request with axios to the OMDB API with the movie specified
    movie(searchTerm);
}

if (process.argv[2] == "do-what-it-says") {
    // node liri.js do-what-it-says
    //    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI’s commands.
    //    It should run spotify-this-song for “I Want it That Way,” as follows the text in random.txt.
    //    Edit the text in random.txt to test out the feature for movie-this and concert-this.
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // We will then print the contents of data
        console.log(data);
        // Then split it by commas (to make it more readable)
        const dataArr = data.split(",");
        // We will then re-display the content as an array for later use.
        console.log("DWIS array: " + dataArr);
        // Create an empty variable for holding the movie name
        let searchTerm = "";

        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (let i = 3; i < dataArr.length; i++) {
            if (i > 3 && i < dataArr.length) {
                searchTerm = searchTerm + "+" + dataArr[i];
            }
            else {
                searchTerm += dataArr[i];
            }
        }
        console.log("DWIS searchTerm: " + searchTerm)
        if (dataArr[2] == "concert-this") {
            // node liri.js concert-this <artist/band name here>
            //     This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
            //     Name of the venue
            //     Venue location
            //     Date of the Event (use moment to format this as “MM/DD/YYYY”)
            // let artist = process.argv[3];
            bit(searchTerm);
        }
        if (dataArr[2] == "spotify-this-song") {
            song(searchTerm);
        }
        if (dataArr[2] == "movie-this") {
            movie(searchTerm);
        }
    });
}


//BONUS:
//    In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
//    Make sure you append each command you run to the log.txt file.
//    Do not overwrite your file each time you run a command.
// fs.appendFile("log.txt", showData + divider, err => {
//     if (err) throw err;
//     console.log(showData);
// });
