const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios.js');

const usuarios = new Usuarios();

const {crearMensaje} = require('../utilidades/utilidades.js');


io.on('connection', (client) => {


  client.on('nuevoUsuario', async(data,callback)=>{

   if(!data.nombre || !data.sala){return callback({error:true,
                                                   message:'El nombre/sala es necesario'})}

  client.join(data.sala);

  let personas = await usuarios.agregarPersona(client.id,data.nombre,data.sala);

  callback(personas)

  client.broadcast.to(data.sala).emit('listaDePersonas',personas)})



  client.on('disconnect',async()=>{

    let personaBorrada = await usuarios.borrarPersona(client.id);

    client.broadcast.to(personaBorrada.sala).emit('mensaje',crearMensaje('Administrador',`El usuario ${personaBorrada.nombre} ha salido del chat`))

    let personas = await usuarios.getPersonasPorSala();

    client.broadcast.to(personaBorrada.sala).emit('listaDePersonas',personas)})



  client.on('mensaje',(data)=>{

    let persona = usuarios.getPersona(client.id)

    client.broadcast.to(persona.sala).emit('mensaje',crearMensaje(persona.nombre,data.mensaje))})



  client.on('mensajePrivado',(data)=>{

     let persona = usuarios.getPersona(client.id);

    client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje))})

  })
