const Datastore = require('nedb');
let inv = new Datastore({filename:'./data/inventario.dat', autoload: true});

function createdItem(req, rsp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  inv.insert(req.body, function(err,record){ rsp.status(200).send("created") })
};
function readInventario(req, resp){
  let timeINV = req.body["timeINV"]
  inv.find({ time: { $gt: timeINV } }, function(err, record) {
    inv.count({}, function (err, count) {
      resp.status(200).send({"record":record,"count":count})
    });
  });
};
function listaIdsInventario(req, resp){
  inventario.find({}, function(err, record) {
    let ids = []
    for (let i = 0; i < record.length; i++) {
      const id = record[i]["id"];
      ids.push({id})
    }
    resp.status(200).send(ids)
  });
};
function itemCantMenos(req, resp){
  req.body["_id"] = req.body["id"]
  inv.find({_id:req.body["_id"]},function(err, record) {
    if(record.length==0){ 
      resp.status(200).send("empty")
    }else{
      let dif = record[0]["cant"] - req.body["ajuste"]
      inv.update({ _id:req.body["_id"]},{$set:{cant:dif,time:Date.now()}},{},function(err,num){
        if(num==1){ resp.status(200).send("update") }
      });
    }
  });
};
function itemCantMas(req, resp){
  req.body["_id"] = req.body["id"]
  inv.find({_id: req.body["_id"]}, function(err, record) {
    if(record.length==0){ 
      resp.status(200).send("empty")
    }else{
      let dif = record[0]["cant"] + req.body["ajuste"]
      inv.update({ _id:req.body["_id"]},{$set:{cant:dif,time:Date.now()}},{},function(err,num){
        if(num==1){ resp.status(200).send("update") }
      });
    }
  });
};
function updateItem(req, resp){
  req.body["_id"] = req.body["id"]
  req.body["time"] = Date.now()
  inv.find({"_id":req.body["_id"]}, function(err, record) {
    if(record.length==0){
      resp.status(200).send("empty")
    }else{
      inv.update({"_id":req.body["_id"]},{$set:req.body},{},function(){
        resp.status(200).send("update")
      })
    }
  });
};
function deleteItem (req, resp){
  inv.remove({_id: req.body["_id"]},{}, function(err, remove) {
    if(remove==1){
      resp.status(200).send("delet")
    }else{
      resp.status(200).send("deletFail")
    }
  });
};

function proformaRegister(proforma){
  return new Promise(function(resolve,reject){
    for (const key in proforma) {
      const id = proforma[key]["id"];
      const cant = proforma[key]["cant"];
      inv.find({_id: id}, function(err, record) {
        if(record.length!=0){
          let dif = record[0]["cant"] - cant
          inv.update({ _id:id}, {$set: {cant:dif,time:Date.now()}}, {}, function(err, num) {
            if(num==1){ console.log("upCant") }
          });
        }
      });
    }
    resolve(true)
  })
}
function proformaUpdate(carroAnt,carroNue){
  return new Promise(function(resolve,reject){
    //////EDITANDO VENTA ITEMS//////
    var InvAjus = []
    //for borrados o modificados//
    for (const key in carroAnt){
      const itemNue = carroNue[key];
      const itemAnt = carroAnt[key];
      if(itemNue == undefined){//borrados del carro
        InvAjus.push({id:key,cant:-itemAnt["cant"]}) 
        
      }else{//modifico del carro
        InvAjus.push({id:key,cant: (itemNue["cant"]-itemAnt["cant"])})
      }  
    }
    //for nuevos//
    for (const key in carroNue) {
      if(carroAnt[key] == undefined){
        InvAjus.push({id:key,cant:carroNue[key]["cant"]})
      }
    }
    /////EDITANDO VENTA ITEMS////// 
    ////// acualizando ajuste //////
    for (let i = 0; i < InvAjus.length; i++) {
      let itm = InvAjus[i].id
      let canti = InvAjus[i].cant
      let dif = record[0]["cant"] - canti
      inv.update({ _id:itm}, {$set:{cant:dif,time:Date.now()}}, {}, function(err, num) {
        if(num==1){ console.log("upCant") }
      });
    }
    ////// acualizando ajuste //////
    resolve(true)
  })
}
function proformaDelete(proforma){
  return new Promise(function(resolve,reject){
    for (const key in proforma) {
      const id = proforma[key]["id"];
      const cant = proforma[key]["cant"];
      inv.find({_id: id}, function(err, record) {
        if(record.length!=0){
          let dif = record[0]["cant"] + cant
          inv.update({ _id:id}, {$set: {cant:dif,time:Date.now()}}, {}, function(err, num) {
            if(num==1){ console.log("upCant") }
          });
        }
      });
    }
    resolve(true)
  })
}
function countItems(){
  return new Promise(function(resolve,reject){
    inv.count({},(err,count)=>{ resolve(count) });
  })
}

module.exports = {
  createdItem,
  readInventario,
  itemCantMas,
  itemCantMenos,
  updateItem,
  deleteItem,
  listaIdsInventario,
  proformaRegister,
  proformaUpdate,
  proformaDelete,
  countItems
}
