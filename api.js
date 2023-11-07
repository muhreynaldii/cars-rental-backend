const express = require("express");
const bodyParser = require("body-parser");

const client = require("./connection");
const app = express();

app.use(bodyParser.json());

app.listen(3100, () => {
  console.log("Server Running");
});

client.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});

app.get("/cars", async (req, res) => {
  try {
    const query = "SELECT * FROM cars";
    const result = await client.query(query);

    res.send(result.rows);
  } catch (err) {
    console.error("Error executing the query:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/cars", async (req, res) => {
  try {
    const { car_id, car_name, day_rate, month_rate, image } = req.body;
    const query =
      "INSERT INTO cars (car_id, car_name, day_rate, month_rate, image) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [car_id, car_name, day_rate, month_rate, image];
    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating a car:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cars/:car_id", async (req, res) => {
  try {
    const carId = req.params.car_id;
    const query = "SELECT * FROM cars WHERE car_id = $1";
    const values = [carId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Car not found");
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error("Error getting a car by ID:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/cars/:car_id", async (req, res) => {
  try {
    const carId = req.params.car_id;
    const { car_name, day_rate, month_rate, image } = req.body;
    const query =
      "UPDATE cars SET car_name = $1, day_rate = $2, month_rate = $3, image = $4 WHERE car_id = $5 RETURNING *";
    const values = [car_name, day_rate, month_rate, image, carId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Car not found");
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error("Error updating a car:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/cars/:car_id", async (req, res) => {
  try {
    const carId = req.params.car_id;
    const query = "DELETE FROM cars WHERE car_id = $1 RETURNING *";
    const values = [carId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Car not found");
    } else {
      res.send("Car deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting a car:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/orders", async (req, res) => {
  try {
    const {
      order_id,
      order_date,
      pickup_date,
      dropoff_date,
      pickup_location,
      dropoff_location,
      car_id,
    } = req.body;
    const query =
      "INSERT INTO orders (order_id, order_date, pickup_date, dropoff_date, pickup_location, dropoff_location, car_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      order_id,
      order_date,
      pickup_date,
      dropoff_date,
      pickup_location,
      dropoff_location,
      car_id,
    ];
    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating an order:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/orders", async (req, res) => {
  try {
    const query = "SELECT * FROM orders";
    const result = await client.query(query);

    res.send(result.rows);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/orders/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const query = "SELECT * FROM orders WHERE order_id = $1";
    const values = [orderId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Order not found");
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error("Error getting an order by ID:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/orders/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const {
      car_id,
      order_date,
      pickup_date,
      dropoff_date,
      pickup_location,
      dropoff_location,
    } = req.body;
    const query =
      "UPDATE orders SET car_id = $1, order_date = $2, pickup_date = $3, dropoff_date = $4, pickup_location = $5, dropoff_location = $6 WHERE order_id = $7 RETURNING *";
    const values = [
      car_id,
      order_date,
      pickup_date,
      dropoff_date,
      pickup_location,
      dropoff_location,
      orderId,
    ];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Order not found");
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error("Error updating an order:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/orders/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const query = "DELETE FROM orders WHERE order_id = $1 RETURNING *";
    const values = [orderId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).send("Order not found");
    } else {
      res.send("Order deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting an order:", err);
    res.status(500).send("Internal Server Error");
  }
});
