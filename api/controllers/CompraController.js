/**
 * CompraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    agregarCarroCompra: async (req,res) => {
      let foto = await CarroCompra.findOne({foto : req.params.fotoId, cliente: req.session.cliente.id})
      if (foto) {
        req.addFlash('mensaje', 'La foto ya se había agregado en el carro.')
      }
      else {
        await CarroCompra.create({
          cliente: req.session.cliente.id,
          foto: req.params.fotoId
        })
        req.session.CarroCompra = await CarroCompra.find({ cliente: req.session.cliente.id })
        req.addFlash('mensaje', 'La foto agregadada en el carro de compra.')
      }
      return res.redirect('/')
    },

    carroCompra: async (req,res) => {
      if (!req.session || !req.session.cliente){
        return res.redirect('/')
      }
      let elementos = await CarroCompra.find({ cliente: req.session.cliente.id }).populate('foto')
      res.view('pages/carro_de_compra', { elementos })
    },

    eliminarCarroCompra: async (req,res) => {
      let foto = await CarroCompra.findOne({ foto : req.params.fotoId, cliente: req.session.cliente.id })
      if (foto) {
        await CarroCompra.destroy({
          cliente: req.session.cliente.id,
          foto: req.params.fotoId
        })
        req.session.CarroCompra = await CarroCompra.find({ cliente: req.session.cliente.id })
        req.addFlash('mensaje', 'Foto eliminada del carro de compra.')
      }
      return res.redirect('/carro-de-compra')
    },

    comprar: async (req, res) => {
      let orden = await Orden.create({
        fecha: new Date(),
        cliente: req.session.cliente.id,
        total: req.session.carroCompra.length
      }).fetch()
      for(let i=0; i< req.session.carroCompra.length; i++){
        await OrdenDetalle.create({
          orden: orden.id,
          foto: req.session.carroCompra[i].foto
        })
      }
      await CarroCompra.destroy({cliente: req.session.cliente.id})
      req.session.carroCompra = []
      req.addFlash('mensaje', 'La compra ha sido realizada')
      return res.redirect("/")
    },

    misOrdenes: async (req,res) => {
      if (!req.session || !req.session.cliente){
        return res.redirect('/')
      }
      let ordenes = await Orden.find({cliente : req.session.cliente.id }).sort('id desc')
      res.view('pages/mis_ordenes', {ordenes})
    },

    ordenDeCompra: async (req, res) => {
      if (!req.session || !req.session.cliente) {
        return res.redirect("/")
      }
      let orden = await Orden.findOne({ cliente: req.session.cliente.id, id: req.params.ordenId }).populate('detalles')
    
      if (!orden) {
        return res.redirect("/mis-ordenes")
      }
    
      if (orden && orden.detalles == 0) {
        return res.view('pages/orden', { orden })
      }

      orden.detalles = await OrdenDetalle.find({ orden: orden.id }).populate('foto')
      return res.view('pages/orden', { orden })
    },
    
};

