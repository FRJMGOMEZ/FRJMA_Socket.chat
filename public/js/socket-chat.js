let socket = io();

let searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('nombre')||!searchParams.has('sala')){
  window.location = 'index.html';
  throw new Error('El nombre y sala es necesario');}

let nombre = searchParams.get('nombre');
let sala = searchParams.get('sala');

let data = {nombre,
            sala};

socket.on('connect',()=>{

  socket.emit('nuevoUsuario',data,(respuesta)=>{console.log(respuesta)})})


socket.on('mensaje',(data)=>{console.log(data)})


socket.on('listaDePersonas',(personas)=>{console.log(personas)})


socket.on('mensajePrivado',(mensaje)=>{console.log(`Mensaje privado`,mensaje)})
