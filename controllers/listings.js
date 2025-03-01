const Listing=require("../models/listing");
const axios = require("axios");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing ou requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

// module.exports.createListing=async (req, res, next) => {
//     let url=req.file.path;
//     let filename=req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.image={url,filename};
//     await newListing.save();
//     req.flash("success","New Listing Created!");
//     res.redirect("/listings");
// }



// module.exports.createListing = async (req, res, next) => {
//     try {
//         let { location } = req.body.listing;
//         let url = req.file.path;
//         let filename = req.file.filename;

//         // Fetch coordinates using OpenStreetMap (Nominatim)
//         let geoData = await axios.get(
//             `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
//         );
//         let coordinates = geoData.data[0]
//             ? { lat: geoData.data[0].lat, lon: geoData.data[0].lon }
//             : { lat: 28.6139, lon: 77.2090 }; // Default: New Delhi

//         const newListing = new Listing(req.body.listing);
//         newListing.owner = req.user._id;
//         newListing.image = { url, filename };
//         newListing.coordinates = coordinates; // Store coordinates in DB
//         await newListing.save();

//         req.flash("success", "New Listing Created!");
//         res.redirect(`/listings/${newListing._id}`);
//     } catch (error) {
//         console.error("Error creating listing:", error);
//         req.flash("error", "Failed to create listing.");
//         res.redirect("/listings");
//     }
// };



module.exports.createListing = async (req, res, next) => {
    try {
        let { location } = req.body.listing;
        let url = req.file ? req.file.path : "";
        let filename = req.file ? req.file.filename : "";

        // Validate if location is provided
        if (!location || location.trim() === "") {
            req.flash("error", "Location is required.");
            return res.redirect("/listings/new");
        }

        // Fetch coordinates using OpenStreetMap (Nominatim)
        let geoData = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
        );

        // If no results from API, set default coordinates (New Delhi)
        let coordinates = geoData.data.length > 0
            ? { lat: geoData.data[0].lat, lon: geoData.data[0].lon }
            : { lat: 28.6139, lon: 77.2090 };

        // Create new listing
        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            image: { url, filename },
            coordinates
        });

        await newListing.save();

        req.flash("success", "New Listing Created!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings");
    }
};



module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing ou requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedLisiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLisiting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}