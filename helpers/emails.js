import nodemailer from "nodemailer"
/*
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "be844875dab2dd",
      pass: "24787f6a9b096a"
    }
  });*/
  const emailRegistro= async (datos)=>{
   // console.log("Desde email registros:",datos);
    const {email,nombre,token}=datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT ,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Email Information
      const info=await transport.sendMail({
        from:'"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
        to:email,
        subject:"UpTask - Confirm your account",
        text:"Confirm your account un UpTask",
        html:`
        <p>Hola: ${nombre} confirm your account in UpTask</p>
        <p>Your account is so close to be finished. You have to click on the following link</p>
        <a href="${process.env.FRONT_END_URL}/confirmar/${token}">Account Confirm</a>
        `
      });
  }
  const correoOlvidePassword=async(datos)=>{
    const {email,nombre,token}=datos;

    
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT ,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info=await transport.sendMail({
      from:'"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
      to:email,
      subject:"UpTask - Instructios to reset the password",
      text:"Reconfirm your password",
      html:`
      <p>Hello: ${nombre} , you are requested re confirm your password</p>
      <p>You have to click on the following link</p>
      <a href="${process.env.FRONT_END_URL}/olvide-password/${token}">Reset Password</a>
      <p>Wether you didn't request a reset password, ignore this email</p>
      `
    });

  }
  export {emailRegistro,correoOlvidePassword}