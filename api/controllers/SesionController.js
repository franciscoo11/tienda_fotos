/**
 * SesionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  registro: async (req,res) => {
      res.view('pages/registro')
  },

  procesarRegistro: async (req,res) => {
    let cliente = await Cliente.findOne({email: req.body.email});
    if (cliente){
      req.addFlash('mensaje', 'Email duplicado')
      return res.redirect('/registro')
    }
    else {
      let cliente = await Cliente.create({
        email: req.body.email,
        nombre: req.body.nombre,
        contrasena: req.body.contrasena,
        activo: true
      })
      req.session.cliente = cliente;
      req.addFlash('mensaje', 'Cliente registrado')
      return res.redirect('/');
    }
  
  },

  inicioSesion: async (req,res) => {
    res.view('pages/inicio_sesion')
  },

  procesarInicioSesion: async (req,res) => {
    let cliente = await Cliente.findOne({ email: req.body.email, contrasena: req.body.contrasena });
    if (cliente) {
        if (cliente.activo) {
          req.session.cliente = cliente
          let carroCompra = await CarroCompra.find({ cliente: cliente.id })
          req.session.carroCompra = carroCompra
          req.addFlash('mensaje', 'Sesión iniciada')
          return res.redirect("/")
        } 
        else {
          req.addFlash('mensaje', 'Cliente desactivado')
          return res.redirect("/inicio-sesion");
        }
    } 
    else {
      req.addFlash('mensaje', 'Email o contraseña invalidos')
      return res.redirect("/inicio-sesion");
    }
  },

  cerrarSesion: async (req, res) => {
    req.session.cliente = undefined;
    req.addFlash('mensaje', 'Sesión finalizada')
    return res.redirect("/");
  },

  
};

