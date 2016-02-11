
/**
 * GET /about
 * About page.
 */
exports.getAbout = function(req, res) {
  res.render('about', {
    title: '認識我們'
  });
};
exports.getCenter = function(req, res) {
  res.render('center', {
    title: '認識本中心'
  });
};
exports.getTOYPF = function(req, res) {
  res.render('toypf', {
    title: '十傑基金會'
  });
};