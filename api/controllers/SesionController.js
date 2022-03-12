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
        contrasena: req.body.contrasena
      })
      req.session.cliente = cliente;
      return res.redirect('/');
    }
  
  },

  inicioSesion: async (req,res) => {
    res.view('pages/inicio_sesion')
  }

  
};

