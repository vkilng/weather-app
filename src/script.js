import { addMinutes, format } from "date-fns.js";

const appController = () => {
    const getWeatherDataAt = async (lat,lon) => {
        const responseObj = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dbdce1224fbb3c2caaf667ca475feca5&units=metric`,{mode: "cors"});
        const jsObj = await responseObj.json();
        return jsObj;
    }
    const getSearchResults = async (searchQuery) => {
        const responseObj = await fetch(`https://photon.komoot.io/api/?q=${searchQuery}&limit=4`,{mode: "cors"});
        const jsObj = await responseObj.json();
        return jsObj;
    }

    return {getWeatherDataAt, getSearchResults};
}

const screenController = (() => {
    const app = appController();
    const searchInput = document.querySelector('input');

    const getSearchOptionContent = (searchOption) => {
        let str = searchOption.properties.name;
        if (searchOption.properties.street) str += `, ${searchOption.properties.street}`;
        if (searchOption.properties.county) str += `, ${searchOption.properties.county}`;
        if (searchOption.properties.city) str += `, ${searchOption.properties.city}`;
        if (searchOption.properties.state) str += `, ${searchOption.properties.state}`;
        if (searchOption.properties.country) str += `, ${searchOption.properties.country}`;
        return str;
    }

    const displaySearchResults = async () => {
        const searchResultsObj = await app.getSearchResults(searchInput.value);
        const searchResults = searchResultsObj.features;//Array of location/place objects
        //console.log(searchResults);
        
        const dropdownDiv = document.querySelector('.drop-down');
        dropdownDiv.textContent = '';
        searchResults.forEach(searchOption => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('search-option');
            optionDiv.textContent = getSearchOptionContent(searchOption);
            optionDiv.insertAdjacentHTML('afterbegin','<i class="material-symbols-rounded">location_on</i>');
            dropdownDiv.appendChild(optionDiv);
            optionDiv.addEventListener('click',() => {
                searchInput.value = getSearchOptionContent(searchOption);
                //console.log(searchOption.geometry.coordinates);
                dropdownDiv.textContent = '';
                displayWeatherDataFor(searchOption.geometry.coordinates);
            })
        });
    }

    const displayWeatherDataFor = async ([lon,lat]) => {
        const weatherData = await app.getWeatherDataAt(lat,lon);
        console.log(weatherData);
        const currDateTimeOfPlaceDiv = document.querySelector('.todays-date');
        const offset = new Date().getTimezoneOffset() + (weatherData.timezone/60);
        const dateTimeString = format(addMinutes(new Date(),offset),'DD MMMM, hh:m a');
        currDateTimeOfPlaceDiv.textContent = `It's ${dateTimeString} in ${weatherData.name}`;
    }

    let delaySearchTimer;
    searchInput.addEventListener('input',() => {
        clearTimeout(delaySearchTimer);
        delaySearchTimer = setTimeout(() => {
            if (searchInput.value != '') displaySearchResults();
        }, 500);
    });

    document.addEventListener('keyup',(e) => {
        if (e.key === "Escape") document.querySelector('.drop-down').textContent = '';
    })

    //test render
    displaySearchResults();

})();