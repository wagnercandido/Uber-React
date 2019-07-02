import React, { Component } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';

// import Geocoder from 'react-native-geocoding';

import Search from '../Search';
import Directions from '../Directions';

export default class Map extends Component {
    state = {
        region: null,
        destination: null,
    }

    async componentDidMount() {

        console.log('------- componentDidMount -------');

        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                navigator.geolocation.getCurrentPosition(
                    async ({ coords }) => {
                        latitude = coords.latitude;
                        longitude = coords.longitude;

                        position = {
                            latitude,
                            longitude,
                            latitudeDelta: 0.01383,
                            longitudeDelta: 0.006315
                        }
                        
                        this.state.region = position;

                        this.setState(this.state);
                    }, //sucesso
                    () => { }, //erro
                    {
                        timeout: 200000,
                        enableHighAccuracy: true,
                        maximumAge: 1000
                    }
                );
                console.log("You can use the ACCESS_FINE_LOCATION");
                
            }
            else {
                console.log("ACCESS_FINE_LOCATION permission denied")
            }
        } catch (err) {
            console.log("CATH - permission denied == ACCESS_FINE_LOCATION ==", err)
        }

    }

    handleLocationSelected = (data, { geometry }) => {
        const { location: { lat: latitude, lng: longitude } } = geometry;
        alert('teste')
        
        this.setState({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text,
            }
        })
    }

    render() {
        const { region, destination } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                >
                    {destination && (
                        <Directions
                            origin={region}
                            destination={destination}
                            onReady={() => {
                                
                            }}
                        />
                    )}
                </MapView>

                <Search onLocationsSelected={this.handleLocationSelected} />
            </View>
        );
    }
}
