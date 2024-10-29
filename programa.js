const PORT = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/routes")

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.static("FrontEnd")); 
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

app.use("/api-giro", routes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
