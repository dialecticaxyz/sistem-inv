const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');
let fs = require('fs');
/** 
exports.read_numNota = async (req, resp) => {
  try {
    let numNota = localStorage.getItem('numNota')
    resp.status(200).send(numNota)
    localStorage.setItem('serv', "libre")
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};

exports.write_numNota = async (req, resp) => {
  try {
    let numNota = req.body["numNota"]
    localStorage.setItem('numNota', parseInt(numNota))
    resp.send("write")
    localStorage.setItem('serv', "libre")
  }catch(e){
    console.log(e);
    resp.status(500).send("There was a problem");
    localStorage.setItem('serv', "libre")
  }
};
*/
const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.stat("./data/"+path, (error, stats) => {
      if(error){ console.log(error); }
      else { resolve(stats.size) }
    });
  })

async function sizeDB(req,rsp){
  let inv = await readFile("inventario.dat")
  let cli = await readFile("clientes.dat")
  let use = await readFile("usuarios.dat")
  let ven = await readFile("ventas.dat")
  rsp.status(200).send({inv,cli,use,ven})
}

module.exports = {
  sizeDB,

}