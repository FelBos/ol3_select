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
        select: function() { //record, index
            /*var selectionModel = this.getSelectionModel();
            var selection = this.getSelection();*/
            //console.log('record is ', record);
            //console.log('index is ', index);
            subSelectionToMap();
        },
        /*containermouseover: function(e) {
            console.log('containermouseover was triggered');
            subSelectionToMap();
        },*/
        selectionchange: function() { //selected
            //console.log('selected is ', selected);
            subSelectionToMap();
        },
        itemmouseleave: function() {
            map.removeInteraction(subSelectionMouseOver);
            map.removeInteraction(selectInteraction);
            map.addInteraction(selectInteraction);
            map.removeInteraction(subSelection);
            map.addInteraction(subSelection);
        },
        itemmouseenter: function(record, item) {
            subSelectionMouseOverToMap(item);
        }
    }
});