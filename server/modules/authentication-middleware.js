const rejectUnauthenticated = (req, res, next) => {
  console.log("user session:", req.user);
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
   return  next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated };
