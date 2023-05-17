var X = XLSX;
var XW = {
	msg: 'xlsx',
	worker: '../jsEx/xlsxworker.js'/////ajuste de ruta por invocacion  del reg inventario
};

var webworkers;

var ejecutar_webworkers = (function() {
	var OUT = document.getElementById('json');

	var crear_json = (function() {
		var fmt= document.getElementsByName( "JSON" );
		return function() {
			for(var i = 0; i < fmt.length; ++i) if(fmt[i].checked || fmt.length === 1) return fmt[i].value;
		};
	})();

	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
	};

	return function ejecutar_webworkers(wb) {
		webworkers = wb;
		var output = "";
		switch(crear_json()) {
			default: output = to_json(wb);
		}
		/****** captura de datos exel ************/
		const datosExel = JSON.parse(output)
		renderExel(datosExel["Hoja1"])	
		/****** captura de datos exel ************/	
	};
})();


var do_file = (function() {
	var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
	var domrabs = document.getElementsByName("userabs")[0];

	var use_worker = typeof Worker !== 'undefined';
	var domwork = document.getElementsByName("useworker")[0];

	var xw = function xw(data, cb) {
		var worker = new Worker(XW.worker);
		worker.onmessage = function(e) {
			switch(e.data.t) {
				case 'ready': break;
				case 'e': console.error(e.data.d); break;
				case XW.msg: cb(JSON.parse(e.data.d)); break;
			}
		};
		worker.postMessage({d:data,b:rABS?'binary':'array'});
	};

	return function do_file(files) {
		
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
			var data = e.target.result;
			if(!rABS) data = new Uint8Array(data);
			if(use_worker) xw(data, ejecutar_webworkers);
			else ejecutar_webworkers(X.read(data, {type: rABS ? 'binary' : 'array'}));
		};
		if(rABS) reader.readAsBinaryString(f);
		else reader.readAsArrayBuffer(f);
	};
})();
/************ carga de datos exel capturados de la interfas html **********/
(function() {
	var cargararchivo = document.getElementById('archivoexcel');////input file
	if(!cargararchivo.addEventListener) return;
	function handleFile(e) { do_file(e.target.files); }
	cargararchivo.addEventListener('change', handleFile, false);
})();
/************ carga de datos exel capturados de la interfas html **********/