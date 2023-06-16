import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth= async (req,res,next)=>{
    
    let token;
    if(req.headers.authorization){
        try{
            token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
           // console.log("BACKEND");
            //It adds a new attribute (usuario) on req automatically
            req.usuario=await Usuario.findById(decoded.id);//.select("-confirmado -token -createAt updatedAt -__v");//Para no traer este campo

            return next();
        }catch(error){
            //console.log("Error en verificar el token: ",error);
            return res.status(404).json({msg:"Error en verificar el token: "+error});
        }
    }

    if(!token){
        const error= new Error("Token no valido");
       return res.status(401).json({msg:error.message});
    }

    next();
}
export default checkAuth;