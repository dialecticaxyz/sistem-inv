const Datastore = require('nedb');
const use = new Datastore({filename:'./data/usuarios.dat', autoload: true});
const bcrypt = require('bcryptjs');
const sendCorreo = require("../correo/correo").sendCorreo
const jwt = require('jsonwebtoken');
const config = require('../config.js');

async function createdAdminInit(req, rsp){///unique email
  use.count({}, function (err, count) {
    if(count==0){
      req.body["_id"] = Date.now().toString()
      req.body["id"] = req.body["_id"]
      req.body["time"] = Date.now()
      req.body["rol"] = "admin"
      bcrypt.genSalt(10).then((salt)=>{
        bcrypt.hash(req.body["password"], salt).then((paswCript)=>{
          req.body["password"] = paswCript
          use.insert(req.body, (err, record)=>{ 
            jwt.sign({"rol":"admin","id":req.body["_id"]},config.SECRET,{expiresIn:60*60*24}, (err,tkn)=>{
              rsp.status(200).send({"tkn":tkn,"nom":req.body["nom"],"cel":req.body["cel"],"rol":"admin","std":"success"})
            });
          })
        })
      })
    }else{
      rsp.status(200).send({"std":"exists"})
    }
  });
};
async function createdUse(req, rsp){///unique email
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  use.find({email: req.body["email"]}, (err, record)=>{
    if(record.length!=0){
      rsp.status(200).send("exists")
    }else{
      req.body["password"] = ""
      use.insert(req.body, (err, record)=>{ rsp.status(200).send("created") })
    }
  });
};
async function sendEmail(req, rsp){
  use.find({email: req.body["email"]}, (err, record)=>{
    if(record.length!=0){
      sendCorreo(req.body["email"],record[0].id).then(()=>{ rsp.status(200).send("success") })
    }else{ rsp.status(200).send("empty") }
  });
};
const formPasword = async (req, res) => {
  const { token } = req.params;
  jwt.verify(token, '123', (err, decoded) => {
    if(err){
      console.log('Error al obtener data del token');
      res.render('index', {userName: "Tiempo de registro Caduco","input":false})
    }else{
      use.find({_id: decoded.id}, (err, record)=>{
        if(record.length!=0){
          if(record[0].password==""){
            res.render('index', {userName: record[0].nom,"input":true})
          }else{
            res.render('index', {userName: record[0].nom,"input":false,"txt":"la contraseña ya fue Registrada"})
          }
        }else{
          res.render('index', {userName: "No existe Usuario","input":false})
        }
      });
    }
  });
}  
const createdPasword = async (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token,config.SECRET, (err, decoded) => {
    if(err){
      rsp.status(200).send("error")
    }else{
      use.find({_id:decoded.id}, (err, record)=>{
        if(record.length!=0){
          let pas = record[0].password
          if(pas==""){
            let password = req.body["password"]
            bcrypt.genSalt(10).then((salt)=>{
              bcrypt.hash(password, salt).then((paswCript)=>{
                use.update({ _id:decoded.id},{$set:{"password":paswCript,"time":Date.now()}},{},(err, num)=>{
                  if(num==1){ res.status(200).send("createdPasw") }
                });
              })
            })
          }else{ res.status(200).send("existsPasw") }
        }else{  rsp.status(200).send("empty") }
      });
    }
  });
} 
const updatePasword = async (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, '123', (err, decoded) => {
    if(err){
      rsp.status(200).send("error")
    }else{
      use.find({_id:decoded.id}, (err, record)=>{
        if(record.length!=0){
          let emailD = record[0].email
          let password = record[0].password
          let email = req.body["email"]
          let pas = req.body["pas"]
          let newPas = req.body["newPas"]
          if(emailD==email){
            bcrypt.compare(pas, password, (err,rsl)=>{
              if(rsl){
                bcrypt.genSalt(10).then((salt)=>{
                  bcrypt.hash(newPas, salt).then((paswCript)=>{
                    use.update({ _id:decoded.id},{$set:{"password":paswCript,"time":Date.now()}},{},(err, num)=>{
                      if(num==1){ res.status(200).send("updatePasw") }
                    });
                  })
                })
              }else{ res.status(200).send("error de usuario o contraseña") }
            });
          }else{ res.status(200).send("error de usuario o contraseña") }
        }else{  res.status(200).send("empty") }
      });
    }
  });
} 
async function loginUser(req, rsp){
  use.find({email: req.body["email"]},(err,record)=>{
    if(record.length!=0){
      let d = record[0]
      const token = req.headers["x-access-token"];
      bcrypt.compare(token, d.password, (err,res)=>{
        if(res){
          jwt.sign({"rol":d.rol,"id":d.id},config.SECRET,{expiresIn:60*60*24},(err, tkn)=>{
            rsp.status(200).send({"tkn":tkn,"nom":d.nom,"cel":d.cel,"rol":d.rol,"std":"success"})
          });
        }else{
          rsp.status(200).send({std:"errorPsw"})
        }
      });
    }else{ rsp.status(200).send({std:"emptyUser"}) }
  });
};
function readUsers(req, resp) {
  use.find({}, function(err, record) {
    use.count({}, function (err, count) {
      resp.status(200).send({"record":record,"count":count})
    });
  });
};
function deleteUser(req, resp){
  use.remove({_id: req.body["_id"]},{}, function(err, remove) {
    if(remove==1){
      resp.status(200).send("delet")
    }else{
      resp.status(200).send("deletFail")
    }
  });
};
function countUsers(){
  return new Promise(function(resolve,reject){
    use.count({},(err,count)=>{ resolve(count) });
  })
}

module.exports = {
  createdUse,
  sendEmail,
  formPasword,
  createdPasword,
  loginUser,
  readUsers,
  deleteUser,
  countUsers,
  updatePasword,
  createdAdminInit
}
