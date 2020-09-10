const fs = require('fs');
const lodash = require('lodash');
const { pickBy, identity } = require('lodash');
var songfdtitle;

module.exports.help = {
    name: 'listmusic',
    description: 'list local music on bots file',
    aliases: ['lm'],
    cooldown: 2,
    usage: '<a-z> or <startwith - sw> <a-z>'
}

module.exports.run = async (client, message, arg) => {
    var args = message.content.split(' ');
    args = args.slice(1, args.length);
    var files = fs.readdirSync('./music');
    var cleanedFiles;
    var list = [];
    var j = 0;

    //remove .mp3 extension at the end.
    for(var i = 0; i < files.length; i++)
        files[i] = files[i].split(".mp3")[0];
    
    // Filter out weird punctuation and find full words.
    const hasCompleteWord = (str, word) =>
        str.replace(/[^\w\s]/gi,"").replace(/\s+/g, " ").split(/\s+/).join(' ').includes(word.replace(/[^\w\s]/gi,"").replace(/\s+/g, " "));
    // Are we searching for files that start with something?
    if(args[0] == 'startwith' || args[0] == 'sw')
    {
        //indeed. filter out startsWith on files
        if(args[1])
        {
            var allargs = args.slice(1, args.length).join(" ");
            for(var i = 0; i < files.length; i++)
            {
                if(!files[i].toLowerCase().startsWith(allargs.toLowerCase()))
                    delete files[i];
            }
            // clean up object of undefined
            list[0] += "=====================\nLIST OF MUSIC STARTING WITH: " + args[1] + "\n=====================\n";
            cleanedFiles = pickBy(files, identity);
        }
        // no. just looking for a song with sw. in it.
        else
        {
            for(var i = 0; i < files.length; i++)
            {
                if(!hasCompleteWord(files[i].toLowerCase(), args[0].toLowerCase()))
                    delete files[i];
            }
            list[0] += "=====================\nLIST OF MUSIC FROM GIVEN: " + args[0] + "\n=====================\n";
            cleanedFiles = pickBy(files, identity);
        }
    }
    // do we have arguements? filter out songs to include keyword
    else if(args[0])
    {
        var allargs = args.join(' ');
        for(var i = 0; i < files.length; i++)
        {
            if(!hasCompleteWord(files[i].toLowerCase(), allargs.toLowerCase()))
                delete files[i];
        }
        list[0] += "=====================\nLIST OF MUSIC FROM GIVEN: " + args[0] + "\n=====================\n";
        cleanedFiles = pickBy(files, identity);
    }
    // no arguements, spit out full list to user. 
    else
    {
        list[0] += "=====================\nLIST OF ALL MUSIC \n=====================\n";
        cleanedFiles = files;
    }
        

    if(Object.keys(cleanedFiles).length == 0)
        return message.channel.send("no results.")

    message.channel.send("Check DM's for list");

    // loop for all elements in object cleanedFiles. add to list.
    for(var key in cleanedFiles)
    {
        list[j] += cleanedFiles[key] + '\n';
        // Discord only allows messages up to size 2000. we can send multiple parts
        if(list[j].length > 1900)
        {
            // WHY IS THERE AN UNDEFINED?!?!?!
            // This is not efficient - TOO BAD!
            list[j] = list[j].split('undefined')[1];
            message.author.send(list[j]);
            j++;
        }
    }
    // WHY IS THERE AN UNDEFINED?!?!?!
    // This is not efficient - TOO BAD!
    list[j] = list[j].split('undefined')[1];
    // send last part.
    message.author.send(list[j])
}