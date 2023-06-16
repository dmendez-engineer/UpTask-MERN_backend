//const express=require('express');
import express from 'express';
import conectarDB from './config/db.js';
import cors from 'cors';

import dotenv from "dotenv";
import router from './routes/usuarioRoutes.js';
import routerProyecto from './routes/proyectoRoutes.js';
import routerTarea from './routes/tareaRoutes.js';

const app=express();
app.use(express.json());
dotenv.config();

conectarDB();


const whiteList=[process.env.FRONT_END_URL];//URL from Frontend

const corsOptions={
    origin:function(origin,callback){
        if(whiteList.includes(origin)){
            //Is able to request the API
            callback(null,true);
        }else{
            callback(null,true);
            //callback(new Error('error de Cors'))
        }
    }
}
app.use(cors(corsOptions));

//Routing

app.use("/api/usuarios",router);
app.use("/api/proyectos",routerProyecto);
app.use("/api/tareas",routerTarea);



const PORT=process.env.PORT || 4000;

//console.log(process.env.HOLA);
const servidor=app.listen(PORT,()=>{
    console.log("Servidor corriendo: "+PORT);
});


//socket.io
import {Server} from 'socket.io'
const io= new Server(servidor,{
    pingTimeout:60000,
    cors:{
        origin:process.env.FRONT_END_URL
    }
});
io.on('connection',(socket)=>{


    //Develop the socket's events.
   /* socket.on('prueba',(proyectos)=>{
        console.log("Prueba desde socket: "+proyectos);
    });
    socket.emit('respuesta',"Procesando...");*/
    socket.on('abrir proyecto',(proyecto)=>{
        socket.join(proyecto);
        
    });
});