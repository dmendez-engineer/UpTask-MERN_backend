import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarTarea,actualizarTarea,eliminarTarea,cambiarEstadoTarea, obtenerTarea} from "../controllers/tareaController.js"
const routerTarea=express.Router();


routerTarea.post("/",checkAuth,agregarTarea);

routerTarea.route("/:id").get(checkAuth,obtenerTarea).put(checkAuth,actualizarTarea).delete(checkAuth,eliminarTarea);

routerTarea.post("/estado/:id",checkAuth,cambiarEstadoTarea);


export default routerTarea;