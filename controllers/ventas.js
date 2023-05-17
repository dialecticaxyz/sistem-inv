const Datastore = require('nedb');
var ventas = new Datastore({filename:'./data/ventas.dat', autoload: true});
const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('./scratch');
let {proformaRegister,proformaUpdate,proformaDelete} = require('./inventario');

function createdVenta(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  let numNot = (localStorage.getItem('numNota')==null?0:parseInt(localStorage.getItem('numNota'))) + 1
  req.body["numNota"] = numNot
  localStorage.setItem('numNota', numNot)
  ventas.insert(req.body, function(err, record) {
    proformaRegister(req.body["proforma"]).then(()=>{
      resp.status(200).send({"std":"created","numNot":numNot})
    })
  })
};
function updateVenta(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  ventas.find({_id: req.body["_id"]}, function(err, record) {
    if(record.length==0){ resp.send("empty") }else{
      ventas.update({ _id:req.body["_id"]},req.body,{},function(){
        proformaUpdate(record[0]["proforma"],req.body["proforma"]).then(()=>{
          resp.status(200).send("update")
        })
      })
    }
  });
};
function deleteVenta(req, resp){
  ventas.find({"_id": req.body["_id"]}, function(err, vent) {
    if(vent.length==0){ resp.send("empty") }else{
      ventas.remove({_id: req.body["_id"]},{},(err,numRemoved)=>{
        if(numRemoved==1){
          proformaDelete(vent[0]["proforma"]).then(()=>{
            resp.status(200).send("delet")
          })
        }else{ resp.status(200).send("deletFail") }
      });
    }
  });
};
function countVentas(){
  return new Promise(function(resolve,reject){
    ventas.count({},(err,count)=>{ resolve(count) });
  })
}
function readVentas(req,resp){
  let tim = req.body["time"]
  ventas.find({ time: { $gt: tim } }, function(err, record) {
    ventas.count({}, function (err, count) {
      resp.status(200).send({"record":record,"count":count})
    });
  });
};
function readIDSventas(req,resp){
  ventas.find({}, function(err, record) {
    let ids = []
    for (let i = 0; i < record.length; i++) {
      ids.push(record[i]["id"])
    }
    resp.status(200).send(ids)
  });
};

function readVentasUserTime(req, resp){//en el dia del time
  let user = req.body["user"]
  let tim1 = req.body["tim1"]
  let tim2 = req.body["tim2"]
  ventas.find({$and:[ {time:{$gt:tim1}}, {time:{$lt:tim2}}, {"dataVenden.nom":user} ]}, (err, record)=>{
    resp.status(200).send({"record":record})
  });
};

/** 
exports.deleteOnlyVenta = async (req, resp) => {
  try {
    ventas.find({"_id": req.body["id"]}, function(err, vent) {
      if(vent.length==0){
        resp.send("empty")
        localStorage.setItem('serv', "libre")
      }else{
        ventas.remove({_id: req.body["id"]},{}, function(err, numRemoved) {
          if(numRemoved==1){
            resp.send("delet")
            localStorage.setItem('serv', "libre")
          }else{
            resp.send("deletFail")
            localStorage.setItem('serv', "libre")
          }
        });
      }
    });
  }catch(e){  
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.read_ventas_user = async (req, resp) => {///mayores al time
  try {
    let tim = req.body["time"]
    let user = req.body["user"]
    ventas.find({ $and: [{ time: { $gt: tim }}, { vendedor: user }]  }, function(err, record) {
      resp.status(200).send({"record":record})
      localStorage.setItem('serv', "libre")
    });
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

*/

module.exports = {
  createdVenta,
  updateVenta,
  deleteVenta,
  countVentas,
  readVentas,
  readIDSventas,
  readVentasUserTime
}