const app = require('./app') // express-sovellus
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

//----------------------------------------
//archive scheduling
const cron = require("node-cron");
const ARCHIVE_TIME = "0 12 * * *";
const adminController = require('./controllers/admin')


const ArchiveTask = async () => {
    console.log("This runs at 12:00 every day", new Date().toISOString());
    await adminController.archiveTask();
    console.log("Archive task done");
}

cron.schedule(ARCHIVE_TIME, ArchiveTask);
//----------------------------------------

//----------------------------------------
//update cards 
const groupController = require('./controllers/group')

const populateDBWithDefaultCards = async () => {
    await groupController.createDefaultCardSets();
    console.log("default cards submitted to MongoDB")
}
populateDBWithDefaultCards();
//----------------------------------------

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
