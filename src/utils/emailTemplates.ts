/**
 * Bohenix Enterprise Email Templates
 * Generates beautiful, responsive, branded HTML emails for the Bohenix Ecosystem.
 */

const COMPANY_NAME = "Bohenix Solutions";
const PRIMARY_COLOR = "#8B2EFF"; // Purple
const ACCENT_COLOR = "#00E5FF"; // Cyan
const BG_DARK = "#0a0a0a";
const TEXT_LIGHT = "#f3f4f6";
const TEXT_MUTED = "#9ca3af";
const LOGO_URL = "https://bohenix.africa/logo.png"; // Fallback URL or generic
const WEBSITE_URL = "https://bohenix.africa";

// Base HTML Wrapper
const wrapHTML = (content: string, preheader: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${BG_DARK}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${TEXT_LIGHT}; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; background: linear-gradient(135deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .content { padding: 40px 20px; background-color: #111111; border-radius: 0 0 12px 12px; line-height: 1.6; font-size: 16px; }
    .content h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
    .footer { padding: 30px 20px; text-align: center; font-size: 13px; color: ${TEXT_MUTED}; }
    .footer a { color: ${ACCENT_COLOR}; text-decoration: none; }
    .btn { display: inline-block; padding: 12px 24px; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .data-table td:first-child { width: 35%; color: ${TEXT_MUTED}; font-weight: 500; }
  </style>
</head>
<body>
  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  
  <div class="container">
    <div class="header" style="background-color: #111111; border-radius: 12px 12px 0 0;">
      <h1>BOHENIX<span style="font-weight:300; color: #fff;"> ONE</span></h1>
    </div>
    
    <div class="content">
      ${content}
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
      <p>
        <a href="${WEBSITE_URL}">bohenix.africa</a> &bull; 
        <a href="https://x.com/bohenix_solutio">X (Twitter)</a> &bull; 
        <a href="https://www.linkedin.com/company/bohenix">LinkedIn</a>
      </p>
      <p style="font-size: 11px; margin-top: 20px; opacity: 0.7;">
        This email was sent from a notification-only address. For support, please contact <a href="mailto:support@bohenix.africa">support@bohenix.africa</a>.
        <br>CONFIDENTIALITY NOTICE: This email and any attachments are confidential.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const getContactConfirmationTemplate = (name: string) => {
  const content = `
    <h2>Inquiry Received</h2>
    <p>Hi ${name ? name : 'there'},</p>
    <p>Thank you for reaching out to <strong>Bohenix Solutions</strong>. We have successfully received your message and our team will review it shortly.</p>
    <p>If your request is urgent, please reply directly to this email with additional details.</p>
    <br/>
    <p>Best regards,<br/><strong>The Bohenix Team</strong></p>
  `;
  return wrapHTML(content, "We've received your message at Bohenix.", "Inquiry Received - Bohenix");
};

export const getSupportTicketTemplate = (ticketNumber: string, issue: string) => {
  const content = `
    <h2>Support Ticket Created</h2>
    <p>We've received your request for support and created a ticket for you.</p>
    <table class="data-table">
      <tr><td>Ticket ID:</td><td><strong style="color:${ACCENT_COLOR}">#${ticketNumber}</strong></td></tr>
      <tr><td>Status:</td><td>Open / Pending Review</td></tr>
      <tr><td>Issue:</td><td>${issue.substring(0, 50)}${issue.length > 50 ? '...' : ''}</td></tr>
    </table>
    <p>Our engineering and support team has been notified and will be with you as soon as possible. Please keep this ticket number for your records.</p>
    <a href="${WEBSITE_URL}/dashboard" class="btn">View Status in Dashboard</a>
  `;
  return wrapHTML(content, `Support Ticket #${ticketNumber} has been created.`, "Support Ticket Created");
};

export const getJobApplicationTemplate = (position: string) => {
  const content = `
    <h2>Application Received</h2>
    <p>Thank you for applying for the <strong>${position}</strong> role at Bohenix Solutions.</p>
    <p>Our talent acquisition team has received your application and will review your profile. If your skills align with our current needs, we will be in touch regarding the next steps.</p>
    <p>We appreciate your interest in joining the Bohenix ecosystem and helping us build the future.</p>
    <br/>
    <p>Best regards,<br/><strong>Bohenix Talent Acquisition</strong></p>
  `;
  return wrapHTML(content, `We've received your application for the ${position} role.`, "Application Received - Bohenix");
};

export const getInternalAlertTemplate = (eventContext: string, details: any) => {
  let detailsHTML = '<table class="data-table">';
  for (const [key, value] of Object.entries(details)) {
    detailsHTML += `<tr><td>${key}:</td><td>${value}</td></tr>`;
  }
  detailsHTML += '</table>';

  const content = `
    <h2 style="color: ${PRIMARY_COLOR}">System Alert / Notification</h2>
    <p><strong>Context:</strong> ${eventContext}</p>
    ${detailsHTML}
    <p style="font-size: 13px; color: ${TEXT_MUTED}">Generated automatically by Bohenix ONE System Engine.</p>
  `;
  return wrapHTML(content, `System Alert: ${eventContext}`, "Internal System Alert");
};

export const getSignatureHTML = (department: string, email: string) => `
  <div style="font-family: Arial, sans-serif; font-size: 13px; color: #555; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
    <strong style="color: #111;">${COMPANY_NAME}</strong><br/>
    <span style="color: #8B2EFF; font-weight: 600;">${department}</span><br/>
    <a href="mailto:${email}" style="color: #00E5FF; text-decoration: none;">${email}</a> | <a href="${WEBSITE_URL}" style="color: #555; text-decoration: none;">bohenix.africa</a>
  </div>
`;

export const getWelcomeEmailTemplate = (name: string) => {
  const content = `
    <h2>Welcome to the Bohenix Ecosystem</h2>
    <p>Hi ${name},</p>
    <p>Your account has been successfully created. You now have access to the entire Bohenix ONE platform, including our suite of AI-powered applications built for Africa.</p>
    <table class="data-table">
      <tr><td>Platform:</td><td>Bohenix ONE</td></tr>
      <tr><td>Status:</td><td><strong style="color: #00C853;">Active</strong></td></tr>
    </table>
    <p>Here's what you can explore:</p>
    <ul style="padding-left: 20px; color: ${TEXT_MUTED};">
      <li><strong style="color: #fff;">Mboka</strong> — AI Job Matching for Skilled Labour</li>
      <li><strong style="color: #fff;">Vuna</strong> — AI-Powered Agricultural Commerce</li>
      <li><strong style="color: #fff;">Safura</strong> — Autonomous Food Scanner & Diet Planner</li>
      <li><strong style="color: #fff;">NjiaSafe</strong> — Road Safety Intelligence</li>
      <li><strong style="color: #fff;">Fixxo</strong> — On-Demand Repair Services</li>
    </ul>
    <a href="${WEBSITE_URL}/dashboard" class="btn">Open Dashboard</a>
    <br/><br/>
    <p>Best regards,<br/><strong>The Bohenix Team</strong></p>
  `;
  return wrapHTML(content, `Welcome to Bohenix, ${name}!`, "Welcome to Bohenix ONE");
};

export const getLoginAlertTemplate = (name: string, ip: string, timestamp: string) => {
  const content = `
    <h2>New Sign-In Detected</h2>
    <p>Hi ${name},</p>
    <p>We detected a new sign-in to your Bohenix account. If this was you, no action is needed.</p>
    <table class="data-table">
      <tr><td>Time:</td><td>${timestamp}</td></tr>
      <tr><td>IP Address:</td><td><code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${ip}</code></td></tr>
    </table>
    <p style="color: ${TEXT_MUTED};">If you did not sign in, please secure your account immediately by changing your password.</p>
    <a href="mailto:support@bohenix.africa" class="btn" style="background-color: #FF3D00;">Report Suspicious Activity</a>
  `;
  return wrapHTML(content, "A new sign-in was detected on your Bohenix account.", "Security Alert - New Sign-In");
};

export const getSecurityAlertTemplate = (name: string, eventType: string, details: string) => {
  const content = `
    <h2 style="color: #FF3D00;">Security Alert</h2>
    <p>Hi ${name},</p>
    <p>A security event was triggered on your Bohenix account:</p>
    <table class="data-table">
      <tr><td>Event:</td><td><strong style="color: #FF3D00;">${eventType}</strong></td></tr>
      <tr><td>Details:</td><td>${details}</td></tr>
      <tr><td>Time:</td><td>${new Date().toISOString()}</td></tr>
    </table>
    <p>If you did not initiate this action, please contact our support team immediately.</p>
    <a href="mailto:support@bohenix.africa" class="btn" style="background-color: #FF3D00;">Contact Support</a>
  `;
  return wrapHTML(content, `Security Alert: ${eventType}`, "Bohenix Security Alert");
};

