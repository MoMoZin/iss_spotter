const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (body) {
      return callback(null, JSON.parse(body).ip);
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  // use request to fetch IP address from JSON API
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    const objBody = JSON.parse(body);
    if (!objBody.success) {
      const msg = `AIP call failed when fetching coordinate for IP ${ip}. Response: ${objBody.message}`;
      callback(Error(msg), null);
      return;
    }

    const result = {
      latitude: objBody.latitude,
      longitude: objBody.latitude,
    };
    return callback(null, result);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  // use request to fetch IP address from JSON API
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover time. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    return callback(null, JSON.parse(body).response);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
// const nextISSTimesForMyLocation = function(callback) {
//   fetchMyIP((err, ip) => ip)
//     .then(ip => {
//       fetchCoordsByIP(ip, (err, coords) => coords);
//     })
//     .then(coords => {
//       fetchISSFlyOverTimes(coords, (err, data) => console.log("final result: ", data));
//     })
//     .catch(err => console.log(err));
//   // empty for now
// };

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }

        callback(null, data);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation
};
