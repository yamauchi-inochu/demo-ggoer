(function () {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTE1ODNkYy1lNzFhLTQyMTctODliZi1lYmI3MmViYWEwN2QiLCJpZCI6MTI0NzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4NjgzOTAwN30.Cu2EHKVy8dBp7XL2cIvSUaXMDwZsCkfqm2jX7c3ObVI';

  var viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayerPicker: true,
  timeline : false,
  animation : false,
  homeButton: true,
  vrButton: true,
  geocoder:true,
  sceneModePicker:true,
  navigationHelpButton:false,
  terrainProvider : Cesium.createWorldTerrain()
});

  // コードをここに記述

}());