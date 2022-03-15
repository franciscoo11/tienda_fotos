/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path')
const fs = require('fs')

module.exports = {

    inicioSesion: async (req,res) => {
        res.view('pages/admin/inicio_sesion')
    },

    procesarInicioSesion: async (req,res) => {
        let admin = await Admin.findOne({ email: req.body.email, contrasena: req.body.contrasena })
        if (admin) {
            req.session.admin = admin
            req.session.cliente = undefined
            req.addFlash('mensaje', 'Sesion de admin iniciada')
            return res.redirect('/admin/principal')
        }
        else {
            req.addFlash('mensaje', 'Email o contraseña invalidas.')
            return res.redirect('/admin/inicio-sesion');
        }
    },

    principal: async (req,res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesion invalida')
            return res.redirect('/admin/inicio-sesion')
        }
        let fotos = await Foto.find().sort('id')
        res.view('pages/admin/principal', {fotos})
    },

    cerrarSesion: async (req,res) => {
        req.session.admin = undefined
        req.addFlash('mensaje', 'Sesion finalizada')
        return res.redirect('/');
    },

    agregarFoto: async (req,res) => {
        res.view('pages/admin/agregar_foto')
    },
  
    procesarAgregarFoto: async (req,res) => {
        let foto = await Foto.create({
            titulo: req.body.titulo,
            activa: true
        }).fetch()

        req.file('foto').upload({}, async (error,files) => {
            if (files && files[0]){

                let upload_path = files[0].fd 
                let ext = path.extname(upload_path)

                await fs.createReadStream(upload_path).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/fotos/${foto.id}${ext}`)))
                await Foto.update({ id : foto.id}, { contenido: `${foto.id}${ext}`, activa: true })
                req.addFlash('mensaje', 'Foto agregada')
                return res.redirect('/admin/principal')
            }

            req.addFlash('mensaje', 'No hay foto seleccionada')
            return res.redirect('/admin/agregar-foto')

        })
    },

    desactivarFoto: async (req, res) => {
        await Foto.update({id: req.params.fotoId}, {activa: false})
        req.addFlash('mensaje', 'Foto desactivada')
        return res.redirect("/admin/principal")
    },
    
    activarFoto: async (req, res) => {
        await Foto.update({id: req.params.fotoId}, {activa: true})
        req.addFlash('mensaje', 'Foto activada')
        return res.redirect("/admin/principal")
    },

    mostrarClientes: async(req, res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesión inválida')
            return res.redirect("/admin/inicio-sesion")
        }
        let clientes = await Cliente.find({})
        res.view('pages/admin/clientes', {
            clientes
        })
    },

    misOrdenes: async(req, res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesión inválida')
            return res.redirect("/admin/inicio-sesion")
        }
        let clienteId = req.params.clienteId;
        //let ordenId = peticion.params.ordenId;
        let ordenes = await Orden.find({
            cliente: clienteId
        }).sort('id desc')
        res.view('pages/admin/mis_ordenes', {
            ordenes
        })
    },

    ordenDeCompra: async(req, res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesión inválida')
            return res.redirect("/admin/inicio-sesion")
        }

        let ordenId = req.params.ordenId;

        let orden = await Orden.findOne({
            //cliente: peticion.session.cliente.id,
            id: ordenId
        }).populate('detalles')

        if (!orden) {
            return res.redirect("pages/admin/clientes")
        }

        if (orden && orden.detalles == 0) {
            return res.view('pages/admin/clientes', {
                orden
            })
        }

        orden.detalles = await OrdenDetalle.find({
            orden: orden.id
        }).populate('foto')
        return res.view('pages/admin/orden', {
            orden
        })
    },

    desactivarCliente: async(req, res) => {
        await Cliente.update({
            id: req.params.clienteId
        }, {
            activo: false
        })

        req.addFlash('mensaje', 'Cliente desactivado')
        return res.redirect("/admin/clientes")
    },

    activarCliente: async(req, res) => {
        await Cliente.update({
            id: req.params.clienteId
        }, {
            activo: true
        })
        req.addFlash('mensaje', 'Cliente activado')
        return res.redirect("/admin/clientes")
    },

    mostrarAdministradores: async(req, res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesión inválida')
            return res.redirect("/admin/inicio-sesion")
        }
        let administradores = await Admin.find({})

        res.view('pages/admin/administradores', {
            administradores
        })
    },

    desactivarAdmin: async(req, res) => {
        //console.log('Admin disabled', peticion.params.adminId)
        if (req.session.admin.id == req.params.adminId) {
            req.addFlash('mensaje', 'No puedes desactivarte a ti mismo!')
        } else {
            await Admin.update({
                id: req.params.adminId
            }, {
                activo: false
            })
            req.addFlash('mensaje', 'Administrador desactivado')
        }
        return res.redirect("/admin/administradores")
    },

    activarAdmin: async(req, res) => {
        await Admin.update({
            id: req.params.adminId
        }, {
            activo: true
        })
        req.addFlash('mensaje', 'Administrador activado')
        return res.redirect("/admin/administradores")
    },

    dashboard: async(req, res) => {
        if (!req.session || !req.session.admin) {
            req.addFlash('mensaje', 'Sesión inválida')
            return res.redirect("/admin/inicio-sesion")
        }
        let consulta = `
          select 'clientes'
          as tipo, count( * ) total from cliente
          union
          select 'Fotos', count( * ) from foto
          union
          select 'Administradores', count( * ) from admin
          union
          select 'Ordenes', count( * ) from orden
        `
        await Cliente.getDatastore().sendNativeQuery(consulta, [], (errores, resultado) => {
            if (errores) return res.serverError(errores);
            let total = resultado.rows

            res.view("pages/admin/dashboard", {
                total
            })
        })
    }


};

