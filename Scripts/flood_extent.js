var aoi = table.filter(ee.Filter.eq("District", "GORAKHPUR"));
Map.addLayer(aoi, {}, "aoi");
var collection = ee
	.ImageCollection("COPERNICUS/S1_GRD")
	.filterBounds(aoi)
	.filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
	.select("VV");
var before = collection.filterDate("2022-05-01", "2022-05-15").mosaic();
var after = collection.filterDate("2022-10-01", "2022-10-30").mosaic();
var before_clip = before.clip(aoi);
var after_clip = after.clip(aoi);
var before_s = before_clip.focal_median(30, "circle", "meters");
var after_s = after_clip.focal_median(30, "circle", "meters");
var difference = after_s.subtract(before_s);
var flood_extent = difference.lt(-3);
var flood = flood_extent.updateMask(flood_extent);
Map.addLayer(before_clip, { min: -30, max: 0 }, "Before_Flood");
Map.addLayer(after_clip, { min: -30, max: 0 }, "After_Flood");
Map.addLayer(difference, {}, "Difference");
Map.addLayer(flood, {}, "Flood");
Export.image.toDrive({
	image: before_s.float(),
	description: "gkp",
	scale: 10,
	maxPixels: 1e12,
	region: aoi,
	crs: "EPSG : 4326",
});
