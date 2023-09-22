const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");


app.use(cors());


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://flutter-curd-7e8da-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const project = db.collection("projects");


// Fetch ALL Data records
async function fetchData() {
    const data = [];
    const result = await project.get();

    result.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
}

// Fetch Only one User data 
async function fetchDataByTitle(title) {
    const data = [];
    try {
        const result = await project.where('title', '==', title).get();
        if (!result) {
            return { message: 'Document not found' };
        }
        result.forEach((doc) => {
            data.push(doc.data());
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

//Only one data
app.get("/profile", async (req, resp) => {
    const title = req.query.title;
    try {
        const data = await fetchDataByTitle(title);
        resp.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        resp.status(500).json({ error: "Error fetching data" });
    }
})

//All User Data
app.get("/data", async (req, resp) => {
    try {
        const data = await fetchData();
        resp.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        resp.status(500).json({ error: "Error fetching data" });
    }
});

app.listen(4545, () => {
    console.log("Server is running on port 4545");
});
