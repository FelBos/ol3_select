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
// modification for style subSelection testing
/*var radius = 8;
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
});*/

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
}


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
    // loop is not neccessary
    /*for (var i = 0; i < arrayToMap.length; i++) {
        subSelectionMouseOver.getFeatures().push(arrayToMap[0]);
    }*/
    // is sufficient because only one element is pushed to map
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
var scaleBar = new ol.control.ScaleLine();
//var scaleLine = new ol.control.ScaleLineUnits({ 'metric' });

// get raster layer
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

var osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

/*var osmGray = ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: 'http://ows.terrestris.de/osm-gray/service'
    }))
});*/

//'http://localhost/geoserver/aws/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc:Arc_Sample&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&format=text%2Fhtml%3B+subtype%3Dopenlayers'

//var geoServerWorldWms = new ol.layer.Tile({
//extent: [-180.0, -90.0, 180.0, 90.0],
//source: new ol.source.ImageWMS({
/*source: new ol.source.TileWMS({
    url: 'http://localhost/geoserver/aws/',
    params: { 'LAYERS': 'nurc:Arc_Sample', 'TILED': true },
    serverType: 'geoserver'
})*/
/*url: function(extent) {
    format: new ol.format.
    //return 'http://http://localhost/geoserver/aws/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc:Arc_Sample&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&format=text%2Fhtml%3B+subtype%3Dopenlayers'
    return 'http://http://localhost/geoserver/aws/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc:Arc_Sample&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&bbox' + extent.join(',') + 'EPSG:4326';
    strategy: ol.loadingstrategy.bbox
}*/
/*    source: new ol.source.ImageWMS({
        url: 'http://http://localhost/geoserver/aws/nurc/wms?service=WMS&version=1.1.0&request=GetMap&layers=nurc:Arc_Sample&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&format=text%2Fhtml%3B+subtype%3Dopenlayers'
    })
});*/


/*format: new ol.format.GeoJSON(),
url: function(extent) {
    return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:solarpolygon&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
},
strategy: ol.loadingstrategy.bbox*/

/*var geoServerWorldWms = new ol.layer.Tile({
    title: 'A sample ArcGrid file',
    source: new ol.source.TileWMS({
        url: 'http://localhost/geoserver/aws/nurc/wms',
        params: { LAYERS: 'nurc:Arc_Sample', VERSION: '1.0.0' }
        //tiled: 'TRUE'
    })
});*/

/*var geoServerWorldWms = new ol.layer.Image({
    title: 'A sample ArcGrid file',
    source: new ol.source.ImageWMS({
        url: 'http://localhost/geoserver/aws/nurc/wms',
        params: { LAYERS: 'nurc:Arc_Sample', VERSION: '1.0.0' }
    })
});*/

var osmGray = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        params: { LAYERS: 'osmwms_graustufen' },
        url: 'http://osmwms.itc-halle.de/maps/osmsw?'
    })
});

//contextualWMSLegend=0&crs=EPSG:4326&dpiMode=all&featureCount=10&format=image/png&layers=osmwms_graustufen&styles=&url=http://osmwms.itc-halle.de/maps/osmsw?

powerTower.setMinResolution(0);
powerTower.setMaxResolution(50);
// create map
var map = new ol.Map({
    target: document.getElementById('map'),
    //target: 'map',
    renderer: 'canvas',
    interactions: ol.interaction.defaults().extend([
        /*clonedSelection,*/
        selectInteraction, dragBox /*, subSelection*/ /*, singleClickSelection*/
    ]),
    layers: [ /*mapQuest,*/ osm, /* geoServerWorldWms,*/ /*osmGray,*/ solarPolygon, powerLines, powerTower],
    view: new ol.View({
        center: [1010401.9676446737, 7188119.030680903],
        maxZoom: 19,
        zoom: 13
    }),
    //controls: ['zoom', scaleBar, scaleBar]
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



function getMapExtent() {
    var mapExtent = map.getView().calculateExtent(map.getSize());
    return mapExtent;
}



var putFeaturesToStore = function() {
    var newData = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        // get properties of selected feature
        var prop = feature.getProperties();
        console.log('property is ', prop);

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



$('#btDelete').click(function() {
    clearSelection();
});



// clear selection store and unselect selected features
var clearSelection = function() {
    selectionStore.removeAll();
    selectInteraction.getFeatures().clear();
    subSelection.getFeatures().clear();
    subSelectionMouseOver.getFeatures().clear();
    mouseOverInteraction.getFeatures().clear();
    map.removeInteraction(mouseOverInteraction);
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
    /*map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);*/
};



// when feature is selected
/*selectInteraction.on('select', function() {
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
    putFeaturesToStore();
});*/

// select on subselection
subSelection.on('select', function() {
    putFeaturesToStore();
    map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);
    map.removeInteraction(subSelection);
    map.addInteraction(subSelection);
    subSelectionMouseOver.getFeatures().clear();
    map.removeInteraction(subSelectionMouseOver);
    map.addInteraction(subSelectionMouseOver);
    //higlightInTable();
});

//function higlightInTable() {
//console.log(subSelection.getFeatures());
//$.each(subSelection.getFeatures(), function() {
//console.log('feature id is ', subSelection.getFeatures().getId());
//$.each(subSelection.getFeatures(), function(key, value) {

/*console.log('key is ', key);
console.log('feature is ', feature);
var featureKey = subSelection.getFeatures().getKeys();
console.log('feature key is ', featureKey);
var featureValue = subSelection.getFeatures().get(featureKey);
console.log('featureValue is ', featureValue);
console.log('subSelection length is', subSelection.getFeatures().getLength());
console.log('subSelection array is ', subSelection.getFeatures().getArray());
var subSelectionArray = subSelection.getFeatures().getArray();
console.log('first entry is ', subSelectionArray[0]);
console.log('first entry id is ', subSelectionArray[0].getId());*/
/*for (var i = 0; i < subSelection.getFeatures().getLength(); i++) {
    var subSelectionArray = subSelection.getFeatures().getArray();
    var subSelFeatureId = subSelectionArray[i].getId();
    console.log('subSelection featureId is ', subSelFeatureId);
    for (var j = 0; j < selectionGrid.getStore().data.items.length; j++) {
        //console.log('feature id of feature in store is ', selectionGrid.getStore().data.items[j].data.feature_Id);
        var gridFeatureId = selectionGrid.getStore().data.items[j].data.feature_Id;
        console.log('gridFeatureId is ', gridFeatureId);
        console.log('style proxy is ', selectionGrid.getStyleProxy());
        //console.log('selection records are ', Ext.grid.selection.getRecords());
        if (subSelFeatureId === gridFeatureId) {
            console.log('subSelFeatureId and gridFeatureId are the same');

        }
    }
}*/
/*console.log('panel id is ', selectionGrid.getId());
console.log('panel item id is ', selectionGrid.getItemId());
console.log('panel store is ', selectionGrid.getStore());
console.log('panel store data is ', selectionGrid.getStore().data);
console.log('panel store data item 0 is ', selectionGrid.getStore().data.items[0]);
console.log('panel store data item 0 data is ', selectionGrid.getStore().data.items[0].data);
console.log('panel store data item 0 data featureid is ', selectionGrid.getStore().data.items[0].data.feature_Id);
console.log('panel store data length is ', selectionGrid.getStore().data.items.length);*/
/*for (var j = 0; j < selectionGrid.getStore().data.items.length; j++) {
    console.log('feature id of feature in store is ', selectionGrid.getStore().data.items[j].data.feature_Id);
}*/
//console.log('panel selection is ', selectionGrid.getSelection());
/*var feature = subSelection.getFeatures();
console.log('feature is ', feature);
console.log('feature data is ', subSelection.getFeatures().data);*/
/*var fId = feature.getId();
console.log('fId is ', fId);*/
//})
//}



// when map is moved
map.on('moveend', function() {
    clearSelection();
    getActiveLayerSource().source.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});



/*var widthMouseOver = 2;
var radiusMouseOver = 6;
var fillMouseOver = new ol.style.Fill({
    color: [255, 255, 255, 0.8]
});

var strokeMouseOver = new ol.style.Stroke({
    color: [0, 0, 0, 1],
    width: widthMouseOver
});


var styleMouseOver = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fillMouseOver,
        stroke: strokeMouseOver,
        radius: radiusMouseOver
    })
});*/


var mouseOverInteraction = new ol.interaction.Select({
    layers: function(layer) {
        return getActiveLayerSource().layer;
    },
    //style: styleMouseOver
    style: styleSelectInteraction
});



/*var getMouseOver = function(setter) {
    var mouseOver = false;
    if (setter === false) {
        mouseOver = false;
    } else {
        mouseOver = false
    }
    return mouseOver;
};

if (getMouseOver() === true) {
    console.log('if getMouseOver is true');
}*/

/*var stateMouseOver = function(event) {
    event.stopPropagation();
    activateMouseOver();
};*/

//$('#btMouseOver').on('click', stateMouseOver);
//$('#btMouseOver').off('click', deactivateMouseOver);
//$('#btMouseOver').on('click', stateMouseOver);
//$('#btMouseOver').on('click', stateMouseOver);


var activateMouseOver = function() {
    //$('#btMouseOver').click(function() {
    //if (getMouseOver() === true) {
    map.on('pointermove', function(e) {
        //getMouseOver();
        //if (getMouseOver() === true) {
        //console.log('pointermove was triggered');
        var pixel = map.getEventPixel(e.originalEvent);
        console.log('pixel cooridnate is ', pixel);
        var hit = map.hasFeatureAtPixel(pixel);
        console.log('hit is ', hit);

        /*map.on('singleclick', function() {
            selectInteraction.on('select', function() {
                console.log('select event was triggered');
            });
        });*/
        map.on('singleclick', function() {
            console.log('singleclick event on map was triggered');
        });

        if (hit === true) {
            //console.log('a feature was hit');
            var pointer_coord = map.getEventCoordinate(e.originalEvent);
            //console.log('pointer_coord is ', pointer_coord);
            var closest = getActiveLayerSource().source.getClosestFeatureToCoordinate(pointer_coord);
            /*console.log('closest feature is ', closest);
            console.log('closest feature id is ', closest.getId());*/
            selectInteraction.getFeatures().clear();
            map.removeInteraction(selectInteraction);
            map.addInteraction(selectInteraction);
            selectInteraction.getFeatures().push(closest);
            console.log('selectInteraction was pushed with closest');
            putFeaturesToStore();
            //map.removeInteraction(subSelectionMouseOver);
        }
        //}
    });
    //});
    //deactivateMouseOver();
};
activateMouseOver();

/*var deactivateMouseOver = function(event) {
    event.stopPropagation();
    map.unByKey('pointermove');
};

$('#btRmMouseOver').on('click', deactivateMouseOver);

var key = $('#btMouseOver').on('click', stateMouseOver);*/
//var key = $('#btMouseOver').on('click', activateMouseOver);
//ol.Observable.unByKey(key);

/*if (selectInteraction.on('select') === true) {
    console.log('select event was triggered');
}*/


/*map.on('pointermove', function(e) {
    //console.log('pointermove was triggered');
    var pixel = map.getEventPixel(e.originalEvent);
    //console.log('pixel cooridnate is ', pixel);
    var hit = map.hasFeatureAtPixel(pixel);
    //console.log('hit is ', hit);

    if (hit === true) {
        console.log('a feature was hit');
        var pointer_coord = map.getEventCoordinate(e.originalEvent);
        console.log('pointer_coord is ', pointer_coord);
        var closest = getActiveLayerSource().source.getClosestFeatureToCoordinate(pointer_coord);
        console.log('closest feature is ', closest);
        map.addInteraction(mouseOverInteraction);
        mouseOverInteraction.getFeatures().clear();
        mouseOverInteraction.getFeatures().push(closest);
        putFeaturesToStore(closest);
    } else if (hit === false) {
        console.log('no feature is hit');
        map.removeInteraction(mouseOverInteraction);
    }
});*/



// remove features from selection and clear store
map.on('singleclick', function() {
    selectionStore.removeAll();
    map.removeInteraction(subSelectionMouseOver);
    map.removeInteraction(subSelection);
    //map.removeInteraction(mouseOverInteraction);
    //map.removeInteraction(selectInteraction);
    //map.addInteraction(selectInteraction);
});
