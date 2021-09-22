
// this middleware sets flash messages from req.flash to res.flash
// flash messages appears after the req is submitted and res executes, 
// flash is set to this res
// EXAMPLE
// user signin -> success in req.flash (req) -> redirects to profile page (res)
// now, this flash is set after req is submitted and before res is finished

module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        success: req.flash('success'),
        error: req.flash('error')
    }
    next();
}