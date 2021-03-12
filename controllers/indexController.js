exports.index_page = (req, res) => {
    res.render('index', {title: "YouTube Video Downloader"});
}

exports.about_page = (req, res) => {
    res.render('about', {title: "About Us"})
}