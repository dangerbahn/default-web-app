module.exports = function(app) {
  var express = require('express');
  var cspReportRouter = express.Router();
  cspReportRouter.post('/', function(req, res) {
    res.send({status:'ok'});
  });
  app.use('/csp-report', cspReportRouter);
};
