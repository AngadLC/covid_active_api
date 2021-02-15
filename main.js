// all global variables
var countrypiechartvar;
const xlabels = []
const ylables = []
const reco = []
const deaths1 = []
const active1 = []
// getting all the data from api and storing 
let alldata = []

// leaflet map
var mymap = L.map('mapid').setView([28.314053058069618, 84.82818603515625], 7);
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


// chart.js
// getting pie chart
getpie()
// getting line chart
getchart();
async function getchart() {
    var data = await getdata();
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Country active covid cases',
                data: ylables,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor:
                    'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 1000000,
                        min: 1000,
                        stepSize: 10000
                    }
                }]
            }
        }
    });
}


async function getdata() {
    await fetch('https://corona.lmao.ninja/v2/countries?fbclid=IwAR1SM_J_74xVI38XBvMxCnN4HoWsM_ub-sMXPcZ1fjwiq-cUT1PPGaDi3Ao')
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            // console.log(data[0].countryInfo.lat)
            data.forEach(element => {
                var lat = parseFloat(element.countryInfo.lat)
                var lng = parseFloat(element.countryInfo.long)
                // console.log(lat)
                var marker = L.marker([lat, lng], {
                    title: `${element.country} Active cases ${element.active}`
                }).on('click', displaydata).addTo(mymap);
                alldata.push(element)
                const { country, active } = element
                xlabels.push(country)
                ylables.push(active)
            });
        })
}
// getting data of the marker
function displaydata(e) {
    // console.log(e)
    // console.log('hi')
    alldata.forEach(element => {
        //  console.log(element)
        if (element.countryInfo.lat == e.target._latlng.lat && element.countryInfo.long == e.target._latlng.lng) {
            // element.preventDefault()
            console.log(element)
            let {active, continent, country, deaths, recovered, todayCases, todayDeaths} = element
            const loadingdata = document.getElementById('popupcontent')
                .innerHTML = `Continent : ${continent}
                         country: ${country},
                         active People = ${active} 
                         Total death = ${deaths}
                         Today  new cases = ${todayCases}
                         Today Death = ${todayDeaths}
                 `
            const loadingh1 = document.getElementById('countryinfo')
                .innerHTML = ` ${country}`
            // For a pie chart
            const countrypiechart = document.getElementById('cpie').getContext('2d');
            if (countrypiechartvar != undefined) {
                removeData(countrypiechartvar)
            }
            countrypiechartvar = new Chart(countrypiechart, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: [active, deaths, recovered],
                        backgroundColor: ['rgba(186, 175, 26)', 'rgba(240, 46, 55)', 'rgba(120, 179, 86)']
                    }],
                    labels: [
                        'Active',
                        'Deaths',
                        'Recover'
                    ]
                }

            })



        }
    })
}
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
}

// fetch api of the all records
async function getwhole() {
    await fetch("https://disease.sh/v3/covid-19/all")
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const { active, deaths, recovered } = data
            console.log(active)
            active1.push(active)
            deaths1.push(deaths)
            reco.push(recovered)

        })
}
// generating pie chart
async function getpie() {
    var data = await getwhole();
    const ctm = document.getElementById('pie').getContext('2d');
    // For a pie chart
    var myPieChart = new Chart(ctm, {
        type: 'pie',
        data: {
            datasets: [{
                data: [active1, deaths1, reco],
                backgroundColor: ['rgba(186, 175, 26)', 'rgba(240, 46, 55)', 'rgba(120, 179, 86)']
            }],
            labels: [
                'Active',
                'Deaths',
                'Recover'
            ]
        }
    });

}