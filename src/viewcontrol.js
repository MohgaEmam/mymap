import React, { Component } from 'react';
import locationcontrol from './location';
import { locations, details } from './foursquare';
import PropTypes from 'prop-types';

export default class viewing extends Component {
    static constructor() {
        map: PropTypes.object.isRequired;
        list: PropTypes.func.isRequired;
        info: PropTypes.object.isRequired;
        checkinglist: PropTypes.bool.isRequired;
        bounds: PropTypes.object.isRequired;


    }

    state = {
        query: '',
        statelocations: [],
        wantedlocations: null,
        output: false
    }

    componentDidMount() {
        locations(daloactions => {
            this.setState({
                statelocations: daloactions,
                wantedlocations: daloactions,
                output: true
            });
            if (daloactions) this.markers(daloactions)
        })
            .catch(error => this.setState({ apiReturned: true }));
    }

    markers(daloactions) {
        const { map, bounds, info, checkinglist } = this.props;
        const locationholder = this
        daloactions.forEach((markerslocation) => {

            const pos = {
                lat: markerslocation.location.lat,
                lng: markerslocation.location.lng
            }

            markerslocation.marker = new window.google.maps.Marker({
                pos,
                map,
                title: markerslocation.name,
                id: markerslocation.id
            });

            bounds.extend(pos);

            markerslocation.marker.addListener('click', function () {
                const markerholder = this
                details(markerholder.id)
                    .then(respond => {
                        const loca = respond.response.venue;

                        const { canonicalUrl, bestPhoto, location, attributes } = loca;

                        function markerfun() {
                            if (canonicalUrl === true) {
                                return canonicalUrl
                            } else { return 'https://foursquare.com/' }
                        }
                        function markerimg() {
                            if (bestPhoto === true) {
                                return `${bestPhoto.prefix}width100${bestPhoto.suffix}`
                            }
                        }
                        markerholder.url = markerfun();
                        markerholder.photo = markerimg();
                        markerholder.address = location.address;
                        markerholder.infoContent = `<div class="place">
                                  <img class="place-photo" src=${markerholder.photo} alt="${markerholder.title}">
                                  <div class="place-meta">
                                    <h2 class="place-title">${markerholder.title}</h2>
                                    <p class="place-contact">${markerholder.address}</p>
                                  </div>
                                </div>
                                <a class="place-link" href="${markerholder.url}" target="_blank">
                                  <span>Read more</span>
                                </a>`

                        // set content and open window after content has returned
                        info.setContent(markerholder.infoContent);
                        info.open(map, markerholder);

                        // close list view in mobile if open so infowindow is not hidden by list
                        if (locationholder.props.list) {
                            checkinglist()
                        };
                    })
                    .catch(error => {
                        markerholder.infoContent = `<div class="venue-error"  role="alert">
                  <h3>Foursquare Venue Details request for ${markerholder.title} failed</h3>
                  <p>Try again later...</p>
                </div>`
                        // set content and open window
                        info.setContent(markerholder.infoContent);
                        info.open(map, markerholder);

                        // close list view in mobile if open so infowindow is not hidden by list
                        if (locationholder.props.list) {
                            checkinglist()
                        };
                    });
            });
        });

        // size and center map
        map.fitBounds(bounds);
    }

    wantedlocations = (e) => {

        const { statelocations } = this.state;
        const { list } = this.props;
        const query = e.target.value.toLowerCase();

        // update state so input box shows current query value
        this.setState({ query: query })

        // close infoWindow when filter runs
        list.close();

        // filter list markers by name of location
        const wantedlocations = statelocations.filter((location) => {
            const holder = location.name.toLowerCase().indexOf(query) > -1;
            location.marker.setVisible(holder);
            return holder;
        })
        this.setState({ wantedlocations })
    }

    showInfo = (location) => {
        // force marker click
        window.google.maps.event.trigger(location.infowindow, 'click');
    }

    render() {

        const { output, wantedlocations, query } = this.state;
        const { checkinglist } = this.props;
        function indexchecking() {
            if (checkinglist === true) {
                return '0'
            } else { return '-1' }
        }

        function checkingreturn() {
            if (output && wantedlocations.length > 0) {
                return (<ul className="places-list">
                    {wantedlocations.map((place, id) =>
                        <locationcontrol
                            key={place.id}
                            place={place}
                            listOpen={checkinglist}
                        />
                    )}
                </ul>)
            } else { return (<p id="filter-error" className="empty-input">No places match filter</p>) }
        }
        function alternative() {
            if (output && wantedlocations === true) {
                return (
                    <div className="list-view">
                        <input type="text"
                            placeholder="Filter by Name"
                            value={query}
                            onChange={this.wantedlocations}
                            className="search-places"
                            role="search"
                            aria-label="text filter"
                            tabIndex={indexchecking()}
                        />
                        {checkingreturn()}
                    </div>
                )
            } else {
                return (
                    <div className="loading-fs">
                        <h4 className="loading-message">loading</h4>
                    </div>
                )
            }
        }
        if (output && !wantedlocations) {
            return (<div> Foursquare API request failed. Please try again later.</div>)
        }
        else { alternative() }
    }
}
