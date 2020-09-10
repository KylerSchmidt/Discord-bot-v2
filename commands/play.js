const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');
const path = require('path');
var songfdtitle;

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
    var args = message.content.split(' ');
    args = args.slice(1, args.length);
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
    
    // is the link a playlist?
    if(args[0].includes("list="))
    {
        let msgPlaylist = await message.channel.send("playlist found. attempting to add to queue...")
        // ytpl takes in only the info after the list= (listID)
        let playlistID = args[0].split('list=')[1];

        // use ytpl to grab each url of the playlist
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
            msgPlaylist.delete()
            let msgPlaylistadding = await message.channel.send("Playlist contains " + playlist.total_items + " items. adding to queue. This may take a while.")
            console.log(playlist.total_items);
            // Loop through recursively grabbing each YT video
            while(i < playlist.total_items)
            {
                message.content = 'playlist ' + playlist.items[i].url_simple;
                await module.exports.run(client, message, arg);
                i++;
            }
            msgPlaylistadding.delete();
            message.channel.send("Playlist added to queue!");
            return;
        });
    }
    
    
    // Get song information details. store in structure song.
    let songInfo;
    let song;
    try {
        songInfo = await ytdl.getInfo(args[0]);
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            isLive: songInfo.videoDetails.isLive,
            desc: songInfo.videoDetails.shortDescription,
            time: songInfo.videoDetails.lengthSeconds,
        };
    } catch (err) {
        // Attempt to grab information about the Youtube link. If none found assume not a youtube link or not url.
        if(!args[0].includes("http"))
        {
            song = {
                title: args.join(' '),
                url: ' ',
                isLive: false,
                desc: ' ',
            }
        }
        else
        {
            return message.channel.send("Failure to getInfo on youtube link.")
        }
    }

    

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
            paused: false,
            repeat: false,
            stayInChat: false,
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
    // we have a queue setup. push the song onto the queue
    // exit for the main thread running play() to run later.
    } else {
        serverQueue.songs.push(song);
        if(args[0].includes('playlist'))
            return;
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

// Deletes a msg sent to discord chat after 3 seconds.
function deleteMsg(msg)
{
    setTimeout(function() { msg.delete(); }, 3000);
}

// Play Youtube livestream
// Called in Play() function
async function playLiveStream(message, song, serverQueue)
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
                if(!serverQueue.repeat) serverQueue.songs.shift();
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
}

//Play local file found in ./music
// Called in Play() function
async function playLocalFile(message, song, serverQueue)
{
    // console.log("file found on server. playing now at " + serverQueue.volume + " volume.");
        let msgFound = await message.channel.send("File found on server. Playing now at " + serverQueue.volume + " volume.");
        await deleteMsg(msgFound);
        serverQueue.dispatcher = serverQueue.connection.play(fs.createReadStream('./music/' + songfdtitle + '.mp3'))
            .on('finish', () => {
                // console.log('Music ended!');
                if(!serverQueue.repeat) serverQueue.songs.shift();
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

// Stream a song directly from YT
// Called in Play() function
async function playYTStream(message, song, serverQueue)
{
    let msgDownloadFail = await message.channel.send("Failure Downloading. Lets try streaming directly.");
    await deleteMsg(msgDownloadFail);
    serverQueue.dispatcher = serverQueue.connection.play(ytdl(song.url, {
        format: 'opus',
        filter: "audioonly",
        highWaterMark: 1<<25,
        quality: "highestaudio"
    }))
        .on('finish', () => {
            console.log('Music ended!');
            if(!serverQueue.repeat) serverQueue.songs.shift();
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
}

// external calls to play
// used in skip.js
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
    var stayInChat = config.stayInChat;

    // THIS IS THE ONLY PLACE THE BOT EXITS PLAYING WITH NO NEW ASYNC CALLS
    if (typeof(song) == 'undefined') {
        serverQueue.dispatcher.pause(true);
        if(!stayInChat)
        {
            serverQueue.voiceChannel.leave();
        }
        queue.delete(guild.id);
        return;
    }

    serverQueue.volume = config.volume;

    // If song is a livestream...
    if (song.isLive)
    {
        playLiveStream(message, song, serverQueue);
        return;
    }

    songfdtitle = song.title.substring(0, 60);
    if(songfdtitle.length > 58)
    {
        songfdtitle = songfdtitle.split(' ')
        songfdtitle = songfdtitle.slice(0, songfdtitle.length - 1)
        songfdtitle = songfdtitle.join(' ');
    } 
    // OUTDATED
    // const hasCompleteWord = (str, word) =>
    //     str.replace(/[-..,\/#!$%\^&\*;:{}=\-_`'"~()]/g,"").split(/\s+/).includes(word.replace(/[-.,\/#!$%\^&\*;:{}=\-_`'"~()]/g,""));

    // our method for filtering out words. /\s+/g will get rid of extra spaces. the first replace makes sure only simple english letters are searched for.
    const hasCompleteWord = (str, word) =>
        str.replace(/[^\w\s]/gi,"").replace(/\s+/g, " ").split(/\s+/).join(' ').includes(word.replace(/[^\w\s]/gi,"").replace(/\s+/g, " "));
    // if no url was given and saved, it is not a yt link and we can search
    // local files directly for anything close to a saved .mp3
    if (song.url == ' ')
    {
        var files = fs.readdirSync('./music');
        for(var i = 0; i < files.length; i++)
        {
            // filter .mp3 off the end of the file. hopefully no song saved has .mp3 in the name?
            files[i] = files[i].split(".mp3")[0]

            // console.log(files[i].replace(/[^\w\s]/gi,"").replace(/\s+/g, " ").split(/\s+/).join(' ') + ' ------------- ' + songfdtitle + ' ------------- ' + hasCompleteWord(files[i].toLowerCase(), songfdtitle.toLowerCase()))
            if(hasCompleteWord(files[i].toLowerCase(), songfdtitle.toLowerCase()))
            {
                songfdtitle = files[i];
                song.title = songfdtitle;
                playLocalFile(message, song, serverQueue);
                return;
            }
        }
        message.channel.send("No local file found.")
        serverQueue.songs.shift();
        play(message, serverQueue.songs[0]);
        return;
    }
    // does the file already exist in the music folder?
    if (fs.existsSync('./music/' + songfdtitle + '.mp3')) {
        playLocalFile(message, song, serverQueue);
    }
    // download the music if it does not exist
    else {
        // Dont want to download something longer than 10 min long.
        if(song.time > 600)
        {
            message.channel.send('Song is longer than 10 min. cannot download. Streaming directly.');
            playYTStream(message, song, serverQueue);
        }
        let msgDownloading = await message.channel.send("Downloading " + songfdtitle);
        ytdl(song.url, {
            filter: "audioonly",
            highWaterMark: 1<<25,
            quality: "highestaudio"
        }).pipe(fs.createWriteStream('./music/' + songfdtitle + '.mp3'))
            // Finished downloading the song.
            .on('finish', () => {
                // console.log("Downloaded!");
                msgDownloading.delete();
                playLocalFile(message, song, serverQueue);
            })
            // Could not find downloaded file IE did not download correctly. attempt to stream instead.
            .on('error', error => {
                console.error(error + "\nMust be a failure to download. Bot will attempt to stream");
                msgDownloading.delete();
                playYTStream(message, song, serverQueue);
            });
    }
}