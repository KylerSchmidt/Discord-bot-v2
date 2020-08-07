const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');
const path = require('path');

module.exports.help = {
    name: 'play',
    description: 'Play a song from youtube. Downloaded on host machine for later use.',
    aliases: ['p'],
    args: true,
    guildonly: true,
    voiceonly: true,
    cooldown: 5,
    usage: '<youtube link>'
}

module.exports.run = async (client, message, arg) => {
    const args = message.content.split(' ');
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    // Create music folder if not already existing.
    if(!fs.existsSync('./music'))
        fs.mkdirSync('./music');
    // Must have ability to connect to channel being called.
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
    
    // Attempt to grab information about the Youtube link. If none found assume not a youtube link or not url.
    // console.log(args[1].toString().trim());
    // if(args[1].toString().trim() !== "http")
    // {
    //     // message.channel.send("Not http");
    //     // playlocal(message, args[1]);
    // }

    // is the link a playlist?
    if(args[1].includes("list="))
    {
        let msgPlaylist = await message.channel.send("playlist found. attempting to add to queue...")
        let playlistID = args[1].split('list=')[1];
        ytpl(playlistID, async function(err, playlist) 
        {
            if(err)
            {
                msgPlaylist.delete();
                message.channel.send("error grabbing playlist.");
                // throw err;
                return;
            }

            let i = 0;
            while(i < playlist.total_items)
            {
                message.content = '!play ' + playlist.items[i].url_simple;
                await module.exports.run(client, message, arg);

                i++;
            }
            return;
        });
    }
    
    
    // Get song information details. store in structure song.
    let songInfo;
    try {
        songInfo = await ytdl.getInfo(args[1]);
    } catch (err) {
        return message.channel.send("Not a valid URL or could not find the URL");
    }
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        isLive: songInfo.videoDetails.isLive,
        desc: songInfo.videoDetails.shortDescription,
    };

    // If we do not have a queue setup, create one.
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: null,
            playing: true,
            dispatcher: null,
        };
        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        // Join voice channel. start play call.
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message, queueContruct.songs[0])
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    // we have a queue setup. push the song onto the queue and exit.
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

// currently not in use.
async function playlocal(message, song)
{
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    // change volume
    // update config file.
    let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    serverQueue.volume = config.volume;

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    if (fs.existsSync('./music/' + song + '.mp3')) {
        console.log("file found on server. playing now at " + serverQueue.volume + " volume.");
        let msgFound = await message.channel.send("File found on server. Playing now at " + serverQueue.volume + " volume.");
        serverQueue.dispatcher  = serverQueue.connection.play(fs.createReadStream('./music/' + songfdtitle + '.mp3'))
            .on('finish', () => {
                console.log('Music ended!');
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
                serverQueue.voiceChannel.leave();
                msgFound.delete();
                message.channel.send("Error playing sound file found on local directory.");
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
                return;
            });
        serverQueue.dispatcher.setVolume(serverQueue.volume / 40);
    }
    // file does not exist locally.
    else {
        message.channel.send("Could not find the file locally.");
    }

}

// allows play to be called from external file.
exports.plays = async function(message, song)
{
    play(message, song);
}

// This function is called from many other submodules to allow for queue to work.
// recursive calls itself to play through a full queue before exiting.
async function play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    // change volume
    // update config file.
    let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    serverQueue.volume = config.volume;

    // THIS IS THE ONLY PLACE THE BOT EXITS
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    // If song is a livestream...
    if (song.isLive)
    {
        let msgLive = await message.channel.send("Live Stream Detected. Streaming...\nBe sure to call !skip or !stop to end.");

        // audioonly was causing weird issues?
        serverQueue.dispatcher = serverQueue.connection.play(ytdl(song.url, {
            format: 'opus',
            highWaterMark: 1<<25,
            liveBuffer: 40000,
            begin: Date.now() - 200000
        }))
            .on('finish', () => {
                console.log('Music ended!');
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
            })
            // failure to stream.
            .on('error', error => {
                console.error(error);
                serverQueue.voiceChannel.leave();
                msgLive.delete();
                message.channel.send("failure to liveStream");
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
            });
        serverQueue.dispatcher.setVolume(serverQueue.volume / 40);
        // return so we dont run into any problems below.
        return;
    }

    var songfdtitle = song.title.substring(0, 30);
    // does the file already exist in the music folder?
    if (fs.existsSync('./music/' + songfdtitle + '.mp3')) {
        console.log("file found on server. playing now at " + serverQueue.volume + " volume.");
        let msgFound = await message.channel.send("File found on server. Playing now at " + serverQueue.volume + " volume.");
        serverQueue.dispatcher = serverQueue.connection.play(fs.createReadStream('./music/' + songfdtitle + '.mp3'))
            .on('finish', () => {
                console.log('Music ended!');
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
                serverQueue.voiceChannel.leave();
                msgFound.delete();
                message.channel.send("Error playing sound file found on local directory.");
                serverQueue.songs.shift();
                play(message, serverQueue.songs[0]);
                return;
            });
        serverQueue.dispatcher.setVolume(serverQueue.volume / 40);
    }
    // download the music if it does not exist
    else {
        console.log("Downloading...");
        let msgDownloading = await message.channel.send("Downloading " + songfdtitle);
        ytdl(song.url, {
            filter: "audioonly",
            highWaterMark: 1<<25,
            quality: "highestaudio"
        }).pipe(fs.createWriteStream('./music/' + songfdtitle + '.mp3'))
            // Finished downloading the song.
            .on('finish', () => {
                console.log("Downloaded!");
                msgDownloading.delete();
                message.channel.send("Downloaded! Playing now at " + serverQueue.volume + " volume.");
                serverQueue.dispatcher = serverQueue.connection.play(fs.createReadStream('./music/' + songfdtitle + '.mp3'))
                    .on('finish', () => {
                        console.log('Music ended!');
                        serverQueue.songs.shift();
                        play(message, serverQueue.songs[0]);
                    })
                    // Failure to download
                    .on('error', error => {
                        console.error(error + "\nCould not find the audio file. Download failure.");
                        serverQueue.voiceChannel.leave();
                        msgDownloading.delete();
                        message.channel.send("Could not find audio file. Download failure?");
                        serverQueue.songs.shift();
                        play(message, serverQueue.songs[0]);
                    });
                serverQueue.dispatcher.setVolume(serverQueue.volume / 40);
            })
            // Could not find downloaded file IE did not download correctly. attempt to stream instead.
            .on('error', error => {
                console.error(error + "\nMust be a failure to download. Bot will attempt to stream");
                msgDownloading.delete();
                message.channel.send("Failure Downloading. Lets try streaming directly.");
                
                serverQueue.dispatcher = serverQueue.connection.play(ytdl(song.url, {
                    filter: "audioonly",
                    highWaterMark: 1<<25,
                    quality: "highestaudio"
                }))
                    .on('finish', () => {
                        console.log('Music ended!');
                        serverQueue.songs.shift();
                        play(message, serverQueue.songs[0]);
                    })
                    // Yikes. Couldn't stream the song either. Could it be region locked?
                    .on('error', error => {
                        console.error(error);
                        serverQueue.voiceChannel.leave();
                        
                        message.channel.send("Failure to Download nor Stream. Could there be restrictions on " + songfdtitle + "?");
                        serverQueue.songs.shift();
                        play(message, serverQueue.songs[0]);
                    });
                serverQueue.dispatcher.setVolume(serverQueue.volume / 40);
            });
    }
}