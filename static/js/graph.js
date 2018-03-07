queue()
    .defer(d3.json, "/debris/projects")
    .await(makeGraphs);

function makeGraphs(error, debrisProjects) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }



    var dateFormat = d3.time.format("%Y-%m-%d");
    debrisProjects.forEach(function () {
       dateFormat(new Date('1483285220'));
    });




    var ndx = crossfilter(debrisProjects);

    var timestampDim = ndx.dimension(function (d) {
        return d["Timestamp"];
    });

    var itemNameTypeDim = ndx.dimension(function (d) {
        return d["ItemName"];
    });

    var listNameDim = ndx.dimension(function (d) {
        return d["ListName"];
    });

     var locationDim = ndx.dimension(function (d) {
        return d["Location"];
    });

    var quantityLevelDim = ndx.dimension(function (d) {
        return d["Quantity"];
    });




    var numProjectsByTime = timestampDim.group();
    var numProjectsByItemName = itemNameTypeDim.group();
    var numProjectsByListName = listNameDim.group();
    var numProjectsByLocation = locationDim.group();
    var numProjectByQuantity = quantityLevelDim.group();
    var totalLocationDim = locationDim.group().reduceSum(function (d) {
        return d["Latitude"];
    });
    var locationGroup = locationDim.group();

    var all = ndx.groupAll();
    var totalLocation = ndx.groupAll().reduceSum(function (d) {
        return d["Latitude"];
    });

    var minTime;
    minTime = timestampDim.bottom(1)[0]["Timestamp"];
    var maxTime;
    maxTime = timestampDim.top(1)[0]["Timestamp"];

    var timeChart = dc.lineChart("#time-chart");
    var itemNameChart = dc.rowChart("#item-type-row-chart");
    var listNameChart = dc.rowChart("#list-chart");
    var metricChart = dc.numberDisplay("#number-projects-nd");
    var quantityChart = dc.numberDisplay("#quantity-chart");
    var locationChart = dc.pieChart("#location-row-chart");
    var selectField = dc.selectMenu("#menu-select");
    selectField
            .dimension(locationDim)
            .group(locationGroup);
    metricChart
            .formatNumber(d3.format("d"))
            .valueAccessor(function (d) {
            return d;
        })
            .group(all);
    quantityChart
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(totalLocation)
        .formatNumber(d3.format(".3s"));
    timeChart
        .ordinalColors(["#d36527"])
        .width(800)
        .height(300)
        .margins({top: 30, right: 50, bottom: 30, left: 50})
        .dimension(timestampDim)
        .group(numProjectsByTime)
        .renderArea(true)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minTime, maxTime]))
        .elasticY(true)
        .xAxisLabel("Year 2017")
        .yAxis().ticks(4);
    itemNameChart
        .ordinalColors(["#d7d20a", "#66AFB2", "#C96A23", "#d30028", "#F5821F"])
        .width(400)
        .height(700)
        .dimension(itemNameTypeDim)
        .group(numProjectsByItemName)
        .xAxis().ticks(4);
    listNameChart
        .ordinalColors(["#1352d7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(400)
        .height(150)
        .dimension(listNameDim)
        .group(numProjectsByListName)
        .xAxis().ticks(6);
    locationChart
        .ordinalColors(["#1ed71c", "#66AFB2", "#C96A23", "#ca00d3", "#F5821F"])
        .height(350)
        .width(350)
        .radius(160)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(quantityLevelDim)
        .group(numProjectByQuantity);
    dc.renderAll();
}