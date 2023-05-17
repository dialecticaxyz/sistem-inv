const jwt = require('jsonwebtoken');

async function verifyUser(req, res, next) {
  const token = req.headers["x-access-token"];
  if(!token) {
    return res.status(401).send({message:"No Token aws Provided"});
  }
  jwt.verify(token, '123', (err, decoded) => {
    if(err){
      return res.status(401).send({message:"No Token aws Autorised"});
    }else{
      if(decoded.rol=="admin"||decoded.rol=="vend"){
        return  next();
      }else{
        return res.status(401).send({message:"No Autorised"});
      }
    }
  });
}

module.exports = { verifyUser: verifyUser}