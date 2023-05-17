
const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/administracion.html',
  '/administradoresAdmin/formEdit.html',
  '/administradoresAdmin/formReg.html',
  '/administradoresAdmin/tabla.html',
  '/cliente/clientes.html',
  '/cliente/exelRegclientes.html',
  '/cliente/formEdit_clientes.html',
  '/cliente/formReg_clientes.html',
  '/css/estylo.css',
  '/estadistica/estadisticaVenta.html',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/install.svg',
  '/images/logo.png',
  '/images/sort_asc.png',
  '/images/sort_asc_disabled.png',
  '/images/sort_both.png',
  '/images/sort_desc.png',
  '/images/sort_desc_disabled.png',
  '/img/Bien.PNG',
  '/img/Cerrar.png',
  '/img/Contabilidad.png',
  '/img/Data.png',
  '/img/Deuda.png',
  '/img/Herramienta.png',
  '/img/Lupa.png',
  '/img/Mal.PNG',
  '/img/Usuario.png',
  '/img/atras.png',
  '/img/calendario.png',
  '/img/camara.png',
  '/img/documento.png',
  '/img/iconos/amburger.png',
  '/img/iconos/camera.png',
  '/img/iconos/close.png',
  '/img/iconos/edit.png',
  '/img/iconos/image 00(1).png',
  '/img/iconos/image0.png',
  '/img/iconos/lapiz.png',
  '/img/iconos/logoCam.png',
  '/img/iconos/mas.png',
  '/img/iconos/menu.png',
  '/img/iconos/pc.png',
  '/img/iconos/phone.png',
  '/img/iconos/reload.png',
  '/img/iconos/succes.png',
  '/img/ubicacion.png',
  '/index.html',
  '/inventario/exelRegInventario.html',
  '/inventario/formEdit_inventario.html',
  '/inventario/formReg_inventario.html',
  '/inventario/inventario.html',
  '/js/apiBakend.js',
  '/js/confire.js',
  '/js/jquery-3.5.1.min.js',
  '/js/jspdf.min.js',
  '/js/jspdf.plugin.autotable.js',
  '/js/mainDB.js',
  '/js/numberToString.js',
  '/jsEx/app.js',
  '/jsEx/cpexcel.js',
  '/jsEx/filesaver.js',
  '/jsEx/jszip.js',
  '/jsEx/shim.js',
  '/jsEx/xlsx.full.min.js',
  '/jsEx/xlsx.js',
  '/jsEx/xlsxworker.js',
  '/limpiar/archivo.html',
  '/limpiar/cargar.html',
  '/limpiar/descarga.html',
  '/limpiar/limpiar.html',
  '/login/cambioPasword.html',
  '/login/confg.html',
  '/pedidos/formInfo_venta.html',
  '/pedidos/pdfVenta.html',
  '/pedidos/pedidos.html',
  '/userAdmin/formEdit.html',
  '/userAdmin/formReg.html',
  '/userAdmin/tabla.html',
  '/vendedoresAdmin/formEdit.html',
  '/vendedoresAdmin/formReg.html',
  '/vendedoresAdmin/tabla.html'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil( caches.open(CACHE_NAME).then((cache) => { 
    return cache.addAll(FILES_TO_CACHE); 
  }));
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) { return caches.delete(key); }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request).then((response) => {  return response || fetch(evt.request); });
    })
  );
});
