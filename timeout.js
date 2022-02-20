const { CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "timeout",
    description: "Mute System",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "user",
            description: "Provide a user to the timeout.",
            type: "USER",
            required: true
        },
        {
            name: "length",
            description: "Provide length for timeout (1 seconds to 28 days)",
            type: "STRING",
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason for the timeout",
            type: "STRING",
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const options = interaction.options
        const target = options.getMember("user");
        const length = options.getString("length");
        const reason = options.getString("reason") || "No Reason Provided";
        const maxtime = ms("28d")
        if (length) timeInMs = ms(length);

        try {
            if (target.id === interaction.member.id)
                return interaction.reply({ content: '`❌ You cant timeout your self.`', ephemeral: true});

            if (target.permissions.has("ADMINISTRATOR"))
            return interaction.reply({ content: '`❌ You cant timeout an administrator.`', ephemeral: true});

            if (!timeInMs)
                return interaction.reply({ content: '`❌ Please especify a valid time.`', ephemeral: true});

            if (timeInMs > maxtime)
            return interaction.reply({ content: '`❌ Time must be to 1 second to 28 days.`', ephemeral: true});

            if (reason.length > 512)
                return interaction.reply({ content: '`❌ Reason must be less than 512 characters.`', ephemeral: true});

            target.timeout(timeInMs, reason);
            return interaction.guild.channels.cache.get('930109541780176911').send({
                embeds: [new MessageEmbed()
                    .setColor('#3C3C3C')
                    .setTitle(`User has been timed out!`)
                    .setDescription('Max time for time outs is 28 days!')
                    .addFields(
                        { name: "User:", value: `<@${target.user.id}>`, inline: true },
                        { name: "Time Of Mute:", value: `\`${length}\``, inline: true },
                        { name: "Reason:", value: `\`${reason}\``},
                    )
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 512 }))
                ],
            }).then(interaction.reply({ content: '`✅ | Succefully timed out the member, info posted in log mod channel`', ephemeral: true }))
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`🛑 Error: ${e}`)
            return interaction.reply({
                embeds: [errorEmbed]
            })
        }
    }
}
