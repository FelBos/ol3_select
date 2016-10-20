'strict mode';

// variables for (vector) layer source
// source point layer
// power tower
var powerTowerSource = sources.powerTower;

// source line layer
// power lines
var powerLinesSource = sources.powerLines;

// source polygon layer
// solar polygon
var solarPolygonSource = sources.solarPolygon;

// variables for (vector) layer
// point layere
// power tower
var powerTower = selectableLayers.powerTower.layer;

// line style
// power lines
var powerLines = selectableLayers.powerLines.layer;

// polygon layer
// solar polygon
var solarPolygon = selectableLayers.solarPolygon.layer;



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

// selectInteraction handles layer for active layer
var selectInteraction = new ol.interaction.Select({
    layers: function(layer) {
        // checkbox to get active layer
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


// get source of active layer
var getActiveLayerSource = function() {
    var layer;
    var source;
    if (($('#powerT').is(':checked')) === true) {
        return {
            layer: powerTower,
            source: powerTowerSource
        };
    }
    if (($('#powerL').is(':checked')) === true) {
        return {
            layer: powerLines,
            source: powerLinesSource
        };
    }
    if (($('#solarPoly').is(':checked')) === true) {
        return {
            layer: solarPolygon,
            source: solarPolygonSource
        };
    }
};




// style for subselecion
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
    //color: [255, 239, 187, 1]
    color: 'rgba(255, 239, 187, 1)'
});

// style for point subselection
var stylePointSubselection = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: radius
    })
});

// style for line subselection
var styleLineSubselection = new ol.style.Style({
    stroke: strokeLine,
    width: width
});

// style for polygon subselection
var stylePolygonSubselection = new ol.style.Style({
    fill: fill,
    stroke: stroke
});

// set subselsection style for respective layer
if (getActiveLayerSource().layer === powerTower) {
    styleSubSelection = stylePointSubselection;
} else if (getActiveLayerSource().layer === powerLines) {
    styleSubSelection = styleLineSubselection;
} else if (getActiveLayerSource().layer === solarPolygon) {
    styleSubSelection = stylePolygonSubselection;
}


var subSelection = new ol.interaction.Select({
    layers: function(layer) {
        return getActiveLayerSource().layer;
    },
    style: styleSubSelection,
    zIndex: 1
});



//style for subSelectionMouseOver
var fillSubSelectionMouseOver = new ol.style.Fill({
    //color: [234, 239, 244, 1]
    color: 'rgba(234, 239, 244, 1)'
});

var stylePointSubSelectionMouseOver = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fillSubSelectionMouseOver,
        stroke: stroke,
        radius: radius
    })
});

// subselection
var subSelectionMouseOver = new ol.interaction.Select({
    layers: function(layer) {
        return getActiveLayerSource().layer;
    },
    style: stylePointSubSelectionMouseOver,
    zIndex: 1
});



// select in table and select in map afterwards
function subSelectionToMap() {
    var arrayToMap = [];
    $.each(selectionGrid.getSelectionModel().getSelection(), function(key, value) {
        var subFeatureId = selectionGrid.getSelectionModel().getSelection()[key].data.feature_Id;
        var subFeature = getActiveLayerSource().source.getFeatureById(subFeatureId);
        arrayToMap.push(subFeature);
    })

    subSelection.getFeatures().clear();

    for (var i = 0; i < arrayToMap.length; i++) {
        subSelection.getFeatures().push(arrayToMap[i]);
    }
    subSelectionMouseOver.getFeatures().clear();
    map.removeInteraction(subSelectionMouseOver);
    map.addInteraction(subSelectionMouseOver);
    map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);
    map.addInteraction(subSelection);
}



// select in table via mouseover and select in map afterwards
function subSelectionMouseOverToMap(item) {
    var arrayToMap = [];
    // no iteration neccessary because function selects only one element
    var subFeatureId = item.data.feature_Id;
    var subFeature = getActiveLayerSource().source.getFeatureById(subFeatureId);
    arrayToMap.push(subFeature);

    subSelectionMouseOver.getFeatures().clear();

    // no loop through array neccessary because only one element is pushed to map
    subSelectionMouseOver.getFeatures().push(arrayToMap[0]);

    map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);
    map.removeInteraction(subSelection);
    map.addInteraction(subSelection);
    map.addInteraction(subSelectionMouseOver);
}



// a DragBox interaction used to select features by drawing boxes
var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly,
});

// clear selection when drawing a new box or clicking on the map
dragBox.on('boxstart', function() {
    clearSelection();
});

dragBox.on('boxend', function() {
    // features that intersect the box are put to the store
    var extent = dragBox.getGeometry().getExtent();
    getActiveLayerSource().source.forEachFeatureIntersectingExtent(extent, function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});



/* map controls and base layer start
 *
 */
// get background maps
// open cycle map
var rasterOcm = new ol.layer.Tile({
    source: new ol.source.OSM({
        attributions: [
            'All maps © <a href="http://www.opencyclemap.org/">OpenCycleMap</a>',
            ol.source.OSM.ATTRIBUTION
        ],
        url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
    })
});

// map quest map
var mapQuest = new ol.layer.Tile({
    style: 'Road',
    source: new ol.source.MapQuest({ layer: 'osm' })
});

// osm 
var osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// osm gray
var osmGray = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        params: { LAYERS: 'osmwms_graustufen' },
        url: 'http://osmwms.itc-halle.de/maps/osmsw?'
    })
});


// set max zoom level for power tower
powerTower.setMinResolution(0);
powerTower.setMaxResolution(50);

// create a scale bar
var scaleBar = new ol.control.ScaleLine();

// create map
var map = new ol.Map({
    target: document.getElementById('map'),
    //target: 'map',
    renderer: 'canvas',
    interactions: ol.interaction.defaults().extend([
        selectInteraction, dragBox 
    ]),
    // base layer and overlay layer
    layers: [ /*mapQuest,*/ osm, /* geoServerWorldWms,*/ /*osmGray,*/ solarPolygon, powerLines, powerTower],
    view: new ol.View({
        center: [1010401.9676446737, 7188119.030680903],
        maxZoom: 19,
        zoom: 13
    }),
    controls: ol.control.defaults({
        attributionOptions: ({
            collapsible: false
        })
    }).extend([
        scaleBar
    ])
});

/*
 * map controls and base layer end
 */


// get current map extent
function getMapExtent() {
    var mapExtent = map.getView().calculateExtent(map.getSize());
    return mapExtent;
}



var putFeaturesToStore = function() {
    var newData = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        // get properties of selected feature
        var prop = feature.getProperties();

        // power tower
        if (getActiveLayerSource().layer === powerTower) {
            var newRow = {
                osm_id: parseInt(prop.osm_id),
                power: prop.power,
                operator: prop.operator,
                ref: parseInt(prop.ref),
                osm_pk: parseInt(prop.osm_pk),
                geom_wkt: prop.geom_wkt,
                /*geometry: prop.geometry,*/
                // get ol feature id from selected feature
                feature_Id: feature.getId()
            };
        }

        // power lines
        else if (getActiveLayerSource().layer === powerLines) {
            var newRow = {
                id: parseInt(prop.id),
                power: prop.power,
                name: prop.name,
                voltage: parseInt(prop.voltage),
                operator: prop.operator,
                cables: parseInt(prop.cables),
                wires: prop.wires,
                frequency: parseInt(prop.frequency),
                voltage_ta: prop.voltage_ta,
                geom_wkt: prop.geom_wkt,
                /*geometry: prop.geometry,*/
                feature_Id: feature.getId()
            };
        }

        // solar polygon
        else if (getActiveLayerSource().layer === solarPolygon) {
            var newRow = {
                osm_id: parseInt(prop.osm_id),
                power: prop.power,
                power_sour: prop.power_sour,
                generator_: prop.generator_,
                layer: prop.layer,
                z_order: parseInt(prop.z_order),
                objectid: parseInt(prop.objectid),
                /*geometry: prop.geometry,*/
                feature_Id: feature.getId()
            };
        }

        // push properties and feature to row
        newData.push(newRow);
        selectionStore.setData(newData);
    });
};


// call function clear selectio when button is clicked
$('#btDelete').click(function() {
    clearSelection();
});



// clear selection store and unselect selected features
var clearSelection = function() {
    selectionStore.removeAll();
    selectInteraction.getFeatures().clear();
    subSelection.getFeatures().clear();
    subSelectionMouseOver.getFeatures().clear();
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
};



// when feature is selected
selectInteraction.on('select', function() {
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
    putFeaturesToStore();
});

// select on subselection
subSelection.on('select', function() {
    putFeaturesToStore();
    map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);
    map.removeInteraction(subSelection);
    map.addInteraction(subSelection);
    subSelectionMouseOver.getFeatures().clear();
});



// select on the bais of current screen extent
map.on('moveend', function() {
    // delete former selections
    clearSelection();
    // get active layer
    // get all features intersecting
    // current map extent 
    getActiveLayerSource().source.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});


// actviate selection via mouseover
var activateMouseOver = function() {
    map.on('pointermove', function(e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.on('singleclick', function() {
        });

        if (hit === true) {
            var pointer_coord = map.getEventCoordinate(e.originalEvent);
            var closest = getActiveLayerSource().source.getClosestFeatureToCoordinate(pointer_coord);
            selectInteraction.getFeatures().clear();
            map.removeInteraction(selectInteraction);
            map.addInteraction(selectInteraction);
            selectInteraction.getFeatures().push(closest);
            putFeaturesToStore();
        }
    });
};

// if button mouseover selection is clicked 
// call function activate mouse over
$('#btMouseOver').on('click', activateMouseOver);



// remove features from selection and clear store
// when map is clicked
map.on('singleclick', function() {
    selectionStore.removeAll();
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
});
