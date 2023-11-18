/*
    Code for the core of the webserver.

    Currently, it only serves files, but
    (eventually) multiplayer support
    will be added.
*/


const port = 3000;
const prefix = `${process.cwd()}/db`;

let fs = require('fs').promises;
let express = require('express');
let app = new express();

app.use(express.text());
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/res/core.html`)
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.all('/api/save/:id/:x/:y', async (req, res) => {
    let { id, x, y } = req.params;

    let coords = `${x}t${y}.bin`;

    if (!isNumeric(x) || !isNumeric(y)) {
        res.send('fail');
        return;
    }

    if (req.method == 'GET') {
        try {
            let data = await fs.readFile(`${prefix}/${id}/${coords}`, 'utf8');
            res.send(data);
        } catch (err) {
            res.send('fail')
        }
        return;
    } else if (req.method == 'POST') {
        let utfData = req.body;

        if (!utfData || utfData.length != 512) {
            res.send('fail');
            return;
        }
        try {
            await fs.mkdir(`${prefix}/${id}`, { recursive: true });
            await fs.writeFile(`${prefix}/${id}/${coords}`, utfData, 'utf8');
            res.send('success');
        } catch (err) {
            res.send('fail')
        }
        return;
    }

    res.send('fail');
})

function isNumeric(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
}