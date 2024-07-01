// Require necessary modules
const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const path = require('path');
const { readdirSync } = require('fs')
const cors = require('cors')
const http = require('http');
const socketIo = require('socket.io');
// // Set up Express server
const expressApp = express();
const server = http.createServer(expressApp);
expressApp.use(express.json());
const userModel = require('./app/Models/userModel');
const { configDotenv } = require('dotenv').config()
// Middleware to parse URL-encoded bodies
expressApp.use(express.urlencoded({ extended: true }));
// const io = socketIo(server);
const connectDB = require('./app/connection/connection');
const Helper = require('./app/Helper/Helper');
const { where } = require('sequelize');
const { app, BrowserWindow } = require('electron');
// connectDB()
const port = 3000;
const socket_port = 5555
expressApp.use(
  cors({
    origin: '*',
  }),
)
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow requests from this origin

  }
});
// const AutoLaunch = require('auto-launch');

// // Replace 'YourAppName' with the name of your application
// const autoLauncher = new AutoLaunch({
//   name: 'YourAppName',
//   path: 'C:\\Users\\Lakshya\\Documents\\GitHub\\path\\meetingApp\\node_modules\\electron\\dist\\electron.exe F:\\meetingApp'
// });

// autoLauncher.isEnabled()
//   .then((isEnabled) => {
//     if (!isEnabled) {
//       return autoLauncher.enable();
//     }
//   })
//   .catch((err) => {
//     console.error('Error enabling auto-launch:', err);
//   });

// // Your existing app code
// app.on('ready', () => {
//   // Create window or other startup tasks
//   createWindow();
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// // Optional: Check for updates
// const { autoUpdater } = require('electron-updater');

// autoUpdater.on('update-available', () => {
//   // Notify the user about the update
// });

// autoUpdater.on('update-downloaded', () => {
//   // Ask the user to restart the app to apply the update
// });

// app.on('ready', () => {
//   autoUpdater.checkForUpdatesAndNotify();
// });

// Function to open inbox
function openInbox(imap, cb) {
  imap.openBox('INBOX', true, cb);
}
io.on('connection', (socket) => {
  emitNewEmailMeet()
  emitNewEmailTeams()
  emitNewEmailZoom()
  console.log('New client connected');

  // Emit new email event for demonstration
  // socket.emit('new-email', [{ from: 'example@example.com', subject: 'Test Email', body: 'This is a test email.', zoomLink: 'http://zoom.us/test' }]);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
// IMAP configuration


// Create an instance of IMAP


expressApp.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
server.listen(socket_port, () => {
  console.log(`Socket Server is running on http://localhost:${socket_port}`);
})
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}
const emitNewEmailZoom = async (imapConfig) => {
  try {


    const emails = await fetchEmails(imapConfig);

    const ZoomEmails = emails.filter((e) =>e.body && e.body.includes('Zoom'));
    // console.log(ZoomEmails)
    // Extract Zoom link
    const extractZoomLink = (body) => {
      const zoomLinkRegex = /(https:\/\/\S+zoom\.us\/j\/\S+)/;
      const match = body.match(zoomLinkRegex);
      return match ? match[0] : 'No Zoom link found';
    };

    const zoomLinks = await Promise.all(ZoomEmails.map((email) => ({
      ...email,
      zoomLink: extractZoomLink(email.body),
    })))
    // Extract Team link

    const TeamsEmails = emails.filter((e) => e.body && e.body.includes('Teams'));


    const extractTeamsLink = (body) => {
      const teamsLinkRegex = /(https:\/\/teams\.live\.com\/meet\/\S+)/;
      const match = body.match(teamsLinkRegex);
      return match ? match[0] : 'No Teams link found';
    };

    const teamLinks = await Promise.all(TeamsEmails.map((email) => ({
      ...email,
      zoomLink: extractTeamsLink(email.body),
    })))

     // Extract Meet link
    const meetEmails = emails.filter((e) =>e.body && e.body.includes('Google Meet'));
    const extractMeetLink = (body) => {
      const meetLinkRegex = /(meet\.google\.com\/[\w-]+)/;
      const match = body.match(meetLinkRegex);
      return match ? 'https://' + match[0] : 'No Google Meet link found';
    };
    const meetLinks =await Promise.all( meetEmails.map((email) => ({
      ...email,
      zoomLink: extractMeetLink(email.body),
    })))

   const data= {
    meet:meetLinks,
    zoom:zoomLinks,
    teams:teamLinks
   }
   return data
  } catch (err) {
    console.error('Error fetching emails:', err);
  }
};
const emitNewEmailTeams = async (imapConfig) => {
  try {

    const emails = await fetchEmails(imapConfig);
    const ZoomEmails = emails.filter((e) => e.body && e.body.includes('Teams'));


    // Extract Zoom link
    const extractTeamsLink = (body) => {
      const teamsLinkRegex = /(https:\/\/teams\.live\.com\/meet\/\S+)/;
      const match = body.match(teamsLinkRegex);
      return match ? match[0] : 'No Teams link found';
    };

    const zoomLinks = ZoomEmails.map((email) => ({
      ...email,
      zoomLink: extractTeamsLink(email.body),
    }));

    return zoomLinks
    // io.emit(`new-email-team-${machineId}`, zoomLinks);
  } catch (err) {
    console.error('Error fetching emails:', err);
  }
};
const emitNewEmailMeet = async (imapConfig) => {
  try {
    
    const emails = await fetchEmails(imapConfig);

    const ZoomEmails = emails.filter((e) =>e.body && e.body.includes('Google Meet'));

    // Extract Zoom link
    const extractMeetLink = (body) => {
      const meetLinkRegex = /(meet\.google\.com\/[\w-]+)/;
      const match = body.match(meetLinkRegex);
      return match ? 'https://' + match[0] : 'No Google Meet link found';
    };
    const zoomLinks = ZoomEmails.map((email) => ({
      ...email,
      zoomLink: extractMeetLink(email.body),
    }));

    return zoomLinks
    // io.emit(`new-email-meet-${machineId}`, zoomLinks);
  } catch (err) {
    console.error('Error fetching emails:', err);
  }
};
// setInterval(emitNewEmailZoom, 60000); 
// setInterval(emitNewEmailTeams, 60000); 
// setInterval(emitNewEmailMeet, 60000); 
const fetchEmails = (imapConfig) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    // Format the date in 'DD-MMM-YYYY' format
    const formattedDate = lastMonthDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, '-');

    const imap = new Imap(imapConfig);


    const openInbox = (cb) => {
      imap.openBox('[Gmail]/All Mail', true, cb);
    };

    imap.once('ready', () => {
      openInbox((err, box) => {
        if (err) return reject(err);

        imap.search(['UNSEEN', // Unread emails
          ['X-GM-RAW', 'category:primary'], // Gmail category: primary
          ['SINCE', formattedDate], // Emails since the calculated date
        ], (err, results) => {
          if (err) return reject(err);

          results = results.sort((a, b) => b - a).slice(0, 10);


          if (!results || results.length === 0) {
            return resolve([]);
          }


          const fetchedEmails = [];
          const f = imap.fetch(results, { bodies: '' });

          f.on('message', (msg, seqno) => {
            let buffer = '';
            msg.on('body', (stream) => {
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', async () => {
                const parsed = await simpleParser(buffer);
                fetchedEmails.push({
                  from: parsed.from.text,
                  subject: parsed.subject,
                  date: parsed.date,
                  body: parsed.text,
                });

                if (fetchedEmails.length === results.length) {
                  imap.end();
                  resolve(fetchedEmails);
                }
              });
            });
          });

          f.once('error', (err) => {
            reject('Fetch error: ' + err);
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  });
};
expressApp.post('/api/getZoomMail', async (req, res) => {
  try {

    const { machineId } = req.body
    const user = await userModel.findOne({ where: { machineId: machineId } });
    const imapConfig = {
      user: `${user.username}`,
      password: `${user.password}`,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    };

    const zoomData = await emitNewEmailZoom(imapConfig, machineId)
    // const teamsData = await emitNewEmailTeams(imapConfig, machineId)
    // const meetData = await emitNewEmailMeet(imapConfig, machineId)
    // const totalData = { zoom: zoomData, meet: meetData, teams: teamsData }
    Helper.response("Success", "Emails Fetched", zoomData, res, 200)
  } catch (err) {
    console.log(err)
    Helper.response("Failed", "Unable to Fetch emails", {}, res, 200)

    
  }
});
expressApp.get('/getMicrosoftMail', async (req, res) => {
  try {
    await emitNewEmailMicrosoft()
  } catch (err) {
    console.log(err)
    res.status(500).send(err.toString());
  }
});
expressApp.get('/getMeetMail', async (req, res) => {
  try {
    await emitNewEmailMeet()
  } catch (err) {
    console.log(err)
    res.status(500).send(err.toString());
  }
});
// require('./app/routes')
readdirSync('./app/routes').map((route) =>

  expressApp.use('/api', require('./app/routes/' + route))
)

// Require necessary modules

