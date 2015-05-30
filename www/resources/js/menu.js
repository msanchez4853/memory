/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



var memoria = (function() {
    var _datosUsuario=null;
    var log = $("#_men_log");
    var imagen_default= 'resources/imagenes/default.png';
    var _fallo1 = null;
    var _fallo2 = null;
    var _marcar_ocultar = false;
    var _imagenes_encontradas=0;
    var n_imagenes;
    var _watchID = null;
    var pulsado1={
        fila:'',
        columna:'',
        imagen:''
    };
    var pulsado2={
        fila:'',
        columna:'',
        imagen:''
    };
    var n_intentos = 0;
    var parametros_partida =[
    {
        imagenes:3,
        matriz:3,
        tiempo:100,
        penaliza:10
    },{
        imagenes:4,
        matriz:3,
        tiempo:100,
        penaliza:10
    },

    {
        imagenes:5,
        matriz:4,
        tiempo:100,
        penaliza:10
    },{
        imagenes:6,
        matriz:4,
        tiempo:100,
        penaliza:10
    },

    {
        imagenes:7,
        matriz:5,
        tiempo:100,
        penaliza:10,
        col:2
    },{
        imagenes:8,
        matriz:6,
        tiempo:100,
        penaliza:10,
        col:2
    },

    {
        imagenes:9,
        matriz:6,
        tiempo:100,
        penaliza:10,
        col:2
    },{
        imagenes:10,
        matriz:6,
        tiempo:100,
        penaliza:10,
        col:2
    },

    {
        imagenes:11,
        matriz:6,
        tiempo:100,
        penaliza:10,
        col:2
    },{
        imagenes:12,
        matriz:6,
        tiempo:100,
        penaliza:10,
        col:2
    },

    {
        imagenes:12,
        matriz:6,
        tiempo:80,
        penaliza:10,
        col:2
    },{
        imagenes:12,
        matriz:6,
        tiempo:60,
        penaliza:10,
        col:2
    }
    ];
    
    var conectado = localStorage.conectado?localStorage.conectado:null;
    function prepararEntorno(){
    
   
        if (window.openDatabase) {
            //conectar con la base de datos
            //__db_memoria = openDatabase("db_memoria", "1.0", "Memoria PhoneGap", 1000000);
    
            if($("span#_acc_nav_usuario")){
                if(localStorage.conectado){
                    $("span#_acc_nav_usuario").html(localStorage.conectado)
                }
            }
        }else{
            alert('no permitido')
        }
    
        $("#_acc_nav_logout").click(terminarSession);
        $("#_acc_nav_atras").click(irPrincipal);
        $("#memoria_par_btn_jugar").click(crearPartida)
        $("#memoria_par_btn_principal").click(irPrincipal);
    }


    
    function iniciarUsuario(nick){
       
        localStorage.conectado = nick;
 
        //
        if(localStorage[nick]){
            _datosUsuario = JSON.parse(localStorage[nick])
            localStorage.record = _datosUsuario.record;
            localStorage.nivel = _datosUsuario.nivel;
            localStorage.puntos_partida = 0;
        }else{
            _datosUsuario={
                usuario:nick,
                puntuaciones:[],
                ajustes:{
                    imagenes:[]
                },
                record: 0,
                nivel: 1                
            }
            localStorage.record=0;
            localStorage.puntos_partida=0;
            localStorage.nivel=1;
        }
 
        localStorage[nick] = JSON.stringify(_datosUsuario);
    
    }


    function terminarSession(event){
        localStorage.removeItem('conectado');
        localStorage.removeItem('record');
        localStorage.removeItem('puntos_partida');
        localStorage.removeItem('nivel');
        document.location="index.html";
    
    }

    function irPrincipal(){
        document.location="principal.html";
    }

    function isConectado(){       
        return localStorage.conectado?true:false;
    }
    
    function getPuntuaciones(){
        if(localStorage.conectado){
            _datosUsuario = JSON.parse(localStorage[localStorage.conectado])
            return _datosUsuario.puntuaciones;
        }
    }

    
    function definirEventos(){
        $("img[emparejada='0']").off('click');
        $("#memoria_par_btn_iniciar").off('click');
        $("img[emparejada='0']").click(tarjetaPulsada);
        $("#memoria_par_btn_iniciar").click(iniciarPartida)
    }
    
    
    function temporizador(){
        var tmp = $("#memoria_est_tmp").html();
        
        tmp = tmp -1;
        if(tmp>=0){
            $("#memoria_est_tmp").html(tmp);
            if(tmp==0){
                
                finalizarPartida(false);
            }
        }
    }
    
    function guardarResultados(){
               
        
        if(localStorage.puntos_partida >= _datosUsuario.record){
            _datosUsuario.record = localStorage.puntos_partida;
            localStorage.record = _datosUsuario.record;
            localStorage.nivel = _nivel;
        }
        
        if(_nivel >= _datosUsuario.nivel){
            _datosUsuario.nivel = _nivel;
        }
        
        _datosUsuario.puntuaciones.push({
            puntuacion:localStorage.puntos_partida,
            nivel:_nivel
        })
        
        localStorage[localStorage.conectado] = JSON.stringify(_datosUsuario);
    }
    
    function finalizarPartida(victoria){
        clearInterval(_temp);
        guardarResultados();
        $("#memoria_par_res_puntos").html(localStorage.puntos_partida);
        $("#memoria_par_res_niv").html(_nivel);
        $("#memoria_par_modal_terminada").modal('show');
        if(victoria){
            $("#memoria_par_terminada_mens_detalle").html('<h1>&nbsp;<span class="glyphicon glyphicon-thumbs-up"></span>&nbsp;&nbsp;Victoria</h1><br/>'+
                '<span>Te atreves a hacerlo mas rapido??. </span>');
            $("#memoria_par_terminada_mens").attr('class','modal-content alert-success');
        }else{
            $("#memoria_par_terminada_mens_detalle").html('<h1>&nbsp;<span class="glyphicon glyphicon-thumbs-down"></span>&nbsp;&nbsp;Game Over</h1>&nbsp;<br/>'+
                '<span>La proxima vez intenta ser mas rapido. </span>');
            $("#memoria_par_terminada_mens").attr('class','modal-content alert-danger');
        }
        
    }
    
    
    function tarjetaPulsada(event){
        
        var fila_p = $(this).attr('fila');
        var columna_p = $(this).attr('columna');
        var imag_p =null;
        setTimeout(imag_p = girarImagen($(this),fila_p,columna_p),500);
        var pareja = false;
        if(pulsado1.fila==''){
            pulsado1.fila = fila_p;
            pulsado1.columna = columna_p;
            pulsado1.imagen = imag_p;
            pareja = false;
        }else{
            pulsado2.fila = fila_p;
            pulsado2.columna = columna_p;
            pulsado2.imagen = imag_p;
            pareja=true;
            n_intentos ++;
            $("#memoria_est_intento").html(n_intentos)
        }
       
       
        
        $(this).off('click');
        
        
        //inicializamos estados
        if(pareja){
            pareja=false;
            
            if(pulsado1.imagen == pulsado2.imagen){
                _imagenes_encontradas ++;
                if(_imagenes_encontradas == n_imagenes){
                    nivelSuperado();
                }
            }else{                
                _fallo1 = $("img[fila='"+pulsado1.fila+"'][columna='"+pulsado1.columna+"']");
                _fallo2 = $("img[fila='"+pulsado2.fila+"'][columna='"+pulsado2.columna+"']");
            }
            pulsado1.fila = '';
            pulsado1.columna = '';
            
            pulsado2.fila = '';
            pulsado2.columna = '';
            
        }
    }
    
    function nivelSuperado(){
        console.log('nivel Superado');
        clearInterval(_temp);
        clearInterval(_girar);
        
        var tmp_res = $("#memoria_est_tmp").html();
        var total = 0;
        $("#memoria_par_tmp").html(tmp_res+" x 10  ");
        $("#memoria_par_tmp_p").html(tmp_res*10);
        total +=(tmp_res*10);
        $("#memoria_par_imag").html(n_imagenes+' x 10  ');
        $("#memoria_par_imag_p").html(n_imagenes*10);
        total +=(n_imagenes*10);
        $("#memoria_par_int").html(n_intentos+' x -10  ');
        $("#memoria_par_int_p").html(-(n_intentos*10));
        total += -(n_intentos*10);
        
        $("#memoria_par_niv").html(_nivel+' x 10  ');
        $("#memoria_par_niv_p").html(_nivel*10);
        total +=(_nivel*(10));
        
        $("#memoria_par_tot_p").html(total);


        var _puntos_partida = parseInt( localStorage.puntos_partida?localStorage.puntos_partida:0);
        
        _puntos_partida = _puntos_partida + parseInt(total);
       
        localStorage.setItem('puntos_partida',_puntos_partida);//_puntos_partida;
        $("#memoria_par_totp_p").html(_puntos_partida);
        
        
        if(_nivel==12){
            //ha finalizado la partida
            finalizarPartida(true);
        }else{
            crearTablero(_nivel+1,false);
        
            $("#memoria_par_sig_niv").html(_nivel)
            $("#memoria_par_enhorabuena").show();
            $("#memoria_par_modal").modal('show');
        }
    }
    
    function defaultImagen(){
       
        if(_fallo1!=null && _fallo2!=null && _marcar_ocultar){
            _fallo1.click(tarjetaPulsada);
            _fallo2.click(tarjetaPulsada);
            _fallo1.attr('src',imagen_default);
            _fallo2.attr('src',imagen_default);
            _fallo1=null;
            _fallo2=null;
            _marcar_ocultar = false;
        }else{
            if(_fallo1!=null && _fallo2!=null){
                _marcar_ocultar = true;
            }
        
        }
    }
    
    function girarImagen(elem,fila,columna){
        // for(_fichas_juego.legth;
        
        console.log('girarImagen')
        elem.attr('src',_fichas_juego[fila][columna]);
        //alert('girarImagne')
        return _fichas_juego[fila][columna];
    }
    
    
    function iniciarPartida(){
        finalizarProgreso();
        
        
        $("#memoria_par").show();
        _temp = setInterval(temporizador,1000);
        _girar = setInterval(defaultImagen,500);
        _fallo1 = null;
        _fallo2 = null;
        _marcar_ocultar = false;
        _imagenes_encontradas=0;
    }
    
    
    
    function iniciarProgreso(){
        
        $("#memoria_par").hide();
        
        _prog = setInterval(function(){
            
            var tam = $("#memoria_par_bar").width() +20;
            tam = tam >=$("#memoria_par_bar").parent().width()  ? 0:tam;
            $("#memoria_par_bar").width(tam);
        },500);
        
        
    }
    
    function finalizarProgreso(){
        $("div.progress").hide();
        $("#memoria_par_modal").modal('hide');
        clearInterval(_prog);
    }
    
    function preparadoTablero(){
        $("#memoria_par_enhorabuena").hide();
        $("#memoria_par_modal").modal('show');
    }
    
    
    function generarFichasJuego(n_imagenes,t_matriz){
        var imagenes_all = [];
        //Imagenes de la aplicacion
        for(i=0; i< 12;i++){
            imagenes_all.push('resources/imagenes/apli'+i+".png");
        }
        
        //Imagenes definidas por el usuario
        var imagenes_usu = _datosUsuario.ajustes.imagenes;
        console.log(imagenes_usu)
        for(i=0; (imagenes_usu && i< imagenes_usu.length);i++){
            imagenes_all.push(imagenes_usu[i]);
        }
        
        var imagenes_sel=[];
        
        var num_total_img = imagenes_all.length;
        console.log("numero total de imagenes "+num_total_img);
        for(i=0; i< n_imagenes;i++){
            
            var indice = Math.floor((Math.random() * num_total_img) + 0);
            var seleccionada = imagenes_all[indice];
            num_total_img--;
            imagenes_all[indice] = imagenes_all[num_total_img];
            console.log("Seleccionada  "+i+" "+seleccionada)
            imagenes_sel.push(seleccionada);
        }
        
        //Colocar imagenes en casillas
        var n_casillas_rellenar = n_imagenes*2;
        var rellenadas = 0;
        var casillas_rellenar=[];
        for(f=0;f<t_matriz && rellenadas < n_casillas_rellenar;f++){
            for(c=0;c<t_matriz && rellenadas < n_casillas_rellenar;c++){
                casillas_rellenar.push({
                    fila:f,
                    columna:c
                });
                rellenadas++;
            }   
        }
        
        _fichas_juego=new Array([],[],[],[],[]);
        for(i=0; i< imagenes_sel.length;i++){
            indice = Math.floor((Math.random() * n_casillas_rellenar) + 0);
            seleccionada = casillas_rellenar[indice];
            n_casillas_rellenar--;
            casillas_rellenar[indice] = casillas_rellenar[n_casillas_rellenar];
            console.log("Seleccionada  "+i+" "+seleccionada)
            var img_casilla={
                fila:seleccionada.fila,
                columna:seleccionada.columna,
                imagen : imagenes_sel[i]
            }
            _fichas_juego[img_casilla.fila][img_casilla.columna] = img_casilla.imagen;
            indice = Math.floor((Math.random() * n_casillas_rellenar) + 0);
            seleccionada = casillas_rellenar[indice];
            n_casillas_rellenar--;
            casillas_rellenar[indice] = casillas_rellenar[n_casillas_rellenar];
            console.log("Seleccionada  "+i+" "+seleccionada)
            img_casilla={
                fila:seleccionada.fila,
                columna:seleccionada.columna,
                imagen : imagenes_sel[i]
            }
            _fichas_juego[img_casilla.fila][img_casilla.columna]= img_casilla.imagen;
        }
        
        console.log(_fichas_juego);
        
    }
    
    
    function crearTablero(nivel,inicioPartida){
        if(nivel >=1 && nivel<=12){
            // iniciarProgreso();
            if(inicioPartida){
                iniciarUsuario(localStorage.conectado)
            }
            var param_n = parametros_partida[nivel-1];
            _nivel = nivel;
            n_imagenes = param_n.imagenes;
            
            var t_matriz =param_n.matriz;
           
            var t_max = param_n.tiempo;
            var pena_seg = param_n.penaliza;
            
            //Pintamos el tablero
            var tablero = $("#memoria_par_tablero > tbody").html('');
            var fichas_pintadas=0;
            for(var f=0; f < t_matriz; f++){
                var _tr = $("<tr></tr>");
                for(var c=0; c < t_matriz; c++){
                 
                    var _td = $("<td ></td>");
                
                    if(fichas_pintadas>=(n_imagenes*2)){
                        _td = $("<td class='hidden'></td>");
                    }else{
                        var _img = $("<img src='"+imagen_default+"' class='casilla_tablero thumbnail img-responsive img-rounded' fila='"+f+"' columna='"+c+"' emparejada='0'/>");
                        _td.append(_img);
                       
                    }
                               
                    _tr.append(_td);
                     
                    fichas_pintadas++;
                }  
                tablero.append(_tr);
            }
            
            generarFichasJuego(n_imagenes,t_matriz);
            
            n_intentos=0; //Reiniciamos los intentos
            $("#memoria_est_intento").html(n_intentos)
            $("#memoria_est_tmp").html(t_max);
            

            definirEventos(); 
            $("#memoria_est_nivel_actua").html(_nivel)
            if(inicioPartida){  
                $("#memoria_par_sig_niv").html(_nivel)
                preparadoTablero();
                localStorage.puntos_partida = 0;
            }
        }
    }
    
    function crearPartida(){
        document.addEventListener("deviceready", onDeviceReady, false);
        $("#memoria_est_usuario").html(localStorage.conectado);
        $("#memoria_est_record").html(localStorage.record);
        $("#memoria_est_nivel").html(localStorage.nivel);
        $("#memoria_par_modal_terminada").modal('hide');
        var nivel = 1   ;
        
        crearTablero(nivel,true);
    }

    function getImagenesUsu(){
        iniciarUsuario(localStorage.conectado);
        return _datosUsuario.ajustes.imagenes;
    }

    function guardarImagenUsu(img){
    
        iniciarUsuario(localStorage.conectado);
        _datosUsuario.ajustes.imagenes.push(img);
        localStorage[localStorage.conectado] = JSON.stringify(_datosUsuario);
    }

    function eliminarImagenUsu(posicion){
        iniciarUsuario(localStorage.conectado);
        _datosUsuario.ajustes.imagenes.splice(posicion,1);
        localStorage[localStorage.conectado] = JSON.stringify(_datosUsuario);
    }


    function onDeviceReady() {
                
        startAccelerometro();
        $("#memoria_par_btn_agitar_no").click(continuarNivel);
        $("#memoria_par_btn_agitar_si").click(actualizarNivel);
                
    }
    
    function startAccelerometro() {
        // Update acceleration every 3 seconds
        _ult_x=null;
        _n_cambios_x=0;
        _ult_sentido_x =null;
        _tmp_ult_x =null;
        _ult_y=null;
        _n_cambios_y=0;
        _ult_sentido_y =null;
        _tmp_ult_y =null;
        _ult_z=null;
        _n_cambios_z=0;
        _ult_sentido_z =null;
        _tmp_ult_z =null;
        var options = {
            frequency: 600
        };
        _watchID = navigator.accelerometer.watchAcceleration(onSuccessAcce, onErrorAcce, options);
    }
    function stopAccelerometro() {
        //alert(stopWatch)
        if (_watchID!=null) {
            navigator.accelerometer.clearWatch(_watchID);
            _watchID = null;
        }
    }

    
    
    
    function onSuccessAcce(acceleration) {
        
            
        var x = acceleration.x;
        var y = acceleration.y;
        var z = acceleration.z;
        var tmp = acceleration.timestamp;
                
        _ult_x = _ult_x==null?x:_ult_x;
        _ult_sentido_x = _ult_sentido_x==null?_ult_x:_ult_sentido_x;
        _tmp_ult_x = _tmp_ult_x==null?tmp:_tmp_ult_x;
               
        var dif_x = _ult_x - x;
        if((dif_x < 0 && _ult_sentido_x >= 0) || (dif_x > 0 && _ult_sentido_x <= 0) ){
            if(Math.abs(dif_x)> 0.2 ){                       
                if(Math.abs(_tmp_ult_x - tmp) > 1000){
                    _n_cambios_x = 0;                                                    
                }else{
                    _n_cambios_x++;
                    if(_n_cambios_x > 2){
                        stopAccelerometro();
                        mostrarMenBarajarTab();
                        
                        _n_cambios_x =0;
                        return;
                    }
                }
                        
                _tmp_ult_x = tmp;
            }
                    
        }
        _utl_x = x;
        _ult_sentido = dif_x;
        
        _ult_y = _ult_y==null?y:_ult_y;
        _ult_sentido_y = _ult_sentido_y==null?_ult_y:_ult_sentido_y;
        _tmp_ult_y = _tmp_ult_y==null?tmp:_tmp_ult_y;
               
        var dif_y = _ult_y - y;
        if((dif_y < 0 && _ult_sentido_y >= 0) || (dif_y > 0 && _ult_sentido_y <= 0) ){
            if(Math.abs(dif_y)> 0.2 ){                       
                if(Math.abs(_tmp_ult_y - tmp) > 1000){
                    _n_cambios_y = 0;                                                    
                }else{
                    _n_cambios_y++;
                    if(_n_cambios_y > 2){
                        stopAccelerometro();
                        mostrarMenBarajarTab();
                        
                        _n_cambios_y =0;
                        return;
                    }
                }
                        
                _tmp_ult_y = tmp;
            }
                    
        }
        _utl_y = y;
        _ult_sentido = dif_y;
        
        //Cambios en Z
        _ult_z = _ult_z==null?z:_ult_z;
        _ult_sentido_z = _ult_sentido_z==null?_ult_z:_ult_sentido_z;
        _tmp_ult_z = _tmp_ult_z==null?tmp:_tmp_ult_z;
               
        var dif_z = _ult_z - z;
        if((dif_z < 0 && _ult_sentido_z >= 0) || (dif_z > 0 && _ult_sentido_z <= 0) ){
            if(Math.abs(dif_z)> 0.2 ){                       
                if(Math.abs(_tmp_ult_z - tmp) > 1000){
                    _n_cambios_z = 0;                                                    
                }else{
                    _n_cambios_z++;
                    if(_n_cambios_z > 2){
                        stopAccelerometro();                        
                        mostrarMenBarajarTab();
                        _n_cambios_z =0;
                        return;
                    }
                }
                        
                _tmp_ult_z = tmp;
            }
                    
        }
        _utl_z = z;
        _ult_sentido = dif_z;
       
    }

    // onError: Failed to get the acceleration
    //
    function onErrorAcce() {
        alert('onError!');
    }
    
    function mostrarMenBarajarTab(){
        //Paramos temporizador.
        clearInterval(_temp);
        $("#memoria_par_modal_agitar").modal('show');
    }


    function continuarNivel(){
        _temp = setInterval(temporizador,1000); 
        $("#memoria_par_modal_agitar").modal('hide');
        startAccelerometro()
    }

    function actualizarNivel(){
    
        $("#memoria_par_modal_agitar").modal('hide');
        _nivel = _nivel?_nivel:1;
        
        crearTablero(_nivel, false);
        iniciarPartida();
        startAccelerometro();
    }

    return {
        prepararEntorno: prepararEntorno,
        iniciarUsuario:iniciarUsuario,
        isConectado:isConectado,
        conectado:localStorage.conectado,
        record:localStorage.record,
        nivel:localStorage.nivel,
        puntuaciones: getPuntuaciones,
        crearPartida: crearPartida,
        iniciarProgreso:iniciarProgreso,
        getImagenesUsu: getImagenesUsu,
        guardarImagenUsu: guardarImagenUsu,
        eliminarImagenUsu:eliminarImagenUsu
        
    }
})();
