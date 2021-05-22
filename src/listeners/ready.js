const { Listener } = require('discord-akairo');

module.exports = class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        let result = await this.client.db.Reminder.find({})
        result.forEach(remind=> {
          setTimeout(async ()=> {
            const user = await this.client.users.fetch(remind.ownerID);
            if(remind.dm) (user).send("Hi im here to remind you for **"+remind.name+"**")
             else {
                 let channel = await this.client.channels.cache.find(c=> c.id === remind.channelID)
                 channel? channel.send("Hi im here to remind you for **"+remind.name+"**"): undefined;
              }
            await this.client.db.Reminder.deleteOne({reminderID: remind.reminderID});
          }, remind.finishsAt - Date.now())
        })
        console.log(`${this.client.user.tag} is now ready!`);
        
    }
};
