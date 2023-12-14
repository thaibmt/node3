
module.exports = (req, res, next) => {
    console.log(req.session.user)
    if (req.session.user.role === 'admin') {
        return next();
    }
    req.session.error = "Chỉ admin mới có thể dùng chức năng này.";
    res.redirect("/dashboard");
};