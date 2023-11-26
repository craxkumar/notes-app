
module.exports = function (router) {
    router.get('/test', (req, res) => {
        res.send("PRIVATE");
    });
};
