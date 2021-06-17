import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Table from './Table';
import { sortData , prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import Map from "./Map";

import "./Covid.css";

const CovidTracker = () => {

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("Worldwide");
    const [countryInfo, setCountryInfo]= useState({});
    const [tableData, setTableData]= useState([]);
    const [mapCenter, setMapCenter]= useState({ lat: 20, lng: 77});
    const [mapZoom, setMapZoom]= useState(4);
    const [mapCountries, setMapCountries]= useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(()=>{
        fetch("https://disease.sh/v3/covid-19/all")
        .then((response)=>response.json())
        .then((data)=>{
            setCountryInfo(data);
        });
    },[]);
    //USEEFFECT = runs a piece of code based on given condition
    useEffect(() => {
        // this code inside here will load once
        //async-> send a request to server, wait for it, do something with it
        //await gives a hold to the function to load its state
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => {
                        return (
                            {
                                name: country.country, //United Stated of America, India
                                value: country.countryInfo.iso2 // UK, USA, IN
                            }
                        )
                    });
                    // we need to sort the data case wise 
                    const sortedData= sortData(data);
                    setCountries(countries);
                    setMapCountries(data);
                    setTableData(sortedData);
                })
        }

        // call for async function 
        getCountriesData();

    }, []);

    const changeCountry =async (event) => {
        const countrycode=event.target.value;

        const url = countrycode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countrycode}`;
        //url worldwide=https://disease.sh/v3/covid-19/all
        //url countrywise= https://disease.sh/v3/covid-19/countries/${countrycode}

        await fetch(url)
        .then((response)=> response.json())
        .then((data)=> {
            setCountry(countrycode);
            setCountryInfo(data);
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
        });
    };

    return (
        <div className="App">
            <div className="app_left">
                {/* Header and the drowpdown */}
                <div className="app_header">
                    <h2>Covid-19 Tracker</h2>
                    <FormControl className="app_dropdown">
                        <Select variant="outlined" onChange={changeCountry} value={country} >

                            {/* using hooks to resolve this riditity */}
                            <MenuItem value="Worldwide">Worldwide</MenuItem>
                            {countries.map((country) => {
                                return <MenuItem value={country.value}>{country.name}</MenuItem>
                            })
                            }

                            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
                        <MenuItem value="worldwide">Australia</MenuItem>
                        <MenuItem value="worldwide">India</MenuItem>
                        <MenuItem value="worldwide">Worldwide</MenuItem> */}
                        </Select>
                    </FormControl>

                </div>

                {/* Info Boxes? */}
                <div className="app_stats">
                    {/* for coronavirus cases  */}
                    <InfoBox 
                         isRed
                         active={casesType === "cases"}
                         onClick={(e) => setCasesType('cases')}
                         title="Cases" 
                         cases={prettyPrintStat(countryInfo.todayCases)} 
                         total={prettyPrintStat(countryInfo.cases)} />
                    {/* for Recoveries  */}
                    <InfoBox 
                         active={casesType === "recovered"}
                         onClick={(e) => setCasesType('recovered')}
                         title="Recovered" 
                         cases={prettyPrintStat(countryInfo.todayRecovered)} 
                         total={prettyPrintStat(countryInfo.recovered)} />
                    {/* for Deaths  */}
                    <InfoBox 
                         isRed
                         active={casesType === "deaths"}
                         onClick={(e) => setCasesType('deaths')}
                         title="Deaths" 
                         cases={prettyPrintStat(countryInfo.todayDeaths)} 
                         total={prettyPrintStat(countryInfo.deaths)} />
                </div>

                {/* Map  */}
                <Map 
                    countries={mapCountries}
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>
            <Card className="app_right">
                <CardContent>
                        {/* this is table  */}
                        <h3>Recent Updates</h3>
                        <Table countries={tableData}/>
                        {/* this is live worldwide cases  */}
                        <hr />
                        <h3>Worldwide new {casesType}</h3>
                        <LineGraph casesType={casesType}/>
                </CardContent>
            </Card>
        </div>
    );
}

export default CovidTracker;