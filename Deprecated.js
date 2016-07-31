import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as dataActions from './actions/dataActions.js';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import { GridList, GridTile } from 'material-ui/GridList';
import { List, ListItem } from 'material-ui/List';
import Temp from 'material-ui/svg-icons/places/ac-unit';
import Rain from 'material-ui/svg-icons/places/beach-access';
// import Divider from 'material-ui/Divider';
import LinearProgress from 'material-ui/LinearProgress';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 'auto',
    overflowY: 'auto',
    marginBottom: 24,
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

@connect((store) => {
    return {
        locations: store.data.locations,
        location: store.data.location,
        loading: store.data.loading,
        fetchedLocalData: store.data.fetchedLocalData,
    }
})

export default class App extends Component {

    componentWillMount() {
        this.props.dispatch(dataActions.getLocations());
    }

    handleLocationUpdate(event) {
        this.props.dispatch(dataActions.getLocalData(event.value));
    }

    renderLocalData() {
        if (this.props.fetchedLocalData) {

            const { location } = this.props;

            return (
                <div>
                    <h1 style={{ textAlign: 'center' }}>{ location.DV.type }</h1>



                    <div style={styles.root}>

                        <Tabs>
                            {
                                location.DV.Location.Period.map(day => {
                                    const tab = <Tab label={ moment(day.value).format('dddd')}/>

                                    const data = day.Rep.map(data => {

                                        if ((data.$ / 60) < new Date().getHours()) {
                                            return null;
                                        }

                                        return (
                                        <Tab>
                                            <GridList
                                                cellHeight={200}
                                                style={styles.gridList}
                                            >
                                                <GridTile
                                                    titlePosition='top'
                                                    title={ (data.$ / 60) + ':00'}>
                                                    <List style={{ marginTop: 40}}>
                                                        <ListItem primaryText={ data.T + '\xB0' + ' (feels like) ' + data.F + '\xB0' }
                                                            leftIcon={<Temp />}
                                                        />
                                                        <ListItem primaryText={ data.Pp + '%'} leftIcon={<Rain />} />
                                                        {/*<ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
                                                            <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
                                                        <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />*/}
                                                    </List>
                                                </GridTile>
                                            </GridList>
                                        </Tab>
                                        )
                                    }).filter(n => n);

                                    return [tab, data];
                                })
                            }
                        </Tabs>

                        <GridList
                            cellHeight={200}
                            style={styles.gridList}
                        >
                            { location.DV.Location.Period.map(day => {
                                const d = <Subheader>
                                    { moment(day.value).format('dddd') }
                                </Subheader>

                                const data = day.Rep.map(data => {

                                    if ((data.$ / 60) < new Date().getHours()) {
                                        return null;
                                    }

                                    return (
                                    <div>
                                        <GridTile
                                            titlePosition='top'
                                            title={ (data.$ / 60) + ':00'}>
                                            <List style={{ marginTop: 40}}>
                                                <ListItem primaryText={ data.T + '\xB0' + ' (feels like) ' + data.F + '\xB0' }
                                                    leftIcon={<Temp />}
                                                />
                                                <ListItem primaryText={ data.Pp + '%'} leftIcon={<Rain />} />
                                                {/*<ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
                                                    <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
                                                <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />*/}
                                            </List>
                                        </GridTile>
                                    </div>
                                    )
                                }).filter(n => n);

                                return [d, data];
                            })}
                        </GridList>
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
                    title="Weather"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                />

                { loading ? <LinearProgress mode="indeterminate" /> : null }

                <div style={styles.root}>

                    <AutoComplete
                        floatingLabelText="Type your location"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={ locations.map(l => (
                            { text: l.name, value: l.id }
                        )) }
                        maxSearchResults={5}
                        onNewRequest={ this.handleLocationUpdate.bind(this) }
                    />

                </div>


                {this.renderLocalData()}

            </div>

        );
    }
}
