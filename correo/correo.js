const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

function sendCorreo(email,id) {
  return new Promise(function(resolve,reject){  
    console.log("envio correo")
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "casaarmielalto@gmail.com", // generated ethereal user
        pass: "ablgaxgarditblys", // generated ethereal password
      },
    });
    
    const token = jwt.sign({"id":id},"123",{expiresIn:60*60*24,});// expires in 24 hours
    let html = 
    `<div>
      <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
      <a href="http://localhost:80/formPasword/${token}" target="_blank">Crear Contraseña</a>
    </div>
    `
    transporter.sendMail({
      from: '"nombre remitente" <casaarmielalto@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "saludos", // Subject line
      html: html, // html body
    }).then((info)=>{
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log("Message sent: %s", info);
      resolve(true)
    })
  })
}

exports.sendCorreo = sendCorreo