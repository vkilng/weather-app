import { app } from "./appController";

const displayForecastWeatherDataFor = async ([lat,lon]) => {
    const mainContentDiv = document.querySelector('.main-content');
    mainContentDiv.textContent = '';
    const todayForecastDiv = document.createElement('div');
    todayForecastDiv.classList.add('today-forecast');
    mainContentDiv.appendChild(todayForecastDiv);
    todayForecastDiv.insertAdjacentHTML('beforebegin',`Today`);
    const tmrwForecastDiv = document.createElement('div');
    tmrwForecastDiv.classList.add('tmrw-forecast');
    mainContentDiv.appendChild(tmrwForecastDiv);
    tmrwForecastDiv.insertAdjacentHTML('beforebegin',`Tomorrow`);

    const forecastWeatherData = await app.getForecastWeatherDataAt(lat,lon).catch((err) => {
        contentOneDiv.textContent = err;
        return;
    });
    console.log('Forecast Weather Data',forecastWeatherData);

    let daysafterDate;

    forecastWeatherData.list.forEach(forecastObj => {
        const card = document.createElement('div');
        card.classList.add('card');
        const forecastWeatherImg = document.createElement('img');
        forecastWeatherImg.src = `./resources/icons/${forecastObj.weather[0].icon}.png`;
        const forecastWeatherPop = document.createElement('div');
        forecastWeatherPop.textContent = `Precipitation ${Math.round(forecastObj.pop*100)}%`;
        const forecastWeatherTemp = document.createElement('div');
        forecastWeatherTemp.textContent = `${Math.round(forecastObj.main.temp)}\u00b0C`;
        const forecastTimeDiv = document.createElement('div');
        const forecastTime = app.getDateTimeAt(forecastWeatherData.city.timezone,forecastObj.dt*1000).slice(-8)
        forecastTimeDiv.textContent = forecastTime;
        card.append(forecastWeatherImg,forecastWeatherPop,forecastWeatherTemp,forecastTimeDiv);

        //Segregating cards into today, tmrw and more
        const forecastDate = app.getDateTimeAt(forecastWeatherData.city.timezone,forecastObj.dt*1000).slice(0,2);
        const todaysDate = app.getDateTimeAt(forecastWeatherData.city.timezone).slice(0,2);
        const tmrwDate = `${parseInt(todaysDate)+1}`;
        if (forecastDate === todaysDate) { todayForecastDiv.appendChild(card) }
        else if (forecastDate === tmrwDate) { tmrwForecastDiv.appendChild(card) }
        else {
            if (!document.querySelector(`.main-content div[data-day="${forecastDate}"]`)) {
                const daysAfterForecastDiv = document.createElement('div');
                daysAfterForecastDiv.classList.add('daysafter-forecast');
                daysAfterForecastDiv.dataset.day = forecastDate;
                mainContentDiv.appendChild(daysAfterForecastDiv);
                daysAfterForecastDiv.insertAdjacentHTML('beforebegin',`${app.getDateTimeAt(forecastWeatherData.city.timezone,forecastObj.dt*1000).split(',')[0]}`);
            }
            document.querySelector(`.main-content div[data-day="${forecastDate}"]`).appendChild(card);
        }
    });
}

export {displayForecastWeatherDataFor};