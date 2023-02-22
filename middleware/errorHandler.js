const notFound = (req,res,next) => {
    const error = new Error(`Not Found : ${req.originalURL}`);
    res.status(404);
    next(error);
};

// Error Handler

const errorHandler = (err,req,res,next) => {
    const statuscose = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscose);
    res.json({
        message: err?.message,
        stack: err?.stack
    });
}

module.exports = {errorHandler,notFound};