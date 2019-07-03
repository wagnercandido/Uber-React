import React, { Component, Fragment } from 'react';
import { View, Image, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Geocoder from 'react-native-geocoding';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';
import { getPixelSize } from '../../utils';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { LocationBox, LocationText, LocationTimeBox, LocationTimeTextSmall, LocationTimeText, Back } from './styles';

Geocoder.init("AIzaSyC6mM9WkuBK2g6Pkrv1CdmpG6RQp2woH3I");

export default class Map extends Component {
    state = {
        region: null,
        destination: null,
        location: null,
        duration: null,
    }

    async componentDidMount() {

        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                navigator.geolocation.getCurrentPosition(
                    async ({ coords }) => {
                        latitude = coords.latitude;
                        longitude = coords.longitude;

                        const response = await Geocoder.from({ latitude, longitude });
                        const address = response.results[0].formatted_address;
                        const location = address.substring(0, address.indexOf(","));

                        position = {
                            latitude,
                            longitude,
                            latitudeDelta: 0.01383,
                            longitudeDelta: 0.006315
                        }

                        this.state.region = position;
                        this.state.location = location;

                        this.setState(this.state);
                    }, //sucesso
                    () => { }, //erro
                    {
                        timeout: 200000,
                        enableHighAccuracy: true,
                        maximumAge: 1000
                    }
                );
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

        this.setState({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text,
            }
        });
    }

    handleBack = () => {
        this.setState({destination: null});
    }

    render() {
        const { region, destination, duration, location } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                    ref={element => this.mapView = element}
                >
                    {destination && (
                        <Fragment>
                            <Directions
                                origin={region}
                                destination={destination}
                                onReady={(result) => {
                                    this.setState({ duration: Math.floor(result.duration) });
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: getPixelSize(50),
                                            left: getPixelSize(50),
                                            top: getPixelSize(50),
                                            bottom: getPixelSize(350)
                                        }
                                    });
                                }}
                            />
                            <Marker
                                coordinate={destination}
                                anchor={{ x: 0, y: 0 }}
                                image={markerImage}
                            >
                                <LocationBox>
                                    <LocationText>{destination.title}</LocationText>
                                </LocationBox>
                            </Marker>
                            <Marker
                                coordinate={region}
                                anchor={{ x: 0, y: 0 }}
                                image={markerImage}
                            >
                                <LocationBox>
                                    <LocationTimeBox>
                                        <LocationTimeText>{duration}</LocationTimeText>
                                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                    </LocationTimeBox>
                                    <LocationText>{location}</LocationText>
                                </LocationBox>
                            </Marker>
                        </Fragment>
                    )}
                </MapView>

                {destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack} >
                            <Image source={backImage} />
                        </Back>
                        <Details />
                    </Fragment>
                ) : <Search onLocationSelected={this.handleLocationSelected} />}

            </View>
        );
    }
}
