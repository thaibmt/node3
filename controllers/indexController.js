const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require('../models/user')
const Phone = require('../models/phone')
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');
// trang chủ
router.get('/', (req, res) => {
    res.render('index');
});
// Xử lý đăng nhập + đăng ký + đăng xuất
router.get('/login', (req, res) => {
    let error = req.session.error;
    delete req.session.error;
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render('login', { error, email: '' });
});
router.get('/register', (req, res) => {
    res.render('register', { error: '', email: '', username: '' });
});
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            throw error;
        }
        res.redirect("/");
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        const hasUser = await bcrypt.compare(password, user.password);
        if (!hasUser) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        req.session.user = user;
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect('/login', { error: 'Email hoặc mật khẩu không đúng', email });
    }
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Kiểm tra đăng nhập
        let user = await User.findOne({ email, password });
        if (user) {
            return res.render('/register', { error: 'Nguời dùng đã tồn tại', email });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.redirect("/login");
    } catch (error) {
        res.redirect('/register', { error: 'Có lỗi xảy ra khi đăng ký', email });
    }
});
// xử lý trang quản lý
router.get('/dashboard', checkAuth, async (req, res) => {

    const username = req.session.user.name;
    const role = req.session.user.role;
    const error = req.session.error;
    const success = req.session.success;
    const phones = await Phone.find({});
    delete req.session.error;
    delete req.session.success;
    res.render("dashboard", { phones: phones, username: username, role: role, error: error, success: success });
});
// xem chi tiết điện thoại
router.get('/phones/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    const phone = await Phone.findOne({ _id: id });
    res.render("view", { phone: phone });
});
router.post('/phones/delete/:id', checkAuth, checkAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        await Phone.deleteOne({ _id: id });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/dashboard");
});
router.post('/phones', checkAuth, checkAdmin, async (req, res) => {
    const { title, price, description } = req.body;
    let phone = new Phone({
        title,
        price,
        description
    });
    try {
        await phone.save();
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/dashboard");
});
router.post('/phones/update/:id', checkAuth, checkAdmin, async (req, res) => {
    const { title, price, description } = req.body;
    const id = req.params.id;
    try {
        await Phone.updateOne({ _id: id }, { title, price, description });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/dashboard");
});
module.exports = router;
