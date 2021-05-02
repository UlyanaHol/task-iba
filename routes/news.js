var express = require('express');
var router = express.Router();
var News = require("../models/news");
var middleware = require("../middleware");

//INDEX - show all news
router.get('/', function (req, res) {
    // Get all news from DB
    News.find({}, function (err, allNews) {
        if (err) {
            console.log(err);
        } else {
            res.render('news/index', { news: allNews });
        }
    });
});

//CREATE - add new newsto DB
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from form and add to news array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
	var category = req.body.category;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newNews = {
        name: name,
        image: image,
        description: desc,
		category: category,
        author: author,
		counter: 0
    };
    // Create a new newsand save to DB
    News.create(newNews, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to news page
            console.log(newlyCreated);
            res.redirect('/news');
        }
    });
});

//NEW - show form to create new newsrouter.get('/new', middleware.isLoggedIn, function (req, res) {
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("news/new"); 
});

// SHOW - shows more info about one news
router.get('/:id', function (req, res) {
    //find the newswith provided ID
    News.findByIdAndUpdate(req.params.id, {$inc: {counter: 1}}, {new:true}).populate('comments').exec(function (err, foundNews) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundNews);
                //render show template with that news               
				res.render('news/show', { news: foundNews });
            }
        });
	 // News.findByIdAndUpdate(req.params.id, {$inc: {counter: 1}}, {new:true});
	// News.findByIdAndUpdate(req.params.id, req.body.news, {new: true}).populate("comments").exec(function(err, foundNews){
	// 		if(err){
	// 			reject(err);
	// 		} else {
	// 			req.body.news.counter++;
	// 			res.render("news/show", {news: foundNews});
	// 		}
	// 	});;
});

// EDIT News ROUTE
router.get('/:id/edit', middleware.checkNewsOwnership, function (req, res) {
    News.findById(req.params.id, function (err, foundNews) {
        res.render('news/edit', { news: foundNews});
    });
});

// UPDATE News ROUTE
router.put('/:id', middleware.checkNewsOwnership, function (req, res) {
    // find and update the correct news   
	News.findByIdAndUpdate(req.params.id, req.body.news, function (err, updatedNews) {
        if (err) {
            res.redirect('/news');
        } else {
            //redirect somewhere(show page)
            res.redirect('/news/' + req.params.id);
        }
    });
});

// DESTROY News ROUTE
router.delete('/:id', middleware.checkNewsOwnership, function (req, res) {
    News.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/news');
        } else {
            res.redirect('/news');
        }
    });
});

router.get('/:id', (req, res) => {
   News.findByIdAndUpdate(req.params.id, req.body.news, {new: true}).populate("comments").exec(function(err, foundNews){
			if(err){
				reject(err);
			} else {
				req.body.news.numberOfViews++;
				res.render("show", {news: foundNews});
			}
		});;
})

module.exports = router;