/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(window).ready(prepararPagina);


function prepararPagina(event){
    memoria.prepararEntorno();
    $("#_acc_btn_login").click(logear)
}

function logear(event){
     var nick = $.trim($("#input_nick").val());
      
      
     if(nick){
         memoria.iniciarUsuario(nick);            
         $("form").attr('action','principal.html');         
         $("form").submit();
     }
     event.preventDefault();
     return false;
}
