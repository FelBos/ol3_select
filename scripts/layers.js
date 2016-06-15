// vector layer on geoserver access via wfs-getFeatureRequest
// source for respective layer
var sources = {
    powerTower: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:powertower&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
    }),
    powerLines: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:powerlines&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
    }),
    solarPolygon: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost/geoserver/aws/BGI/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BGI:solarpolygon&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
    })
};

// title, data model, columns and style for respective layer
var selectableLayers = {
    powerTower: {
        title: 'Power Tower',
        selectable: false,
        dataModel: ['osm_id', 'power', 'operator', 'ref', 'osm_pk', 'geom_wkt', /* 'geometry',*/ 'feature_Id'],
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
                text: 'Geometry WKT',
                width: 100,
                sortable: true,
                hideable: true,
                dataIndex: 'geom_wkt'
            },
            /* {
                        text: 'Geometry',
                        width: 100,
                        sortable: true,
                        hideable: true,
                        dataIndex: 'geometry'
                    },*/
            {
                text: 'Feature Id',
                width: 100,
                sortable: true,
                hideable: true,
                dataIndex: 'feature_Id'
            }
        ],
        layer: new ol.layer.Vector({
            source: sources.powerTower,
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
        })
    },
    powerLines: {
        title: 'Power Lines',
        selectable: false,
        dataModel: ['id', 'power', 'name', 'voltage', 'operator', 'cables', 'wires', 'frequency', 'voltage_ta', 'geom_wkt', /*'geometry',*/ 'feature_Id'],
        columns: [{
                text: 'ID',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'id'
            }, {
                text: 'Power',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'power'
            }, {
                text: 'Name',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'name'
            }, {
                text: 'Voltage',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'voltage'
            }, {
                text: 'Operator',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'operator'
            }, {
                text: 'Cables',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'cables'
            }, {
                text: 'Wires',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'wires'
            }, {
                text: 'Frequency',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'frequency'
            }, {
                text: 'Voltage Tag',
                width: 100,
                sortable: true,
                hideable: false,
                dataIndex: 'voltage_ta'
            }, {
                text: 'Geometry WKT',
                width: 100,
                sortable: true,
                hideable: true,
                dataIndex: 'geom_wkt'
            },
            /* {
                        text: 'Geometry',
                        width: 100,
                        sortable: true,
                        hideable: true,
                        dataIndex: 'geometry'
                    },*/
            {
                text: 'Feature Id',
                width: 100,
                sortable: true,
                hideable: true,
                dataIndex: 'feature_Id'
            }
        ],
        layer: new ol.layer.Vector({
            source: sources.powerLines,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#bdbdbd',
                    width: 4
                })
            })
        })
    },
    solarPolygon: {
        title: 'Solar Polygon',
        selectable: false,
        dataModel: ['osm_id', 'power', 'power_sour', 'generator_', 'layer', 'z_order', 'objectid',/* 'geometry',
*/ 'feature_Id'],
        columns: [{
            text: 'OSM ID',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'osm_id'
        }, {
            text: 'power',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'power'
        }, {
            text: 'Power Source',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'power_sour'
        }, {
            text: 'Generator',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'generator_'
        }, {
            text: 'Layer',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'layer'
        }, {
            text: 'Z Order',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'z_order'
        }, {
            text: 'Object ID',
            width: 100,
            sortable: true,
            hideable: false,
            dataIndex: 'objectid'
        },/* {
            text: 'Geometry',
            width: 100,
            sortable: true,
            hideable: true,
            dataIndex: 'geometry'
        },*/ {
            text: 'Feature Id',
            width: 100,
            sortable: true,
            hideable: true,
            dataIndex: 'feature_Id'
        }],
        layer: new ol.layer.Vector({
            source: sources.solarPolygon,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#fec44f'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                    width: 2
                })
            })
        })
    }
};
