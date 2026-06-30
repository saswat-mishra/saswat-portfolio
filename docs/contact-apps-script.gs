/**
 * Contact-form backend for saswatbuilds.com — Google Apps Script.
 *
 * Captures every /contact submission to a Google Sheet AND emails a notification
 * on each submit. The site POSTs a JSON string (fetch mode:'no-cors', so the
 * browser sends it as text/plain — we read e.postData.contents directly).
 *
 * DEPLOY:
 *  1. Create a Google Sheet; note its ID (the long string in the URL).
 *  2. Extensions → Apps Script; paste this file; set SHEET_ID + NOTIFY_EMAIL.
 *  3. Deploy → New deployment → type "Web app";
 *       Execute as: Me · Who has access: Anyone.
 *  4. Copy the /exec URL → set it as VITE_GOOGLE_SCRIPT_URL
 *       (GitHub repo → Settings → Secrets → Actions). The build inlines it.
 *
 * Fields sent by the form: name, email, company, message, source, ts.
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = 'saswatmishra.iitd@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = (data.name || '').toString().slice(0, 200);
    const email = (data.email || '').toString().slice(0, 200);
    const company = (data.company || '').toString().slice(0, 200);
    const message = (data.message || '').toString().slice(0, 5000);
    const source = (data.source || '').toString().slice(0, 200);
    const ts = (data.ts || new Date().toISOString()).toString();

    // 1) Append to the Sheet (the durable data path).
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received', 'Name', 'Work email', 'Company', 'What they want to build', 'Source']);
    }
    sheet.appendRow([ts, name, email, company, message, source]);

    // 2) Email notification on every submit.
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: email || NOTIFY_EMAIL,
        subject: `New lead: ${name}${company ? ' (' + company + ')' : ''}`,
        body:
          `New scoping-call request from saswatbuilds.com\n\n` +
          `Name:    ${name}\n` +
          `Email:   ${email}\n` +
          `Company: ${company}\n` +
          `Build:   ${message}\n\n` +
          `Source:  ${source}\n` +
          `Time:    ${ts}\n`,
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}

// Optional: lets you sanity-check the deployment in a browser (GET).
function doGet() {
  return ContentService.createTextOutput('saswatbuilds contact endpoint — POST only.');
}
