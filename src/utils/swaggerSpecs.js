import swaggerJSDOC from "swagger-jsdoc";
import { __dirname } from "./utils.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Coderhouse - Backend Course",
            version: "1.0.1",
            description: "**¡Bienvenido a la documentación de APIs para mi proyecto de eCommerce basado en Express y Node.js!**\n\n\nEste proyecto es un sistema de comercio electrónico (eCommerce) que utiliza tecnologías de Express y Node.js para proporcionar una plataforma robusta y escalable para la compra y venta de productos en línea.\n\n\nEste proyecto se ha desarrollado como parte de la **entrega final** del curso de **backend** de la carrera de 'Desarrollador Full Stack' en [Coderhouse](https://www.coderhouse.com/). Durante el curso, hemos aplicado conceptos y técnicas fundamentales de desarrollo backend para construir esta aplicación eCommerce desde cero.\n\n\n_El objetivo de esta documentación es proporcionar una guía completa y detallada sobre las APIs disponibles en mi proyecto._\n\n\n _Aquí encontrarás información sobre:_\n - _Los endpoints disponibles_\n - _Los parámetros de solicitud y respuesta_\n - _Ejemplos de uso para ayudarte a integrar y utilizar nuestras APIs de manera efectiva en tu aplicación cliente._\n\nLinks del proyecto:\n - [Project Repository](https://github.com/FrancoSantaCruz/Coderhouse-BackendCourse-3erPracticaDeIntegracion)\n - [Linkedin](https://www.linkedin.com/in/franco-santa-cruz/)\n - [Github Profile](https://github.com/FrancoSantaCruz)\n - [Email](mailto:sczfranco@gmail.com)\n\n\n\n.\n  ",
            contact: {
                email: "sczfranco@gmail.com"
            }
        },
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

export const swaggerSetup = swaggerJSDOC(swaggerOptions);