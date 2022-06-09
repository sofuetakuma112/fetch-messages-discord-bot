import { Client, Intents } from "discord.js"; //discord.js からClientとIntentsを読み込む
import "dotenv/config";
import fs from "fs";
import { stringify } from "csv/sync";

(async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] }); //clientインスタンスを作成する

  client.once("ready", async () => {
    const LONG_TERM_INTERN_CAHNNEL_ID = "972106811488473098";
    // const long_term_intern_channel = await client.channels.fetch(
    //   LONG_TERM_INTERN_CAHNNEL_ID
    // );
    // const messages = await long_term_intern_channel.messages
    //   .fetch({ limit: 100 })
    //   .catch(console.error);

    // <ref *1> Message {
    //   channelId: '972106811488473098',
    //   guildId: '809470928467525693',
    //   id: '984457466601422888',
    //   createdTimestamp: 1654783350373,
    //   type: 'DEFAULT',
    //   system: false,
    //   content: 'https://www.wantedly.com/projects/1035179',
    //   author: User {
    //     id: '431070807763058688',
    //     bot: false,
    //     system: false,
    //     flags: UserFlags { bitfield: 0 },
    //     username: 'Maaaaaaaaaaaaax',
    //     discriminator: '5965',
    //     avatar: '63f3466f114052d7755bf3b25f78e435',
    //     banner: undefined,
    //     accentColor: undefined
    //   },
    //   pinned: false,
    //   tts: false,
    //   nonce: null,
    //   embeds: [
    //     MessageEmbed {
    //       type: 'article',
    //       title: 'インターン：HoloLens2でMRの世界を実現！経験ゼロ歓迎します！！ by 株式会社ヒプスター',
    //       description: '渋谷の道玄坂にあるスタートアップIT企業でインターンを募集中です！\n\nプログラマやシステムエンジニアになりたいけれど、とっかかりがない...',
    //       url: 'https://www.wantedly.com/projects/1035179',
    //       color: null,
    //       timestamp: null,
    //       fields: [],
    //       thumbnail: [Object],
    //       image: null,
    //       video: null,
    //       author: null,
    //       provider: null,
    //       footer: null
    //     }
    //   ],
    //   components: [],
    //   attachments: Collection(0) [Map] {},
    //   stickers: Collection(0) [Map] {},
    //   editedTimestamp: null,
    //   reactions: ReactionManager { message: [Circular *1] },
    //   mentions: MessageMentions {
    //     everyone: false,
    //     users: Collection(0) [Map] {},
    //     roles: Collection(0) [Map] {},
    //     _members: null,
    //     _channels: null,
    //     crosspostedChannels: Collection(0) [Map] {},
    //     repliedUser: null
    //   },
    //   webhookId: null,
    //   groupActivityApplication: null,
    //   applicationId: null,
    //   activity: null,
    //   flags: MessageFlags { bitfield: 0 },
    //   reference: null,
    //   interaction: null
    // }
    // console.log(Array.from(messages.values())[0]);
    // const contents = Array.from(messages.values()).map((message) => ({
    //   createdTimestamp: new Date(message.createdTimestamp).toLocaleString(
    //     "ja-JP",
    //     { timeZone: "Asia/Tokyo" }
    //   ),
    //   content: message.content,
    //   id: message.id,
    // }));

    // console.log(contents.slice(90, contents.length));

    // const around = await long_term_intern_channel.messages.fetch({
    //   limit: 10,
    //   before: contents[contents.length - 1].id,
    // });

    const channel = client.channels.cache.get(LONG_TERM_INTERN_CAHNNEL_ID);
    let messages = [];

    // Create message pointer
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then((messagePage) =>
        messagePage.size === 1 ? messagePage.at(0) : null
      );

    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then((messagePage) => {
          messagePage.forEach((msg) => messages.push(msg));

          // Update our message pointer to be last message in page of messages
          message =
            0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    }

    const contents = Array.from(messages.values()).map((message) => ({
      createdTimestamp: new Date(message.createdTimestamp).toLocaleString(
        "ja-JP",
        { timeZone: "Asia/Tokyo" }
      ),
      content: (message.content.match(
        /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
      ) || [null])[0],
      id: message.id,
    })).filter(({ content }) => content);
    console.log(contents.at(-1));
    console.log(`contents.length: ${contents.length}`);

    contents.sort((a, b) =>
      a.content.toUpperCase() < b.content.toUpperCase() ? 1 : -1
    );

    console.log(contents.slice(contents.length - 21, contents.length - 1));

    const csvString = stringify(contents, { header: true });
    fs.writeFileSync("long_term_intern.csv", csvString);
  });

  client.login(process.env.TOKEN);
})();
