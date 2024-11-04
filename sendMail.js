const nodemailer = require('nodemailer');
console.log("test");

// Créez un transporteur de votre choix
let transporter = nodemailer.createTransport({
    service: 'gmail', // Par exemple, utilisez Gmail
    auth: {
        user: 'fops415@gmail.com', // Remplacez par votre adresse email
        pass: 'wzrq uhqj iekx irpn' // Remplacez par votre mot de passe ou un mot de passe d'application
    }
});

// Fonction pour envoyer l'email
function sendEmail(commitMessage) {
    const mailOptions = {
        from: 'fops415@gmail.com',
        to: 'fops3868@gmail.com', // Remplacez par l'adresse du destinataire
        subject: 'Nouveau Commit',
        text: `Un nouveau commit a été effectué : ${commitMessage}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Erreur : ' + error);
        }
        console.log('Email envoyé : ' + info.response);
    });
}

// Récupérer le message du dernier commit
const exec = require('child_process').exec;
exec('git log -1 --pretty=%B', (err, stdout) => {
    if (err) {
        console.error(err);
        return;
    }
    sendEmail(stdout.trim());
});