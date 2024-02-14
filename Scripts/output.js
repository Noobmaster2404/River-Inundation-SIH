var selection = L8.filterBounds(
	table.filter(ee.Filter.eq("District", "GORAKHPUR"))
)
	.filterDate("2022-05-01", "2022-05-15")
	.filterMetadata("CLOUD_COVER", "less_than", 1)
	.mean();

Map.addLayer(selection, { bands: ["B4", "B3", "B2"] });
var training_points = water.merge(other);
print(training_points);
var training_data = selection.sampleRegions({
	collection: training_points,
	properties: ["LC"],
	scale: 30,
});

var classifier = ee.Classifier.smileCart();
classifier = classifier.train({
	features: training_data,
	classProperty: "LC",
	inputProperties: [
		"B1",
		"B2",
		"B3",
		"B4",
		"B5",
		"B6",
		"B7",
		"B8",
		"B9",
		"B10",
		"B11",
	],
});

print(classifier);

var classified_image = selection.classify(classifier);
// Map.addLayer(classified_image, {palette : ["2874ed", "e0d1d1"], min:0, max:2}, "classifier");

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
