var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var nodeArgs = process.argv;
var movie = "";
var song = "";
var stuffToLog;

//set up to show tweets when my-tweets entered in command line
var command = process.argv[2];

if (command === "my-tweets"){ 
	getTweets();


}else if (command === "movie-this"){
	for(i = 3; i<nodeArgs.length; i++){
		if(i>3 && i<nodeArgs.length){
			movie = movie + "+" + nodeArgs[i]
		}else{ 
			movie += nodeArgs[i]
		}
	}
	movieInfo();


}else if (command === "spotify-this-song"){
	for(i = 3; i < nodeArgs.length; i++){
		if(i>3 && i<nodeArgs.length){
			song = song + "+" + nodeArgs[i]
		}else{
			song += nodeArgs[i];
		}
	}
	songInfo();

}else if(command === "do-what-it-says"){
	doWhatItSays();
}
 
//called when my-tweets entered in command line to fetch last 20 tweets 
function getTweets(){
	var client = new Twitter({
	  consumer_key: keys.consumer_key,
	  consumer_secret: keys.consumer_secret,
	  access_token_key: keys.access_token_key,
	  access_token_secret: keys.access_token_secret
	});
	 
	var params = {screen_name: 'LearningNPM', limit:20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (error) {
	    console.log(error);
	  }else{
	  	for (var i = 0; i < tweets.length; i++){

	  		//some formating to help with readability in command line
	  		console.log("_____________________________________________");
	       	console.log("Tweeted on: " + tweets[i].created_at);
	        console.log(tweets[i].text);
	        stuffToLog = "Tweeted on: " + tweets[i].created_at+"\r\n"+tweets[i].text+"\r\n";
	        writeLog();
	  	}
	  }
	});
}

function movieInfo(){
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body){

		// If there were no errors and the response code was 200 (i.e. the request was successful)...
	  if (!error && response.statusCode === 200) {

	    // Then we print out the imdbRating
	    var json = JSON.parse(body);
	    console.log("Title of the Movie: "+json.Title);
    	console.log("Year the movie came out: "+json.Year);
    	console.log("IMDB Rating of the movie: "+json.imdbRating);
    	console.log("Rotten Tomatoes Rating of the movie: "+json.Ratings[1].Value);
    	console.log("Country where the movie was produced: "+json.Country);
    	console.log("Language of the movie: "+json.Language);
    	console.log("Plot of the Movie: "+json.Plot);
    	console.log("Actors of the Movie: "+json.Actors);
	  }
	});
}

function songInfo(){
	var spotify = new Spotify({
	  	id: 'dc6f59333c5746cb8d6b905abc13e31e',
	  	secret: '4b9453ac94894398bc35d81475fb6e67'
	});

	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
		console.log("The artist of the song is: "+data.tracks.items[0].artists[0].name);
		console.log("The name of the song is: "+data.tracks.items[0].name);
		console.log("A preview of the song can be found at: "+data.tracks.items[0].preview_url);
		console.log("The song is on the album: "+data.tracks.items[0].album.name);
	});
}

function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data){
		var dataArray = data.split(',');
		var command2 = dataArray[0];
		var afterCommandEntry = dataArray[1]; 
		// console.log(dataArray[0]);
		// console.log(dataArray[1]);

		if (command2 === "my-tweets"){ 
			getTweets();

		}else if (command2 === "movie-this"){
			movie = afterCommandEntry.slice(1, -1).split(' ').join('+');
			movieInfo();
		
		}else if (command2 === "spotify-this-song"){
			song = afterCommandEntry.slice(1, -1).split(' ').join('+');
			// console.log(song);
			songInfo();
		}else(console.log("command must be = to 'my-tweets' or 'movie-this' or 'spotify-this-song'"))
	});
}

function writeLog(){
	fs.appendFile("log.txt", stuffToLog, function(error){
		if(error){
			return console.log(error);
		}
	});
}
