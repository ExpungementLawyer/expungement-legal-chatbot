/**
 * Google Sheets API integration — lead capture + analytics tracking.
 *
 * Requires a Google Cloud service account with Sheets API enabled.
 * The target spreadsheet must be shared with the service account email.
 *
 * If no credentials are configured, methods are no-ops (graceful fallback).
 */

const fs = require('fs');
const path = require('path');

let sheets = null;
let sheetsAuth = null;
let SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || null;

// ─── Lazy initialization ───────────────────────────────────────────────────

async function initSheets() {
    if (sheets) return true;
    if (!SPREADSHEET_ID) {
        console.warn('⚠️  GOOGLE_SHEETS_SPREADSHEET_ID not set — Sheets integration disabled.');
        return false;
    }

    try {
        const { google } = require('googleapis');
        const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
        const rawCredentials = process.env.GOOGLE_CREDENTIALS_JSON;

        if (rawCredentials) {
            let credentials;
            try {
                credentials = JSON.parse(rawCredentials);
                if (credentials.private_key) {
                    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
                }
            } catch (parseErr) {
                console.warn('⚠️  GOOGLE_CREDENTIALS_JSON is not valid JSON — Sheets integration disabled.');
                return false;
            }

            sheetsAuth = new google.auth.GoogleAuth({
                credentials,
                scopes,
            });
        } else {
            const credPath = process.env.GOOGLE_CREDENTIALS_PATH ||
                path.join(__dirname, 'google-credentials.json');

            if (!fs.existsSync(credPath)) {
                console.warn(
                    `⚠️  Google credentials not found at ${credPath} and GOOGLE_CREDENTIALS_JSON is empty — Sheets integration disabled.`
                );
                return false;
            }

            sheetsAuth = new google.auth.GoogleAuth({
                keyFile: credPath,
                scopes,
            });
        }

        sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
        console.log('✅  Google Sheets integration initialized');
        return true;
    } catch (err) {
        if (err && err.code === 'MODULE_NOT_FOUND') {
            console.warn('⚠️  "googleapis" package is missing — install it to enable Sheets integration.');
            return false;
        }
        console.warn('⚠️  Failed to initialize Google Sheets:', err.message);
        sheets = null;
        return false;
    }
}

// ─── Append a row ──────────────────────────────────────────────────────────

async function appendRow(sheetName, values) {
    if (!(await initSheets())) return;

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [values] },
        });
    } catch (err) {
        console.error(`Sheets append error (${sheetName}):`, err.message);
    }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Record a lead (contact info from intake form).
 */
async function recordLead({ sessionId, name, email, phone, state, offenseType, eligibilityResult }) {
    await appendRow('Leads', [
        new Date().toISOString(),
        sessionId || '',
        name || '',
        email || '',
        phone || '',
        state || '',
        offenseType || '',
        eligibilityResult || '',
    ]);
}

/**
 * Record an analytics event.
 */
async function recordEvent({ sessionId, event, data }) {
    await appendRow('Analytics', [
        new Date().toISOString(),
        sessionId || '',
        event || '',
        typeof data === 'object' ? JSON.stringify(data) : String(data ?? ''),
    ]);
}

/**
 * Ensure sheets have headers (call once on startup).
 */
async function ensureHeaders() {
    if (!(await initSheets())) return;

    const leadsHeaders = ['Timestamp', 'Session ID', 'Name', 'Email', 'Phone', 'State', 'Offense Type', 'Eligibility'];
    const analyticsHeaders = ['Timestamp', 'Session ID', 'Event', 'Data'];

    try {
        // Check if Leads sheet has headers
        const leadsRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Leads!A1:H1',
        }).catch(() => null);

        if (!leadsRes || !leadsRes.data.values || leadsRes.data.values.length === 0) {
            await appendRow('Leads', leadsHeaders);
        }

        const analyticsRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Analytics!A1:D1',
        }).catch(() => null);

        if (!analyticsRes || !analyticsRes.data.values || analyticsRes.data.values.length === 0) {
            await appendRow('Analytics', analyticsHeaders);
        }
    } catch (err) {
        console.warn('⚠️  Could not ensure sheet headers:', err.message);
    }
}

module.exports = {
    recordLead,
    recordEvent,
    ensureHeaders,
    initSheets,
};
