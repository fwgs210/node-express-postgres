// module.exports = (req, res, next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// }; 
const notifier = require('node-notifier');

module.exports = (err, str, req) => {
    const title = 'Error in ' + req.method + ' ' + req.url
   
    notifier.notify({
      title: title,
      message: str
    })
}