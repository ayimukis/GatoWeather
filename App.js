import {ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator} from 'react-native';
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {getCurrentPositionAsync} from "expo-location";
import {Fontisto} from '@expo/vector-icons';


const {width: SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = "6391c146865344b5706499578483b822";

const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
}

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);

    const [location, setLocation] = useState();
    const [ok, setOk] = useState(true);
    const ask = async () => {
        const {granted} = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
        const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
        setCity(location[0].city);
        const response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?id=524901&lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const json = await response.json();
        console.log(json);
        setDays(json.daily);
    }
    useEffect(() => {
        ask();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                indicatorStyle="white"
                contentContainerStyle={styles.weather}
            >

                {days.length === 0 ? (
                    <View style={{...styles.day, alignItems: "center"}}>
                        <ActivityIndicator color="white" size="large" style={{marginTop: 10}}/>
                    </View>
                ) : (
                    days.map((day, index) => {
                        const date = new Date(day.dt * 1000);
                        const yyyy = date.getFullYear();
                        const mm = date.getMonth()+1;
                        const dd = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
                        return (
                            <View key={index}>
                                <View style={styles.dateView} >
                                    <Text style={styles.date}>
                                        {/*{yyyy}년*/}
                                        {mm}월{dd}일
                                    </Text>
                                </View>
                                <View style={styles.day} >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%"
                                        }}
                                    >

                                        <Text style={styles.temp}>
                                            {parseFloat(day.temp.day).toFixed(1)}
                                        </Text>

                                        <Fontisto name={icons[day.weather[0].main]} size={68} color="#DEFCF9"/>
                                    </View>
                                    <Text style={styles.description}>{day.weather[0].main}</Text>
                                    <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                                </View>
                            </View>
                    )}

                    )

                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#CCA8E9",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center"
    },
    cityName: {
        fontSize: 58,
        fontWeight: "500",
        color: "#DEFCF9"
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "flex-start",
        paddingHorizontal: 20,
    },
    dateView: {
        width: SCREEN_WIDTH,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    temp: {
        marginTop: 50,
        fontSize: 100,
        color: "#DEFCF9",
    },
    date: {
        marginTop: 50,
        fontSize: 60,
        color: "#CADEFC",
    },
    description: {
        marginTop: -10,
        fontSize: 30,
        fontWeight: "500",
        color: "#DEFCF9",
    },
    tinyText: {
        marginTop: -5,
        fontSize: 25,
        fontWeight: "500",
        color: "#DEFCF9",
    }
})