module.exports = function(news){
    // Mongo controller CRUD for News
    const NewsCtrl = require('../controllers/news');

    news.route('/news')
    .get(NewsCtrl.findAllNews);

    news.route('/news/findById/:id')
    .get(NewsCtrl.findById);

    news.route('/news/add')
    .post(NewsCtrl.addNews);

    news.route('/news/update')
    .put(NewsCtrl.updateNews);

    news.route('/news/delete/:id')
    .delete(NewsCtrl.deleteNews);

    news.route('/news/findBySection/:section')
    .get(NewsCtrl.findBySection);

    news.route('/news/today')
    .get(NewsCtrl.todaysNews);
}