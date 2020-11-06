import express from "express";
import usersData from "./data.json";
import moment from "moment";
import MongoClient from "mongodb";
import path from "path";

console.log(process.env.MONGO_URL);
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/hrtest';

const app = express();

// Create a middleware
const middleware = ((req, res, next) => {
    // here we can check token on the headers for authentication
    // and block access to the routes that need authorisation.
    // Not implemented for now :)
    console.log("middle");
    next();
});

// init MongoDB
const initMongo = (async () => {
    console.log('Starting MongoDB...');
    let client;
    try {
        client = await MongoClient.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch(err) {
        console.log(err);
    }
    console.log('MongoDB started...');
    return client.db(client.s.options.dbName).collection('users');
});

const init = (async () => {
    const db = await initMongo();

    await storeUsers(db);

    app.set("port", 5000);
    app.set('views', './views');
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'public')))
    
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
        
    }));

    app.get("/", (req, res) => {
        res.render('index', { title: 'Test' });
    });
    
    app.get("/list", async (req, res) => {
        const nearlyExpiredNames = [];
        const currDate = moment();

        const users = await getUsers(db);
        users.forEach((user) => {
            // We add a year on the last updated date and we compare
            // it with the current date for showing the nearly expired
            // names
            let lastUpdateDate = moment(user.nameUpdated).add(1, 'y');
            const diff = moment.duration(lastUpdateDate.diff(currDate))
            if (diff.asDays() <= 28) nearlyExpiredNames.push(user.name)
        })
        res.render("list", { 
            siteTitle: "Test",
            title: "Names close to expiry!",
            names: nearlyExpiredNames 
        });
    });
    
    app.post("/", async (req, res) => {
        // check to see if user exists
        const user = await getUserByUsername(db, req.body.username); 
        if (user) {
            res.redirect(`/users/${user.username}`);
        } else {
            res.redirect("/");
        }
    });
    
    app.get("/users/:username", middleware, async (req, res) => {
        //find name from username
        const user = await getUserByUsername(db, req.params.username);
        if (user) {
            res.render("user", { 
                siteTitle: "Test",
                user, message: "" 
            });
        } else {
            res.redirect("/");
        }
    });
    
    
    app.post("/users/:username", middleware, async (req, res) => {
        const user = await getUserByUsername(db, req.params.username);
        const newName = req.body.newName;
        const previousNameSet = new Set(user.previousNames);

        if (previousNameSet.has(newName)) {
            res.render("user", { 
                siteTitle: "Test",
                user, 
                message: "The inserted name was previously used!" 
            });
        } else {
            //update the name and add new name to previous names array
            await updateUserData(db, user.username, [...user.previousNames, user.name], newName, moment().format());
            const newUser = await getUserByUsername(db, user.username);
            res.render("user", { 
                siteTitle: "Test",
                user: newUser, 
                message: "Name has been updated correctly!" 
            });
        }
    });
    
    app.get("/users/:username/list", middleware, async (req, res) => {
        const user = await getUserByUsername(db, req.params.username);
        res.render("list", { 
            siteTitle: "Test",
            title: "Previously used names!",
            names: user.previousNames 
        });
    });
    
    app.listen(app.get("port"), () => {
        console.log(`App started listening on PORT: ${app.get("port")}`)
    });
});

async function storeUsers(db) {
    await db.insertMany(usersData);
}

async function getUsers(db) {
    return await db.find({}).toArray();
}

async function getUserByUsername(db, username) {
    return await db.findOne({ username: username });
}

async function updateUserData(db, username ,prevNames, newName, updateDate) {
    await db.updateOne(
        { username: username },
        {
            $set: {
                name: newName,
                previousNames: prevNames,
                nameUpdated:  updateDate
            }
        }
    );
}

init();