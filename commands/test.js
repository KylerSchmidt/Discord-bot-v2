const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');
const path = require('path');
module.exports.help = {
    name: 'test',
    description: 'test function.',
    args: true,
    guildonly: true
    // usage: '<1-10>'
}
module.exports.run = async (client, message, arg) => {
    const args = message.content.split(' ');
    let songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        isLive: songInfo.videoDetails.isLive,
    };

    const videoInfo = await ytdl.getInfo(song.url);
    // let islive = ytdl.chooseFormat(videoInfo.)
    console.log(videoInfo);
    console.log(typeof(args[1]))
    if(args[1].includes("list="))
    {
        let msgPlaylist = await message.channel.send("playlist found. attempting to add to queue...")
        let playlistID = args[1].split('list=')[1];
        
        ytpl(playlistID, function(err, playlist) 
        {
            if(err)
            {
                msgPlaylist.delete();
                message.channel.send("error grabbing playlist.");
                throw err;
                return;
            }
            console.log(playlist);
            console.log(playlist.total_items);
            console.log(playlist.items[0].url_simple);
        });
    }
}