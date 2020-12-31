const User = require('../model/userModel');

exports.register = (req, res) => {
    res.render('register');
};


exports.registerPost = (req, res) => {

    console.log(req.body);
    const { name, email, password } = req.body; 

    if(!name || !email || !password) {
        res.render('register', { error: 'Please provide all deatils'});
    }

    User.findOne({ 'email': email}, (err, user) => {
        if (err) {
            res.render('register', { error: err});
        }

        if (user) {
            res.render('register', { error: 'This email already exists!!'});
        } else {
            User.create(req.body, (err, newUser) => {
                if (err) {
                    res.render('register', { error: err});
                }

                res.render('register', { error: 'User successfully created!'});
            });
        }

    });
};

exports.login = (req, res) => {
    res.render('login');
};

exports.loginPost = async (req, res) => {
    const { email, password } = req.body; 

    if(!email || !password) {
        res.render('login', { error: 'Please provide all deatils'});
    }

    const user = await User.findOne({email});

    if(!user || !await user.correctPassword(password, user.password)) {
        res.render('login', { error: 'Incorrect email or password'});
    }

    req.session.user = user;
    if(user.email == 'admin@b.com') {
        req.session.admin = true;
    }
    res.redirect('/');
};

exports.logout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/?logout=true');
    }
};