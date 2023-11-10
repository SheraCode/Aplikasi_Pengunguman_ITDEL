module.exports = {
    index: async(req, res) => {
        try {
            res.render('admin/users/view_signin', {
                title: 'Login',
            })
        } catch (err) {
            console.log(err)  
        }
    }
}