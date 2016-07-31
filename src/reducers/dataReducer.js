const initialState = {
    loading: false,
    fetchedLocalData: false,
    locations: [],
    localHourly: {},
    localDaily: {},
    error: null,
    activeTimeSlice: 'daily',
    photo: '',
}

export default function reducer(state = initialState, action) {

    const isPending = ~action.type.split('_').indexOf('PENDING');
    const isRejected = ~action.type.split('_').indexOf('REJECTED');

    if (isPending) {
        state = {
            ...state,
            loading: true,
        };
    } else if (isRejected) {
        state = {
            ...state,
            loading: false,
            error: action.payload,
        };
    }

    switch (action.type) {
        case 'FETCH_LOCATIONS_FULFILLED':
            state = {
                ...state,
                loading: false,
                locations: action.payload.Locations.Location
            };
            break;
        case 'FETCH_LOCAL_DATA_3_HOURLY_FULFILLED':
            state = {
                ...state,
                fetchedLocalData: true,
                loading: false,
                localHourly: action.payload.SiteRep
            }
            break
        case 'FETCH_LOCAL_DATA_DAILY_FULFILLED':
            state = {
                ...state,
                fetchedLocalData: true,
                loading: false,
                localDaily: action.payload.SiteRep
            }
            break
        case 'TIME_PREFERENCE_CHANGE':
            state = {
                ...state,
                activeTimeSlice: action.payload,
            }
            break
        case 'FETCH_PHOTO_FULFILLED':
            state = {
                ...state,
                photo: action.payload,
            }
            break
        default:
            break;
    }

    return state;
}
