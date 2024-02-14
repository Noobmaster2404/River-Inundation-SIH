var aoi = table.filter(ee.Filter.eq("District", "GORAKHPUR"));
var a = image.clip(aoi);
// var a = ee.Image("CGIAR/SRTM90_V4")
// var b = a.clip(aoi)
// var dem = b.select('elevation')
// Map.addLayer(dem)
// Export.image.toDrive({
//   image:dem,
//   description : "DEM",
//   scale : 30,
//   region : aoi,
// })
Map.addLayer(a, { min: 0, max: 150 });
// var hillshade=ee.Terrain.hillshade(a)
// Map.addLayer(hillshade, {min: 150, max: 280})
var exportParams = {
	region: a,
	scale: 30, // Adjust the scale according to your requirements
	format: "JPEG", // Specify the desired format
};
