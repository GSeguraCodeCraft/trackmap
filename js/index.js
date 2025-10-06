/* Variables */
const search_form = document.querySelector('.header_form');
const errorMessage = document.querySelector('#errorMessage');
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000;
const part1 = 'at_szc6Zpm7';
const part2 = 'JMMhjeyyL6JSBYj';
const part3 = '6APx3W';



//Event listener
search_form.addEventListener('submit', getValue);



//Functions

function sanitizeInput(input) {
    return input.replace(/[<>{}();]/g, '');
}





function getValue(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
        showError('Please wait before making another request.');
        return;
    }
    lastRequestTime = now;
    const value = sanitizeInput(document.querySelector('#ipInput').value.trim());
    if (isValidIPv4(value)) {
        errorMessage.classList.add('hidden');
        search_Ip_Address(value);
    } else {
        showError('Please enter a valid IP address.');
    }
}


  /* Search for an IpAddress */

  async function search_Ip_Address(ip_address) {
    
    const api_key = part1 + part2 + part3;
    const request = await fetch( `https://geo.ipify.org/api/v2/country,city?apiKey=${api_key}&ipAddress=${ip_address}`);
    const response = await request.json();

    errorMessage.classList.add('hidden');
    /* Update the UI on the page */
    const {location, ip, isp } = response;

    update_ui(ip, location.city, location.timezone, isp);

    /* Update the map on the page */
  /* first remove all map instances if any */
  if (map !== undefined && map !== null) {
    map.remove();
  }
  create_map(location.lat, location.lng, location.country, location.region);
      
}

/* Creates the map */

let map;
function create_map(lat, lng, country, region) {
    map = L.map('map').setView([lat, lng], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    /* Add marker to the map */
    const my_icon = L.icon({
        iconUrl: 'images/icon-location.svg',
        iconSize: [40, 60],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
       
    })
    L.marker([lat, lng], {icon: my_icon}).addTo(map)
    .bindPopup(`${region}, ${country}`)
    .openPopup();
}
    
    /* update UI function */
    function update_ui(ip_address, location, timezone, isp){
      /* select all the elements on the page */
      const address = document.querySelector('#ip-address');
      const city = document.querySelector('#location');
      const utc = document.querySelector('#utc');
      const isprovider = document.querySelector('#isp');

      /* Update and sanitize all the elements on the page */
    
    address.textContent = sanitizeInput(ip_address);
    city.textContent = sanitizeInput(location);
    utc.textContent = 'UTC' + sanitizeInput(timezone);
    isprovider.textContent = sanitizeInput(isp);

    }
    
  





/* Create map with default values when page loads */
const defaultIp = "26.37.52.179";
search_Ip_Address(defaultIp)



/* IP Validation */
function isValidIPv4(ipAddress) {
  // Regular expression to match a valid IPv4 address
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

  // Test the input string against the regular expression
  return ipv4Regex.test(ipAddress);
}

// Allow search on pressing Enter key
            ipInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    searchButton.click();
                }
            });

            // Initial load for the placeholder IP
            search_Ip_Address(ipInput.value.trim());


            



            /**
            
            **/
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.classList.remove('hidden');
            }
