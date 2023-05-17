var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase
function startDB(){
  dataBase = indexedDB.open("inventario", 10);
  dataBase.onupgradeneeded = function (e){
    var active = dataBase.result; 
    var object = active.createObjectStore('inventario', { keyPath : 'id'});
    var object = active.createObjectStore('clientes', { keyPath : 'id'});

    if (!active.objectStoreNames.contains('ventas')) {
      var object = active.createObjectStore('ventas', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('archivo')) {
      var object = active.createObjectStore('archivo', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('administrador')) {
      var object = active.createObjectStore('administrador', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('vendedor')) {
      var object = active.createObjectStore('vendedor', { keyPath : 'id'});
    }
    if (!active.objectStoreNames.contains('usuario')) {
      var object = active.createObjectStore('usuario', { keyPath : 'id'});
    }
  };
  dataBase.onsuccess = function (e){ init_m() };
  dataBase.onerror = function (e){console.log(e)};
}
/******* promeas generales BD ******/
function write_DB(f,col){
  return new Promise(function(resolve,reject){  
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var request = object.put(f);
    request.onerror = function (e) {alert("Ya existe el registro");};
    data.oncomplete = function (e){ resolve(true) };
  }) 
}
function update_DB(id,f,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var elemento = object.get(id);
    elemento.onsuccess = function(e){
      var result = e.target.result;
      for (const key in f){ result[key] = f[key]; }
      object.put(result); 
    };
    elemento.onerror = function (e) {console.log(e)};
    data.oncomplete = function (e){ resolve(true) };
  });
}
function read_DB(col){
  return new Promise(function(resolve,reject){
    var elts = [];
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var cursor = object.openCursor();
    cursor.onsuccess = function (e) {
      var result = e.target.result;
      if (result === null) {return;}
      elts.push(result.value);
      result.continue();
    };
    data.oncomplete = function() { resolve(elts) };
  });
}
function read_DB_ids(col){
  return new Promise(function(resolve,reject){
    var elts = [];
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var cursor = object.openCursor();
    cursor.onsuccess = function (e) {
      var result = e.target.result;
      if (result === null) {return;}
      elts.push(result.value.id);
      result.continue();
    };
    data.oncomplete = function() { resolve(elts) };
  });
}
function read_ID_DB(id,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readonly");
    var object = data.objectStore(col);
    var request = object.get(id);
    request.onsuccess = function (){
      var result = request.result;
      if (result !== undefined){ resolve(result) }else{ resolve(false) }
    };
  });
}
function del_DB(id,col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var request = object.delete(id);
    request.onsuccess = function (){ resolve(true) };
  })
}
function clear_coleccion(col){
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction([col], "readwrite");
    var object = data.objectStore(col);
    var objectStoreRequest = object.clear();
    objectStoreRequest.onsuccess = function(event) {resolve(true)};
  })
}
/******* promeas generales BD ******/
function up_inventario_venta(id,cant){ //predeterminado reductivo
  return new Promise(function(resolve,reject){
    var active = dataBase.result;
    var data = active.transaction(["inventario"], "readwrite");
    var object = data.objectStore("inventario");
    var elemento = object.get(id);
    elemento.onsuccess = function(e){
      var result = e.target.result;
      var ct = result["cant"]-cant
      result["cant"]=ct
      object.put(result);
    };
    elemento.onerror = function (e) {console.log(e)};
    data.oncomplete = function (e){ resolve(true) };
  });
}

/******* promeas generales IndexDb firestore ******/
function dataWriteLC(f,col){
  return new Promise(function(resolve,reject){
    f["time"] = new Date().getTime()
    db.collection(col).doc(f.id).set(f).then(function(){
      write_DB(f,col).then(()=>{ resolve(true) })
    }).catch(function(error){console.error(error);})
  })
}
function dataUpdateLC(id,col,f){
  return new Promise(function(resolve,reject){
    f["time"] = new Date().getTime()
    db.collection(col).doc(id).update(f).then(function(){
      update_DB(id,f,col).then(()=>{ resolve(true) })
    }).catch(function(error){console.error(error);})
  })
}
function dataDeleteLC(id,col){
  return new Promise(function(resolve,reject){
    db.collection(col).doc(id).delete().then(function(){
      del_DB(id,col).then(()=>{ resolve(true) })
    }).catch(function(error){console.error(error);})
  })
}
async function clearDowCloudWriteLocal(col){
  loadData() 
  let clsAlm = await clear_coleccion(col)
  let dat= await db.collection(col).get()
  for (let i = 0; i < dat.docs.length; i++) {
    let el= dat.docs[i].data();
    let reg = await write_DB(el,col)
    document.getElementById("conter").textContent = dat.docs.length-i
  }
  successDat(true)
}
/******* promeas generales IndexDb firestore ******/
//////////////////////// MANEJO DE FORMULARIO //////////////////////////
function storage(key){ return (localStorage.getItem(key)==null?"":localStorage.getItem(key))}
function storageNum(key){ return (storage(key)==""?0:parseFloat(localStorage.getItem(key)))}
function storageJson(key){ return storage(key)==""?{}: JSON.parse(localStorage.getItem(key))}
function storageDef(key,def){ 
  if(typeof(def)=="number"){
    return storage(key)==""?def:parseFloat(storage(key)) 
  }else{
    return storage(key)==""?def:storage(key)
  }
}
function storageBolean(key){ return storage(key)==""?false:true }
function storageJsonPre(key,js){ return storage(key)==""?js: JSON.parse(localStorage.getItem(key))}
function storageJsonSetup(key,jsn){
  return new Promise(function(resolve,reject){  
    let jl = storageJson(key)
    for (const key in jsn) {
      const el = jsn[key];
      const e = jl[key];
      if(e==undefined){ jl[key] = el }
    }
    resolve(jl)
  }) 
}
function itemFilter(val,act,fil,mat,elm){
  return new Promise(function(resolve,reject){ 
    let p = mat.indexOf(elm); 
    if(act){
      if(p==-1){ mat.push(elm); }
      resolve(true); 
    }else{
      if(val==fil){ 
        if(p==-1){ mat.push(elm); }
        resolve(true)
      }else{
        if(p!=-1){ mat.splice(p,1) }
        resolve(false)
      }
    }
  }) 
}
let asend = true
function sortTable(ord,typ,elm,arr){
  return new Promise(function(resolve,reject){
    if(ord){
      if(typ=='txt'){
        if(asend){
          arr.sort((a, b) => {
            if(a[elm] < b[elm]) return 1;
            if(a[elm] > b[elm]) return -1;
            return 0;
          })
          asend = false
        }else{
          arr.sort((a, b) => {
            if(a[elm] < b[elm]) return -1;
            if(a[elm] > b[elm]) return 1;
            return 0;
          })
          asend = true
        }  
      }else{
        if(asend){
          arr.sort(((a, b) => b[elm] - a[elm]));
          asend = false
        }else{
          arr.sort(((a, b) => a[elm] - b[elm]));
          asend = true
        }
      }
      resolve(arr)
    }else{ resolve(arr) }
  })
}
function ValNum(id){
  let nod = document.getElementById(id)
  if(nod.tagName=="INPUT"){
    let val = nod.value
    return (val==""?0:parseFloat(val))
  }else{
    let val = nod.textContent
    return (val==""?0:parseFloat(val))
  }
}
function saveText(e,i){
  let js = Object.keys(e.target.dataset)[0] 
  let jsv = storageJson(js)
  jsv[e.target.id] = e.target.value
  localStorage.setItem(js,JSON.stringify(jsv))
  if(e.target.type=="date"){
    document.getElementById(e.target.id+"_Txt").textContent = fechaForma2(e.target.value)
  }
  if(e.target.type=="number"){
    jsv[e.target.id] = parseFloat(e.target.value) 
    localStorage.setItem(js,JSON.stringify(jsv))
  }
  if(e.target.type=="option"){
    jsv[e.target.id] = e.target.value 
    localStorage.setItem(js,JSON.stringify(jsv))
  }
  if(i==true){renderVentas()}
}
function checkbox(e,i){
  let js = Object.keys(e.target.dataset)[0] 
  let jsv = storageJson(js)
  jsv[e.target.id] = e.target.checked
  localStorage.setItem(js,JSON.stringify(jsv))
  if(i==true){renderVentas()}
}


//////////////////////// MANEJO DE FORMULARIO //////////////////////////
function json_to_from(idf,stg){
  return new Promise(function(resolve,reject){
    let js
    if(stg==undefined){js = storageJson(idf)}else{js=stg}
    const f = document.querySelectorAll('[data-'+idf+']')
    for (let i = 0; i < f.length; i++) {
      if(f[i].tagName=="INPUT"){ if(js[f[i].id]){ document.getElementById(f[i].id).value = js[f[i].id] } }
      if(f[i].type=="date"){
        if(js[f[i].id]){ 
          document.getElementById(f[i].id).value = js[f[i].id] 
          document.getElementById(f[i].id+"_Txt").textContent = fechaForma2(js[f[i].id])
        }else{
          document.getElementById(f[i].id+"_Txt").textContent = fechaActualTxt()
          document.getElementById(f[i].id).value = fecActInp
        }
      }
      if(f[i].tagName=="SELECT"){ if(js[f[i].id]){ document.getElementById(f[i].id).value = js[f[i].id] } }
      if(f[i].tagName=="IMG"){ if(js[f[i].id]){ document.getElementById(f[i].id).src = js[f[i].id] }  }
      if(f[i].tagName=="LABEL"){ if(js[f[i].id]){ document.getElementById(f[i].id).textContent = js[f[i].id] } }
      if(f[i].type=="checkbox"){ if(js[f[i].id]){ document.getElementById(f[i].id).checked = js[f[i].id] } }
      /*fecha compuesta*/
      let fc = f[i].dataset[idf]
      let fe = f[i].dataset["fechcomp"]
      if(fc=="fechComp"){
        let f = document.querySelectorAll('[data-fecha='+fe+']')
        if(js[fe]==undefined){continue}
        f[0].value = parseInt(js[fe].split("-")[2]) 
        f[1].value = js[fe].split("-")[1]
        f[2].value = js[fe].split("-")[0]
        continue
      }
      /*fecha compuesta*/
      /*secion info*/
      let set =  f[i].dataset[Object.keys(f[i].dataset)[0]]  
      if(f[i].tagName=="DIV" || f[i].tagName=="SPAN"){
        document.getElementById(f[i].id).textContent = js[f[i].id];
        if(set=="fechaForma2"){ if(js[f[i].id]){ document.getElementById(f[i].id).textContent = fechaForma2(js[(f[i]).id]) } }
        if(set=="checkbox"){
          if(js[f[i].id]){
            document.getElementById(f[i].id).textContent=f[i].dataset.check.split("_")[0] 
          }else{
            document.getElementById(f[i].id).textContent=f[i].dataset.check.split("_")[1]
          }
        }
      }
      /*secion info*/
    }
    resolve(true)
  })
}
function form_to_json(id){
  return new Promise(function(resolve,reject){
    const f = document.querySelectorAll('[data-'+id+']')
    let form = {}
    for (let i = 0; i < f.length; i++) {
      let id = f[i].id
      let val = f[i].value
      let tipo = f[i].type
      let tag = f[i].tagName
      if(tipo=="number"){if(val==""){form[id]=0}else{form[id]=parseFloat(val)}}
      if(tipo=="text"){form[id] = val}
      if(tipo=="password"){form[id] = val}
      if(tipo=="date"){form[id] = val}
      if(tipo=="checkbox"){form[id] = f[i].checked}
      if(tipo=="select-one"){form[id] = val}
      if(tipo=="email"){form[id] = val}
      if(tag=="IMG"){form[id] = f[i].src}
      if(tag=="LABEL"){form[id] = f[i].textContent}
      let fc = f[i].dataset.user
      let fe = f[i].dataset["fechcomp"]
      if(fc=="fechComp"){
        let f = document.querySelectorAll('[data-fecha='+fe+']')
        let dia = f[0].value<10?("0"+f[0].value):f[0].value;if(dia=="0"){continue}
        let mes = f[1].value
        let ano = f[2].value;if(ano==""){continue}
        let fecha = ano+"-"+mes+"-"+dia
        form[fe] = fecha
      }
      //required
      if(f[i].required){
        if(form[id]==""||form[fe]==""){
          document.getElementById(id).style.backgroundColor="rgb(255, 200, 200)"
          alert("existen datos faltantes")
          resolve(false)
        }else{
          document.getElementById(id).style.backgroundColor="rgb(255, 255, 255)"
        }
      }
      //required
    }
    resolve(form)
  })
}
//////////////////////// MANEJO DE FORMULARIO //////////////////////////
function lnk(e){ var a = document.createElement("a"); a.href = e+".html"; a.click() }
///////////////////// FECHAS /////////////////////// 
const nombreMeses =  'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'.split(' ')
const nombreMesesCorto =  'Ene. Fe. Mar. Abr. May. Jun. Jul. Ago. Sep. Oct. Nov. Dic.'.split(' ')
const NombreDias= 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado '.split(' ')
let fecActSist = new Date()
function timeToMesDia(tim){//time 1655244456367
  let d = new Date(tim)
  let dia = d.getDate()<10?("0"+d.getDate()):d.getDate()
  let mes = d.getMonth()
  return (dia+" "+nombreMeses[mes])
}
function fechaForma2(f){// 10/Ene/2020
  let fc = f.split("-")
  return (fc[2]+"/"+nombreMesesCorto[fc[1]-1] +"/"+fc[0])
}
function fechaActualTxt(){
  var mes = fecActSist.getMonth()+1;
  var dia = fecActSist.getDate(); 
  var ano = fecActSist.getFullYear();
  if(dia<10){dia='0'+dia;}
  if(mes<10){mes='0'+mes}
  return fechaForma2(ano+"-"+mes+"-"+dia);
}
let fecActInp = fechaActual()
function fechaActual(){
  var mes = fecActSist.getMonth()+1; //mes
  var dia = fecActSist.getDate(); //dia
  var ano = fecActSist.getFullYear(); //año
  if(dia<10){dia='0'+dia}
  if(mes<10){mes='0'+mes}
  return (ano+"-"+mes+"-"+dia);
}
function dateTOinput(tim){//time 1655244456367
  let d = new Date(tim)
  let dia = d.getDate()<10?("0"+d.getDate()):d.getDate()
  let mes = d.getMonth()<10?("0"+(d.getMonth()+1)):d.getMonth()
  let year = d.getFullYear()
  return (year+"-"+mes+"-"+dia)
}
const numeroDeSemana = fecha => {
  const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24,
      DIAS_QUE_TIENE_UNA_SEMANA = 7,
      JUEVES = 4;
  fecha = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  let diaDeLaSemana = fecha.getUTCDay(); // Domingo es 0, sábado es 6
  if (diaDeLaSemana === 0) {
      diaDeLaSemana = 7;
  }
  fecha.setUTCDate(fecha.getUTCDate() - diaDeLaSemana + JUEVES);
  const inicioDelAño = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
  const diferenciaDeFechasEnMilisegundos = fecha - inicioDelAño;
  return Math.ceil(((diferenciaDeFechasEnMilisegundos / DIA_EN_MILISEGUNDOS) + 1) / DIAS_QUE_TIENE_UNA_SEMANA);
};
function weekActual(t){
  let hoy = new Date();
  let w = numeroDeSemana(hoy)
  return (hoy.getFullYear()+"-W"+(w<10?("0"+w):w))
}
function getDateOfISOWeek(wk) {
  let y = parseInt(wk.split("-")[0])
  let w = parseInt(wk.split("-")[1].replace(/[^0-9]+/g, ""))
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart.getTime();
}
///////////////////// FECHAS /////////////////////// 
/*pantalla spiner succses contador*/
const divLoad = document.createElement("div");
divLoad.innerHTML = `
<div id="pantallaSpiner">
<div class="modalSpiner">
  <div id="spinner" class="lds-spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="conter">
    <div id="conter">.</div>
  </div>  
  <div id="cajaSuccess">
    <div class="circle">
      <div id="checkSucc" class=""></div>
    </div>
  </div> 
</div>
</div>` 
function loadData(){
  document.body.appendChild(divLoad);
  document.getElementById("pantallaSpiner").style.display = "inline-block"
  document.getElementById("spinner").style.display = "block"
} 
function successDat(s,c){
  document.getElementById("spinner").style.display = "none"
  document.getElementById("cajaSuccess").style.display= 'block';
  document.getElementById("checkSucc").classList.add('success');
  setTimeout(noSucsesDat,1000);
  if(c!=undefined){ localStorage.setItem(c,"") } 
  if(s){ setTimeout(window.location.reload(),1000) } 
}
function noSucsesDat(){
  document.getElementById("pantallaSpiner").style.display = "none"
  document.getElementById("cajaSuccess").classList.add('desapareser');
  setTimeout(restarSucessesDat,750); 
}
function restarSucessesDat(){
  document.getElementById("cajaSuccess").style.display= 'none';
  document.getElementById("cajaSuccess").classList.remove('desapareser');
  document.getElementById("checkSucc").classList.remove('success');
}
/*pantalla spiner succses contador*/
///////////////////////////// secion manejo de tablas //////////////////////////////
function filter(){
  const text = document.getElementById("buscar").value.toUpperCase()
  for (let i = 0; i < items.length; i++) {
    const txtItm = items[i].textContent.toUpperCase()
    const idItm = items[i].id.split("_")[1]
    if(txtItm.indexOf(text) > -1){ document.getElementById(idItm).style.display = "" }else{ document.getElementById(idItm).style.display = "none" }
  }
}
let listCol
function manejoColumnas(tab){
  listCol = storageJson(tab)
  const head = document.getElementById("headColm").querySelectorAll("th")
  let listCkeck = ``;
  for (let i = 0; i < head.length; i++) {
    const td = head[i];
    listCkeck += 
    `<div>
      <input onclick="togleColm('cr${i+1}','${tab}')" type="checkbox" id="cr${i+1}" >
      <label for="cr${i+1}">${td.textContent}</label>
    </div>` 
    if(listCol["cr"+(i+1)]==undefined){listCol["cr"+(i+1)] = true}
  }
  document.querySelector("#contedOcultador").innerHTML = listCkeck;
  for (const key in listCol) { document.getElementById(key).checked = listCol[key]; }
  establacerColumnas(listCol)
}
function togleColm(id,tab){
  listCol[id] = document.getElementById(id).checked
  localStorage.setItem(tab, JSON.stringify(listCol))
  establacerColumnas(listCol)
}
function establacerColumnas(listCol){
  let head = document.getElementById("headColm").querySelectorAll("th")
  for (let i = 0; i < head.length; i++) {
    listCol["cr"+(i+1)]
    head[i].style.display = listCol["cr"+(i+1)]?"":"none"
  }
  var body = document.getElementById("listaDitem").querySelectorAll("tr")
  for (let i = 0; i < body.length; i++) {
    const fila = body[i].querySelectorAll("td");
    for (let i = 0; i < fila.length; i++) {
      listCol["cr"+(i+1)]
      fila[i].style.display = listCol["cr"+(i+1)]?"":"none"
    }
  }
}
function listVer(){ document.getElementById("contedOcultador").classList.add("listVer") }
function oculVer(){ document.getElementById("contedOcultador").classList.remove("listVer") }

///////////////////////////// secion manejo de tablas //////////////////////////////