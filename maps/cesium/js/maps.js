(function () {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTE1ODNkYy1lNzFhLTQyMTctODliZi1lYmI3MmViYWEwN2QiLCJpZCI6MTI0NzcsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU4NjgzOTAwN30.Cu2EHKVy8dBp7XL2cIvSUaXMDwZsCkfqm2jX7c3ObVI';

    var viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url : './data/topo/{z}/{x}/{y}.png',
      maximumLevel: 0,
      maximumLevel: 4,
      credit : new Cesium.Credit('SRTM')}),
      baseLayerPicker: true,
      terrainProvider : Cesium.createWorldTerrain()
    });

    var imageryLayers = viewer.imageryLayers;

    var viewModel = {
      layers: [],
      baseLayers: [],
      upLayer: null,
      downLayer: null,
      selectedLayer: null,
      isSelectableLayer: function (layer) {
        return this.baseLayers.indexOf(layer) >= 0;
      },
      raise: function (layer, index) {
        imageryLayers.raise(layer);
        viewModel.upLayer = layer;
        viewModel.downLayer = viewModel.layers[Math.max(0, index - 1)];
        updateLayerList();
        window.setTimeout(function () {
          viewModel.upLayer = viewModel.downLayer = null;
        }, 10);
      },
      lower: function (layer, index) {
        imageryLayers.lower(layer);
        viewModel.upLayer =
          viewModel.layers[
            Math.min(viewModel.layers.length - 1, index + 1)
          ];
        viewModel.downLayer = layer;
        updateLayerList();
        window.setTimeout(function () {
          viewModel.upLayer = viewModel.downLayer = null;
        }, 10);
      },
      canRaise: function (layerIndex) {
        return layerIndex > 0;
      },
      canLower: function (layerIndex) {
        return layerIndex >= 0 && layerIndex < imageryLayers.length - 1;
      },
    };
    var baseLayers = viewModel.baseLayers;

    Cesium.knockout.track(viewModel);

    function setupLayers() {
      // Create all the base layers that this example will support.
      // These base layers aren't really special.  It's possible to have multiple of them
      // enabled at once, just like the other layers, but it doesn't make much sense because
      // all of these layers cover the entire globe and are opaque.
      addBaseLayerOption("topo", undefined); // the current base layer

      addBaseLayerOption(
        "GSI",
        new Cesium.UrlTemplateImageryProvider({
        url : 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
        maximumLevel: 18,
        credit : new Cesium.Credit('GSI')
    })
  );

  // Create the additional layers
  addAdditionalLayerOption(
    "topo",
    new Cesium.UrlTemplateImageryProvider({
    url : './data/topo/{z}/{x}/{y}.png',
    maximumLevel: 0,
    maximumLevel: 8,
    credit : new Cesium.Credit('GSI')
  }),
  1.0,
  false
  );
    }

    function addBaseLayerOption(name, imageryProvider) {
      var layer;
      if (typeof imageryProvider === "undefined") {
        layer = imageryLayers.get(0);
        viewModel.selectedLayer = layer;
      } else {
        layer = new Cesium.ImageryLayer(imageryProvider);
      }

      layer.name = name;
      baseLayers.push(layer);
    }

    function addAdditionalLayerOption(name, imageryProvider, alpha, show) {
      var layer = imageryLayers.addImageryProvider(imageryProvider);
      layer.alpha = Cesium.defaultValue(alpha, 0.5);
      layer.show = Cesium.defaultValue(show, true);
      layer.name = name;
      Cesium.knockout.track(layer, ["alpha", "show", "name"]);
    }

    function updateLayerList() {
      var numLayers = imageryLayers.length;
      viewModel.layers.splice(0, viewModel.layers.length);
      for (var i = numLayers - 1; i >= 0; --i) {
        viewModel.layers.push(imageryLayers.get(i));
      }
    }

    setupLayers();
    updateLayerList();

    //Bind the viewModel to the DOM elements of the UI that call for it.
    var toolbar = document.getElementById("toolbar");
    Cesium.knockout.applyBindings(viewModel, toolbar);

    Cesium.knockout
      .getObservable(viewModel, "selectedLayer")
      .subscribe(function (baseLayer) {
        // Handle changes to the drop-down base layer selector.
        var activeLayerIndex = 0;
        var numLayers = viewModel.layers.length;
        for (var i = 0; i < numLayers; ++i) {
          if (viewModel.isSelectableLayer(viewModel.layers[i])) {
            activeLayerIndex = i;
            break;
          }
        }
        var activeLayer = viewModel.layers[activeLayerIndex];
        var show = activeLayer.show;
        var alpha = activeLayer.alpha;
        imageryLayers.remove(activeLayer, false);
        imageryLayers.add(baseLayer, numLayers - activeLayerIndex - 1);
        baseLayer.show = show;
        baseLayer.alpha = alpha;
        updateLayerList();
      });


}());
