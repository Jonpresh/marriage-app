const app = require("./server")

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
