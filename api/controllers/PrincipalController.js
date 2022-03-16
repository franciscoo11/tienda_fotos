/**
 * PrincipalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    inicio: async (req,res) => {
      let fotos = await Foto.find({activa: true})
      res.view('pages/inicio', { fotos })
    },

    topVendidas: async (req, res) => {

      let consulta = `
      SELECT
        titulo,
        contenido,
        COUNT ( * ) AS cantidad
      FROM
        orden_detalle
        INNER JOIN foto ON orden_detalle.foto_id = foto.ID
      GROUP BY
        titulo, contenido, foto_id
      ORDER BY
      COUNT ( * ) DESC
      LIMIT 10
      `

      await OrdenDetalle.getDatastore().sendNativeQuery(consulta, [], (errores, resultado) => {
        if (errores) {
          return res.serverError(errores);
        }
        let fotos = resultado.rows
        res.view('pages/top_vendidas', { fotos })
      })
    }
    

};
  