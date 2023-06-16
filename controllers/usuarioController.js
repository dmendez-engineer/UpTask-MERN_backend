import {emailRegistro,correoOlvidePassword} from "../helpers/emails.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";



/*const usuarios=(req,res)=>{
    res.json({msg:"Desde api con Controller"});
};
const crearUsuario=(req,res)=>{
    res.json({msg:"Creando usuario..."});
}

const actualizarUsuario=(req,res)=>{
    res.json({msg:"Actualizando usuario"});
}*/


const registrarUsuarios= async (req,res)=>{
    
    const {email}=req.body;

// npm i bcrypt => to implement tha password HASH or password encryption

    const existeUsuario= await Usuario.findOne({email:email});

    if(existeUsuario){
        const error= new Error("Usuario ya registrado");
        return res.status(403).json({msg:error.message});
    }

    try{
        const usuario= new Usuario(req.body);
        usuario.token=generarId();
        await usuario.save();

        //Send the confirmation email
        emailRegistro({
            email:usuario.email,
            nombre:usuario.nombre,
            token:usuario.token
        });

        res.json({msg:'Usuario creado correctamente'});
    

    }catch(error){
        console.log("ERROR: ",error.response);
    }

   
}

const autenticar=async (req,res)=>{
    
    //Comprobar que el usuario existe
     const {email,password}=req.body;

     const usuarioLogin= await Usuario.findOne({email:email});
    if(!usuarioLogin){
        const error= new Error("El usuario no existe");
        return res.status(400).json({msg:error.message});
    }

    //Comprobar si el usuario está confirmado
    if(!usuarioLogin.confirmado){
        const error= new Error("Tú cuenta no está confirmado");
        return res.status(403).json({msg:error.message});
    }


    //Comprobar el password
    if(await usuarioLogin.comprobarPassword(password)){
       console.log("USUARIO COMPROBADO",usuarioLogin);
        res.json({
            _id:usuarioLogin._id,
            nombre:usuarioLogin.nombre,
            email:email,
            token:generarJWT(usuarioLogin._id)
        });
    }else{
        const error= new Error("Contraseña incorrecta");
        return res.status(403).json({msg:error.message});
    }
}

const confirmar= async  (req,res)=>{
  //  console.log("Routing dinánmico",req.params.token);//EL NOMBRE TOKEN que asigné en la URL en el ROUTE
    const {token}=req.params;

    const usuarioConfirmar=await Usuario.findOne({token:token});

    if(!usuarioConfirmar){
        const error= new Error("TOKEN no válido");
        return res.status(403).json({msg:error.message});
    }
    try{
      
        usuarioConfirmar.confirmado=true;
        usuarioConfirmar.token="";
       
        await usuarioConfirmar.save();
        res.json({msg:"Usuario confirmado correctamente"});

    }catch(error){
        console.log("ERROR: ",error);
    }


}
const olvidePassword=async (req,res)=>{

    const {email}=req.body;
   // console.log("EMAIL: ",email);
    const usuarioOlvidado=await Usuario.findOne({email:email});

    if(!usuarioOlvidado){
        const error= new Error("Email NO Registrado");
        return res.status(403).json({msg:error.message});
    }
    try{
        usuarioOlvidado.token=generarId();
        await usuarioOlvidado.save();
        res.json({msg:"Hemos enviados un email con las instrucciones"});
        correoOlvidePassword({
            email:usuarioOlvidado.email,
            nombre:usuarioOlvidado.nombre,
            token:usuarioOlvidado.token
        });
       
    }catch(err){
        console.log("ERROR: ",err);
    }
    

}
const comprobarToken=async (req,res)=>{
    const {token}=req.params;

    const comprobarUsuarioToken= await Usuario.findOne({token:token});

    if(!comprobarUsuarioToken){
       
        const error= new Error("Token no válido");
        return res.status(403).json({msg:error.message});
    }else{
        //Token valido
        res.json({msg:"Token válido y el usuario existe"});
      
    }

}
const nuevoPassword=async (req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const usuario=await Usuario.findOne({token:token});

    if(!usuario){
        const error= new Error("Token no válido");
        return res.status(403).json({msg:error.message});
    }

    usuario.password=password;
    usuario.token="";
    try{
        await usuario.save();
        res.json({msg:"Su contraseña fue actualizada"});
    }catch(err){
        console.log("Error: ",err);
    }
    

    
}
const perfil=async(req,res)=>{
    const {usuario}=req; //I can destructuring the new attribute that I added automatically in checkAuth.js
    res.json(usuario);
    console.log("Desde Perfil");
}
export {
registrarUsuarios,autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil
};