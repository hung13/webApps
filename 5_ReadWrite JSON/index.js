var fs = require('fs');
var words;


//if file doesn't exist, make an array to later add to json file when it's created
if(fs.existsSync('words.json')){
	var jsonData = fs.readFileSync('words.json', 'utf8');
	words = JSON.parse(jsonData);
} else{
	words = [];
}


//start server on port 3000 and begin listening for requests
const express = require('express')
const app = express();

const server = app.listen(3000, listening);
function listening(){
	console.log("listening...");
}


//route and function to add word to json file
app.get('/add/:word', addWord);
function addWord(request, response){
	//gets word from route and adds it to array
	var newWord = request.params.word;
	words.push(newWord);
	
	//write new word to json
	var data = JSON.stringify(words);
	fs.writeFile('words.json', data, finished);
	function finished(err){
		response.send(newWord + " written");
	}
}


//route and function to show all words
app.get('/readAll', readAll);
function readAll(request, response){
	response.send(words);
}