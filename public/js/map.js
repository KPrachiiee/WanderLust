   mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container:"map",//contaoner Id
        style:"mapbox://styles/mapbox/streets-v12",//style url
        center: listing.geometry.coordinates, //starting position [lng,lat]
        //center: coordinates,     // coordinates,
        zoom:9, //starting zoom
    });


    const marker = new mapboxgl.Marker({color:"red"})
     .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
     .setPopup( new mapboxgl.Popup({ offset: 25 })
     .setHTML(
            `<h3>${listing.title}</h3><p>Exact locationw will be provided after booking</p>`
              )
            )
            .addTo(map);
     


