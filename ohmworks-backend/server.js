import express from "express"; // js framework to create the web server
import fs from "fs"; // File System, r/w files, manipulate directories, rename and move files, provide file info, needed for json r/w
import path from "path"; // Helps build file paths cross-platform (windows, macOS, Linux)
import cors from "cors"; // Since frontend is on different port, allow cross-origin requests

const app = express();
app.use(express.json()); // Allows server to parse incoming json POST reqs
app.use(cors()); // Allow cross-origin reqs

const componentsFolder = path.join(process.cwd(), "components-data");
if (!fs.existsSync(componentsFolder)) {
    fs.mkdirSync(componentsFolder); // Create components folder if it doesn't exist when server starts
}

// GET all components
app.get("/components", (req, res) => {
    const files = fs.readdirSync(componentsFolder); // Reads all filenames in components

    const components = files.map(file => { // Loop over each file, read content
        const filePath = path.join(componentsFolder, file);
        const content = fs.readFileSync(filePath, "utf-8").trim();

        if (!content) {
            console.warn(`Skipping empty component file: ${file}`);
            return null; // Skip empty json
        }

        try {
            return JSON.parse(content); // Parse json file
        }
        catch (err) {
            console.error(`Failed to parse ${file}:`, err.message);
            return null; // Skip invalid json
        }
    }).filter(Boolean); // Remove nulls

    res.json(components); // Sends array of component objects to client
});

// GET a single component
app.get("/components/:id", (req, res) => {
    const { id } = req.params; // Gets :id from URL
    const filePath = path.join(componentsFolder, `${id}.json`); // Builds full path to the component json

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Component file not found"});
    }

    const content = fs.readFileSync(filePath, "utf-8").trim();

    if (!content) {
        return res.status(400).json({ error: "Component file is empty"});
    }

    try {
        const component = JSON.parse(content);  // Parse json file
        res.json(component);  // Sends component object to client
    }
    catch (err) {
        console.error(`Failed to parse ${id}.json:`, err.message);
        res.status(400).json({ error: "Component file contains invalid JSON" });
    }
});

// POST a component (create or update a json)
app.post("/components", (req, res) => {
    const component = req.body; // Contains json sent by client

    if (!component.id) {
        return res.status(400).json({ error: "Missing component id" });
    }

    try {
        const jsonString= JSON.stringify(component, null, 2);
        JSON.parse(jsonString);

        if (Object.keys(component).length === 0) {
            return res.status(400).json({ error: "Component JSON is empty" });
        }

        const filePath = path.join(componentsFolder, `${component.id}.json`); // Saves component as id.json in components/
        fs.writeFileSync(filePath, jsonString); // Writes the json file
        res.json({ message: "Component saved", component }); // Send confirmation json to frontend
    }
    catch (err) {
        console.error(`Failed to save component ${component.id}:`, err.message);
        res.status(400).json({ error: "Invalid component JSON"});
    }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));