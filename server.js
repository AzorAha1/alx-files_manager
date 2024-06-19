const express = require('express');
const { json } = require('express');
const routes = require('./routes/index');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(json())
app.use(require('./routes/index'));

app.listen(PORT, () => {
  console.log(`server running at port: ${PORT}`);
});
