import express from "express";

//import {usuarios,crearUsuario,actualizarUsuario} from "../controllers/usuarioController.js";
import {registrarUsuarios,autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router=express.Router();
/*
router.get("/",usuarios);

router.post("/",crearUsuario);

router.put("/",actualizarUsuario);*/

router.post("/",registrarUsuarios)

router.post("/login",autenticar);
router.get("/confirmar/:token",confirmar)//Routing dinámico
router.post("/olvide-password",olvidePassword);
//router.get("/olvide-password/:token",comprobarToken);
//router.post("/olvide-password/:token",nuevoPassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil",checkAuth,perfil);


export default router;