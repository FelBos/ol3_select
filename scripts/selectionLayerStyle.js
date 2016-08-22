// style for selectInteraction
var fillSelectInteraction = new ol.style.Fill({
    //color: [255, 100, 50, 0.5]
    color: 'rgba(255, 100, 50, 0.5)'
});
var widthSelectInteraction = 2;
var strokeSelectInteraction = new ol.style.Stroke({
    //color: [255, 100, 50, 0.8],
    color: 'rgba(255, 100, 50, 0.8)',
    width: widthSelectInteraction
});
var styleSelectInteraction = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fillSelectInteraction,
        stroke: strokeSelectInteraction,
        radius: 12
    }),
    fill: fillSelectInteraction,
    stroke: strokeSelectInteraction
});

var selectInteraction = new ol.interaction.Select({
    layers: function(layer) {
        var powerT = $('#powerT').is(':checked');
        var powerL = $('#powerL').is(':checked');
        var solarPoly = $('#solarPoly').is(':checked');
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);
    },
    style: styleSelectInteraction,
    addCondition: ol.events.condition.altKeyOnly
        //addCondition: ol.events.condition.altShiftKeysOnly
});



// style for subselecion
// modification for style subSelection testing
var radius = 8;
var width = 2;
var fill = new ol.style.Fill({
    //color: [255, 239, 187, 1]
    color: 'rgba(255, 239, 187, 1)'
});

var stroke = new ol.style.Stroke({
    //color: [127, 127, 127, 0.8],
    color: 'rgba(127, 127, 127, 0.8)',
    width: width
});
var strokeLine = new ol.style.Stroke({
    //color: [255, 239, 187, 1],
    color: 'rgba(255, 239, 187, 1)',
    width: width
});
var styleSubSelection = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: radius
    }),
    fill: fill,
    stroke: strokeLine
});

// style for subselecion
/*var radius = 8;
var width = 2;
var fill = new ol.style.Fill({
    color: [255, 239, 187, 1]
});

var stroke = new ol.style.Stroke({
    color: [127, 127, 127, 0.8],
    width: width
});

var strokeLine = new ol.style.Stroke({
    color: [255, 239, 187, 1]
});

var stylePointSubselection = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: radius
    })
});

var styleLineSubselection = new ol.style.Style({
    stroke: strokeLine,
    width: width
});

var stylePolygonSubselection = new ol.style.Style({
    fill: fill,
    stroke: stroke
});


if (getActiveLayerSource().layer === powerTower) {
    styleSubSelection = stylePointSubselection;
} else if (getActiveLayerSource().layer === powerLines) {
    styleSubSelection = styleLineSubselection;
} else if (getActiveLayerSource().layer === solarPolygon) {
    styleSubSelection = stylePolygonSubselection;
}*/



var subSelection = new ol.interaction.Select({
    layers: function(layer) {
        /*var powerT = $('#powerT').is(':checked');
        var powerL = $('#powerL').is(':checked');
        var solarPoly = $('#solarPoly').is(':checked');
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);*/
        return getActiveLayerSource().layer;
    },
    style: styleSubSelection,
    zIndex: 1
});



//style for subSelectionMouseOver
var fillSubSelectionMouseOver = new ol.style.Fill({
    color: [234, 239, 244, 1]
});

var stylePointSubSelectionMouseOver = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fillSubSelectionMouseOver,
        stroke: stroke,
        radius: radius
    })
});

var subSelectionMouseOver = new ol.interaction.Select({
    layers: function(layer) {
        /*var powerT = $('#powerT').is(':checked');
        var powerL = $('#powerL').is(':checked');
        var solarPoly = $('#solarPoly').is(':checked');
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);*/
        return getActiveLayerSource().layer;
    },
    style: stylePointSubSelectionMouseOver,
    zIndex: 1
});