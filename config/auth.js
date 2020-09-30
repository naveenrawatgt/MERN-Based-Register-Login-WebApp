module.exports = {
    ensureAuthenticated: (req, res, next)=>{
        if (req.isAuthenticated()){
            return next();
        }else{
            req.flash('error_msg', 'Please sign in to view this page.');
            res.redirect('/user/login');
        }
    }
}