/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(window).ready(prepararPagina);


function prepararPagina(event){
    if(memoria.isConectado()){
        memoria.prepararEntorno();
        $("#memoria_est_usuario").html(memoria.conectado);
        $("#memoria_est_record").html(memoria.record);
        $("#memoria_est_nivel").html(memoria.nivel);
        
        var puntuaciones = memoria.puntuaciones();
        
        var num=0;
        for(i=0;i<puntuaciones.length;i++){
            var p = puntuaciones[i];
            var _tr = $("<tr><td>"+i+"</td><td>"+p.puntuacion+"</td><td>"+p.nivel+"</td></tr>");
            $("#memoria_est_table > tbody").append(_tr);
            num++;
        }
        
        if(num==0){
            var _tr = $("<tr><td colspan='3'>No hay registros.</td></tr>");
            $("#memoria_est_table > tbody").append(_tr);
        }
    }else{
        alert('No conectado')
    }
}

