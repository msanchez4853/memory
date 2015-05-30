/* 
 * Funciones para la gestion de la pagina de ajustes.html
 */

$(window).ready(prepararPagina);


function prepararPagina(event){
     //Una vez cargada la informacion de la pagina se define el comportamiento de algunos de los elementos de la pagina
    //Y se prepara el entorno del juego.
    
     document.addEventListener("deviceready",onDeviceReady,false);
   // $("#memoria_img_cap_file").hide();
    $("#_acc_btn_tomar_img").hide();
    $("#memoria_img_cap_file").change(handleFileSelect)
    $("#_acc_btn_anadir_img").click(mostrarDialogoArchivo);
    
    $("#memoria_ac_btn_guardar").click(guardarImagen);
    $("#memoria_ac_btn_limpiar").click(limpiarFormularioImagen);
    $("#memoria_ac_btn_limpiar_foto").click(limpiarFormularioFoto);
  //  $("#memoria_ac_btn_guardar_foto").click(tomarFoto);
    if(memoria.isConectado()){
        memoria.prepararEntorno();
        pintarCarusel()
    
    }else{
        alert('No conectado')
    }
}


function pintarCarusel(){
            
    var imagenes = memoria.getImagenesUsu();
        
    var dv_list_imagenes = $("#list_imagenes");
    var dv_list_imagenes_indicators = $("#list_imagenes_indicators");
    dv_list_imagenes.html('');
    dv_list_imagenes_indicators.html('');
       
    if(imagenes.length>0){
        $("#_memoria_ver_carrusel").show();
        $("#_memoria_ver_carrusel_no_img").hide();
        for(i=0;i<imagenes.length;i++){
            var imagen_obj = imagenes[i];
            var img = $("<div>"+
                "<img id='id_img_"+i+"' src='"+imagen_obj+"' class='img-responsive'/>"+
                "</div>"+
                "<div class='carousel-caption'>"+
                "<h1 class='center-block'>"+
                "<a class='memoria_ac_btn_eliminar' onclick='eliminarImagen("+i+");' id='id_del_"+i+"'> <span class='glyphicon glyphicon-trash  btn-lg'></span></a>"+
                "</h1>"+
                "</div>");
                
            var div_img = $("<div class='item "+(i==0?"active":"")+"'></div>").append(img);
            var li_img = $("<li data-target='#carousel-list-imagenes' data-slide-to='"+i+"' "+(i==0?"class='active'":"")+"></li>");
        
            dv_list_imagenes.append(div_img);
            dv_list_imagenes_indicators.append(li_img);
        }
    }else{
        $("#_memoria_ver_carrusel").hide();
        $("#_memoria_ver_carrusel_no_img").show();
    }
    
}
function mostrarDialogoArchivo(){
    console.log('mostrarDialogoArchivo')
    $("#memoria_img_anadir_modal").modal("show")
    //$("#memoria_img_cap_file").click();    
}


function mostrarDialogoFoto(){
    
    //$("#memoria_img_foto_modal").modal('show')
    tomarFoto();
}

function limpiarFormularioFoto(){
   // $("#memoria_img_foto_modal").modal('hide');
}

function handleFileSelect(evt) {
  
   console.log('handleFileSelect(evt) ')
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            alert("debe selecionar una archivo de imagen.")
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                $("#memoria_img_anadir_modal").modal("hide")
                $("#memoria_img_capturada").attr('src', e.target.result);
                $("#memoria_img_cap_modal").modal('show');
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);   
      
    }
    
}


function guardarImagen(){

    memoria.guardarImagenUsu($("#memoria_img_capturada").attr('src'));
    pintarCarusel();
    $("#memoria_img_cap_modal").modal('hide');
}

function limpiarFormularioImagen(){
    $("#memoria_img_capturada").attr('src','');    
    $("#memoria_img_cap_modal").modal('hide');
}

function eliminarImagen(posicion){
    
    memoria.eliminarImagenUsu(posicion);
    pintarCarusel();
}


/*function tomarFoto(){
    context.drawImage(video, 0, 0,$("video#ft_video").width(),$("video#ft_video").height());  
    
    var dataURL = canvas.toDataURL("image/png");
    $("#memoria_img_capturada").attr('src', dataURL);
    limpiarFormularioFoto();
    $("#memoria_img_cap_modal").modal('show');
}

*/
/*
function hasGetUserMedia() {
    // Note: Opera builds are unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function iniciarCamara(){
    
    canvas = document.getElementById("ft_canvas");
    video =  document.getElementById('ft_video');
    videoObj = {
        video: true
        
    }
    var _width = $("video#ft_video").width()==0?($("video#ft_video").parent().width()-20):$("video#ft_video").width();
    var _height = $("video#ft_video").height()==0?($("video#ft_video").parent().height()-20):$("video#ft_video").height();
    
   
    $("#ft_canvas").attr('width',_width);
    $("#ft_video").attr('width',_width);
    $("#ft_canvas").attr('height',_height);
    $("#ft_video").attr('height',_height);
    
    context = canvas.getContext("2d");  

    
    getMedia(videoObj);
    
}*/

/*function getMedia(videoObj){
    if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
                        
            video.src = stream;
            activarVisor();
        }, errorCallback);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
                            
            video.src = window.webkitURL.createObjectURL(stream);
            //video.play();
            activarVisor();
        }, errorCallback);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            //video.play();
            activarVisor();
        }, errorCallback);
    }
}

function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error.name);
    
}

function activarVisor(){      
    $("#ft_men_video").show();   
    
}*/

function onDeviceReady() {
    console.log('onDeviceReady')
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
   // $("#ft_ac_tomar_foto").show();
    console.log('fin onDeviceReady')
    $("#_acc_btn_tomar_img").click(mostrarDialogoFoto);
    $("#_acc_btn_tomar_img").show();
}

function onPhotoDataSuccess(imageData){   
    $("#memoria_img_capturada").attr('src',"data:image/jpeg;base64," + imageData);
    limpiarFormularioFoto();
    $("#memoria_img_cap_modal").modal('show');
}

function tomarFoto(){
    console.log('tomarFoto')
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
    
    console.log('Fin tomarFoto') 

}

function onFail(message) {
    alert('Failed because: ' + message);
}