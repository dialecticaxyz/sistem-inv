const Datastore = require('nedb');
var clientes = new Datastore({filename:'./data/clientes.dat', autoload: true});

function createdCliente(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  clientes.insert(req.body,(err,rsl)=>{ resp.status(200).send("created") })
};
function readClienteTime(req, resp){
  let timeCLI = req.body["timeCLI"]
  clientes.find({ time: { $gt: timeCLI } }, function(err, record) {
    clientes.count({}, function (err, count) {
      resp.status(200).send({"record":record,"count":count})
    });
  });
};
function updateCliente(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  clientes.find({"_id":req.body["_id"]}, function(err, record) {
    if(record.length==0){
      resp.status(200).send("empty")
    }else{
      clientes.update({"_id":req.body["_id"]},{$set:req.body},{},function(){
        resp.status(200).send("update")
      })
    }
  });
};
function deleteCliente(req, resp){
  clientes.remove({_id: req.body["_id"]},{}, function(err, numRemoved) {
    if(numRemoved==1){
      resp.status(200).send("delet")
    }else{
      resp.status(200).send("deletFail")
    }
  });
};
function readClientesIDS(req, resp){
  clientes.find({}, function(err, record) {
    let ids = []
    for (let i = 0; i < record.length; i++) {
      const id = record[i]["id"];
      ids.push({id})
    }
    resp.status(200).send(ids)
  });
};
function countClientes(){
  return new Promise(function(resolve,reject){
    clientes.count({},(err,count)=>{ resolve(count) });
  })
}
module.exports = {
  createdCliente,
  readClienteTime,
  countClientes,
  updateCliente,
  deleteCliente,
  readClientesIDS
}