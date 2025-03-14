const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

/*(async () => {
    const { default: hbs } = await import('nodemailer-express-handlebars');

    const transport = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    });
    
     // Configure Handlebars options
    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve('./views/emails'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/emails'),
        extName: '.handlebars',
    };

    // Use Handlebars with Nodemailer
    transport.use('compile', hbs(handlebarOptions));

    exports.enviar = async (opciones) => {
        const opcionesEmail = {
            from: 'devJobs <noreplay@devjobs.com>',
            to: opciones.user.email,
            subject: opciones.subject,
            template: opciones.archivo,
            context: {
                resetUrl: opciones.resetUrl
            }
        }
    
        const sendMail = util.promisify(transport.sendMail, transport);
        return sendMail.call(transport, opcionesEmail);
    };
})();*/

let transport = nodemailer.createTransport({
    host : emailConfig.host,
    port : emailConfig.port,
    auth: {
        user : emailConfig.user,
        pass: emailConfig.pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: 'handlebars',
        partialsDir: __dirname+'/../views/emails',
        layoutsDir: __dirname+'/../views/emails',
        defaultLayout: 'reset.handlebars'
    },
    viewPath: __dirname+'/../views/emails',
    extName : '.handlebars'
}));

exports.enviar = async (opciones) => {

    const opcionesEmail = {
        from:'devJobs <noreply@devjobs.com',
        to: opciones.user.email,
        subject : opciones.subject, 
        template: opciones.archivo,
        context: {
            resetUrl : opciones.resetUrl
        },
    };

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail);
}
