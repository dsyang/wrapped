import { Story } from "react-insta-stories/dist/interfaces";
import { Homemade_Apple } from "next/font/google";

import { StoryFunc } from "../../interfaces";
import "./highlights.css";

const homemadeApple = Homemade_Apple({ subsets: ["latin"], weight: "400" });

const MOMENT_EMOJIS: Record<string, string> = {
  baby: "👶",
  birthday: "🎂",
  wedding: "💒",
  promotion: "🎉",
  anniversary: "💍",
  other: "✨",
};

const MOMENT_TITLES: Record<string, string> = {
  baby: "New Addition!",
  birthday: "Happy Birthday!",
  wedding: "Just Married!",
  promotion: "Congrats!",
  anniversary: "Anniversary!",
  other: "Celebration!",
};

const LifeMomentsStory: StoryFunc = (data, config) => {
  const lifeMoments = config.lifeMoments || [];

  if (lifeMoments.length === 0) {
    return [];
  }

  const stories: Story[] = [];

  // Intro slide
  stories.push({
    duration: 6000,
    content: (props) => (
      <div className="text-black text-center w-full h-full p-8 bg-cover bg-notion-paper pt-20 flex flex-col">
        <p className={`${homemadeApple.className} text-5xl mb-6 mt-10`}>
          Life Moments
        </p>
        <p className={`${homemadeApple.className} text-6xl mb-8`}>
          We Celebrated
        </p>
        <div className="text-6xl mb-8 flex justify-center gap-4">
          {Array.from(new Set(lifeMoments.map((m) => MOMENT_EMOJIS[m.type]))).map(
            (emoji, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                {emoji}
              </span>
            )
          )}
        </div>
        <p className="text-lg text-gray-600 mt-auto mb-20">
          {lifeMoments.length} special moment{lifeMoments.length !== 1 ? "s" : ""} in {config.periodName}
        </p>
      </div>
    ),
  });

  // Individual moment slides
  for (const moment of lifeMoments) {
    const backgroundImage = `url(${moment.photo})`;
    const captionPosition =
      moment.captionPosition === "top" ? "top-10" : "bottom-10";
    const emoji = MOMENT_EMOJIS[moment.type];
    const title = MOMENT_TITLES[moment.type];

    const captionText = moment.caption || `${moment.name} - ${title}`;

    stories.push({
      content: (props) => (
        <div className="w-full h-full relative">
          <div
            style={{ backgroundImage }}
            className="ken-burns-bg bg-cover bg-center w-full h-full flex place-items-center justify-center content-center"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          
          {/* Top badge */}
          <div className="absolute top-8 left-0 right-0 flex justify-center">
            <div className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
              <span>{emoji}</span>
              <span>{title}</span>
            </div>
          </div>

          {/* Caption */}
          <div className={`w-full absolute ${captionPosition}`}>
            <div className="bg-black/80 backdrop-blur-sm text-white w-4/5 mx-auto p-3 text-center rounded-xl select-none shadow-xl">
              <p className={`${homemadeApple.className} text-xl`}>{captionText}</p>
            </div>
          </div>
        </div>
      ),
    });
  }

  return stories;
};

export default LifeMomentsStory;

