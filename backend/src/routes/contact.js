const express  = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, email, mensaje, siteId } = req.body;

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const to   = process.env.EMAIL_TO   || 'marvix91@gmail.com';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error('❌ SMTP_USER o SMTP_PASS no configurados');
    return res.status(500).json({ error: 'Servicio de correo no configurado.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const siteName = siteId === 'fubono'
    ? 'Fundación Bosque Nuboso de Occidente'
    : 'Explore Occidente';

  try {
    await transporter.sendMail({
      from:    `"${siteName}" <${user}>`,
      to,
      replyTo: email,
      subject: `Nuevo mensaje de contacto – ${nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#2d6a4f">Nuevo mensaje de contacto</h2>
          <p><strong>Sitio:</strong> ${siteName}</p>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border:none;border-top:1px solid #eee"/>
          <p style="white-space:pre-wrap">${mensaje.replace(/</g, '&lt;')}</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('❌ Error enviando correo:', err.message);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Intente de nuevo.' });
  }
});

module.exports = router;
