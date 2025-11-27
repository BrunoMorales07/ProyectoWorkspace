let express = require("express");
let cors = require("cors");
let fs = require("fs");
let path = require("path");

let app = express();
app.use(cors());


let dataPath = path.join(__dirname, "data");

let folders = fs.readdirSync(dataPath).filter(folder =>
    fs.statSync(path.join(dataPath, folder)).isDirectory()
);

folders.forEach(folder => {
    let folderPath = path.join(dataPath, folder);

    app.get(`/${folder}`, (req, res) => {
        let files = fs.readdirSync(folderPath).filter(file => file.endsWith(".json"));
        let allData = files.map(file => {
            return require(path.join(folderPath, file));
        });

        res.json(allData);
    });
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


app.listen(3000, () => {
    console.log("Backend corriendo en http://localhost:3000");
    console.log("Rutas generadas automáticamente:");
    folders.forEach(f => console.log(` ➤ /${f}`));
});
