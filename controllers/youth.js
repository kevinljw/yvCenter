
/**
 * GET /about
 * About page.
 */
exports.getLocal = function(req, res) {
  res.render('local', {
    title: '在地好資源'
  });
};
exports.getBevo = function(req, res) {
  res.render('bevo', {
    title: '青年當志工'
  });
};
exports.getFindvo = function(req, res) {
  res.render('findvo', {
    title: '機構找志工'
  });
};
exports.getLaunchteam = function(req, res) {
  res.render('launchteam', {
    title: '揪團去服務'
  });
};
exports.getEmpower = function(req, res) {
  res.render('empower', {
    title: '青年培力'
  });
};