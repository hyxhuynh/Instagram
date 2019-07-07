const express = require('express');
const app = express();

// First route
app.get('/', (req, res) => res.send('Hello'));
const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));