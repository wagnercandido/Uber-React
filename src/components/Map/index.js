import React, { Component } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';

export default class Map extends Component {
    state = {
        region: null
    }

    async componentDidMount() {
        try {
            const granted = await PermissionsAndroid.request(
                "android.permission.ACCESS_FINE_LOCATION",
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert('ok');
            } else {
                alert('error')
            }
        } catch (err) {
            alert('erro catch')
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords: latitude, longitude }) => {
                this.setState({
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }
                })
            }, //Sucesso
            () => { }, //Erro
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000, //armazenar a localização no cache
            }
        )
    }

    

    render() {
        const { region } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    loadingEnabled
                />
            </View>
        );
    }
}
