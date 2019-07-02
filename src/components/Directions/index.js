import React, { Component } from 'react';

import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey="AIzaSyC6mM9WkuBK2g6Pkrv1CdmpG6RQp2woH3I"
        strokeWidth={3}
        strokeColor="#222"
    />
);

export default Directions;