import express from "express";
import {obtenerProyecto,nuevoProyecto,obtenerProyectos,editarProyectos,eliminarProyecto,buscarColaborador,agregarColaborador,eliminarColaborador,
    obtenerTareas} from "../controllers/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";

const routerProyecto=express.Router();

//routerProyecto.get("/",checkAuth,obtenerProyectos);
//routerProyecto.post("/",checkAuth,nuevoProyecto);

routerProyecto.route("/").get(checkAuth,obtenerProyectos).post(checkAuth,nuevoProyecto);
routerProyecto.route("/:id").get(checkAuth,obtenerProyecto).put(checkAuth,editarProyectos).delete(checkAuth,eliminarProyecto);


routerProyecto.get("/tareas/:id",checkAuth,obtenerTareas);

routerProyecto.post("/colaborador/:id",checkAuth,agregarColaborador);
routerProyecto.post("/eliminar-colaborador/:id",checkAuth,eliminarColaborador);
routerProyecto.post("/colaborador",checkAuth,buscarColaborador);
export default routerProyecto;