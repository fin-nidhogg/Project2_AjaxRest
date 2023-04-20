
// Global variables
const dropdown = document.getElementById('dropdown');
const showsTable = document.getElementById('shows');
const dateInput = document.getElementById('date');

// Instantly after loading window, get and render all possible theatre options from finnkino API
window.onload = function () {
    console.log("Document loaded!");
    getAreas();
    getShows(); // Get initial list of all shows today when no value selected
};

////////////////////////////////////////////////////////
//  Trigger the getShows() function if 
//  a change is detected in the drop-down menu.
//////////////////////////////////////////////////////// 

dropdown.addEventListener("change", () => {
    let dropvalue = document.getElementById('dropdown').value;
    getShows(dropvalue, dateInput.value);
});

////////////////////////////////////////////////////////
//  GET selectable theaters from Finnkino's API and 
//  create options based on response data.
//////////////////////////////////////////////////////// 

function getAreas() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://www.finnkino.fi/xml/TheatreAreas/', true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('Getting theatres OK');
            createSelections(this);
        }
    };
    xhttp.send();
};

////////////////////////////////////////////////////////
//  Function to create new selection option to dropdown
//////////////////////////////////////////////////////// 

function createSelections(xml) {
    let xmlData = xml.responseXML;
    let theatres = xmlData.getElementsByTagName("TheatreArea");

    for (let i = 0; i < theatres.length; i++) {
        let value = theatres[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
        let name = theatres[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
        let htmlElement = `<option value="${value}">${name}</option>`
        dropdown.innerHTML += htmlElement;
    };
};

//////////////////////////////////////////////////////
//  Function to get all shows of desired
//  theatre and date. Date defaults today if none given.
//////////////////////////////////////////////////////

function getShows(theatreArea, inputDate) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://www.finnkino.fi/xml/Schedule/?area=' + theatreArea + '&dt=' + inputDate, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('Requesting shows done!');
            createShows(this);
        }
    };
    xhttp.send();
};

//////////////////////////////////////////////////////
//  Function to create show element
//////////////////////////////////////////////////////

function createShows(xml) {
    let xmlData = xml.responseXML;
    let shows = xmlData.getElementsByTagName("Show");
    showsTable.innerHTML = '';

    // Iterate through the shows list
    for (let i = 0; i < shows.length; i++) {

        // Let's read the necessary information into variables from the returned xml for later use.

        let title = shows[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
        let prodYear = shows[i].getElementsByTagName("ProductionYear")[0].childNodes[0].nodeValue;
        let genres = shows[i].getElementsByTagName("Genres")[0].childNodes[0].nodeValue;
        let lengthInMinutes = shows[i].getElementsByTagName("LengthInMinutes")[0].childNodes[0].nodeValue;
        let showStart = shows[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue;
        let theatreAuditorium = shows[i].getElementsByTagName("TheatreAndAuditorium")[0].childNodes[0].nodeValue;
        let eventLink = shows[i].getElementsByTagName("EventURL")[0].childNodes[0].nodeValue;
        let showLink = shows[i].getElementsByTagName("ShowURL")[0].childNodes[0].nodeValue;
        let moviePicture = shows[i].getElementsByTagName("EventSmallImagePortrait")[0].childNodes[0].nodeValue;

        // Quick and dirty way to create html element with "template literals".

        let htmlElement = `<tr>
        <td><img class="img-fluid" src="${moviePicture}" alt="${title}"></td>
        <td colspan="3"><p><h2><a href="${eventLink}" target="_blank">${title} - ${prodYear}</a></h2>
        ${genres} Kesto: ${lengthInMinutes} Minuuttia</p>
        <h5><a href="${showLink}" target="_blank">Näytös: ${parseTimestamp(showStart)} | ${theatreAuditorium}</a></h5>
        </td>
    </tr>`
        showsTable.innerHTML += htmlElement;
    };
};

//////////////////////////////////////////////////////
//  Function to parse timestamp to more readable form
//////////////////////////////////////////////////////

function parseTimestamp(timestamp) {
    unixTime = Date.parse(timestamp);
    let date = new Date(unixTime);
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleTimeString("fi-FI", options);
};