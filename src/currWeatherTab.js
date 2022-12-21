import { app } from "./appController";

const displayCurrWeatherDataFor = async ([lat,lon]) => {
    const mainContentDiv = document.querySelector('.main-content');
    mainContentDiv.textContent = '';
    const contentOneDiv = document.createElement('div');
    contentOneDiv.classList.add('content-one');
    const leftSideDiv = document.createElement('div');
    leftSideDiv.classList.add('left-side');
    const rightSideDiv = document.createElement('div');
    rightSideDiv.classList.add('right-side');
    contentOneDiv.append(leftSideDiv,rightSideDiv);
    const contentTwoDiv = document.createElement('div');
    contentTwoDiv.classList.add('content-two');
    const contentThreeDiv = document.createElement('div');
    contentThreeDiv.classList.add('content-three');
    mainContentDiv.append(contentOneDiv, contentTwoDiv, contentThreeDiv);

    const weatherData = await app.getCurrWeatherDataAt(lat,lon).catch((err) => {
        contentOneDiv.textContent = err;
        return;
    });
    console.log('Weather Data',weatherData);

    leftSideDiv.textContent = '';
    const currDateTimeDiv = document.createElement('div');
    currDateTimeDiv.classList.add('todays-date');
    currDateTimeDiv.textContent = app.getDateTimeAt(weatherData.timezone);
    const minMaxTempDiv = document.createElement('div');
    minMaxTempDiv.classList.add('minmax-temp');
    minMaxTempDiv.textContent = `Day ${Math.round(weatherData.main.temp_max)}\u00b0C \u2191 \u2022 Night ${Math.round(weatherData.main.temp_min)}\u00b0C \u2193`;
    const currTempDiv = document.createElement('div');
    currTempDiv.classList.add('temp');
    currTempDiv.textContent = `${Math.round(weatherData.main.temp)}`;
    const feelsLikeDiv = document.createElement('div');
    feelsLikeDiv.classList.add('feels-like');
    feelsLikeDiv.textContent = `Feels like ${Math.round(weatherData.main.feels_like)}\u00b0C`;
    leftSideDiv.append(currDateTimeDiv,minMaxTempDiv,currTempDiv,feelsLikeDiv);

    rightSideDiv.textContent = '';
    const weatherImage = document.createElement('img');
    weatherImage.src = `./resources/icons/${weatherData.weather[0].icon}.png`;
    const weatherDescriptionDiv = document.createElement('div');
    weatherDescriptionDiv.textContent = weatherData.weather[0].description;
    rightSideDiv.append(weatherImage,weatherDescriptionDiv);

    contentTwoDiv.textContent = '';
    const [sunriseTime,sunsetTime] = app.getSunRiseSunSetAt(weatherData.timezone, weatherData.sys.sunrise, weatherData.sys.sunset);
    const sunriseDiv = document.createElement('div');
    sunriseDiv.classList.add('sunrise');
    sunriseDiv.insertAdjacentHTML('beforeend',`<div>Sunrise</div><div>${sunriseTime}</div>`);
    const sunsetDiv = document.createElement('div');
    sunsetDiv.classList.add('sunset');
    sunsetDiv.insertAdjacentHTML('beforeend',`<div>Sunset</div><div>${sunsetTime}</div>`);
    contentTwoDiv.append(sunriseDiv,sunsetDiv);

    contentThreeDiv.textContent = '';
    contentThreeDiv.insertAdjacentHTML('beforeend','<h5>Current Details</h5>')
    const humidityDiv = document.createElement('div');
    humidityDiv.insertAdjacentHTML('beforeend',`<div>Humidity</div>`);
    humidityDiv.insertAdjacentHTML('beforeend',`<div>${weatherData.main.humidity}%</div>`);
    const pressureDiv = document.createElement('div');
    pressureDiv.insertAdjacentHTML('beforeend',`<div>Pressure</div>`);
    pressureDiv.insertAdjacentHTML('beforeend',`<div>${weatherData.main.pressure.toLocaleString()} mBar</div>`);
    const visibiltyDiv = document.createElement('div');
    visibiltyDiv.insertAdjacentHTML('beforeend',`<div>Visibility</div>`);
    visibiltyDiv.insertAdjacentHTML('beforeend',`<div>${Math.round(weatherData.visibility/1000)} km</div>`);
    const windDiv = document.createElement('div');
    windDiv.insertAdjacentHTML('beforeend',`<div>Wind</div>`);
    windDiv.insertAdjacentHTML('beforeend',`<div>${weatherData.wind.speed} km/h &nbsp;<i class="material-symbols-rounded">&#xe55d</i></div>`);
    contentThreeDiv.append(humidityDiv,pressureDiv,visibiltyDiv,windDiv);
    const windDirectionIcon = document.querySelector('.content-three i');
    windDirectionIcon.style.transform = `rotate(${weatherData.wind.deg}deg)`;
    if (weatherData.rain) {
        const precipitationDiv = document.createElement('div');
        precipitationDiv.insertAdjacentHTML('beforeend',`<div>Precipitation</div>`);
        precipitationDiv.insertAdjacentHTML('beforeend',`<div>${weatherData.rain['1h']} mm (1 hr)</div>`);
        contentThreeDiv.appendChild(precipitationDiv);
        
    }

}

export {displayCurrWeatherDataFor};