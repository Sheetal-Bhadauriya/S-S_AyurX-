const mysql = require("mysql");
const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

let globalProductsData = [];

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root12",
  database: "sAyur",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for serving static files (e.g., CSS)
app.use(express.static(path.join(__dirname, "public")));

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/buynow", (req, res) => {
  // Use the stored productsData for rendering the buynow template
  res.sendFile(path.join(__dirname, "views/buynow.html"));
});

app.post("/placeOrder", (req, res) => {
  // Extract data from the request body
  const { address, paymentMethod, shippingMethod, totalPrice } = req.body;

  // Use the extracted data as needed
  const sql =
    "INSERT INTO orders (address, payment_method, shipping_method, product_total) VALUES (?, ?, ?, ?)";

  connection.query(
    sql,
    [address, paymentMethod, shippingMethod, totalPrice],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        console.log("Order placed successfully!");
        res.json({ success: true, message: "Order placed successfully!" });
      }
    }
  );
});

// Serving the HTML File for user request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/createAccount", (req, res) => {
  res.sendFile(path.join(__dirname, "views/createAccount.html"));
});

app.get("/orderConfirm", (req, res) => {
  res.sendFile(path.join(__dirname, "views/orderConfirm.html"));
});

// For User Registration.
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const salt = crypto.randomBytes(16);

  const combined = Buffer.concat([Buffer.from(password), salt]);

  // Hash the combined value (SHA-256)
  const hashedPassword = crypto
    .createHash("sha256")
    .update(combined)
    .digest("hex");

  // Create a SQL query to insert the data into the database
  const insertQuery =
    "INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)";

  connection.query(
    insertQuery,
    [username, email, hashedPassword, salt],
    (error, results) => {
      if (error) {
        console.error("Error inserting data into the database:", error);
        res.status(500).json({
          success: false,
          message: "Registration failed. Please try again.",
        });
      } else {
        console.log("Data inserted into the database");
        res.json({ success: true });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const selectQuery =
    "SELECT salt, password_hash FROM users WHERE username = ?";

  connection.query(selectQuery, [username], (error, results) => {
    if (error) {
      console.error("Error retrieving user data:", error);
      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    } else if (results.length === 1) {
      const user = results[0];
      const salt = user.salt;
      const storedPassword = user.password_hash;

      const combined = Buffer.concat([Buffer.from(password), salt]);
      const hashedPassword = crypto
        .createHash("sha256")
        .update(combined)
        .digest("hex");

      if (hashedPassword === storedPassword.toString()) {
        console.log("Successed");
        res.json({ success: true, message: "Login successful!" });
      } else {
        res.status(401).json({
          success: false,
          message: "Login failed. Please check your username and password.",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Login failed. Please check your username and password.",
      });
    }
  });
});

// app.get("/products", (req, res) => {
//   res.sendFile(path.join(__dirname, "views/products.html"));
// });

app.get("/products", (req, res) => {
  // Fetch product data from the database
  const selectQuery = "SELECT pname, pImgUrl, price, quantity FROM products";
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product data. Please try again later.",
      });
    } else {
      // Render the HTML template with the product data
      res.render("products", { products: results });
    }
  });
});

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
