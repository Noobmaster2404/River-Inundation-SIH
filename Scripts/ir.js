// get the image collection
var aoi = table.filter(ee.Filter.eq("District", "GORAKHPUR"));
var l8_composite = ee
	.ImageCollection("LANDSAT/LC08/C01/T1_SR")
	.filterDate("2021-03-01", "2021-05-31")
	.filterBounds(aoi)
	.filter(ee.Filter.lt("CLOUD_COVER", 10))
	.median()
	.clip(aoi);

// add the layer to the map
var vis_params = {
	bands: ["B5", "B6", "B10"],
	min: 0,
	max: 3000,
	gamma: 1.2,
};
Map.addLayer(l8_composite, vis_params, "L8 Composite");

// export the data to drive as TIF
// Export.image.toDrive({
//   image: l8_composite.select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']),
//   description: 'Bangalore_L8_B1to7',
//   folder: 'Bangalore_L8',
//   scale: 30, region: geometry,
//   fileDimensions: 7680,
//   maxPixels: 10e11,
//   crs: 'EPSG:32643'
// });
