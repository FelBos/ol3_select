// get legend using svg
getIconLegend = function(style) {
    style = style.getImage();
    var radius = style.getRadius();
    var fillColor = style.getFill().getColor();
    var strokeWidth = style.getStroke().getWidth();
    var dx = radius + strokeWidth;

    var svgElem = $('<svg />')
        .attr({
            width: dx * 2,
            height: dx * 2
        });

    $('<circle />')
        .attr({
            cx: dx,
            cy: dx,
            r: radius,
            stroke: style.getStroke().getColor(),
            'stroke-width': strokeWidth,
            fill: fillColor
        })
        .appendTo(svgElem);

    // Convert DOM object to string to overcome from some SVG manipulation related oddities
    return $('<div>').append(svgElem).html();
}

$('#legendPowerTower').prepend($(getIconLegend(powerTower.getStyle())));


// legend for power lines
getLineLegend = function(style) {
    var strokeColor = style.getStroke().getColor();
    var strokeWidth = style.getStroke().getWidth();

    var svgLine = $('<svg />')
        .attr({
            width: 24,
            height: 12
        })

    $('<line />')
        .attr({
            x1: 0,
            y1: 6,
            x2: 24,
            y2: 6,
            stroke: strokeColor,
            'stroke-width': strokeWidth
        })
        .appendTo(svgLine);
    return $('<div>').append(svgLine).html();
}

$('#legendPowerLines').prepend($(getLineLegend(powerLines.getStyle())));


// legend for solar polygon
getPolygonLegend = function(style) {
    var strokeColor = style.getStroke().getColor();
    var strokeWidth = style.getStroke().getWidth();
    var fillColor = style.getFill().getColor();
    var rectWidth = 50;
    var rectHeight = 25;

    var svgRect = $('<svg />')
        .attr({
            width: rectWidth,
            height: rectHeight
        })

    $('<rect />')
        .attr({
            width: rectWidth,
            height: rectHeight,
            fill: fillColor,
            'stroke-width': strokeWidth,
            stroke: strokeColor
                //'stroke-opacity': 1
        })
        .appendTo(svgRect);
    return $('<div>').append(svgRect).html();
}

$('#legendSolarPolygon').prepend($(getPolygonLegend(solarPolygon.getStyle())));


// legend for select Interaction
getSelectionLegend = function() {
    var circleSt = styleSelectInteraction.getImage();
    var strokeColor = circleSt.getStroke().getColor();
    var strokeWidth = circleSt.getStroke().getWidth();
    var fillColor = circleSt.getFill().getColor();
    var radius = circleSt.getRadius();
    var dx = radius + strokeWidth;

    var selPoint = $('<svg />')
        .attr({
            width: dx * 2,
            height: dx * 2
        });

    $('<circle />')
        .attr({
            cx: dx,
            cy: dx,
            r: radius,
            stroke: strokeColor,
            'stroke-width': strokeWidth,
            fill: fillColor
        })
        .appendTo(selPoint);

    return $('<div>').append(selPoint).html();
}

$('#legendSelection').prepend($(getSelectionLegend()));


getSubSelectionLegend = function() {
    var circleSt = styleSubSelection.getImage();
    var strokeColor = circleSt.getStroke().getColor();
    var strokeWidth = circleSt.getStroke().getWidth();
    var fillColor = circleSt.getFill().getColor();
    var radius = circleSt.getRadius();
    var dx = radius + strokeWidth;

    var subSelPoint = $('<svg />')
        .attr({
            width: dx * 2,
            height: dx * 2
        });

    $('<circle />')
        .attr({
            cx: dx,
            cy: dx,
            r: radius,
            stroke: strokeColor,
            'stroke-width': strokeWidth,
            fill: fillColor
        })
        .appendTo(subSelPoint);
    return $('<div>').append(subSelPoint).html();
}

$('#legendSubSelection').prepend($(getSubSelectionLegend()));


getMouseOverSubSelectionLegend = function() {
    var circleSt = stylePointSubSelectionMouseOver.getImage();
    var strokeColor = circleSt.getStroke().getColor();
    var strokeWidth = circleSt.getStroke().getWidth();
    var fillColor = circleSt.getFill().getColor();
    var radius = circleSt.getRadius();
    var dx = radius + strokeWidth;

    var mouseOverSubSelPoint = $('<svg />')
        .attr({
            width: dx * 2,
            height: dx * 2
        });

    $('<circle />')
        .attr({
            cx: dx,
            cy: dx,
            r: radius,
            stroke: strokeColor,
            'stroke-width': strokeWidth,
            fill: fillColor
        })
        .appendTo(mouseOverSubSelPoint);
    return $('<div>').append(mouseOverSubSelPoint).html();
}

$('#legendMouseOverSubSelection').prepend($(getMouseOverSubSelectionLegend()));
