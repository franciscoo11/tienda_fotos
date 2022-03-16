# tienda-fotos

a [Sails v1](https://sailsjs.com) application


### Links

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Fri Mar 11 2022 16:50:53 GMT-0300 (hora estándar de Argentina) using Sails v1.5.2.

<!-- Internally, Sails used [`sails-generate@2.0.6`](https://github.com/balderdashy/sails-generate/tree/v2.0.6/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

### EXPECTATIVAS DE ENTREGA PROYECTO FINAL

Te damos la bienvenida a la última parte de nuestra navegación por Sails! Reconocemos que has realizado un excelente trabajo y a continuación tienes la oportunidad para demostrate a ti mismo qué tanto conoces sobre este framework.

El sitio de Fotos está a punto de ser lanzado. Tu misión es ampliar el subsistema administrativo para porporcionar una mayor cantidad de funcionalidades. Crearemos un menú más completo para los administradores que incluye los siguientes enlaces: 

    Principal (Enlaza a lá página ya existente “/admin/principal”)
    Clientes
    Administradores
    Dashboard

Para ello completa los siguentes requerimientos relacionados a dicho subsistema:

    Clientes: al cliquear este elemento se despliega la lista de todos los clientes del sitio. Desde esta página puedes ejecutar las acciones a continuación:

        Al hacer clic sobre un cliente verás las órdenes del cliente
            Una vez que haces clic en la orden verás las fotos
        Activar o desactivar un cliente, donde un usuario desactivado no puede iniciar sesión.

    Administradores: al cliquear este elemento aparecen todos los administradores del sitio. Desde esta página puedes activar o desactivar un administrador (un administrador no se puede desactivar a sí mismo).
    Dashboard: al cliquear este elemento se despliega la cantidad total de clientes, la cantidad total de fotos, la cantidad total de administradores y la cantidad total de órdenes.
