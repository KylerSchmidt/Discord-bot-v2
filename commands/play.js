const ytdl = require('ytdl-core');
module.exports.help = {
    name: 'play',
    description: 'Play a song from youtube without downloading to bot',
    aliases: ['p'],
    args: true,
    guildonly: true,
    usage: '<youtube link>'
}

module.exports.run = async(client, message, arg) => {
    const args = message.content.split(' ');
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
    // User did not provide any form of arguements. return.
    if (args[1] == null)
        return 0;
    const songInfo = await ytdl.getInfo(args[1]);
    
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url, {
        filter: "audioonly",
        highWaterMark: 1<<25,
        quality: "highestaudio"
    }))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 8 );
}