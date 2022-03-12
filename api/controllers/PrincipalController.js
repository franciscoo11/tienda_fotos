/**
 * PrincipalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    inicio: async (req,res) => {
        let fotos = await Foto.find({activa: true})
        res.view('pages/inicio', {fotos})
    },

};

