import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scriptLoader from 'react-async-script-loader';
import viewingcontrol from './viewcontrol';
import map from './map'
import logo from './logo.svg';
import './App.css';
class App extends Component {

    static constructor() {
        map: PropTypes.object;
        prepmap: PropTypes.bool;
        info: PropTypes.object;
        errorm: PropTypes.bool;
        bounds: PropTypes.object;

    }
    state = {
        checkinglist: true,
        map: {},
        info: {},
        bounds: {},
        width: window.innerWidth,
        prepmap: false,
        errorm: false
}

    componentDidMount() {
        window.addEventListener("resize", this.updateWidth);
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
        function classname() {
            if (checkinglist === true) {
                return "list open"
            } else {
                return "list"
            }
        }
        function tabindex() {
            if (checkinglist === true) {
                return '0'
            } else {
                return '-1'
            }
        }
        function mapready() {
            if (prepmap === true) {
                return (
                    <viewingcontrol
                        map={map}
                        info={info}
                        bounds={bounds}
                        listfun={this.listfun}
                        checkinglist={checkinglist}
                    />
                )
            } else {
                return (<p>loading error</p>)
            }
        }

        return (
            <div className="container" role="main">
                <nav id="checking" className="checking" onClick={this.listfun}>
                </nav>
                <section
                    id="restaurant-list"
                    className={classname()}
                    role="complementary"
                    tabIndex={tabindex()}
                >
                    {mapready()}

                </section>
                <map id="map"
                    className="map"
                    role="application"
                />

            </div>
            
        );
    }
}



export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyALbJJU0brE9_kXjLYVk6i7MOWjsvVYkXM`]
)(App);
