// comments from explanations here:
// https://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/

showHide = function(selector) {
    d3.select(selector).select('.hide').on('click', function(){
        d3.select(selector)
            .classed('visible', false)
            .classed('hidden', true);
    });

    d3.select(selector).select('.show').on('click', function(){
        d3.select(selector)
            .classed('visible', true)
            .classed('hidden', false);
    });
}


pathMap = function(map, url, initialSelections) {
    var pointTypes = d3.map(),
        points = [],
        lastSelectedPoint;

    var selectPoint = function() {
        cell.classed('selected', true);

        d3.select('#selected h1')
            .html('')
            .append('a')
            .text(point.name)
            .attr('href', point.url)
            .attr('target', '_blank')
    }

    var drawPointTypeSelection = function() {
        showHide('#selections')
        labels = d3.select('#toggles').selectAll('input')
            .data(pointTypes.values())
            .enter().append("label");

        labels.append("input")
            .attr('type', 'checkbox')
            .property('checked', function(d) {
                return initialSelections === undefined || initialSelections.has(d.type)
            })
            .attr("value", function(d) { return d.type; })
            .on("change", drawWithLoading);

        labels.append("span")
            .attr('class', 'key')
            .style('background-color', function(d) { return '#' + d.color; });

        labels.append("span")
            .text(function(d) { return d.type; });
    }

    /* -------- NOTE ------
     * The following are the only bits that aren't d3.v4 compatible. This means
     * that the filtering of checked types no longer works under v4.
     * selectedTypes just returns a boolean value instead of the previous map,
     * so the subsequent pointsFilteredtoSelectedTypes just uses all of them.
     * TODO: Fix this!
     */
    var selectedTypes = function() {
        //return d3.selectAll('#toggles input[type=checkbox]')[0].filter(function(elem) {
        return d3.select('#toggles').selectAll('input[type=checkbox]')
            .filter(function(elem) { 
                return elem.checked;
        //}).map(function(elem) {
        //    return elem.value;
        })
    }

    var pointsFilteredToSelectedTypes = function() {
        var currentSelectedTypes = d3.set(selectedTypes());
        return points.filter(function(item){
            //return currentSelectedTypes.has(item.type);
            return currentSelectedTypes;
        });
    }

    // Function triggered by map zooming or dragging
    var drawWithLoading = function(e){
        d3.select('#loading').classed('visible', true);
        if (e && e.type == 'viewreset') {
            d3.select('#overlay').remove();
        }
        setTimeout(function(){
            draw();
            d3.select('#loading').classed('visible', false);
        }, 0);
    }

    var draw = function() {
        d3.select('#overlay').remove();

        // get map bounds to be used for filtering to view only
        var bounds = map.getBounds(),
            topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
            bottomRight = map.latLngToLayerPoint(bounds.getSouthEast()),
            existing = d3.set(),
            drawLimit = bounds.pad(0.4);

        // Only points filtered within bounds are passed here
        filteredPoints = pointsFilteredToSelectedTypes().filter(function(d) {
            var latlngf = new L.LatLng(d.latfrom, d.lonfrom);
            var latlngt = new L.LatLng(d.latto, d.lonto);

            // ---> filtering!
            if (!drawLimit.contains(latlngf)) { return false };
            if (!drawLimit.contains(latlngt)) { return false };

            // Re-projection onto map layer
            var pointf = map.latLngToLayerPoint(latlngf);
            var pointt = map.latLngToLayerPoint(latlngt);

            key = pointf.toString();
            if (existing.has(key)) { return false };
            existing.add(key);

            d.xf = pointf.x;
            d.yf = pointf.y;
            d.xt = pointt.x;
            d.yt = pointt.y;
            return true;
        });

        // constuct voronoi cells
        //voronoi(filteredPoints).forEach(function(d) { d.point.cell = d; });

        var svg = d3.select(map.getPanes().overlayPane).append("svg")
            .attr('id', 'overlay')
            .attr("class", "leaflet-zoom-hide")
            .style("width", map.getSize().x + 'px')
            .style("height", map.getSize().y + 'px')
            .style("margin-left", topLeft.x + "px")
            .style("margin-top", topLeft.y + "px");

        var g = svg.append("g")
            .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")");

        // This adds a new SVG point for every filtered object
        var svgPoints = g.attr("class", "points")
            .selectAll("g")
            .data(filteredPoints)
            .enter().append("g")
            .attr("class", "point");

        svgPoints.append("circle")
            .attr("transform", function(d) { return "translate(" + d.xf + "," + d.yf + ")"; })
            .style('fill', function(d) { return '#' + d.color } )
            .attr("r", 5);

        svgPoints.append("circle")
            .attr("transform", function(d) { return "translate(" + d.xt + "," + d.yt + ")"; })
            .style('fill', function(d) { return '#' + d.color } )
            .attr("r", 5);

        var buildPathFromPoint = function (d) {
            return out = "M" + d.xf + " " + d.yf + "L" + d.xt + " " + d.yt;
        }

        svgPoints.append("path")
            .attr("class", "point-cell")
            .attr("d", buildPathFromPoint)
            .style("stroke", function (d) {
                return "#" + d.color
            })
            .style("stroke-width", function (d) {
                return 5 * d.lwd
            })
            .on("click", selectPoint)
            .classed("selected", function(d) {
                return lastSelectedPoint == d
            });

    }

    // viewreset triggered when zoom changed; moveend when map is dragged
    var mapLayer = {
        onAdd: function(map) {
            map.on('viewreset moveend', drawWithLoading);
            drawWithLoading();
        }
    };

    showHide('#about');

    // Load the csv data
    map.on('ready', function() {
        d3.csv(url, function(csv) {
            points = csv;
            points.forEach(function(point) {
                pointTypes.set(point.type, {type: point.type, color: point.color});
            })
            drawPointTypeSelection();
            map.addLayer(mapLayer);
        })
    });
}
