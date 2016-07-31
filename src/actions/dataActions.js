import { buildQuery, buildFlickr } from '../helpers';

export function getLocations() {
    return {
        type: 'FETCH_LOCATIONS',
        payload: fetch(buildQuery('val/wxfcs/all/json/sitelist'))
            .then(res => res.json())
    }
}

export function getLocal3HourlyData(locationId) {
    return {
        type: 'FETCH_LOCAL_DATA_3_HOURLY',
        payload: fetch(buildQuery(`val/wxfcs/all/json/${locationId}?res=3hourly`))
            .then(res => res.json())
    }
}

export function getLocalDailyData(locationId) {
    return {
        type: 'FETCH_LOCAL_DATA_DAILY',
        payload: fetch(buildQuery(`val/wxfcs/all/json/${locationId}?res=daily`))
            .then(res => res.json())
    }
}

export function timePreference(time) {
    return {
        type: 'TIME_PREFERENCE_CHANGE',
        payload: time,
    }
}

export function fetchPhoto(lat, lon) {
    return {
        type: 'FETCH_PHOTO',
        payload: buildFlickr(lat, lon)
    }
}
