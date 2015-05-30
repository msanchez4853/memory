/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
memoria.iniciarProgreso();

$(window).ready(prepararPagina);


function prepararPagina(event){
    if(memoria.isConectado()){
        memoria.prepararEntorno();
        memoria.crearPartida();
    }else{
        alert('No conectado')
    }
}

