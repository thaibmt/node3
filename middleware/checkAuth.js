// middleware/checkAuth.js

module.exports = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (req.session.user) {
        return next();
    }
    req.session.error = "Vui lòng đăng nhập";
    return res.redirect('login');
};
