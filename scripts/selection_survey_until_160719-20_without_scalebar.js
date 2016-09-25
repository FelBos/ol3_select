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


// call function getActiveLayer to get selectable layer and set layerDataModelField accordingly
// return value is accesible via function call
var getLayerDataModelField = function() {
    if (getActiveLayerSource().layer === powerTower) {
        var layerDataModelField = selectableLayers.powerTower.dataModel;
    } else if (getActiveLayerSource().layer === powerLines) {
        var layerDataModelField = selectableLayers.powerLines.dataModel;
    } else if (getActiveLayerSource().layer === solarPolygon) {
        var layerDataModelField = selectableLayers.solarPolygon.dataModel;
    }
    return layerDataModelField;
};

// call function getActiveLayer to get selectable layer and set layerDataStore accordingly
// return value is accesible via function call
var getLayerDataStore = function() {
    if (getActiveLayerSource().layer === powerTower) {
        var layerDataStore = selectableLayers.powerTower.dataModel;
    } else if (getActiveLayerSource().layer === powerLines) {
        var layerDataStore = selectableLayers.powerLines.dataModel;
    } else if (getActiveLayerSource().layer === solarPolygon) {
        var layerDataStore = selectableLayers.solarPolygon.dataModel;
    }
    return layerDataStore;
};

// call function getActiveLayer to get selectable layer and set layerGridColumn accordingly
// return value is accesible via function call
var getLayerGridColumn = function() {
    if (getActiveLayerSource().layer === powerTower) {
        var layerGridColumn = selectableLayers.powerTower.columns;
    } else if (getActiveLayerSource().layer === powerLines) {
        var layerGridColumn = selectableLayers.powerLines.columns;
    } else if (getActiveLayerSource().layer === solarPolygon) {
        var layerGridColumn = selectableLayers.solarPolygon.columns;
    }
    return layerGridColumn;
};



var dataModel = Ext.define('Selection', {
    extend: 'Ext.data.Model',
    fields: getLayerDataModelField()
});


var selectionStore = Ext.create('Ext.data.Store', {
    model: 'Selection',
    data: getLayerDataStore()
});


var selectionGrid = Ext.create('Ext.grid.Panel', {
    renderTo: $('#grid')[0],
    store: selectionStore,
    width: '100%',
    height: 280,
    title: 'Selections',
    selModel: {
        selType: 'rowmodel', // rowmodel is the default selection model
        mode: 'MULTI' // Allows selection of multiple rows
    },
    columns: getLayerGridColumn(),
    // add event listeners to panel
    listeners: {
        select: function(record, index) {
            /*var selectionModel = this.getSelectionModel();
            var selection = this.getSelection();*/
            subSelectionToMap();
        },
    }
});



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
    //color: [0, 0, 0, 1]
    color: 'rgba(0, 0, 0, 1)'
});

var stylePointSubselection = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: radius
    })
});

var styleLineSubselection = new ol.style.Style({
    stroke: strokeLine
});

var stylePolygonSubselection = new ol.style.Style({
    fill: fill,
    stroke: stroke
});


if (getActiveLayerSource().layer === powerTower) {
    styleSubselection = stylePointSubselection;
} else if (getActiveLayerSource().layer === powerLines) {
    styleSubselection = styleLineSubselection;
} else if (getActiveLayerSource().layer === solarPolygon) {
    styleSubselection = stylePolygonSubselection;
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
    style: styleSubselection,
    zIndex: 1
});



var radiusClone = 10;
var widthClone = 3;
var fillClone = new ol.style.Fill({
    color: [0, 0, 0, 0]
});
var strokeClone = new ol.style.Stroke({
    color: [255, 237, 160, 0],
    width: widthClone
});

var stylePointClonedSelection = new ol.style.Style({
    image: new ol.style.Circle({
        fill: fillClone,
        stroke: strokeClone,
        radius: radiusClone,
        zIndex: 1
    })
});

if (getActiveLayerSource().layer === powerTower) {
    styleClonedSelection = stylePointClonedSelection;
}

var clonedSelection = new ol.interaction.Select({
    layers: function(layer) {
        return getActiveLayerSource().layer;
    },
    style: styleClonedSelection
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
    map.addInteraction(subSelection);
};



// a DragBox interaction used to select features by drawing boxes
var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly,
});

// clear selection when drawing a new box or clicking on the map
dragBox.on('boxstart', function() {
    subSelection.getFeatures().clear();
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

// set max zoom level for power tower
powerTower.setMinResolution(10);
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
    control: ['zoom', scaleBar]
});

/*var view = new ol.View({
    center: [1010401.9676446737, 7188119.030680903],
    maxZoom: 19,
    zoom: 13
});

var map = new ol.Map({
    target: 'map'
});

map.addLayer(mapQuest);
map.addLayer(solarPolygon);
map.addLayer(powerLines);
map.addLayer(powerTower);
map.setView(view);

map.getInteractions().extend([selectInteraction, dragBox]);
map.addControl(['zoom', scaleBar]);*/

/*
 * map controls and base layer end
 */



// deselection via checkbox
// it is not neccessary to press shit-key for deselection
/*var deselectLayer = function() {

    var clonedFeatureArray = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        var properties = feature.getProperties();
        var featureId = feature.getId();
        var clonedFeature = feature.clone();
        clonedFeature.setId(feature.getId());
        clonedFeatureArray.push(clonedFeature);
    });
    for (i = 0; i < clonedFeatureArray.length; i++) {
        clonedSelection.getFeatures().push(clonedFeatureArray[i]);
    }

    map.addInteraction(clonedSelection);

    var featuresToFilter = [];
    clonedSelection.on('select', function() {
        clonedSelection.getFeatures().forEach(function(feature) {
            featuresToFilter.push(feature);
        });
        deselectFeatures();
    });

    function deselectFeatures() {
        selectInteraction.getFeatures().clear();
        var deselectionArray = []
        for (var j = 0; j < clonedFeatureArray.length; j++) {
            if (clonedFeatureArray.length === 1 && clonedFeatureArray[0].i === featuresToFilter[0].i) {
                clearSelection();
            } else if (clonedFeatureArray[j].i !== featuresToFilter[0].i) {
                deselectionArray.push(clonedFeatureArray[j]);
            } else if (clonedFeatureArray[j].i === featuresToFilter[0].i) {
                var filtered = clonedFeatureArray[j].i
            }
        }
        for (k = 0; k < deselectionArray.length; k++) {
            selectInteraction.getFeatures().push(deselectionArray[k]);
        }
        map.removeInteraction(subSelection);
        map.addInteraction(selectInteraction);
        putFeaturesToStore();
        setCurrentSelection();
    }

    function setCurrentSelection() {
        var currentSelectionArray = [];
        selectInteraction.getFeatures().forEach(function(feature) {
            var properties = feature.getProperties();
            var currentFeatureId = feature.getId();
            var currentFeature = feature.clone();
            currentFeature.setId(feature.getId());
            currentSelectionArray.push(currentFeature);
        });
    };
};


map.on('singleclick', checkDeselectL);


function checkDeselectL() {
    console.log('checkDeselectL was called');
    if (($('#deselectL').is(':checked')) === true) {
        console.log('deselectL is true');
        deselectLayer();
    } else if (($('#deselectL').is(':checked')) !== true) {
        console.log('deselectL is false');
    }
}

($('#deselectL').change(function() {
    console.log('change event on checkbox was triggered');
    checkDeselectL();
}));*/



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



$('#btDelete').click(function() {
    clearSelection();
});



// clear selection store and unselect selected features
var clearSelection = function() {
    selectionStore.removeAll();
    selectInteraction.getFeatures().clear();
    subSelection.getFeatures().clear();
    map.removeInteraction(subSelection);
    map.removeInteraction(clonedSelection);
    map.addInteraction(selectInteraction);
};



// when feature is selected
selectInteraction.on('select', function() {
    map.removeInteraction(subSelection);
    putFeaturesToStore();
});

subSelection.on('select', function() {
    putFeaturesToStore();
    map.removeInteraction(selectInteraction);
    map.addInteraction(selectInteraction);
    map.removeInteraction(subSelection);
    map.addInteraction(subSelection);
});



/*var dragStarted = false;

var handleDragStart = function(ev) {
    if (dragStarted !== true) {
        console.log('dragStarted was false');
        dragStarted = true;
        console.log('dragStarted was set to true');

        function selectByMapExtent() {
            clearSelection();
            getActiveLayerSource().source.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
                selectInteraction.getFeatures().push(feature);
            });
            putFeaturesToStore();
        }
        selectByMapExtent();
    }
};

map.on('pointerdrag', function() {
    handleDragStart();
    console.log('Test');
});*/

// when map is moved
map.on('moveend', function() {
    clearSelection();
    getActiveLayerSource().source.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
    dragStarted = false;
    console.log('dragStarted was set to false');
});

/*function onpropertychange() {
    map.dispatchEvent('movestart');
    console.log('movestart was triggered');
    var view = map.getView();
    view.un('propertychange', onpropertychange);
    selectByMapExtent();
    console.log('view was changed');
    map.on('moveend', function() {
        view.on('propertychange', onpropertychange);
    });
};
map.getView().on('propertychange', onpropertychange);

var selectByMapExtent = function() {
    clearSelection();
    getActiveLayerSource().source.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
};*/



// remove features from selection and clear store
map.on('singleclick', function() {
    selectionStore.removeAll();
    map.removeInteraction(subSelection);
});
