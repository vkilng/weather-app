import { app } from "./appController";
import {displayCurrWeatherDataFor} from "./currWeatherTab";
import { displayForecastWeatherDataFor } from "./forecastWeatherTab";

const screenController = (() => {
    let lat, lon;

    const focusTabOnClick = (() => {
        const tabs = document.querySelectorAll('.navigation div');
        const switchFocus = () => {
            for (let i=0; i<tabs.length; i++) {
                tabs[i].classList.toggle('focused');
            }
        }
        tabs[0].addEventListener('click',() => {
            switchFocus();
            displayCurrWeatherDataFor([lat,lon]);
        });
        tabs[1].addEventListener('click',() => {
            switchFocus();
            displayForecastWeatherDataFor([lat,lon]);
        })
        return {switchFocus};
    })();

    const searchInput = document.querySelector('input');

    const displaySearchResults = async () => {
        const searchResultsObj = await app.getSearchResults(searchInput.value);
        const searchResults = searchResultsObj.features;//Array of location/place objects
        //console.log(searchResults);
        
        const dropdownDiv = document.querySelector('.drop-down');
        dropdownDiv.textContent = '';
        searchResults.forEach(searchOption => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('search-option');
            optionDiv.textContent = app.getSearchOptionContent(searchOption);
            optionDiv.insertAdjacentHTML('afterbegin','<i class="material-symbols-rounded">location_on</i>');
            dropdownDiv.appendChild(optionDiv);
            optionDiv.addEventListener('click',() => {
                searchInput.value = app.getSearchOptionContent(searchOption);
                //console.log(searchOption.geometry.coordinates);
                dropdownDiv.textContent = '';
                [lon,lat] = searchOption.geometry.coordinates;//Weird response. Who tf presents lon before lat, you ask? This API does.
                displayCurrWeatherDataFor([lat,lon]);
                if (document.querySelector('.navigation div:last-of-type').classList.contains('focused')) {focusTabOnClick.switchFocus()};
            })
        });
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