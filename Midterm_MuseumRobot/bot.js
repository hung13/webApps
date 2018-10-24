var config = require('./config');
var fs = require('fs');
var Twit = require('twit');
const download = require('image-downloader');
const puppeteer = require('puppeteer');

var item;
var url = 'http://lbry-web-007.amnh.org/digital/items/show/';
var pageURL;
var imgURL;
var imgTitle;
var imgDest = 'img/photo.jpg';
var T = new Twit(config);


fs.readFile('itemNum.txt', 'utf8', function(err, data) {
  	item = parseInt(data);
  	pageURL = url + item.toString();
	item = item + 1;

	fs.writeFile('itemNum.txt', item, function(err){
	    if (err) console.log(err);
	});
});


(async function scrap(){
  	try {
	  	//scrapper to get website data necessary to get img and title
	    const browser = await puppeteer.launch();
	    const page = await browser.newPage();

	    await page.goto(pageURL, {waitUntil: 'load'});

	    //get img url to later download image to upload to twitter
	    const linkImageURL = await page.$('a.fancyitem[href]');
	    const hrefAttributeValue = await page.evaluate(
	      link => link.getAttribute('href'), linkImageURL,
	    );

	    //get img title to be in twitter post
	    const linkImageTitle = await page.$('a.fancyitem[title]');
	    const titleAttributeValue = await page.evaluate(
	      link => link.getAttribute('title'), linkImageTitle,
	    );

	    //string manipulation to clean title of html tags and save to global var
	    var first = titleAttributeValue.indexOf("<br>");
	    var strLen = titleAttributeValue.length

	    imgTitle = titleAttributeValue.slice(first + 4, strLen);
	    imgTitle = imgTitle.split("<em>").join('');
	    imgTitle = imgTitle.split("</em>").join('');
	    imgTitle = imgTitle.split("  ").join(' ');
	    imgTitle = imgTitle.split("&#039;").join('\'');

	    //save url to download
	    imgURL = hrefAttributeValue;

	    await browser.close();

	    //get img to local storage
		downloadImg();

  	} catch (err) {
    	console.error(err);
  	}
})();


function downloadImg(){
	options = { url: imgURL, dest: imgDest}
	
	//downloads pic using url and saves img to folder with file path
	download.image(options).then(({ filename, image }) => {
	    console.log('File saved to', filename)
	}).catch((err) => {
	    console.error(err)
	})
}


function postImg(){
	var imgTest = fs.readFileSync(imgDest, { encoding: 'base64' })

	T.post('media/upload', {media_data: imgTest}, function(err, data, response){
		// now we can assign alt text to the media, for use by screen readers and
		// other text-based presentations and interpreters
		var mediaIdStr = data.media_id_string;
		var altText = imgTitle;
		var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
		//post has exhibit title and link 
		var postStatus = imgTitle + '\n' + pageURL;
		
		T.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
		    	// now we can reference the media and post a tweet (media will attach to the tweet)
		    	var params = { status: postStatus, media_ids: [mediaIdStr] }
		    	T.post('statuses/update', params, function (err, data, response) {})
		  	}
		})
	})
}


setTimeout(function(){	
	postImg();
}, 10000);