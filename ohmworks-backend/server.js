import express from "express"; // js framework to create the web server
import fs from "fs"; // File System, r/w files, manipulate directories, rename and move files, provide file info, needed for json r/w
import path from "path"; // Helps build file paths cross-platform (windows, macOS, Linux)

const app = express();
app.use(express.json()); // Allows server to parse incoming json POST requests

const componentsFolder = path.join(process.cwd(), "components"); // Path to components json folder

// GET all components
app.get("/components", (req, res) => {
    const files = fs.readdirSync(componentsFolder); // Reads all filenames in components
    const components = files.map(file => // Loop over each file, read content
        JSON.parse(fs.readFileSync(path.join(componentsFolder, file), "utf-8")) // Parse json file
    );
    res.json(components); // Sends array of component objects to client
});

// GET a single component
app.get("/components/:id", (req, res) => {
    const { id } = req.params; // Gets :id from URL
    const filePath = path.join(componentsFolder, `${id}.json`); // Builds full path to the component json
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Component not found"}); // Throw a 404 error if component file not found
    }

    const component = JSON.parse(fs.readFileSync(filePath, file), "utf-8"); // Parse json file
    res.json(component); // Sends component object to client
});

// POST a component (create or update a json)
app.post("/components", (req, res) => {
    const component = req.body; // Contains json sent by client
    if (!component.id) {
        return res.status(400).json({ error: "Missing component id"}); // If component.id doesn't exist, throw 400 error
    }

    const filePath = path.join(componentsFolder, `${component.id}.json`); // Saves component asid.json in components/
    fs.writeFileSync(filePath, JSON.stringify(component, null, 2)); // Writes the json file
    res.json({ message: "Component saved", component }); // Send confirmation json to frontend
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000")); // Listen for connections on localhost:4000