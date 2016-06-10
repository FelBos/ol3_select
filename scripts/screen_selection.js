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
    addCondition: ol.events.condition.altKeyOnly,
    removeCondition: ol.events.condition.shiftKeyOnly
});



var activeSelectableLayer = solarPolygon;
var activeLayerSource = solarPolygonSource;

if (activeSelectableLayer === powerTower) {
    var layerDataModelField = selectableLayers.powerTower.dataModel;
    var layerDataStore = selectableLayers.powerTower.dataModel;
    var layerGridColumn = selectableLayers.powerTower.columns;
} else if (activeSelectableLayer === powerLines) {
    var layerDataModelField = selectableLayers.powerLines.dataModel;
    var layerDataStore = selectableLayers.powerLines.dataModel;
    var layerGridColumn = selectableLayers.powerLines.columns;
} else if (activeSelectableLayer === solarPolygon) {
    var layerDataModelField = selectableLayers.solarPolygon.dataModel;
    var layerDataStore = selectableLayers.solarPolygon.dataModel;
    var layerGridColumn = selectableLayers.solarPolygon.columns;
}


var dataModel = Ext.define('Selection', {
    extend: 'Ext.data.Model',
    fields: layerDataModelField
});


var selectionStore = Ext.create('Ext.data.Store', {
    model: 'Selection',
    data: layerDataStore
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
    columns: layerGridColumn,
    // add event listeners to panel
    listeners: {
        select: function(record, index) {
            var selectionModel = this.getSelectionModel();
            var selection = this.getSelection();
            var featureId = selection[0].data.feature_Id;
        },
    }
});



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
        selectInteraction
    ]),
    layers: [mapQuest, solarPolygon, powerLines, powerTower],
    view: new ol.View({
        center: [1010401.9676446737, 7188119.030680903],
        maxZoom: 19,
        zoom: 13
    }),
    control: 'zoom'
});



function getMapExtent() {
    var mapExtent = map.getView().calculateExtent(map.getSize());
    return mapExtent;
}


var putFeaturesToStore = function() {
    var newData = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        // get ol feature id from selected feature
        /*var fId = feature.getId();
        console.log(fId);*/

        // get properties from selectd feature
        var prop = feature.getProperties();
        console.log('prop is ', prop);
        // power tower
        if (activeSelectableLayer === powerTower) {
            var newRow = {
                osm_id: prop.osm_id,
                power: prop.power,
                operator: prop.operator,
                ref: prop.ref,
                osm_pk: prop.osm_pk,
                geometry: prop.geometry,
                feature_Id: feature.getId()
            };
        }


        // power lines
        else if (activeSelectableLayer === powerLines) {
            var newRow = {
                id: prop.id,
                power: prop.power,
                name: prop.name,
                voltage: prop.voltage,
                operator: prop.operator,
                cables: prop.cables,
                wires: prop.wires,
                frequency: prop.frequency,
                voltage_ta: prop.voltage_ta,
                geometry: prop.geometry,
                feature_Id: feature.getId()
            };
        }


        // solar polygon
        else if (activeSelectableLayer === solarPolygon) {
            var newRow = {
                osm_id: prop.osm_id,
                power: prop.power,
                power_sour: prop.power_sour,
                generator_: prop.generator_,
                layer: prop.layer,
                z_order: prop.z_order,
                objectid: prop.objectid,
                geometry: prop.geometry,
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
    activeLayerSource.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});
