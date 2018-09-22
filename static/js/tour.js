var tour = new Tour(
{
	name: "tour",
	steps: [
	{
		element: "#time-chart",
		title: "Timestamp",
		content: "Marine polution over the 2017 all around the world"
	},
	{
		element: "#location-row-chart",
		title: "Total debris per location",
		content: "On this piechart we can see the total amount of debris dumped in the water per location"
	},
	{
		element: "#list-chart",
		title: "Type of polution",
		content: "In this case as a polution type it will be only marine debris"
	}]



});

// Initialize the tour
tour.init();

// Start the tour
tour.start();
