/*
    Code for the core of the webserver.

    Currently, it only serves files, but
    (eventually) multiplayer support
    will be added.
*/

let express = require('express');

const port = 3000;

let app = new express();

app.use(express.static('static'));

app.get('/', (req,res) => {
    res.sendFile(`${process.cwd()}/res/core.html`)
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});