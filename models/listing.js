const mongoose = require("mongoose");
const Review=require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        
        // type: String, 
        // default: "https://media.istockphoto.com/id/1253992491/photo/view-of-the-seiser-alm-one-of-the-biggest-alpine-meadows-on-the-dolomites-with-the-sassolungo.jpg?s=2048x2048&w=is&k=20&c=i1RiL3VW2BieRCxhwDds11yLEt9yQeYV_EgvKMYba5s=" ,
        // set: (v) => v === "" ? "https://media.istockphoto.com/id/1253992491/photo/view-of-the-seiser-alm-one-of-the-biggest-alpine-meadows-on-the-dolomites-with-the-sassolungo.jpg?s=2048x2048&w=is&k=20&c=i1RiL3VW2BieRCxhwDds11yLEt9yQeYV_EgvKMYba5s=" : v,
    
        url:String,
        filename:String,
    
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    coordinates: { // Store Latitude & Longitude
        lat: Number,
        lon: Number
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}})
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;