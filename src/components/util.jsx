import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        mulitiplier: 800,
    },

    recovered: {
        hex: "#7DD71D",
        mulitiplier: 1200,
    },

    deaths: {
        hex: "#C0C0C0",
        mulitiplier: 2000,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            // if return dont swap the data therefore return -1 to stop swapping 
            return -1;
        } else {
            return 1;
        }
    })

    return sortedData;
};

export const prettyPrintStat = (stat) =>{
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
}
// draw circles on map with Interactive tooltip 
export const showDataOnMap = (data, casesType = 'cases') =>
    data.map((country) => (
        <Circle
          center={[country.countryInfo.lat, country.countryInfo.long]}
          fillOpacity={0.4}
          pathOptions={{
            color: casesTypeColors[casesType].hex,
            fillColor: casesTypeColors[casesType].hex,
          }}
          radius={
            Math.sqrt(country[casesType] / 10) * casesTypeColors[casesType].mulitiplier
          }
        >
        
          <Popup>
            <div className="info-container">
              <div
                className="info-flag"
                style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
              />
              <div className="info-name">{country.country}</div>
              <div className="info-confirmed">
                Cases: {numeral(country.cases).format("0,0")}
              </div>
              <div className="info-recovered">
                Recovered: {numeral(country.recovered).format("0,0")}
              </div>
              <div className="info-deaths">
                Deaths: {numeral(country.deaths).format("0,0")}
              </div>
            </div>
          </Popup>
        </Circle>
    ));
