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



var selectInteraction = new ol.interaction.Select({
    layers: function(layer) {
        var powerT = $('#powerT').is(':checked');
        var powerL = $('#powerL').is(':checked');
        var solarPoly = $('#solarPoly').is(':checked');
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);
        /*if (getActiveLayer() === powerTower) {
            return layer === powerTower;
        } else if (getActiveLayer() === powerLines) {
            return layer === powerLines;
        } else if (getActiveLayer() === solarPolygon) {
            return layer === solarPolygon;
        }*/

        /*layer = getActiveLayer();
        console.log('layer is ', layer);
        return (layer === powerTower) ||
            (layer === powerLines) ||
            (layer === solarPolygon);*/

        /*if (getActiveLayer() === powerTower) {
            return powerT;
        } else if (getActiveLayer() === powerLines) {
            return powerL;
        } else if (getActiveLayer() === solarPolygon) {
            return solarPoly;
        }
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);*/
    },

    style: new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [255, 100, 50, 0.5]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 100, 50, 0.8],
                width: 2
            }),
            radius: 12
        }),
        fill: new ol.style.Fill({
            color: [255, 100, 50, 0.5]
        }),
        stroke: new ol.style.Stroke({
            color: [255, 100, 50, 0.8],
            width: 2
        })
    }),

    toggleCondition: ol.events.condition.never,
    addCondition: ol.events.condition.altKeyOnly
        //removeCondition: ol.events.condition.shiftKeyOnly
        //removeCondition: ol.events.condition.ctrlKeyOnly
        //addCondition: ol.events.condition.altShiftKeysOnly
});



// check which layer is selectable
var powerTowerChecked = function() {
    if (($('#powerT').is(':checked')) === true) {
        return true;
    } else {
        return false;
    }
};

var powerLinesChecked = function() {
    if (($('#powerL').is(':checked')) === true) {
        return true;
    } else {
        return false;
    }
};

var solarPolyChecked = function() {
    if (($('#solarPoly').is(':checked')) === true) {
        return true;
    } else {
        return false;
    }
};


// call function layerXChecked (e.g. powerTowerChecked) to get selectable layer
// return value is accesible via function call
var getActiveLayer = function() {
    if (powerTowerChecked() === true) {
        return powerTower;
    } else if (powerLinesChecked() === true) {
        return powerLines;
    } else if (solarPolyChecked() === true) {
        return solarPolygon;
    }
};

// call function getActiveLayer to get selectable layer and set LayerSource accordingly
// return value is accesible via function call
var getLayerSource = function() {
    if (getActiveLayer() === powerTower) {
        layerSource = powerTowerSource;
    } else if (getActiveLayer() === powerLines) {
        layerSource = powerLinesSource;
    } else if (getActiveLayer() === solarPolygon) {
        layerSource = solarPolygonSource;
    }
    return layerSource;
};

// call function getActiveLayer to get selectable layer and set layerDataModelField accordingly
// return value is accesible via function call
var getLayerDataModelField = function() {
    if (getActiveLayer() === powerTower) {
        var layerDataModelField = selectableLayers.powerTower.dataModel;
    } else if (getActiveLayer() === powerLines) {
        var layerDataModelField = selectableLayers.powerLines.dataModel;
    } else if (getActiveLayer() === solarPolygon) {
        var layerDataModelField = selectableLayers.solarPolygon.dataModel;
    }
    return layerDataModelField;
};

// call function getActiveLayer to get selectable layer and set layerDataStore accordingly
// return value is accesible via function call
var getLayerDataStore = function() {
    if (getActiveLayer() === powerTower) {
        var layerDataStore = selectableLayers.powerTower.dataModel;
    } else if (getActiveLayer() === powerLines) {
        var layerDataStore = selectableLayers.powerLines.dataModel;
    } else if (getActiveLayer() === solarPolygon) {
        var layerDataStore = selectableLayers.solarPolygon.dataModel;
    }
    return layerDataStore;
};

// call function getActiveLayer to get selectable layer and set layerGridColumn accordingly
// return value is accesible via function call
var getLayerGridColumn = function() {
    if (getActiveLayer() === powerTower) {
        var layerGridColumn = selectableLayers.powerTower.columns;
    } else if (getActiveLayer() === powerLines) {
        var layerGridColumn = selectableLayers.powerLines.columns;
    } else if (getActiveLayer() === solarPolygon) {
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
        },
    }
});



// select in table and select in map afterwards
function tableToMap() {
    originalSelectionToMap();
    subSelectionToMap();
}

function originalSelectionToMap() {
    var originalArray = [];

    $.each(selectionGrid.getStore().data.items, function(key, value) {
        var selectedFeatureId = selectionGrid.getStore().data.items[key].data.feature_Id;
        console.log('feature id is ', selectedFeatureId);
        var feature = getLayerSource().getFeatureById(selectedFeatureId);
        console.log('feature is ', feature);
        originalArray.push(feature);
    })
    console.log('orginal array is ', originalArray);

    selectInteraction.getFeatures().clear();
    for (var i = 0; i < originalArray.length; i++) {
        selectInteraction.getFeatures().push(originalArray[i]);
    }
}

function subSelectionToMap() {
    var arrayToMap = [];
    $.each(selectionGrid.getSelectionModel().getSelection(), function(key, value) {
        var subFeatureId = selectionGrid.getSelectionModel().getSelection()[key].data.feature_Id;
        console.log('sub feature id is ', subFeatureId);
        var subFeature = getLayerSource().getFeatureById(subFeatureId);
        console.log('feature is ', subFeature);
        arrayToMap.push(subFeature);
    })
    console.log('array to map is ', arrayToMap);

    /*for (var i = 0; i < arrayToMap.length; i++) {
        selectInteraction.getFeatures().push(arrayToMap[i]);
    }*/



    // style for subselecion
    var radius = 8;
    var width = 2;
    var fill = new ol.style.Fill({
        color: [255, 255, 0, 0.5]
    });
    var stroke = new ol.style.Stroke({
        color: [127, 127, 127, 0.8],
        width: width
    });

    var strokeLine = new ol.style.Stroke({
        color: [255, 255, 0, 1]
    });

    var stylePointSubselection = [
        new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: radius,
                zIndex: 1
            })
        })
    ];
    var styleLineSubselection = [
        new ol.style.Style({
            stroke: strokeLine,
            width: width,
            zIndex: 1
        })
    ];

    var stylePolygonSubselection = [
        new ol.style.Style({
            fill: fill,
            stroke: stroke
        })
    ];

    //var styleSubselection = [stylePointSubselection, styleLineSubselection, stylePolygonSubselection];
    if (getActiveLayer() === powerTower) {
        styleSubselection = stylePointSubselection;
    } else if (getActiveLayer() === powerLines) {
        styleSubselection = styleLineSubselection;
    } else if (getActiveLayer() === solarPolygon) {
        styleSubselection = stylePolygonSubselection;
    }

    //  interaction.Select subSelection
    var subSelection = new ol.interaction.Select({
        layers: function(layer) {
            return getActiveLayer();
        },
        style: styleSubselection
    });

    map.addInteraction(subSelection);

    for (var i = 0; i < arrayToMap.length; i++) {
        subSelection.getFeatures().push(arrayToMap[i]);
    }
}



// a DragBox interaction used to select features by drawing boxes
var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
});

// clear selection when drawing a new box or clicking on the map
dragBox.on('boxstart', function() {
    clearSelection();
});


dragBox.on('boxend', function() {
    // features that intersect the box are put to the store
    var extent = dragBox.getGeometry().getExtent();
    getLayerSource().forEachFeatureIntersectingExtent(extent, function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});



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


// create map
var map = new ol.Map({
    target: document.getElementById('map'),
    //target: 'map',
    renderer: 'canvas',
    interactions: ol.interaction.defaults().extend([
        selectInteraction, dragBox /*, subSelection*/
    ]),
    layers: [mapQuest, solarPolygon, powerLines, powerTower],
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


function addSelect() {
    singleClick = new ol.interaction.Select();
    map.addInteraction(singleClick);

    singleClick.getFeatures().on('add', function(event) {
        if (getActiveLayer() === powerTower || getActiveLayer() === solarPolygon) {
            var properties = event.element.getProperties();
            selectedFeatureId = properties.osm_id;
            removeFeatureFromStore(selectedFeatureId);
        } else if (getActiveLayer() === powerLines) {
            var properties = event.element.getProperties();
            selectedFeatureId = properties.id;
            removeFeatureFromStore(selectedFeatureId);
        }
        /*fId = properties.feature_Id;
        console.log('feature id is ', fId);*/
        //removeFeatureFromLayer(selectedFeatureId);
    });
}

/*function removeFeatureFromLayer(selectedFeatureId) {
    var features = getLayerSource().getFeatures();
    if (features != null && features.length > 0) {
        for (x in features) {
            var properties = features[x].getProperties();
            var idToRemove = properties.osm_id;
            if (idToRemove == selectedFeatureId) {
                getLayerSource().removeFeature(features[x]);
                break;
            }
        }
    }
}*/

function removeFeatureFromStore(selectedFeatureId) {
    $.each(selectionStore.getData().map, function(key, value) {
        if (getActiveLayer() === powerTower || getActiveLayer() === solarPolygon) {
            var keyData = selectionStore.getData().map[key].data.osm_id;
        } else if (getActiveLayer() === powerLines) {
            var keyData = selectionStore.getData().map[key].data.id;
        }
        //var keyData = selectionStore.getData().map[key].data.idFeature;
        if (keyData === parseInt(selectedFeatureId)) {
            if (getActiveLayer() === powerTower || getActiveLayer() === solarPolygon) {
                var storeOsmId = selectionStore.getData().map[key].data.osm_id;
            } else if (getActiveLayer() === powerLines) {
                var storeOsmId = selectionStore.getData().map[key].data.id;
            }
            //var storeOsmId = selectionStore.getData().map[key].data.idFeature;
            var selectionArray = selectionStore.getData().items;

            function checkArray(selectionArray) {
                if (getActiveLayer() === powerTower || getActiveLayer() === solarPolygon) {
                    return storeOsmId !== selectionArray.data.osm_id;
                } else if (getActiveLayer() === powerLines) {
                    return storeOsmId !== selectionArray.data.id;
                }
            }
            //return storeOsmId !== selectionArray.data.idFeature;
            var filteredArray = selectionArray.filter(checkArray);

            var filteredArrayToStore = [];
            for (var i = 0; i < filteredArray.length; i++) {
                filteredArrayToStore.push(filteredArray[i].data);
                selectionStore.setData(filteredArrayToStore);
            }
        }
    })
}



function getMapExtent() {
    var mapExtent = map.getView().calculateExtent(map.getSize());
    return mapExtent;
}


var putFeaturesToStore = function() {
    var newData = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        // get properties from selectd feature
        var prop = feature.getProperties();
        //console.log('prop is ', prop);

        // power tower
        if (getActiveLayer() === powerTower) {
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
        else if (getActiveLayer() === powerLines) {
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
        else if (getActiveLayer() === solarPolygon) {
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


// clear selection store and unselect selected features
var clearSelection = function() {
    selectionStore.removeAll();
    selectInteraction.getFeatures().clear();
};


// when feature is clicked
selectInteraction.on('select', putFeaturesToStore);


// when map is moved
map.on('moveend', function() {
    clearSelection();
    getLayerSource().forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});
