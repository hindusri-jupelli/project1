
        // document.addEventListener("DOMContentLoaded", function () {
        //     if (!listingData || !listingData.lat || !listingData.lon) {
        //         console.warn("Coordinates missing for:", listingData.title);
        //         listingData.lat = 28.6139; // Default latitude
        //         listingData.lon = 77.2090; // Default longitude
        //     }
        
        //     var map = L.map("map").setView([listingData.lat, listingData.lon], 12);
        
        //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //     }).addTo(map);
        
        //     L.marker([listingData.lat, listingData.lon])
        //         .addTo(map)
        //         .bindPopup(`<b>${listingData.title}</b><br>${listingData.location}`)
        //         .openPopup();
        // });
        
        window.onload = function () {
            if (typeof listingData === "undefined") {
                console.error("listingData is not defined");
                return;
            }
        
            console.log("Listing Data:", listingData);
            var map = L.map("map").setView([listingData.lat, listingData.lon], 13);
            
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);
        
            L.marker([listingData.lat, listingData.lon]).addTo(map)
                .bindPopup(`<b>${listingData.title}</b><br>${listingData.location}`)
                .openPopup();
        };
        
        