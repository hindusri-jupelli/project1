const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const flash=require("connect-flash");
const Review = require("../models/review.js");  
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

// index route
// router.get("/", wrapAsync(listingController.index));

// New route->form to create a new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));




//show route-> /listings/:id (GET)
// router.get("/:id", wrapAsync(listingController.showListing));

// create route->post request from the create new listing button
// router.post("/",validateListing,isLoggedIn, wrapAsync(listingController.createListing));


// edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// update route
// router.put("/:id",validateListing,isLoggedIn,isOwner, wrapAsync(listingController.updateListing));

// delete route
// router.delete("/:id", isLoggedIn,isOwner,
//     wrapAsync(listingController.destroyListing));

module.exports=router;