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
// point layer
// power tower
var powerTower = selectableLayers.powerTower.layer;

// line layer
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
    //style: pointHighlight, lineHighlight, polygonHighlight,
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



// start ext js part
// basic grid panel start
var dataModel = Ext.define('Selection', {
    extend: 'Ext.data.Model',
    fields: ['id', 'osm_id', 'power', 'operator', 'ref', 'osm_pk', 'geometry', 'feature_Id']
});

var selectionStore = Ext.create('Ext.data.Store', {
    model: 'Selection',
    data: selectableLayers.powerTower.dataModel
});

var grid = Ext.create('Ext.grid.Panel', {
    renderTo: $('#grid')[0],
    store: selectionStore,
    width: '100%',
    height: 280,
    title: 'Selections',
    selModel: {
        selType: 'rowmodel', // rowmodel is the default selection model
        mode: 'MULTI' // Allows selection of multiple rows
    },
    columns: selectableLayers.powerTower.columns,
    /*columns: {
        selectableLayers.powerTower.columns,
        selectableLayers.powerLines.columns
    },*/
    /*columns: [
        selectableLayers.powerTower.columns,
        selectableLayers.powerLines.columns,
        selectableLayers.solarPolygon.columns
    ],*/
    // add event listeners to panel
    listeners: {
        select: function(record, index) {
            var selectionModel = this.getSelectionModel();
            var selection = this.getSelection();
            var featureId = selection[0].data.feature_Id;
        },
    }
});
// end ext js part


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


// Create the map
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
};


var putFeaturesToStore = function() {
    var newData = [];
    selectInteraction.getFeatures().forEach(function(feature) {
        // get ol feature id from selected feature
        var fId = feature.getId();
        console.log(fId);
        // get properties from selectd feature
        var prop = feature.getProperties(),
            newRow = {
                osm_id: prop.osm_id,
                power: prop.power,
                operator: prop.operator,
                ref: prop.ref,
                osm_pk: prop.osm_pk,
                geometry: prop.geometry,
                feature_Id: fId
            };
        // push properties and feature to row
        newData.push(newRow);
    });
    selectionStore.setData(newData);
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
    powerTowerSource.forEachFeatureIntersectingExtent(getMapExtent(), function(feature) {
        selectInteraction.getFeatures().push(feature);
    });
    putFeaturesToStore();
});
