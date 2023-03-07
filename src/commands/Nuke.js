import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { Command } from "djs-handlers";

export default new Command({
  name: "nuke",
  description: "Deletes and recreates a chanel.",
  execute: async ({ interaction }) => {
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

    interaction.reply({
      content: `You sure?`,
      ephemeral: true,
      components: [buttons],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 15000,
      max: 1,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "no") {
        await i.update({
          content: "Nuke was aborted.",
          components: [],
        });
        return;
      }

      if (i.customId === "yes") {
        if (!(interaction.channel instanceof TextChannel)) {
          i.update({
            content: "This can only be used in a text channel.",
            components: [],
          });
        }

        await i.update({
          content: `BOOOOOM!`,
          components: [],
        });

        await interaction.channel.clone();
        interaction.channel.delete();
      }
    });
  },
});
