const express = require("express");
const axios = require("axios"); // using axios cause node-fetch gives more errors than my ex
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  axios
    .get("https://dummyjson.com/products/1")
    .then((response) => {
      const data = response.data;
      // parsed data into variables for later use
      const sensor_name = data.id;
      const sensor_temp = data.title;
      //devaid, logs wanted values from parsed data
      console.log("Product ID:", sensor_name);
      console.log("Product Title:", sensor_temp);
      //devaid, logs parsed data
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "500 error code" });
      console.log(data);
    });
});

app.listen(port, () => {
  //http://localhost:3000/
  //later this port will be frost server
  console.log(`Server is listening on port ${port}`);
});
