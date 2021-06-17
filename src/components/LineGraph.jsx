import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import { Line } from 'react-chartjs-2';

const options = {
    plugins:
    {
        legend: {
            display: false,
        },
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem) {
                return numeral(tooltipItem).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};


function Linegraph({ casesType = "cases" }) {
    const [data, setData] = useState({});
    //https://disease.sh/v3/covid-19/historical/all?lastdays=30



    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // console.log(data.cases);
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        };
        fetchData();
    }, [casesType]);


    return (
        <div className="Linegraph">
            {data && data.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                label: "Cases",
                                backgroundColor: "rgba(204,16,52,0.5)",
                                borderColor: "#CC1034",
                                data: data,
                                fill: true,
                            },
                            
                        ]
                    }}
                    options={options}
                />
            )}
        </div>
    )
}

export default Linegraph;
