var express = require('express');
var router = express.Router();
const cliFun = require('../controllers/clientes');
const invFun = require('../controllers/inventario');
const venFun = require('../controllers/ventas');
const limpiar = require("../controllers/administrar")
const { verifyToken } = require("../middleware/verifyToken")
const { verifyUser } = require("../middleware/verifyUser")
const useFun = require("../controllers/usuarios");
const administrar = require('../controllers/administrar');

router.post("/createdAdminInit",useFun.createdAdminInit);
router.post("/createdUse",verifyToken,useFun.createdUse);
router.post("/sendEmail",[],useFun.sendEmail);
router.get('/formPasword/:token',[],useFun.formPasword);
router.post('/createdPasword',[],useFun.createdPasword);
router.post('/updatePasword',verifyUser,useFun.updatePasword);
router.post('/loginUser',[],useFun.loginUser);
router.post('/readUsers',verifyToken,useFun.readUsers);
router.post('/deleteUser',verifyToken,useFun.deleteUser);

router.post("/createdCliente",verifyToken,cliFun.createdCliente);
router.post("/deleteCliente", verifyToken,cliFun.deleteCliente);
router.post("/updateCliente",verifyUser,cliFun.updateCliente);
router.post("/readClienteTime",verifyUser,cliFun.readClienteTime);
router.get("/readClientesIDS",verifyUser,cliFun.readClientesIDS);

router.post("/createdItem", verifyToken, invFun.createdItem);
router.post("/readInventario",verifyUser, invFun.readInventario);
router.get("/listaIdsInventario", invFun.listaIdsInventario);
router.post("/updateItem",verifyToken, invFun.updateItem);
router.post("/deleteItem",verifyToken, invFun.deleteItem);
router.post("/itemCantMenos",verifyToken, invFun.itemCantMenos);
router.post("/itemCantMas",verifyToken, invFun.itemCantMas);

router.post("/createdVenta",verifyUser,venFun.createdVenta);
router.post("/updateVenta",verifyUser, venFun.updateVenta);
router.post("/deleteVenta",verifyUser,venFun.deleteVenta);
router.post("/readVentas",verifyUser,venFun.readVentas);
router.post("/readIDSventas",verifyUser,venFun.readIDSventas);
router.post("/readVentasUserTime",verifyUser, venFun.readVentasUserTime);
/** 
router.post("/read_venta_id",verifyToken, read_venta_id);
router.post("/del_ventaMarc",servicio,verifyToken, del_ventaMarc);
router.post("/read_ventas_user", read_ventas_user);
*/

router.get("/sizeDB",verifyToken, administrar.sizeDB);
//router.post("/write_numNota",servicio,verifyToken, limpiar.write_numNota);

module.exports = router;