// working examples Ext JS 6
// simpsons grid https://docs.sencha.com/extjs/6.0/components/grids.html

Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: ['name', 'email', 'phone']
});

var userStore = Ext.create('Ext.data.Store', {
    model: 'User',
    data: [
        { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
        { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
        { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
        { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
    ]
});

Ext.create('Ext.grid.Panel', {
    renderTo: document.body,
    store: userStore,
    width: 400,
    height: 200,
    title: 'Application Users',
    columns: [{
        text: 'Name',
        width: 100,
        sortable: false,
        hideable: false,
        dataIndex: 'name'
    }, {
        text: 'Email Address',
        width: 150,
        dataIndex: 'email',
        hidden: true
    }, {
        text: 'Phone Number',
        flex: 1,
        dataIndex: 'phone'
    }]
});



// example ? start
/*Ext.require([
  'Ext.grid.*',
  'Ext.data.*',
  'Ext.form.field.Number',
  'Ext.form.field.Date',
  'Ext.tip.QuickTipManager'
]);

Ext.define('Task', {
  extend: 'Ext.data.Model',
  idProperty: 'taskId',
  fields: [
    {name: 'projectId', type: 'int'},
    {name: 'project', type: 'string'},
    {name: 'taskId', type: 'int'},
    {name: 'description', type: 'string'},
    {name: 'estimate', type: 'float'},
    {name: 'rate', type: 'float'},
    {name: 'cost', type: 'float'},
    {name: 'due', type: 'date', dateFormat:'m/d/Y'}
  ]
});

var data = [
  {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 112, description: 'Integrate 2.0 Forms with 2.0 Layouts', estimate: 6, rate: 150, due:'06/24/2007'},
  {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 101, description: 'Add required rendering "hooks" to GridView', estimate: 6, rate: 100, due:'07/01/2007'},
  {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 105, description: 'Ext Grid plugin integration', estimate: 4, rate: 125, due:'07/01/2007'}
];

Ext.onReady(function(){

  Ext.tip.QuickTipManager.init();

  var store = Ext.create('Ext.data.Store', {
    model: 'Task',
    data: data,
    sorters: {property: 'due', direction: 'ASC'},
    groupField: 'project'
  });

  var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
  });

  var grid = Ext.create('Ext.grid.Panel', {
    width: 840,
    height: 450,
    frame: true,
    title: 'Sponsored Projects',
    iconCls: 'icon-grid',
    renderTo: document.body,
    store: store,
    plugins: [cellEditing],
    dockedItems: [{
      dock: 'top',
      xtype: 'toolbar',
      items: [{
          tooltip: 'Toggle the visibility of the summary row',
          text: 'Toggle Summary',
          enableToggle: true,
          pressed: true,
          handler: function() {
              grid.getView().getFeature('group').toggleSummaryRow();
          }
      }]
  }],
  features: [{
      id: 'group',
      ftype: 'groupingsummary',
      groupHeaderTpl: '{name}',
      hideGroupedHeader: true,
      enableGroupingMenu: false
  }],
  columns: [{
      text: 'Task',
      flex: 1,
      tdCls: 'task',
      sortable: true,
      dataIndex: 'description',
      hideable: false,
      summaryType: 'count',
      summaryRenderer: function(value, summaryData, dataIndex) {
          return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
      }
  }, {
      header: 'Project',
      width: 180,
      sortable: true,
      dataIndex: 'project'
  }, {
      header: 'Due Date',
      width: 136,
      sortable: true,
      dataIndex: 'due',
      summaryType: 'max',
      renderer: Ext.util.Format.dateRenderer('m/d/Y'),
      summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
      field: {
          xtype: 'datefield'
      }
  }, {
      header: 'Estimate',
      width: 100,
      sortable: true,
      dataIndex: 'estimate',
      summaryType: 'sum',
      renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
          return value + ' hours';
      },
      summaryRenderer: function(value, summaryData, dataIndex) {
          return value + ' hours';
      },
      field: {
          xtype: 'numberfield'
      }
  }, {
      header: 'Rate',
      width: 120,
      sortable: true,
      renderer: Ext.util.Format.usMoney,
      summaryRenderer: Ext.util.Format.usMoney,
      dataIndex: 'rate',
      summaryType: 'average',
      field: {
          xtype: 'numberfield'
      }
  }, {
      id: 'cost',
      header: 'Cost',
      width: 100,
      sortable: false,
      groupable: false,
      renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
          return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
      },
      dataIndex: 'cost',
      summaryType: function(records, values) {
          var i = 0,
              length = records.length,
              total = 0,
              record;

          for (; i < length; ++i) {
              record = records[i];
              total += record.get('estimate') * record.get('rate');
          }
          return total;
      },
      summaryRenderer: Ext.util.Format.usMoney
    }]
  });
});*/
// example ? end



// manually inserted osm fake data
Ext.define('Selection', {
    extend: 'Ext.data.Model',
    fields: ['id', 'geometry', 'operator', 'osm_id', 'osm_pk', 'power', 'ref']
});

var selectionStore = Ext.create('Ext.data.Store', {
    model: 'Selection',
    data: [{
        id: 1,
        geometry: 123,
        operator: '50Hertz',
        osm_id: 11,
        osm_pk: 111,
        power: '110 kV',
        ref: 777
    }, {
        id: 2,
        geometry: 456,
        operator: 'eon',
        osm_id: 21,
        osm_pk: 222,
        power: '220 kV',
        ref: 888
    }]
});

Ext.create('Ext.grid.Panel', {
    renderTo: $('#grid')[0],
    store: selectionStore,
    width: '100%',
    height: 280,
    title: 'Selections',
    columns: [{
        text: 'ID',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'id'
    }, {
        text: 'Geometry',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'geometry'
    }, {
        text: 'Operator',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'operator'
    }, {
        text: 'OSM ID',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'osm_id'
    }, {
        text: 'OSM PK',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'osm_pk'
    }, {
        text: 'Power',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'power'
    }, {
        text: 'Ref',
        width: 100,
        sortable: true,
        hideable: false,
        dataIndex: 'ref'
    }]
});


// add values from selected layer to textbox
// textbox was removed from dom
/*function selectValues() {
    selectInteraction.on('select',
        function() {
            selectInteraction.getFeatures().forEach(function(a) {
                $('#daten').val($('#daten').val() + ', ' + a.i);
                // console.log(a);
            });
        }
    );
};*/


// clear textboxs
/*function deleteSelectVal() {
    $('#daten').val("");
};*/



// not tested
/*function unselectFeatures(event) {
  var feature = event.selected[0];
  myLayer.getSource().removeFeature(feature);
  event.selected.clear();
};*/

/*function unselectFeatures() {
  selectInteraction.getSource.removeFeatures(feature);
  //myLayer.getSource().removeFeature(feature);
  //event.selected.clear();
};*/


/*document.getElementById('daten').innerHTML = 'Test';
document.getElementById('daten').innerHTML = powerT[0];*/


// select record in grid
// http://stackoverflow.com/questions/17267026/extjs-get-rowindex-of-a-selected-row

// select feture by id tip
// http://stackoverflow.com/questions/29351968/how-to-get-features-from-vector-layer-in-openlayers-3
