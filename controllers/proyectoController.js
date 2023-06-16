import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyecto=async (req,res)=>{

    const {id}=req.params;
    const proyecto=await Proyecto.findById(id).populate({path:'tareas',populate:{path:'completeBy'}})
    .populate('colaboradores',"nombre email");//With this, I will get the fields that I will work with

    if(!proyecto){
        return res.status(401).json({msg:"Este proyecto no existe"});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString() 
    && !proyecto.colaboradores.some(c=>c._id.toString()===req.usuario._id.toString())){
        return res.status(401).json({msg:"You don't have the permissions to see this project"});
    }
      //  const tareas=await Tarea.find().where('proyecto').equals(proyecto._id);
 //   const proyecto=await Proyecto.find().where("_id").equals(id);
    res.json(
        proyecto,
       /* tareas*/
    );
}
const obtenerProyectos=async (req,res)=>{

    //const proyectos= await Proyecto.find({creador:req.usuario._id});
    const proyectos= await Proyecto.find({
        '$or':[
            {'colaboradores':{$in:req.usuario}}, //This is a kind of where and thus, I can bring data with multiple where's
            {'creador':{$in:req.usuario}}        //By default, the operator is in $and so, I have to change the operator in $or
        ]
    });/*
    .where('creador')
    .equals(req.usuario);*/
 
   // const proyectosAux=await Proyecto.find().where('colaboradores').equals(req.usuario._id);

    if(!proyectos){
        return res.json({msg:"Este proyecto no existe"});
    }
    //const proyectos= await Proyecto.find();
    res.json(proyectos);
}
const obtenerTareas=async (req,res)=>{
    const {id}=req.params;

   // const tareas=await Tarea.find().where('proyecto').equals(req.proyecto);
    //res.json(tareas);
    res.json({msg:"Obteniendo tareas"});

}
const editarProyectos=async (req,res)=>{
    const {id}=req.params;
    const{nombre,cliente,descripcion,fechaEntrega}=req.body;
    const proyecto=await Proyecto.findById(id);
    


    if(!proyecto){
        return res.status(401).json({msg:"Este proyecto no existe"});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        return res.status(401).json({msg:"No tiene los permisos para actualizar este proyecto"});
    }
    proyecto.nombre=nombre || proyecto.nombre;
    proyecto.cliente=cliente || proyecto.cliente;
    proyecto.descripcion=descripcion || proyecto.descripcion;
    proyecto.fechaEntrega=fechaEntrega || proyecto.fechaEntrega;
  try{
    const proyectoActualizado=await proyecto.save();
    res.json(proyectoActualizado);
  }catch(error){
    console.log("ERROR:",error);
  }
    
}
const eliminarProyecto=async (req,res)=>{
    const {id}=req.params;
  
    const proyecto=await Proyecto.findById(id);
    


    if(!proyecto){
        return res.status(401).json({msg:"Este proyecto no existe"});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        return res.status(401).json({msg:"No tiene los permisos para actualizar este proyecto"});
    }
   

    try{
        await proyecto.deleteOne();
        res.json({msg:"Proyecto eliminado"});
      }catch(error){
        console.log("ERROR:",error);
      }
}
const agregarColaborador=async (req,res)=>{
       // const usuario=await Usuario.
       const {email}=req.body
       
       
       const{id}=req.params;

       const proyecto=await Proyecto.findById(id);
       if(!proyecto){
        const error= new Error("Proyecto no encontrado");
        return res.status(404).json({msg:error.message});
       }
       if(proyecto.creador.toString()!==req.usuario._id.toString()){
        const error= new Error("No tienes los permisos");
        return res.status(404).json({msg:error.message});
       }

       const usuario=await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');//FOr searching a user by one attribute "email"
       if(!usuario){
        const error= new Error("Usuario no encontrado");
       
        return res.status(404).json({msg:error.message});
        }
        if(proyecto.creador.toString()===usuario._id.toString()){
           
            const error= new Error("No se puede agregar como colaborador al creador");
            console.log(error.message);
            return res.status(404).json({msg:error.message});
        }
       
       
       /* const existeColaborador=proyecto.colaboradores.filter(c=>c._id===usuario._id?true:false);
        if(existeColaborador){
            const error= new Error("Este usuario ya está como colaborador");
            return res.status(404).json({msg:error.message});
        }*/
        if(proyecto.colaboradores.includes(usuario._id)){
            const error= new Error("Este usuario ya está como colaborador");
            return res.status(404).json({msg:error.message});
        }

       proyecto.colaboradores.push(usuario._id);
       await proyecto.save();
       
       res.status(202).json({msg:"Se agregó exitosamente el colaborador a este proyecto"});
    }
const buscarColaborador=async(req,res)=>{
   const {email}=req.body;
    //const usuario=await Usuario.find().where('email').equals(email);
    const usuario=await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');//FOr searching a user by one attribute "email"
    if(!usuario){
        const error= new Error("Usuario no encontrado");
       
        return res.status(404).json({msg:error.message});
    }
    
    res.json(usuario);
}
const eliminarColaborador=async (req,res)=>{
    const{id}=req.params;
    console.log(id,req.body.id);
       const proyecto=await Proyecto.findById(id);
      // const proyecto=await Proyecto.find().where('colaboradores').equals(id);
    
       if(!proyecto){
        const error= new Error("Proyecto no encontrado");
        return res.status(404).json({msg:error.message});
       }
       if(proyecto.creador.toString()!==req.usuario._id.toString()){
        const error= new Error("No tienes los permisos");
        return res.status(404).json({msg:error.message});
       }
       proyecto.colaboradores.pull(req.body.id);
       await proyecto.save();

       res.json({msg:'Se ha eliminado el colaborador correctamente'});
    }

const nuevoProyecto=async(req,res)=>{
    const nuevoProyecto= new Proyecto(req.body);
    
   /* 
    const nuevoProyecto= new Proyecto();
   const { nombre,descripcion,cliente}=req.body;
    nuevoProyecto.nombre=nombre;
    nuevoProyecto.descripcion=descripcion;
    nuevoProyecto.cliente=cliente;*/
    nuevoProyecto.creador=req.usuario._id;
    try{
        const proyectoAlmacenado=await nuevoProyecto.save();
        res.json(proyectoAlmacenado);
    }catch(err){
        console.log("Error: ",err);
    }
   
    
    return res.json({msg:"Proyecto agregado satisfactoriamente"});

}
export {obtenerProyecto,nuevoProyecto,obtenerProyectos,
    editarProyectos,eliminarProyecto,buscarColaborador,agregarColaborador,
    eliminarColaborador,obtenerTareas,}