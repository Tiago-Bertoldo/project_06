const jwt = require('jsonwebtoken')

module.exports = (req ,res ,next) => {
    try {
       const token = req.headers.authorization.split(' ')[1];
       const decodeToken = jwt.verify(token , 'RANDOM_TOKEN_SECRET');
       const userId = decodeToken.userId;
       console.log(token)
       req.auth = {
           userId:userId,
        }
         return next();
    } catch (error) {
        res.status(401).json({ error })
    }
}