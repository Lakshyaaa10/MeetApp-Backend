const { google } = require('googleapis');
const imapSimple = require('imap-simple');
const { promisify } = require('util');
const readFileAsync = promisify(require('fs').readFile);
const writeFileAsync = promisify(require('fs').writeFile);
const path = require('path');

// Path to token.json for storing the token
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load client secrets from a local file
async function loadClientSecrets() {
    const content = await readFileAsync('credentials.json');
    return JSON.parse(content);
}

// Create an OAuth2 client with the given credentials
function createOAuth2Client(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

// Get and store new token after prompting for user authorization
async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    // Redirect user to authUrl and obtain the code from the URL
    const { code } = await new Promise((resolve) => {
        // Use a method to capture the code, e.g., readline or a web server
        // For example purposes, using readline:
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve({ code });
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await writeFileAsync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
    return oAuth2Client;
}

// Authorize a client with credentials, then call the Gmail API
async function authorize() {
    const credentials = await loadClientSecrets();
    const oAuth2Client = createOAuth2Client(credentials);

    try {
        const token = await readFileAsync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (error) {
        return getNewToken(oAuth2Client);
    }
}

// Access Gmail via IMAP using the authorized OAuth2 client
async function accessGmail() {
    const auth = await authorize();

    const imapConfig = {
        imap: {
            user: 'lakshyaquaere@gmail.com',
            xoauth2: auth.credentials.access_token,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false,
            },
        },
    };

    try {
        const connection = await imapSimple.connect(imapConfig);
        console.log('Connected to Gmail');
        
        // Use the connection object to interact with Gmail
        // For example, fetching emails:
        const box = await connection.openBox('INBOX');
        const results = await connection.search(['UNSEEN'], { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true });
        console.log(results);

        connection.end();
    } catch (error) {
        console.error('Error connecting to Gmail:', error);
    }
}

// Execute the function to access Gmail
accessGmail();
