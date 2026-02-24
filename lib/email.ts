import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;

export const resend = resendKey ? new Resend(resendKey) : null;

/**
 * Envoyer un email de confirmation de paiement
 * Optionnel si RESEND_API_KEY n'existe pas (fail gracefully)
 */
export async function sendProgramConfirmationEmail(
  userEmail: string,
  userName: string,
  tier: string,
  goal: string
) {
  if (!resend) {
    console.warn(
      "[EMAIL] RESEND_API_KEY not configured, skipping email notification"
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from: "THE FORGE <noreply@the-forge.com>",
      to: userEmail,
      subject: `✓ Ton programme ${tier} a été créé !`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6A00;">THE FORGE</h1>
          <h2>Bienvenue, ${userName || "Forger"} !</h2>
          
          <p>Ton programme <strong>${tier}</strong> vient d'être forgé avec succès.</p>
          
          <p><strong>Objectif :</strong> ${goal}</p>
          
          <p>Tu peux maintenant :</p>
          <ul>
            <li><a href="https://the-forge-two.vercel.app/account">Voir tes programmes</a></li>
            <li><a href="https://the-forge-two.vercel.app/account">Accéder à ton espace</a></li>
          </ul>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            © 2026 THE FORGE. Tous droits réservés.
          </p>
        </div>
      `
    });

    console.log(`[EMAIL] Confirmation sent to ${userEmail}`);
    return result;
  } catch (error) {
    console.error("[EMAIL] Failed to send confirmation:", error);
    // Don't throw - email is non-critical
  }
}
