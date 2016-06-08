// vector layer on aws geoserver requested via wfs-getFeatureRequest
// point layer
// power tower
var powerTowerSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function(extent) {
        return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:powertower&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
    },
    strategy: ol.loadingstrategy.bbox
});

// maxFeatures=50& was taken out
// line layer
// power lines
var powerLinesSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function(extent) {
        return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:powerlines&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
    },
    strategy: ol.loadingstrategy.bbox
});

// polygon layer
// solar polygon
var solarPolygonSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function(extent) {
        return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:solarpolygon&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
    },
    strategy: ol.loadingstrategy.bbox
});

// add vector layer and set style
// point style
// power tower
var powerTower = new ol.layer.Vector({
    source: powerTowerSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: '#636363',
                width: 2
            })
        })
    })
});


// line style
// power lines
var powerLines = new ol.layer.Vector({
    source: powerLinesSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#bdbdbd',
            width: 4
        })
    })
});


// polygon style
// solar polygon
var solarPolygon = new ol.layer.Vector({
    source: solarPolygonSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#fec44f'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
            width: 2
        })
    })
});



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
Ext.define('Selection', {
    extend: 'Ext.data.Model',
    fields: ['id', 'osm_id', 'power', /* 'operator',*/ 'ref', 'osm_pk', 'geometry', 'feature_Id']
});

var selectionStore = Ext.create('Ext.data.Store', {
    model: 'Selection',
    data: [{
        osm_id: 11,
        power: 'tower',
        operator: '50Hertz',
        ref: 777,
        osm_pk: 111,
        geometry: 123,
        feature_Id: 789
    }, {
        osm_id: 21,
        power: 'tower',
        operator: 'eon',
        ref: 888,
        osm_pk: 222,
        geometry: 456,
        feature_Id: 987
    }]
});

Ext.create('Ext.grid.Panel', {
    renderTo: $('#grid')[0],
    store: selectionStore,
    width: '100%',
    height: 280,
    title: 'Selections',
    selModel: {
        selType: 'rowmodel', // rowmodel is the default selection model
        mode: 'MULTI' // Allows selection of multiple rows
    },
    columns: [{
        text: 'OSM ID',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'osm_id'
    }, {
        text: 'Power',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'power'
    }, {
        text: 'Operator',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'operator'
    }, {
        text: 'Ref',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'ref'
    }, {
        text: 'OSM PK',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'osm_pk'
    }, {
        text: 'Geometry',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'geometry'
    }, {
        text: 'Feature Id',
        width: '100 %',
        sortable: true,
        hideable: false,
        dataIndex: 'feature_Id'
    }],
    // add event listeners to panel
    listeners: {
        select: function(record, index) {
            var selectionModel = this.getSelectionModel();
            //getRecords(selectionStore);
            var selection = this.getSelection();
            var featureId = selection[0].data.feature_Id;
        },
    }
});
// end ext js part



/*var pos = ol.OverlayPositioning('bottom-left');
console.log(pos);*/
/*var size = ol.Size();
console.log(size);*/
/*var co = ol.Coordinate();
console.log(co);*/



selectValues();

// gets values from selected layer and adds them to grid
function selectValues() {
    selectInteraction.on('select',
        function() {
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
        }
    );
};



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
    })
});
