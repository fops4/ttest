require('dotenv').config();  // Charger les variables d’environnement
const nodemailer = require('nodemailer');
const { execSync } = require('child_process');
const axios = require('axios');

// Clé API pour l'API Gemini (récupérée depuis le fichier .env)
const geminiApiKey = process.env.GEMINI_API_KEY;

// Fonction pour récupérer l'utilisateur et le message de commit
function getCommitInfo() {
  const user = execSync('git config user.name').toString().trim();
  const email = execSync('git config user.email').toString().trim();
  const message = execSync('git log -1 --pretty=%B').toString().trim();
  const changes = execSync('git show -1').toString().trim(); // Affiche les modifications du commit
  return { user, email, message, changes };
}

// Fonction pour obtenir les suggestions de Gemini
async function getGeminiSuggestions(changes) {
  try {
    const response = await axios.post(
      'https://ai.google.dev/competition/projects/store-analyzer',
      { changes },
      {
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,  // Inclure la clé API dans l'en-tête
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.suggestions || 'Aucune suggestion disponible';
  } catch (error) {
    console.error('Erreur lors de l\'analyse avec Gemini:', error);
    return 'Erreur lors de l\'analyse des suggestions.';
  }
}

// Fonction pour envoyer l'e-mail avec les suggestions
async function sendEmail(commitInfo, suggestions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fops415@gmail.com',
        pass: 'wzrq uhqj iekx irpn'
    }
  });

  const mailOptions = {
    from: '"Notifier de Commit" <fops415@gmail.com>',
    to: commitInfo.email,
    subject: `Suggestions pour votre commit: ${commitInfo.message}`,
    text: `Bonjour ${commitInfo.user},\n\nVous avez effectué un nouveau commit avec le message:\n"${commitInfo.message}"\n\nSuggestions de Gemini :\n${suggestions}\n\nMerci !`,
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
  const commitInfo = getCommitInfo();
  const suggestions = await getGeminiSuggestions(commitInfo.changes);
  await sendEmail(commitInfo, suggestions);
}

main();
