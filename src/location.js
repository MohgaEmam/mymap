import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class locationcontrol extends Component {
    static constructor() {
        locations: PropTypes.object.isRequired;
        menu: PropTypes.bool.isRequired;
    }


    render() {

        function checking(menu) {
            if (menu === true) {
                return '0'
            } else {
                return '1'
            }
        }

        function info() {
            window.google.maps.event.trigger(this.props.locations.marker, 'click');
        }

        const { locations, menu } = this.props;

        return (
            <li className="place">
                <div
                    onClick={this.info}
                    onKeyPress={this.info}
                    role="button"
                    tabIndex={checking()}
                >
                    {locations.name}
                </div>
            </li>
        );
    }
}
