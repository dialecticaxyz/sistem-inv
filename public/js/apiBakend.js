//const url = "https://premaned-server.glitch.me"
//const serverURL = 'wss://premaned-server.glitch.me';

//const url = "https://zany-gold-dhole-wear.cyclic.app"
//const serverURL = 'wss://zany-gold-dhole-wear.cyclic.app';

const url = "http://127.0.0.1"
const serverURL = 'ws://127.0.0.1';
const token = JSON.parse((localStorage.getItem("datUser")==null||localStorage.getItem("datUser")=="")?"{}":localStorage.getItem("datUser")).tkn
//////////////////// SECION USER ////////////////////
function createdUse(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/createdUse`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(data=>{ resolve(data) }) }  }
    );
  })
}
function sendEmail(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/sendEmail`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(data=>{ resolve(data) }) }  }
    );
  })
}
function createdPasword(dat,tkn){
  return new Promise(function(resolve,reject){
    fetch(url+`/createdPasword`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':tkn},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(data=>{ resolve(data) }) }  }
    );
  })
}
function updatePasword(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/updatePasword`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(data=>{ resolve(data) }) }  }
    );
  })
}
function loginUser(email,psw){
  return new Promise(function(resolve,reject){
    fetch(url+`/loginUser`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':psw},
      body: JSON.stringify({"email":email})
      }).then(rsp=>{ if(rsp.ok){ rsp.json().then(data=>{ resolve(data) }) }  }
    );
  })
}
function readUsers(){
  return new Promise(function(resolve,reject){
    fetch(url+'/readUsers',{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},})
    .then((rsp)=>{ rsp.json().then(function(d) { resolve(d) }); })
    .catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}
function deleteUser(id){
  return new Promise(function(resolve,reject){
    fetch(url+`/deleteUser`,{method:'post',headers:{'Accept':'application/json, text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify({"_id":id})
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(d=>{ resolve(d) }); } }
    );
  })
}
//////////////////// SECION USER ////////////////////
//////////////////// SECION VENTAS////////////////////
function readVentasTime(){
  return new Promise(function(resolve,reject){
    let timeVEN = storage("timeVEN")==""?0:parseInt(storage("timeVEN"))
    fetch(url+'/readVentas',{ method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token}, 
      body: JSON.stringify({"time":timeVEN})
    }).then((rsp)=>{ rsp.json().then((d)=>{ resolve(d) }); }).catch((err)=>{ console.log(err) });
  })
}
function readIDSventas(){
  return new Promise(function(resolve,reject){
    fetch(url+'/readIDSventas',{ method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token}, 
    }).then((rsp)=>{ rsp.json().then((d)=>{ resolve(d) }); }).catch((err)=>{ console.log(err) });
  })
}
function read_ventas_user(user){
  return new Promise(function(resolve,reject){
    let time = storage("timeVEN")==""?0:parseInt(storage("timeVEN"))
    fetch(url+'/read_ventas_user',{ method: 'post', 
      headers: {'Accept': 'application/json, text/plain','Content-Type': 'application/json','x-access-token':token}, 
      body: JSON.stringify({"time":time,"user":user,})
    }).then(
      function(rsp) { rsp.json().then(function(data) { resolve(data) }); }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}
function read_ventas_user_time(user,tim1,tim2){
  return new Promise(function(resolve,reject){
    fetch(url+'/read_ventas_user_time',{ method: 'post', 
      headers: {'Accept': 'application/json, text/plain','Content-Type': 'application/json','x-access-token':token}, 
      body: JSON.stringify({"tim1":tim1,"tim2":tim2,"user":user,})
    }).then(
      function(rsp) { rsp.json().then(function(data) { resolve(data) }); }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}

function deleteVenta(id){
  return new Promise(function(resolve,reject){
    fetch(url+`/deleteVenta`,{method:'post',headers:{'Accept':'application/json, text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify({"_id":id})
      }).then(rsp => { if(rsp.ok) { rsp.text().then(d=>{ resolve(d) }); } }
    );
  })
}
function del_ventaMarc(id){
  return new Promise(function(resolve,reject){
    fetch(url+`/del_ventaMarc`,{method:'post',headers:{'Accept':'application/json, text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify({"id":id})
      }).then(rsp => { if(rsp.ok) { rsp.text().then(Data => {resolve(Data) }); } }
    );
  })
}
//////////////////// SECION VENTAS////////////////////
//////////////////// SECION INVENTARIO////////////////////
function createdItem(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/createdItem`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(data=>{ resolve(data) }) } }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}
function readInventario(){
  return new Promise(function(resolve,reject){
    let timeINV = (localStorage.getItem("timeINV")==null||localStorage.getItem("timeINV")=="") ? 0 : parseInt(localStorage.getItem("timeINV")) 
    fetch(url+'/readInventario', { method: 'post',headers: {'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token}, 
      body: JSON.stringify({"timeINV":timeINV})
    }).then(rsp=>{ if(rsp.ok){ rsp.json().then(data=>{ resolve(data) }) } }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}

function readInventarioIDS(){
  return new Promise(function(resolve,reject){
    fetch(url+'/read_inventarioIDS').then(
      function(rsp) { rsp.json().then(function(data) { resolve(data) }); }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}
function deleteItem(id){
  return new Promise(function(resolve,reject){
    fetch(url+`/deleteItem`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify({"_id":id})
      }).then(rsp => { if(rsp.ok) { rsp.text().then(d => {resolve(d) }); } }
    );
  })
}
function updateItem(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/updateItem`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
    }).then(rsp => {  if(rsp.ok){ rsp.text().then(d => { resolve(d) }) } });
  })
}
function itemCantMas(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/itemCantMas`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
    }).then(rsp=>{ if(rsp.ok) { rsp.text().then(d =>{ resolve(d) }); } });
  })
}
function itemCantMenos(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/itemCantMas`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
    }).then(rsp=>{ if(rsp.ok) { rsp.text().then(d =>{ resolve(d) }); } });
  })
}
//////////////////// SECION INVENTARIO////////////////////
//////////////////// SECION CLIENTES////////////////////
function createdCliente(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/createdCliente`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(d=>{ resolve(d) }) } }
    );
  })
}
function updateCliente(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/updateCliente`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
      }).then(rsp=>{ if(rsp.ok){ rsp.text().then(d=>{ resolve(d) }) } }
    );
  })
}
function readClienteTime(){
  return new Promise(function(resolve,reject){
    let timeCLI = storage("timeCLI")==""?0:parseInt(storage("timeCLI"))
    fetch(url+'/readClienteTime',{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token}, 
      body: JSON.stringify({"timeCLI":timeCLI})
    }).then((rsp)=>{ rsp.json().then((d)=>{ resolve(d) }); }).catch((err)=>{ console.log(err) });
  })
}
function readClientesIDS(){
  return new Promise(function(resolve,reject){
    fetch(url+'/read_clientesIDS').then(
      function(rsp) { rsp.json().then(function(data) { resolve(data) }); }
    ).catch(function(err){ console.log('Fetch Error :-S', err) });
  })
}
function deleteCliente(id){
  return new Promise(function(resolve,reject){
    fetch(url+`/deleteCliente`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify({"_id":id})
      }).then(rsp => { if(rsp.ok) { rsp.text().then(Data => {resolve(Data) }); } }
    );
  })
}
//////////////////// SECION CLIENTES////////////////////
function sizeDB(){
  return new Promise(function(resolve,reject){
    fetch(url+`/sizeDB`,{method:'get',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token}}).
      then(rsp=>{ if(rsp.ok) { rsp.json().then(d=>{resolve(d) }) } }
    );
  })
}
function read_numNota(){
  return new Promise(function(resolve,reject){
    fetch(url+`/read_numNota`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
    }).then(rsp => { if(rsp.ok) { rsp.text().then(Data => { resolve(Data) });  }  });
  })
}
function write_numNota(dat){
  return new Promise(function(resolve,reject){
    fetch(url+`/write_numNota`,{method:'post',headers:{'Accept':'application/json,text/plain','Content-Type':'application/json','x-access-token':token},
      body: JSON.stringify(dat)
    }).then(rsp => { if(rsp.ok) { rsp.text().then(Data => { resolve(Data) });  }  });
  })
}

function timeLocal(id){  return localStorage.getItem(id)==null?0:parseInt(localStorage.getItem(id)) }
function elemtDif(d1,d2){
  var ar = [];
  for (var i = 0; i < d1.length; i++) {
    var ig = false;
    for (var j = 0; j < d2.length & !ig; j++){ if(d1[i] == d2[j]){ ig=true } }
    if(!ig){ ar.push(d1[i]) }
  }
  return ar
}

/////////// SINCRO DATA BASE //////////
//clientes
async function sincroDBclientes(){
  loadData()
  console.log("bajando clientes....")
  let datCloud = await readClienteTime()
  console.log(datCloud)
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    item["upCloud"] = true
    let v_reg = await write_DB(item,'clientes')
    let timeLocal = storage("timeCLI")==""?0:parseInt(storage("timeCLI"))
    if(item["time"]>timeLocal){ localStorage.setItem("timeCLI",item["time"]) }
  }
  let datLocal = await read_DB('clientes')
  if(datCloud["count"]<datLocal.length){ 
    sincroDelsCLI() 
  }else{
    console.log("clientes bajado...!!!")
    successDat(true)
  }
}
async function sincroDelsCLI(){
  let datLocal = await read_DB('clientes')
  let arrCloud = await readClientesIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    let delLoc = await del_DB(dat.id,'clientes')
    console.log("eleiminando..!!")
  }
  console.log("clientes bajado...!!!")
  successDat(true)
}
//clientes
//inventario
async function sincroDBinventario(){
  loadData()
  console.log("bajando Inventario.....")  
  let datCloud = await readInventario()
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    await write_DB(item,'inventario')
    let timeLocal = (localStorage.getItem("timeINV")==null||localStorage.getItem("timeINV")=="") ? 0 : parseInt(localStorage.getItem("timeINV")) 
    if(item["time"]>timeLocal){ localStorage.setItem("timeINV",item["time"]) }
  }
  let datLocal = await read_DB('inventario')
  if(datCloud["count"]<datLocal.length){ 
    sincroDelsINV() 
  }else{
    console.log("Inventario bajado...!!!")
    successDat(true)
  }
}
async function sincroDelsINV(){
  let datLocal = await read_DB('inventario')
  let arrCloud = await readInventarioIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    let delLoc = await del_DB(dat.id,'inventario')
    console.log("eleiminando..!!")
  }
  console.log("Inventario bajado...!!!")
  successDat(true)
}
//inventario
//Usuarios
async function sincroDBusuario(){
  loadData()
  console.log("bajando usuarios.....")  
  let datCloud = await readUsers()
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    await write_DB(item,'usuario')
  }
  let datLocal = await read_DB('usuario')
  if(datCloud["count"]<datLocal.length){ 
    //sincroDelsINV() 
  }else{
    console.log("usuario bajado...!!!")
    successDat(true)
  }
}
async function sincroDelsUSE(){
  let datLocal = await read_DB('usuario')
  let arrCloud = await readInventarioIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    let delLoc = await del_DB(dat.id,'usuario')
    console.log("eleiminando..!!")
  }
  console.log("usuario bajado...!!!")
  successDat(true)
}
//Usuarios
//ventas 
async function sincroDBventas(){
  loadData()
  console.log("bajando ventas Admin....")
  let datCloud = await readVentasTime()
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    let v_reg = await write_DB(item,'ventas')
    let arch = await write_DB(item,'archivo')//archivo
    let timeLocal = storage("timeVEN")==""?0:parseInt(storage("timeVEN"))
    if(item["time"]>timeLocal){ localStorage.setItem("timeVEN",item["time"]) }
  }
  let datLocal = await read_DB('ventas')
  if(datCloud["count"]<datLocal.length){ 
    //sincroDelsVenta() 
  }else{
    console.log("ventas bajado...!!!")
    successDat(true)
  }
}
async function sincroDelsINV(){
  let datLocal = await read_DB('ventas')
  let arrCloud = await readInventarioIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    let delLoc = await del_DB(dat.id,'ventas')
    console.log("eleiminando..!!")
  }
  console.log("ventas bajado...!!!")
  successDat(true)
}
//ventas y inventario
/////////// SINCRO DATA BASE //////////

///////// Actualizar Tiempo Real /////////
async function changeVenta(init){
  console.log("bajando ventas nuevas o modificadas ...")
  document.getElementById("conection").classList.add("animacionPulso")
  let datCloudVent = await readVentasTime()
  let datVent = datCloudVent["record"]
  for (let i = 0; i < datVent.length; i++) {
    let item = datVent[i];
    await write_DB(item,'ventas')
    await write_DB(item,'archivo')//archivo
    if(item["time"]>storageDef("timeVEN",0)){ localStorage.setItem("timeVEN",item["time"]) }
  }
  console.log("ventas Nuevo Registrado ...")
  let datLocalVent = await read_DB('ventas')
  if(datCloudVent["count"]<datLocalVent.length){ 
    deleteChangeVenta(init) 
  }else{
    console.log("ventas bajado...!!!")
    changeInventario(init)
  }
}
async function deleteChangeVenta(init){
  let datLocal = await read_DB('ventas')
  let arrCloud = await readInventarioIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    await del_DB(dat.id,'ventas')
    console.log("eleiminando venta..!!")
  }
  console.log("ventas eliminadas...!!!")
  changeInventario(init)
}
async function changeInventario(init){
  console.log("bajando cambios Inventario.....") 
  let datCloud = await readInventario()
  let datos = datCloud["record"]
  for (let i = 0; i < datos.length; i++) {
    let item = datos[i];
    await write_DB(item,'inventario')
    let timeLocal = (localStorage.getItem("timeINV")==null||localStorage.getItem("timeINV")=="") ? 0 : parseInt(localStorage.getItem("timeINV")) 
    if(item["time"]>timeLocal){ localStorage.setItem("timeINV",item["time"]) }
  }
  let datLocal = await read_DB('inventario')
  if(datCloud["count"]<datLocal.length){ 
    deleteChangeInventario(init) 
  }else{
    console.log("Inventario bajado...!!!")
    document.getElementById("conection").classList.remove("animacionPulso")
    if(init){ renderDatos() }
  }
}
async function deleteChangeInventario(init){
  let datLocal = await read_DB('inventario')
  let arrCloud = await readInventarioIDS()
  let sincroDel = elemtDif(datLocal,arrCloud)
  for (let i = 0; i < sincroDel.length; i++) {
    let dat = sincroDel[i];
    await del_DB(dat.id,'inventario')
    console.log("eleiminando item inventario..!!")
  }
  console.log("Inventario bajado...!!!")
  document.getElementById("conection").classList.remove("animacionPulso")
  if(init){ renderDatos() }
}
///////// Actualizar Tiempo Real /////////

/////////// WEBSOCKET CONECCION //////////
let socket;
function openSocket(){
  socket = new WebSocket(serverURL);
  socket.addEventListener('open', openConnection);
  socket.addEventListener('close', closeConnection);
  socket.addEventListener('message', readIncomingMessage);
}

function openConnection(){
  document.getElementById("conection").style.backgroundColor = "rgb(30, 255, 0)"
  if (socket.readyState===WebSocket.OPEN){ changeVenta(true) }
}
function closeConnection(){
  document.getElementById("conection").style.backgroundColor = "rgb(255, 0, 0)"
}

function readIncomingMessage(event) {
  console.log(event.data)
  changeVenta(true)
}
function sendMessage(dat){
  if (socket.readyState===WebSocket.OPEN){ socket.send(dat); }
}
/////////// WEBSOCKET CONECCION //////////
