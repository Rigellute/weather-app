import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as dataActions from './actions/dataActions.js';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import { List, ListItem } from 'material-ui/List';
import Temp from 'material-ui/svg-icons/image/wb-sunny';
import Rain from 'material-ui/svg-icons/places/beach-access';
import Wind from 'material-ui/svg-icons/action/trending-flat';
import Compass from 'material-ui/svg-icons/action/explore';
import LinearProgress from 'material-ui/LinearProgress';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

@connect((store) => {
    return {
        locations: store.data.locations,
        hourly: store.data.localHourly,
        daily: store.data.localDaily,
        loading: store.data.loading,
        fetchedLocalData: store.data.fetchedLocalData,
        activeTimeSlice: store.data.activeTimeSlice,
        photo: store.data.photo,
    }
})

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
        }

        this.dailyDataArray = [];
        this.hourlyDataArray = [];
    }

    componentWillMount() {
        this.props.dispatch(dataActions.getLocations());
    }

    handleLocationUpdate(event) {

        const { dispatch } = this.props;

        dispatch(dataActions.getLocalDailyData(event.value));
        dispatch(dataActions.getLocal3HourlyData(event.value));
        dispatch(dataActions.fetchPhoto(event.lat, event.lon));
    }

    handleTimePreference(slice) {
        this.props.dispatch(dataActions.timePreference(slice))
        // this.setState({ timeSlice: slice })
    }

    handleDrawer() {
        this.setState({
            menuOpen: !this.state.menuOpen,
        })
    }

    formatDailyData() {

        if (this.props.activeTimeSlice !== 'daily') {
            return null;
        }

        // NOTE: if the data has already been formated, return formatted data.
        if (this.dailyDataArray.length) {
            return this.dailyDataArray;
        }

        const { daily } = this.props;

        this.dailyDataArray = daily.DV.Location.Period.map((day, i) => (

            <Tab
                key={i}
                label={ moment(day.value).format('dddd')}
            >

                <div className='flex-container'>

                    { day.Rep.map((data, j) => {

                        if (i === 0 && (data.$ / 60) < new Date().getHours()) {
                            return null;
                        }

                        const isDay = data.$ === 'Day' ? true : false;
                        const temp = isDay ? data.Dm : data.Nm;
                        const feelTemp = isDay ? data.FDm : data.FNm;
                        const rain = isDay ? data.PPd : data.PPn;

                        return (
                            <Paper key={j} className='paper' zDepth={2}>
                                <Subheader>{ data.$ }</Subheader>
                                <h1 className='bigWhite'>
                                    { temp + '\xB0' }
                                </h1>
                                <List>
                                    <ListItem primaryText={'Feels like: ' + feelTemp + '\xB0' }
                                        leftIcon={<Temp />}/>
                                    <ListItem primaryText={'Chance of rain: ' + rain + '%'}
                                        leftIcon={<Rain />}/>
                                    <ListItem primaryText={'Wind speed: ' + data.S + 'mph'}
                                        leftIcon={<Wind />}/>
                                    <ListItem primaryText={'Wind direction: ' + data.D}
                                        leftIcon={<Compass />}/>
                                </List>
                            </Paper>
                        )
                    }) }
                </div>

            </Tab>
            ))

            return this.dailyDataArray;
    }

    formatHourlyData() {

        if (this.props.activeTimeSlice !== '3hourly') {
            return null;
        }

        // NOTE: if the data has already been formated, return formatted data.
        if (this.hourlyDataArray.length) {
            return this.hourlyDataArray;
        }

        const { hourly } = this.props;

        this.hourlyDataArray = hourly.DV.Location.Period.map((day, i) => (

            <Tab
                key={i}
                label={ moment(day.value).format('dddd')}
            >

                <div className='flex-container'>

                    { day.Rep.map((data, j) => {

                        if (i === 0 && (data.$ / 60) < new Date().getHours()) {
                            return null;
                        }

                        return (
                            <Paper key={j} className='paper' zDepth={3}>
                                <Subheader>{ (data.$ / 60) + ':00'}</Subheader>
                                <h1 className='bigWhite'>
                                    { data.T + '\xB0' }
                                </h1>
                                <List>
                                    <ListItem primaryText={'Feels like: ' + data.F + '\xB0' }
                                        leftIcon={<Temp />}/>
                                    <ListItem primaryText={'Chance of rain: ' + data.Pp + '%'}
                                        leftIcon={<Rain />}/>
                                    <ListItem primaryText={'Wind speed: ' + data.S + 'mph'}
                                        leftIcon={<Wind />}/>
                                    <ListItem primaryText={'Wind direction: ' + data.D}
                                        leftIcon={<Compass />}/>
                                </List>
                            </Paper>
                        )
                    }) }
                </div>

            </Tab>
            ))

            return this.hourlyDataArray;
    }

    renderLocalData() {
        if (this.props.fetchedLocalData && !this.props.loading) {

            return (
                <div>

                    <div className="container">
                        <Tabs>
                            { this.formatHourlyData() }
                            { this.formatDailyData() }
                        </Tabs>
                    </div>

                </div>
            )
        } else {
            return null;
        }
    }

    render() {

        const { locations, loading } = this.props;
        return (
            <div>
                <AppBar
                    onTouchTap={ this.handleDrawer.bind(this) }
                    title="Weather Forecast"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                />

                <Drawer open={ this.state.menuOpen }>
                    <MenuItem>About</MenuItem>
                    <MenuItem>Menu Item 2</MenuItem>
                </Drawer>

                { loading ? <LinearProgress mode="indeterminate" /> : null }

                <div className='aligner'>
                    <div className='centerAlign'>

                        <AutoComplete
                            floatingLabelText="Type your location"
                            filter={AutoComplete.fuzzyFilter}
                            dataSource={ locations.map(l => (
                                { text: l.name, value: l.id, lat: l.latitude, lon: l.longitude }
                            )) }
                            maxSearchResults={5}
                            onNewRequest={ this.handleLocationUpdate.bind(this) }
                        />
                        <Checkbox style={{ maxWidth: 250 }} label='Daily'
                            defaultChecked={ this.props.activeTimeSlice === 'daily'}
                            onClick={ () => this.handleTimePreference('daily') }/>

                        <Checkbox style={{ maxWidth: 250 }} label='3 Hourly'
                            checked={ this.props.activeTimeSlice === '3hourly'}
                            onClick={ () => this.handleTimePreference('3hourly') }
                        />

                    </div>
                </div>

                {this.renderLocalData()}

            </div>

        );
    }
}
