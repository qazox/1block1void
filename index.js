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