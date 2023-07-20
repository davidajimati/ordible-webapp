// This function renames the audio file after it has been converted
async function renameAudioFile(audioPath) {
  console.log("Rename Audio file path function working----\n")
  try {
    const fileName = path.basename(audioPath);
    const validChars = '-_.()[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const sanitizedFileName = [...fileName]
      .filter((char) => validChars.includes(char))
      .join('');
    const newAudioPath = path.join(path.dirname(audioPath), sanitizedFileName);
    fs.renameSync(audioPath, newAudioPath);
    return newAudioPath;
  } catch (err) {
    console.log("Rename Audio file path function error-----\n", err)
    return new Error("an error occurred")
  }
}

/* THIS ROUTE CONVERTS A video to audio using youtube-dl-exec, then sends the raw file to the client */
app.get('/sendRaw', async (req, res) => {
  console.log("sendRaw route received a request");
  res.setHeader('Content-Type', 'audio/mpeg');

  const options = {
    extractAudio: true,
    audioFormat: 'mp3',
    output: '-'
  };
  const url = 'https://www.youtube.com/watch?v=YblII6yXAWA'

  try {
    let result = await exec(url, options);
    const audio_file = result.stdout

    res.send(audio_file);
    console.log("response sent to client")
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
})

//-----------------------OLD MASTER FUNCTION----------------------------
async function masterFunction(url, audioTitle) {
  const filePath = `backend/convertedAudios/${audioTitle}.mp3`;
  const fileExists = await checkAvailability(filePath);

  if (fileExists) {
    console.log('File found:', filePath);
    return filePath;
  } else {
    try {
      const options = {
        extractAudio: true,
        audioFormat: 'mp3',
        output: `backend/convertedAudios/${audioTitle}.mp3`
      };

      const rawOutput = await downloadAudio(url, options)
      if (rawOutput != null & rawOutput != Error) {
        const audioPath = await getPath(String(rawOutput.stdout))
        // console.log(audioPath);
        if (audioPath != Error)
          return (audioPath);
        else throw Error
      } else throw Error
    } catch (error) {
      return new Error("An error occurred");
    }
  }
}


// This function checks for the presence of a file in the filesystem
function checkAvailability(filePath) {
  try {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File does not exist.\n___________________________________');
          resolve(false);
        } else {
          console.log('File exists.\n___________________________________');
          resolve(true);
        }
      });
    });
  } catch (err) {
    return new Error
  }
}

// ---------------This snippet converts audio to binary format streamable to client ------------
fs.readFile(newAudioPath, (err, data) => {
  if (err) {
    console.error(err);
    res.status(500).send('Error reading audio file');
  } else {
    // Convert the audio data to base64
    const base64Audio = data.toString('base64');
    res.json({ audio: base64Audio });
  }
})

// computes random character to make up an indexing title.
function getRandomChars(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// This function corrects the title before the conversion begins
function cleanupTitle(rawFile_name) {
  const validChars = '-_.()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
  const sanitizedFileName = [...rawFile_name]
    .filter((char) => validChars.includes(char))
    .join('');
  return sanitizedFileName;
}
