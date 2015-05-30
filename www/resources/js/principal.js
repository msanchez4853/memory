/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(window).ready(prepararPagina);


function prepararPagina(event){
    if(memoria.isConectado()){
        memoria.prepararEntorno();
        $("#_mem_info").hide();
        $("button[data-toggle='popover']").hover(mostrarMensaje);    
        $("button[data-toggle='popover']").mouseout(function(){
            $("#_mem_info").hide();
        });
        
        $("#_acc_btn_jugar").click(empezarPartida);
        $("#_acc_btn_estadisticas").click(mostrarEstadisticas);
        $("#_acc_btn_ajustes").click(mostrarAjustes);
        
    }else{
       alert('No conectado')
    }
}


function mostrarMensaje(event){
    $(this).attr('data-content');
    
    $("#_mem_info").html($(this).attr('data-content'));
    $("#_mem_info").show();
}


function empezarPartida(event){
    document.location='partida.html';
}

function mostrarEstadisticas(event){
    document.location='estadisticas.html';
}

function mostrarAjustes(event){
    document.location='ajustes.html';
}