// app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const sequelize = require("./config/database");

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Import models to ensure they are registered with Sequelize
const Caso = require("./model/Caso");
const File = require("./model/File");
const CasoFile = require("./model/CasoFile"); // Import the join table explicitly

// Sync the models with the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync(); // Ensure all models, including join tables, are synced
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
const adminRoutes = require("./routes/admin");
const abogadoRoutes = require("./routes/abogados");
const clienteRoutes = require("./routes/clientes");
const alumnoRoutes = require("./routes/alumnos");
const casoRoutes = require("./routes/casos");
const chatRoutes = require("./routes/chat");
const fileRoutes = require("./routes/Files");
const bibliotecaRoutes = require("./routes/biblioteca");

// Use routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/abogados", abogadoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/casos", casoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/biblioteca", bibliotecaRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`API is running on port ${port}!`);
});

// Set keepAliveTimeout and headersTimeout for the server
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
