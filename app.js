// app.js

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const sequelize = require("./config/database");

// Middleware to parse JSON requests
app.use(express.json());

// Test the database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync(); // Syncs the models with the database
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Home route for testing API
app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to the API Webserver</h1>");
});

// Import routes
const usuarioRoutes = require("./routes/usuarios");
const abogadoRoutes = require("./routes/abogados");
const clienteRoutes = require("./routes/clientes");
const alumnoRoutes = require("./routes/alumnos");
const casoRoutes = require("./routes/casos");
const citaRoutes = require("./routes/citas");
const chatRoutes = require('./routes/chat');

// Use routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/abogados", abogadoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/casos", casoRoutes);
app.use("/api/citas", citaRoutes);
app.use('/api/chat', chatRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`API is running on port ${port}!`);
});

// Set keepAliveTimeout and headersTimeout for the server
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
