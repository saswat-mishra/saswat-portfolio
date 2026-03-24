/**
 * SASWAT MISHRA PORTFOLIO — Google Sheets Contact Form Handler
 * ============================================================
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (name it "Portfolio Leads" or similar)
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire file content and save (Ctrl+S)
 * 4. Click "Deploy" > "New deployment"
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize permissions
 * 6. Copy the Web app URL
 * 7. Add to your .env file as: VITE_GOOGLE_SCRIPT_URL=<your-url>
 * 8. Run: npm run build && npm run preview to test
 */

const SHEET_NAME = 'Leads'; // Tab name in your Google Sheet

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Company',
        'Project Type',
        'Budget',
        'Message',
        'Source'
      ]);

      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground('#030712');
      headerRange.setFontColor('#00ff41');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const params = e.parameter || {};

    sheet.appendRow([
      new Date().toISOString(),
      params.name || '',
      params.email || '',
      params.company || '',
      params.projectType || '',
      params.budget || '',
      params.message || '',
      'Portfolio Website'
    ]);

    // Send email notification to Saswat
    if (params.email && params.name) {
      try {
        MailApp.sendEmail({
          to: 'saswatmishra.iitd@gmail.com',
          subject: `🚀 New Portfolio Lead: ${params.name} — ${params.projectType || 'AI Project'}`,
          body: `
New contact from your portfolio website!

Name: ${params.name}
Email: ${params.email}
Company: ${params.company || 'Not provided'}
Project Type: ${params.projectType || 'Not specified'}
Budget: ${params.budget || 'Not specified'}
Message: ${params.message}

Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          `.trim()
        });
      } catch (mailErr) {
        // Email sending failed but form submission succeeded
        console.log('Mail error:', mailErr.message);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Lead captured' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
