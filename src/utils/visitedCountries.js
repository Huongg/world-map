import worldData from './worldData.js'

function colourVisitedCountries() {
  const visitedCountries= ["Vietnam", "Thailand", "Maylaysia", "Singapore", "Cambodia", "Laos", "Indonesia",
                   "England", "France", "Italy", "Monica", "Switzerland", "South Africa", 
                   "America", "China"];

  const visitedCountriesInfo = []; 

  worldData.features.map(d => { 
    let name = d.properties.name;

    visitedCountries.forEach(visitedCountry => {
      if (visitedCountry.includes(name)){
        visitedCountriesInfo.push(d);
        return "#FFC0CB";
      } else {
      	return "#12EA00";
      }
    });

  });

}


// visitedCountriesInfo();
export default colourVisitedCountries;