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

};

