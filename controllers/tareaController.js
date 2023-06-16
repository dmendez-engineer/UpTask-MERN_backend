import Proyecto from '../models/Proyecto.js';
import Tarea from './../models/Tarea.js';


const agregarTarea=async(req,res)=>{
        const tareaNueva=new Tarea(req.body);
        const {proyecto}=req.body;
    
        const existeProyecto=await Proyecto.findById(proyecto);

        if(!existeProyecto){
            const error= new Error("El proyecto no existe");
            return res.status(404).json({msg:error.message});
        }

        if(existeProyecto.creador.toString()!==req.usuario._id.toString()){
            const error= new Error("No tiene los permisos para añadir tareas");
            return res.status(404).json({msg:error.message});
        }

        try{
            //const tareaAgregada=await tareaNueva.save();
            const tareaAgregada=await Tarea.create(req.body);
            existeProyecto.tareas.push(tareaAgregada._id);
            await existeProyecto.save();
            return res.json(tareaAgregada);
            //return res.json({msg:"Tarea agregada exitosamente"});
        }catch(error){
            console.log("Erro: ",error);
            const errorMessage= new Error("Hubo error en la inserción de la tarea");
            return res.json({msg:errorMessage.message});
        }
        

}

const obtenerTarea=async(req,res)=>{

    const idProyecto=req.params.id;
 
    const existeProyecto=await Proyecto.findById(idProyecto);

    if(!existeProyecto){
        const error= new Error("El proyecto no existe");
        return res.status(404).json({msg:error.message});
    }
    if(existeProyecto.creador.toString()!==req.usuario._id.toString()){
        const error= new Error("No tiene los permisos para ver tareas de este proyecto");
        return res.status(403).json({msg:error.message});
    }


    
    //const tareas=await Tarea.findById(id).populate('proyecto');
   const tareas= await Tarea.find().where('proyecto').equals(existeProyecto._id);
    

        

    if(!tareas){
        const error= new Error("Tarea NO encontrada");
        return res.status(404).json({msg:error.message});
    }
    return res.json(tareas);

}

const actualizarTarea=async(req,res)=>{
    //const tarea= new Tarea();
   // tarea=await Tarea.find().where('proyecto').equals(req.params.id);

    const {id}=req.params;
    
    const tarea=await Tarea.findById(id).populate('proyecto');
   
   
   

        if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()){
            const error= new Error("No tiene los permisos para ver tareas de este proyecto");
            return res.status(403).json({msg:error.message});
        }

    if(!tarea){
        const error= new Error("Tarea NO encontrada");
        return res.status(404).json({msg:error.message});
    }
    tarea.nombre=req.body.nombre || tarea.nombre;
    tarea.descripcion=req.body.descripcion || tarea.descripcion;
    tarea.prioridad=req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega=req.body.fechaEntrega || tarea.fechaEntrega;

   // console.log("INFORMACION DE LA TAAREA desde el BODY: ",req.body);
   

    try{
        const tareaActualizada= await tarea.save();
        return res.json(tareaActualizada);
    }catch(error){
        console.log("Erro: ",error);
        const errorMessage= new Error("Hubo error en la actualizacion de la tarea");
        return res.json({msg:errorMessage.message});
    }


    
}

const eliminarTarea=async(req,res)=>{

    const {id}=req.params;
    
    const tarea=await Tarea.findById(id).populate('proyecto');
    const tareaEliminada=tarea;
    console.log("TAREAS: ",tarea);
   

        if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()){
            const error= new Error("No tiene los permisos para ver tareas de este proyecto");
            return res.status(403).json({msg:error.message});
        }

    if(!tarea){
        const error= new Error("Tarea NO encontrada");
        return res.status(404).json({msg:error.message});
    }
    try{
        const proyecto=await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id);

      
        
        await Promise.allSettled([await proyecto.save(),await tarea.deleteOne()]); // it allows the both await begins at the same time
        
        return res.json({msg:"Eliminación exitosa"});

    }catch(error){
        console.log("Erro: ",error);
        const errorMessage= new Error("Hubo error en la actualizacion de la tarea");
        return res.json({msg:errorMessage.message});
    }
  
}

const cambiarEstadoTarea=async(req,res)=>{

    const {id}=req.params;
    
    const tarea=await Tarea.findById(id).populate('proyecto');

   
    if(!tarea){
        const error= new Error("Tarea NO encontrada");
        return res.status(404).json({msg:error.message});
    }
    if(tarea.proyecto.creador.toString()!==req.usuario._id.toString()
    && !tarea.proyecto.colaboradores.some(c=>c._id.toString()===req.usuario._id.toString())){
        const error= new Error("No tiene los permisos para ver tareas de este proyecto");
        return res.status(403).json({msg:error.message});
    }

    tarea.estado=!tarea.estado;
    tarea.completeBy=req.usuario._id;

   await tarea.save();

   const tareaAlmacenada=await Tarea.findById(id).populate('proyecto').populate('completeBy');
   return res.json(tareaAlmacenada);
}

export {
    agregarTarea,obtenerTarea,actualizarTarea,eliminarTarea,cambiarEstadoTarea
}