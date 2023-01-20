const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = (array) => {
  array.forEach(pass => console.log(`Next pass at ${Date(pass.risetime)} for ${pass.duration} seconds!`));
};
nextISSTimesForMyLocation()
  .then(result => printPassTimes(result))
  .catch((error) => console.log("It didn't work: ", error.message));