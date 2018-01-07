var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    Event       = require("./models/event"),
    Comment     = require("./models/comment"),
    seedDB      = require('./seeds');


mongoose.connect("mongodb://localhost/invictus");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

// setting up schema
// var eventSchema = new mongoose.Schema({
// 	name: String,
// 	image: String,
// 	description: String
// });

// var Event = mongoose.model("Event", eventSchema); 



//_________________ROUTES_______________________________________//

app.get("/", function(req, res){
	res.render("landing");
})


//INDEX - show all events
app.get("/events", function(req, res){
//getting all events from database
	Event.find({}, function(err, allEvents){
		if(err){
			console.log(err);
		} else {
			res.render("events/index", {events: allEvents});
		}
	});
})

//CREATE - add new events to db
app.post("/events", function(req, res){
	//getting data from new event form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newEvent = {name: name, image: image, description: desc};
	//adding the event to db
	Event.create(newEvent, function(err, event){
			if(err){
				console.log(err);
			} else {
				res.redirect("/events");
			}
		});
})

//NEW - show form to  create new event
app.get("/events/new", function(req, res){
	res.render("events/new");
})


//SHOW - more info about an event
app.get("/events/:id",function(req, res){
	//find Event with provided ID
	Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
		if(err){
			console.log(err);
		} else {
			//render show template with found event
			res.render("events/show", {event: foundEvent});
		}
	})
})

//----------------COMMENTS ROUTES-----------------------------

app.get("/events/:id/comments/new", function(req,res){
	//find event by id
	Event.findById(req.params.id, function(err, event){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {event: event});
		}
	}) 
})



app.post("/events/:id/comments", function(req, res){
	Event.findById(req.params.id, function(err, event){
		if(err){
			console.log(err);
			res.redirect("/events");
		} else {
			//adding the comment to db
			Comment.create(req.body.comment, function(err, comment){
					if(err){
						console.log(err);
					} else {
						// console.log(event.comments);
						event.comments.push(comment);
						event.save();
						res.redirect('/events/' + event._id);
					}
				});						
		}
	})


})

















app.get("*", function(req, res){
	res.send("f**k you!!!");
})

//_________________ROUTES_______________________________________//


// app.listen(3000, function(){
// 	console.log("started!!");
// })

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("started!!");
})

