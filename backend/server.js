let express = require("express");
let cors = require("cors");
let fs = require("fs");
let path = require("path");
let mariadb = require("mariadb");
let jwt = require("jsonwebtoken");
const SECRET_KEY = "grupo 6 proyecto";

let app = express();
app.use(cors());
app.use(express.json());

let db = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1899",
  database: "ecommerce",
  port: 3306,
  connectionLimit: 5,
});

let dataPath = path.join(__dirname, "data");

let folders = fs
  .readdirSync(dataPath)
  .filter((folder) => fs.statSync(path.join(dataPath, folder)).isDirectory());

folders.forEach((folder) => {
  let folderPath = path.join(dataPath, folder);

  app.get(`/${folder}`, (req, res) => {
    let files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".json"));
    let allData = files.map((file) => {
      return require(path.join(folderPath, file));
    });

    res.json(allData);
  });
});

//Middleware autenticación
app.use("/:folder/:file", (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
        next();
    }
    catch(error) {
        res.status(401).json({message: "Usuario no autorizado"});
    }
});

app.get("/:folder/:file", (req, res) => {
  let folder = req.params.folder;
  let file = req.params.file;

  let filePath = path.join(dataPath, folder, file);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Archivo no encontrado" });
  }
});
// ========== ENDPOINT POST /cart ==========
app.post("/cart", async (req, res) => {
  let conn;
  try {
    const {
      user_id,
      items,
      subtotal,
      shippingCost,
      totalWithShipping,
      shippingType,
      paymentMethod,
      address,
    } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({
        error: "Faltan datos requeridos",
      });
    }

    conn = await db.getConnection();
    await conn.beginTransaction();

    // Crear orden
    const ordenResult = await conn.query(
      `INSERT INTO ordenes (user_id, subtotal, shippingType, totalWithShipping, paymentMethod, status) 
             VALUES (?, ?, ?, ?, ?, 'pendiente')`,
      [
        user_id,
        subtotal,
        shippingCost,
        shippingType,
        totalWithShipping,
        paymentMethod,
      ]
    );

    const order_id = parseInt(ordenResult.insertId);

    // Guardar productos
    for (let item of items) {
      const subtotalItem = item.cost * item.count;

      await conn.query(
        `INSERT INTO orderDetails (order_id, product_id, quantity, unitPrice, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
        [order_id, item.id, item.count, item.cost, subtotalItem]
      );
    }

    // Guardar dirección
    if (address) {
      await conn.query(
        `INSERT INTO shippingAddress (user_id, order_id, street, city, state, zipCode, country) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          order_id,
          address.street || "",
          address.city || "",
          address.state || "",
          address.zipCode || "",
          address.country || "Uruguay",
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      success: true,
      mensaje: "✅ Orden creada exitosamente",
      order_id: order_id,
      items_guardados: items.length,
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al procesar la orden",
      detalles: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(3000, () => {
  console.log("Backend corriendo en http://localhost:3000");
  console.log("Rutas generadas automáticamente:");
  folders.forEach((f) => console.log(` ➤ /${f}`));
  console.log("Rutas MariaDB:");
  console.log("   ➤ GET /test-db (probar conexión)");
  console.log("   ➤ POST /cart (guardar orden)");
});
