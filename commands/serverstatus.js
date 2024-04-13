const { spawn } = require("child_process");

module.exports.help = {
    name: 'serverstatus',
    description: 'Check what systemctl services are running',
    guildonly: false,
    args: true,
    cooldown: 5
}
module.exports.run = async (client, message, args) => {
    // Filtering out as much as possible since this is a sensitive command going to the shell.
    // Its likely fine now that spawn() is called instead of exec(), but still.
    const serverName = args[0].replace(/[^a-zA-Z ]/g, "")
    var systemctl = spawn('/bin/systemctl', ['show', '--property=ActiveState,ActiveEnterTimestamp', serverName])
    var stderr = ''
    var stdout = ''
    systemctl.stdout.on('data', (data) => {
        stdout += data
        var active = stdout.split('=')
        var time = active[2]
        active = active[1].split('\n')

        // Return back to user if a service is running.
        if (active[0] === 'active')
            return message.channel.send(`${client.emotes.success} Server is active for ${serverName}. It has been active since ${time}`)
        else
            return message.channel.send(`${client.emotes.error} Server is inactive for ${serverName}`)
    })

    systemctl.stderr.on('data', (data) => {
        stderr += data
        console.log(`stderr: ${stderr}`);
        return message.channel.send(`${client.emotes.error} Invalid`)
    });

    systemctl.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}