const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var foodCat;
var cat = "";
let url;


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

//initial rendering of index so user can pick the food categories
//pulled from the site. 
app.get('/', function (req, res) {
  url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;
  request(url, function(error, response, body){
    foodCat = JSON.parse(body);
    //Send the data received to populate the dropdown menu on the index.
    //Had to null the variables used later in the get function since
    //everything is on the same page and if variables are not null
    //the code will 'break'
    res.render('index', {foodCat, cat:null, foodLst:null, error: null});
  })
})

app.post('/', function(req, res){
  //I wanted to be fancy and have a "cascading dropdown" (i think is the
  //jargon), where choosing one dropdown would automatically generate another.
  
  //if user have chosen a recipe, generate the recipe page from data pulled from api
  //if user decides to change food category after seeing the recipes, go to 'else if'
  if ((req.body.recipe ) && (cat == req.body.category)){
    url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=` + req.body.recipe;
    request(url, function(error, response, body){
      let foodRec = JSON.parse(body);
      res.render('recipe', {foodRec});
    })
  }

  //if users only chosen a food category so far, regenerate index page with the second
  //dropdown with recipes related to user choice
  else if (req.body.category){
    cat = req.body.category;
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=` + cat;
    request(url, function(error, response, body){
      let foodLst = JSON.parse(body);
      res.render('index', {foodCat, cat, foodLst, error: null});
    })
  } 
})


app.listen(3000, function () {
  console.log('App listening on port 3000...')
})
