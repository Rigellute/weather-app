export function buildQuery(resource) {

    // NOTE: base example http://datapoint.metoffice.gov.uk/public/data/resource?key=APIkey

    const key = 'f385fe2f-19d0-4bba-9e57-f14feffafb74';

    const baseUrl = 'http://datapoint.metoffice.gov.uk/public/data/';

    const param = ~resource.indexOf('?') ? '&key=' : '?key=';

    return baseUrl + resource + param + key;
}

export function buildFlickr(lat, lon) {

    /* Example find place id by lat and lon
    'https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&lat=57.6494&lon=-3.5606&format=json&nojsoncallback=1&api_key=9880f2212f49d2289601fb002f87a718'
     */

    /* Example place photo
     'https://api.flickr.com/services/rest/?method=flickr.photos.search&place_id=RY6QzEhQULzlyR4h2w&sort=interestingness-desc&per_page=1&format=json&nojsoncallback=1&api_key=9880f2212f49d2289601fb002f87a718'
     */

    // NOTE: Example to build url from returned data
    // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    const key = '&api_key=9880f2212f49d2289601fb002f87a718';

    const baseUrl = 'https://api.flickr.com/services/rest/';
    const findIdMethod = `?method=flickr.places.findByLatLon&lat=${lat}&lon=${lon}`;
    const format = `&format=json&nojsoncallback=1`;
    const formatAndKey = format + key;

    return fetch(baseUrl + findIdMethod + formatAndKey)
    .then(res => res.json())
    .then(placeData => {
        const placeId = placeData.places.place[0].place_id;
        const getUrlData = `?method=flickr.photos.search&place_id=${placeId}&sort=interestingness-desc&per_page=1`;
        return fetch(baseUrl + getUrlData + formatAndKey)
    })
    .then(res => res.json())
    .then(urlData => {
        const { farm, server, id, secret } = urlData.photos.photo[0];

        return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
    })
}
