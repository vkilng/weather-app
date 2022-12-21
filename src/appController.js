import { addMinutes, format } from "date-fns";

const appController = () => {
    const getCurrWeatherDataAt = async (lat,lon) => {
        const responseObj = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dbdce1224fbb3c2caaf667ca475feca5&units=metric`,{mode: "cors"}).catch((error) => {
            document.querySelector('.main-content').textContent = error;
            return;
        });
        const jsObj = await responseObj.json();
        return jsObj;
    }

    const getForecastWeatherDataAt = async (lat,lon) => {
        const responseObj = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dbdce1224fbb3c2caaf667ca475feca5&units=metric`,{mode: "cors"}).catch((error) => {
            document.querySelector('.main-content').textContent = error;
            return;
        });
        const jsObj = await responseObj.json();
        return jsObj;
    }

    const getSearchResults = async (searchQuery) => {
        const responseObj = await fetch(`https://photon.komoot.io/api/?q=${searchQuery}&limit=4`,{mode: "cors"}).catch((error) => {
            document.querySelector('.main-content').textContent = error;
            return;
        });
        const jsObj = await responseObj.json();
        return jsObj;
    }
    const getSearchOptionContent = (searchOption) => {
        let str = searchOption.properties.name;
        if (searchOption.properties.street) str += `, ${searchOption.properties.street}`;
        if (searchOption.properties.county) str += `, ${searchOption.properties.county}`;
        if (searchOption.properties.city) str += `, ${searchOption.properties.city}`;
        if (searchOption.properties.state) str += `, ${searchOption.properties.state}`;
        if (searchOption.properties.country) str += `, ${searchOption.properties.country}`;
        return str;
    }
    
    const getOffsetFromLocale = (offsetFromUTC) => {
        return (new Date().getTimezoneOffset() + (offsetFromUTC/60));
    }
    const getDateTimeAt = (offsetFromUTC, givenTime = new Date()) => {
        const offsetFromLocale = getOffsetFromLocale(offsetFromUTC);
        const dateTimeString = format(addMinutes(new Date(givenTime),offsetFromLocale),'dd LLLL, hh:mm aaa');
        return dateTimeString;
    }
    const getSunRiseSunSetAt = (offsetFromUTC, sunriseAtUTC, sunsetAtUTC) => {
        const offsetFromLocale = getOffsetFromLocale(offsetFromUTC);
        const sunriseTime = format(addMinutes(new Date(sunriseAtUTC*1000),offsetFromLocale),'hh:mm aa');
        const sunsetTime = format(addMinutes(new Date(sunsetAtUTC*1000),offsetFromLocale),'hh:mm aa');
        return [sunriseTime,sunsetTime];
    }

    return {getCurrWeatherDataAt, getForecastWeatherDataAt, getSearchResults,
        getSearchOptionContent, getDateTimeAt, getSunRiseSunSetAt};
}

const app = appController();

export {app};