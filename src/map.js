import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class map extends Component {

    static constructor() {
        map: PropTypes.object;
        prepmap: PropTypes.bool;
        info: PropTypes.object;
        errorm: PropTypes.bool;
        bounds: PropTypes.object;
    }
    state = {
        checkinglist: true,
        map: { },
        info: { },
        bounds: { },
        width: window.innerWidth,
        prepmap: false,
        errorm: false
    }

    output({ success }) {
        if (success && !this.state.mapReady) {

            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 30.0083745, lng: 31.2149558 }, 
                zoom: 10
            });
            const bounds = new window.google.maps.LatLngBounds();
            const info = new window.google.maps.info({ maxWidth: 300 });

            this.setState({
                map: map,
                info: info,
                bounds: bounds,
                prepmap: true,
            });
        } else if (this.state.prepmap === true) {
            console.log("Map did not load");
            this.setState({ errorm: true });
        }
    }

    updateWidth = () => {
        const { map, bounds } = this.state;
        this.setState({ width: window.innerWidth });

    }

    listfun = () => {

        const { width, checkinglist, info } = this.state;

        if (width < 500) {
            if (checkinglist === true) {
                info.close();
            }
            this.setState({ checkinglist: checkinglist === false });
        }
    }
    render() {

        const { checkinglist, map, info, bounds, prepmap, errorm } = this.state
        function maperror() {
            if (errorm === true) {
                return (
                    <div id="map-error" className="error" role="alert">
                        Google Maps did not load.  Please try again later...
                   </div>
                )
            } else {
                return (
                    <div className="loading-map">
                        <h4 className="loading-message">Map is loading...</h4>
                    </div>
                )
            }
        }

        return (
            <div className="container" role="main" >
                <nav id="checking" className="checking" onClick={this.listfun}>
                    <path d="pk.eyJ1IjoibW9oZ2EiLCJhIjoiY2prMXlnYmNoMG1xMDNxbnRnZDJidDZiNSJ9.LXn4oq8MHpruuciQecOdXQ"></path>

                    <section id="map" className="map" role="application">
                        {maperror()}
                    </section>
                </nav>
            </div>
            )
        }
    }