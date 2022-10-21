
// get the data from json file
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function () {
    const json = JSON.parse(req.response);

    heatMap(json);
}


function heatMap(jsonData) {
    const baseTemp = jsonData.baseTemperature;
    const dataset = jsonData.monthlyVariance;


    // create xScale and yScale
    let w = 1600;
    let h = 650;
    let padding = 180;
    // years
    const xMin = d3.min(dataset, (d) => d.year);
    const xMax = d3.max(dataset, (d) => d.year);
    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([padding, w - padding]);

    // colors
    const colors = ["rgb(27, 117, 252)", "rgb(69, 181, 251)", "rgb(162, 219, 254)", "rgb(213, 239, 255)", "rgb(255, 253, 193)", "rgb(251, 197, 152)","rgb(255, 169, 99)","rgb(237, 132, 57)","rgb(224, 0, 0)", "rgb(141, 0, 0)"]
    // months
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const yMin = d3.min(dataset, (d) => d.month);
    const yMax = d3.max(dataset, (d) => d.month);
    const yScale = d3.scaleLinear()
        .domain([yMax + 0.5, yMin - 0.5])
        .range([h - padding, 0]);

    // create svg
    const svg = d3.select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h)

    // plot
    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('width', 5)
        .attr('height', 40)
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.month))
        .attr('data-year', (d) => d.year)
        .attr('data-month', (d) => d.month-1)
        .attr('data-temp', (d) => baseTemp+d.variance)
        .attr('data-var', (d) => d.variance)
        .attr('fill', (d) => {
            let temp = baseTemp + d.variance;
            if (temp < 3.9) {
                return colors[0];
            }
            else if (temp < 5.0) {
                return colors[1];
            }
            else if (temp < 6.1) {
                return colors[2];
            }
            else if (temp < 7.2) {
                return colors[3];
            }
            else if (temp < 8.3) {
                return colors[4];
            }
            else if (temp < 9.5) {
                return colors[5];
            }
            else if (temp < 10.6) {
                return colors[6];
            }
            else if (temp < 11.7) {
                return colors[7];
            }
            else if (temp < 12.8) {
                return colors[8];
            }
            else {
                return colors[9];
            }
        })
        .on("mouseover", function(){
            let xPosition = d3.select(this).attr('x');
            let yPosition = d3.select(this).attr('y');
            let year = d3.select(this).attr('data-year');
            let month = months[d3.select(this).attr('data-month') -1];
            let temp = Number(d3.select(this).attr('data-temp')).toFixed(2);
            let variance = Number(d3.select(this).attr('data-var')).toFixed(2);

      
            d3.select('#tooltip')
                .transition()
                .duration(100)
                .style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .attr('data-year', year);
            
            document.getElementById('value').innerHTML = `${year} - ${month}<br>${temp}<sup>o</sup>C<br>${variance}<sup>o</sup>C`

            // show tooltip
            d3.select('#tooltip').classed('hidden', false);
        })
        .on("mouseout", function(){
            d3.select('#tooltip').classed('hidden', true);
        })

    // create x-axis and y-axis
    const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d3.format('d'));
    svg.append('g')
        .attr('transform', `translate(0, ${h - padding + 20})`)
        .attr('id','x-axis')
        .style('font-size', '14px')
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale).ticks(14).tickFormat((d, i) => months[11 - i]);
    svg.append('g')
        .attr('transform', `translate(${padding}, 20)`)
        .attr('id', 'y-axis')
        .style('font-size', '14px')
        .call(yAxis);

    // legend
    const legendScaleX = d3.scaleLinear().domain([1.7, 13.9]).range([200.0, 610.0]);
    const legendValues= [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

    const legend = svg.append('g')
    .attr('id', 'legend')
    .selectAll('div')
    .data(legendValues)
    .enter()
    .append('rect')
    .attr('x', (d) => legendScaleX(d)-20)
    .attr('y', h-80)
    .attr('width',40)
    .attr('height', 40)
    .attr('fill', (d,i) => colors[i])
    .style('stroke', 'black')
    .style('stroke-width','1px')

    const legendXaxis = d3.axisBottom(legendScaleX).ticks(10).tickValues(legendValues).tickFormat(d3.format('.1f'));

    svg.append('g')
    .attr('transform', `translate(0, ${h-40})`)
    .attr('font-size', '16px')
    .call(legendXaxis);
    
}