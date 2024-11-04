const nodemailer = require('nodemailer');
const axios = require('axios');
const { execSync } = require('child_process');

// Fonction pour récupérer l'utilisateur GitHub
// Fonction pour récupérer l'adresse e-mail et le nom d'utilisateur de Git localement
function getGithubUser() {
    try {
      const gitConfigUser = execSync('git config user.name').toString().trim();
      const gitConfigEmail = execSync('git config user.email').toString().trim();
      return { name: gitConfigUser, email: gitConfigEmail };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations Git:', error);
      return null;
    }
  }

// Fonction pour envoyer l'e-mail
async function sendEmail(commitMessage) {
  const user = await getGithubUser();
  if (!user) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fops415@gmail.com',
      pass: 'wzrq uhqj iekx irpn'
    }
  });

  const mailOptions = {
    from: '"Notifier de Commit" <fops415@gmail.com>',
    to: user.email, // Email de l'utilisateur GitHub
    subject: 'Nouveau Commit effectué',
    text: `Bonjour ${user.name},\n\nVous avez effectué un nouveau commit :\n\n"${commitMessage}"\n\nMerci !`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
  }
}

// Fonction principale
async function main() {
  const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
  await sendEmail(commitMessage);
}

main();
