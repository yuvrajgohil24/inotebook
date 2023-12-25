var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Thisisa$ecret';


const fetchUser = (req, res, next) => {
    //Get the user from the JWT token and add ID to the required object
    const token = req.header('auth-token');

    if(!token){
        res.status(401).send({error: "Please authenticate a valid token"})
    }
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
}

module.exports = fetchUser;