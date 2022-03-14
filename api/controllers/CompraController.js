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
        let elementos = await CarroCompra.find({ cliente: req.session.cliente.id}).populate('foto')
        res.view('pages/carro_de_compra', {elementos})
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

    
};

