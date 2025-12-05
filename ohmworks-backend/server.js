import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const componentsFolder = path.join(process.cwd(), "components-data");
if (!fs.existsSync(componentsFolder)) {
    fs.mkdirSync(componentsFolder);
}

//serve SVG + JSON files
app.use("/components-data", express.static(componentsFolder));

// GET all components
app.get("/components", (req, res) => {
    const files = fs.readdirSync(componentsFolder);

    const components = files.map(file => {
        const filePath = path.join(componentsFolder, file);
        const content = fs.readFileSync(filePath, "utf-8").trim();

        if (!content) return null;

        try {
            return JSON.parse(content);
        } catch {
            return null;
        }
    }).filter(Boolean);

    res.json(components);
});

// GET single component
app.get("/components/:id", (req, res) => {
    const { id } = req.params;
    const filePath = path.join(componentsFolder, `${id}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Component not found" });
    }

    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (!content) return res.status(400).json({ error: "Empty file" });

    try {
        res.json(JSON.parse(content));
    } catch {
        res.status(400).json({ error: "Invalid JSON" });
    }
});

// POST component
app.post("/components", (req, res) => {
    const component = req.body;
    if (!component.id) return res.status(400).json({ error: "Missing id" });

    const filePath = path.join(componentsFolder, `${component.id}.json`);
    const json = JSON.stringify(component, null, 2);

    fs.writeFileSync(filePath, json);
    res.json({ message: "Component saved", component });
});

app.listen(4000, () =>
    console.log("Backend running on http://localhost:4000")
);
