const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  passTimes.forEach(pass => console.log(`Next pass at ${Date(pass.risetime)} for ${pass.duration} seconds!`));
});
