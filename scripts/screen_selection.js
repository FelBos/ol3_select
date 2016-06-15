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



// Initialize the select interaction
var selectInteraction = new ol.interaction.Select({
    layers: function(layer) {
        var powerT = $('#powerT').is(':checked');
        var powerL = $('#powerL').is(':checked');
        var solarPoly = $('#solarPoly').is(':checked');
        return (powerT && layer === powerTower) ||
            (powerL && layer === powerLines) ||
            (solarPoly && layer === solarPolygon);
    },
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 12,
            fill: new ol.style.Fill({
                color: 'rgba(255, 100, 50, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                width: 2,
                color: 'rgba(255, 100, 50, 0.8)'
            })
        }),

        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            width: 2,
            color: 'rgba(64, 64, 64, 0.8)'
        }),

        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            width: 2,
            color: 'rgba(255, 100, 50, 0.8)'
        }),
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


var gridColumn = Ext.create('Ext.grid.Panel', {
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
var selection = this.getSelection();
*/
            //var featureId = selection[0].data.feature_Id;
        },
    }
});



// a DragBox interaction used to select features by drawing boxes
var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
});

// clear selection when drawing a new box and when clicking on the map
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
        selectInteraction, dragBox
    ]),
    layers: [mapQuest, solarPolygon, powerLines, powerTower],
    view: new ol.View({
        center: [1010401.9676446737, 7188119.030680903],
        maxZoom: 19,
        zoom: 13
    }),
    control: ['zoom', scaleBar]
});



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
            selectionArray.filter(checkArray);
            var filteredArray = selectionArray.filter(checkArray);

            var filteredArrayToStore = [];
            for (var i = 0; i < filteredArray.length; i++) {
                filteredArrayToStore.push(filteredArray[i].data);
                selectionStore.setData(filteredArrayToStore);
            }
        } else {}
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
