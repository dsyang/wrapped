import { Story } from "react-insta-stories/dist/interfaces";
import { Homemade_Apple } from "next/font/google";

import { DataLight, StoryFunc } from "../../interfaces";
import { formatNumber as n } from "../../helpers/format";
import { joined } from "../helpers/joined";
import { formatDate } from "../helpers/simple-date";
import BarChart from "../components/bar-chart";
import RandomEmojiBackground from "../components/emoji-background";
import Emoji from "../components/emoji";

const homemadeApple = Homemade_Apple({ subsets: ["latin"], weight: "400" });

const SlackStories: StoryFunc = (data, config) => {
  if (!config.slack || !data.slack?.channels) {
    return [];
  }

  const channelCount = Object.keys(config.slack.channels).length;
  const oneStoryPerChannelOption =
    config.slack.storyOptions?.oneStoryPerChannel || "auto";

  // Determine layout based on configuration
  const useNewLayout =
    oneStoryPerChannelOption === "always" ||
    (oneStoryPerChannelOption === "auto" && channelCount > 3);

  if (useNewLayout) {
    // New combined layout - one story per channel
    const stories: Story[] = [...ChannelStories(data, config)];
    return stories;
  } else {
    // Original separate layout - stories grouped by type
    const stories: Story[] = [
      ...EmojiCharts(data, config),
      ...BufoCharts(data, config),
      ...ChannelSummaries(data, config),
    ];
    return stories;
  }
};

// New combined layout - one comprehensive story per channel
const ChannelStories: StoryFunc = (data, config) => {
  const stories: Story[] = [];

  if (!config.slack || !data.slack?.channels) {
    return [];
  }

  for (const channelName of Object.keys(config.slack.channels)) {
    const channelData = data.slack.channels[channelName];

    if (!channelData) {
      console.log(`No data for channel ${channelName}`);
      continue;
    }

    // Emoji data
    const favoriteEmoji = getSortedEmoji(channelData.emojis!.byCount);
    const emojiList = EmojiList(favoriteEmoji, data);
    const uniqueEmojis = new Set();
    Object.keys(channelData.emojis!.byCount).forEach((emoji) =>
      uniqueEmojis.add(emoji),
    );

    // Bufo data
    const favoriteBufos = getSortedEmoji(
      channelData.emojis!.byCount,
      7,
      (emoji) => {
        return emoji.startsWith("bufo");
      },
    );
    const bufoList = EmojiList(favoriteBufos, data);
    const uniqueBufoCount = Object.keys(channelData.emojis!.byCount).filter(
      (emoji) => emoji.startsWith("bufo"),
    ).length;

    // Reaction data
    const favoriteReacji = getSortedEmoji(channelData.reacji!, 6);
    const reacjiList = EmojiList(favoriteReacji, data);

    // Message stats
    const topPostersWithoutBots: Record<string, number> = {};
    const topPostersOnlyBots: Record<string, number> = {};

    // Filter out bots
    for (const [name, count] of Object.entries(channelData.topPosters!)) {
      if (!(config.slack.ignoreBots || []).includes(name)) {
        topPostersWithoutBots[name] = count;
      } else {
        topPostersOnlyBots[name] = count;
      }
    }

    let botsContentsMaybe = <></>;

    if (Object.keys(topPostersOnlyBots).length > 0) {
      botsContentsMaybe = (
        <p className="mt-[20px]">
          Our top 3 busiest bots were{" "}
          {recordToNameAndNumber(topPostersOnlyBots, "messages", 3)}.
        </p>
      );
    }

    stories.push({
      content: (props) => (
        <div className="text-black text-center w-full h-full bg-cover bg-notion-paper">
          <RandomEmojiBackground />
          <div className="w-full h-full p-6 pt-16 overflow-y-auto">
            <p className={`${homemadeApple.className} text-4xl mb-10`}>
              #{channelName}
            </p>

            {/* Message Stats */}
            <div className="mb-10">
              <p className="text-sm">
                In {config.periodName},{" "}
                <span className="font-bold">
                  {n(channelData.messageCount)} messages
                </span>{" "}
                were written. The top 3 chatterbugs were{" "}
                {recordToNameAndNumber(topPostersWithoutBots, "messages", 3)}.
              </p>
              {botsContentsMaybe}
            </div>

            {/* Emojis Section */}
            <div className="mb-6">
              <p className={`${homemadeApple.className} text-2xl mb-2`}>
                Emojis
              </p>
              <div className="mb-2">{emojiList}</div>
              <p className="text-xs text-gray-600">
                {uniqueEmojis.size} unique emojis used
              </p>
            </div>

            {/* Bufos Section */}
            {uniqueBufoCount > 0 && (
              <div className="mb-6">
                <p className={`${homemadeApple.className} text-2xl mb-2`}>
                  Bufos
                </p>
                <div className="mb-2">{bufoList}</div>
                <p className="text-xs text-gray-600">
                  {uniqueBufoCount} unique bufos used
                </p>
              </div>
            )}

            {/* Reactions Section */}
            <div className="mb-4">
              <p className={`${homemadeApple.className} text-2xl mb-2`}>
                Reactions
              </p>
              <div>{reacjiList}</div>
            </div>
          </div>
        </div>
      ),
    });
  }

  return stories;
};

// Original separate layout functions
const EmojiCharts: StoryFunc = (data, config) => {
  const elements: Array<JSX.Element> = [];

  if (!config.slack || !data.slack?.channels) {
    return [];
  }

  for (const channelName of Object.keys(config.slack.channels)) {
    const channelData = data.slack.channels[channelName];
    const favoriteEmoji = getSortedEmoji(channelData.emojis!.byCount);
    const emojiList = EmojiList(favoriteEmoji, data);
    const uniqueEmojis = new Set();
    Object.keys(channelData.emojis!.byCount).forEach((emoji) =>
      uniqueEmojis.add(emoji),
    );

    elements.push(
      <div key={channelName} className="mb-[30px]">
        <p className={`${homemadeApple.className} text-2xl`}>#{channelName}</p>
        <div className="mb-[10px]">{emojiList}</div>
        <p className="text-sm text-gray-600">
          We used {uniqueEmojis.size} unique emojis in 2024
        </p>
      </div>,
    );
  }

  return [
    {
      content: () => (
        <div className="text-black text-center w-full h-full bg-cover bg-notion-paper">
          <RandomEmojiBackground />
          <div className="w-full h-full p-8 pt-20">
            <p className={`${homemadeApple.className} text-6xl`}>
              Emoji Charts
            </p>
            <p className="mb-[20px] text-2xl">{config.periodName}</p>
            {elements}
          </div>
        </div>
      ),
    },
  ];
};

const BufoCharts: StoryFunc = (data, config) => {
  const elements: Array<JSX.Element> = [];

  if (!config.slack || !data.slack?.channels) {
    return [];
  }

  for (const channelName of Object.keys(config.slack.channels)) {
    const channelData = data.slack.channels[channelName];
    const favoriteEmoji = getSortedEmoji(
      channelData.emojis!.byCount,
      7,
      (emoji) => {
        return emoji.startsWith("bufo");
      },
    );
    const emojiList = EmojiList(favoriteEmoji, data);

    // Count unique bufo emojis
    const uniqueBufoCount = Object.keys(channelData.emojis!.byCount).filter(
      (emoji) => emoji.startsWith("bufo"),
    ).length;

    if (uniqueBufoCount > 0) {
      elements.push(
        <div key={channelName} className="mb-[30px]">
          <p className={`${homemadeApple.className} text-2xl`}>
            #{channelName}
          </p>
          <div className="mb-[10px]">{emojiList}</div>
          <p className="text-sm text-gray-600">
            We used {uniqueBufoCount} unique bufos in 2024
          </p>
        </div>,
      );
    }
  }

  if (elements.length === 0) {
    return [];
  }

  return [
    {
      content: () => (
        <div className="text-black text-center w-full h-full bg-cover bg-notion-paper">
          <RandomEmojiBackground />
          <div className="w-full h-full p-8 pt-20">
            <p className={`${homemadeApple.className} text-6xl`}>Bufo Charts</p>
            <p className="mb-[20px] text-2xl">{config.periodName}</p>
            {elements}
          </div>
        </div>
      ),
    },
  ];
};

const ChannelSummaries: StoryFunc = (data, config) => {
  const stories: Story[] = [];

  if (!config.slack || !data.slack?.channels) {
    return [];
  }

  for (const channelName of Object.keys(config.slack.channels)) {
    const channelData = data.slack.channels[channelName];

    if (!channelData) {
      console.log(`No data for channel ${channelName}`);
      continue;
    }

    const favoriteReacji = getSortedEmoji(channelData.reacji!, 6);
    const reacjiList = EmojiList(favoriteReacji, data);
    const topPostersWithoutBots: Record<string, number> = {};
    const topPostersOnlyBots: Record<string, number> = {};

    // Filter out bots
    for (const [name, count] of Object.entries(channelData.topPosters!)) {
      if (!(config.slack.ignoreBots || []).includes(name)) {
        topPostersWithoutBots[name] = count;
      } else {
        topPostersOnlyBots[name] = count;
      }
    }

    let botsContentsMaybe = <></>;

    if (Object.keys(topPostersOnlyBots).length > 0) {
      botsContentsMaybe = (
        <p className="mt-[30px]">
          Our top 3 busiest bots were{" "}
          {recordToNameAndNumber(topPostersOnlyBots, "messages", 3)}.
        </p>
      );
    }

    stories.push({
      content: () => (
        <div className="text-black text-center w-full h-full p-8 bg-notion-paper pt-20">
          <p className={`${homemadeApple.className} text-2xl`}>
            #{channelName}
          </p>
          <p className="mt-[30px]">
            In {config.periodName},{" "}
            <span className="font-bold">
              {n(channelData.messageCount)} messages
            </span>{" "}
            were written. The top 3 chatterbugs were{" "}
            {recordToNameAndNumber(topPostersWithoutBots, "messages", 3)}.
          </p>
          {botsContentsMaybe}
          <div>
            <p className={`mt-[30px] text-xl ${homemadeApple.className}`}>
              Reacji Charts
            </p>
            <p>{reacjiList}</p>
          </div>
        </div>
      ),
    });
  }

  return stories;
};

const EmojiList = (
  input: Array<{ emoji: string; count: number }>,
  data: DataLight,
) => {
  const result = [];

  for (const [i, emoji] of input.entries()) {
    const transformed = <Emoji data={data} name={emoji.emoji} />;
    const separator =
      i === input.length - 1 ? "" : i === input.length - 2 ? ", and " : ", ";

    result.push(
      <>
        <span className="text-2xl">{transformed}</span> × {emoji.count}
        {separator}
      </>,
    );
  }

  return result;
};

function recordToNameAndNumber(
  record: Record<string, number>,
  unit: string,
  length?: number,
): string {
  const array = Object.entries(record).map(([name, count]) => ({
    name,
    count,
  }));
  let sorted = array.sort((a, b) => b.count - a.count);
  if (length) {
    sorted = sorted.slice(0, length);
  }

  return joined(
    sorted.map((x) => `${x.name} (${n(x.count)}${unit ? ` ${unit}` : ""})`),
  );
}

function getWeekdayWithMostMessages(input: Record<string, number>): string {
  const array = Object.entries(input).map(([day, count]) => ({ day, count }));
  const sorted = array.sort((a, b) => b.count - a.count);

  return sorted[0].day;
}

function getSortedEmoji(
  input: Record<string, number>,
  length: number = 7,
  filter: (emoji: string) => boolean = () => true,
) {
  const array = Object.entries(input)
    .map(([emoji, count]) => ({
      emoji,
      count,
    }))
    .filter(({ emoji }) => filter(emoji));
  const sorted = array.sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, length);

  return top;
}

export default SlackStories;
