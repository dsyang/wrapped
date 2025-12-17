import Image from "next/image";

import { StoryFunc } from "../../interfaces";
import { Homemade_Apple } from "next/font/google";
import ScrollingText from "../components/scrolling-text";
import { joined } from "../helpers/joined";

const homemadeApple = Homemade_Apple({ subsets: ["latin"], weight: "400" });

// Helper to chunk array into groups of n
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const NewMembersStory: StoryFunc = (data, config) => {
  const newPeople = config.people.filter((p) => p.new);
  const newPeopleWithPhotos = newPeople.filter((p) => !!p.photo);

  // Dynamic layout switching based on member count
  if (newPeople.length <= 5) {
    // Few members layout - single slide with scrolling photos
    const newPeopleNames = joined(newPeople.map((p) => p.name));

    const newPeopleImages = newPeopleWithPhotos.map((p) => {
      return (
        <div key={p.name}>
          <div className="rounded-full overflow-hidden border-4 w-[124px] h-[124px] border-black">
            <Image
              src={p.photo!}
              alt={`Photo of ${p.name}`}
              className="object-cover w-full h-full"
              width={200}
              height={200}
            />
          </div>
          <p
            className={`-mt-[10px] bg-white z-10 pt-[5px] relative ${homemadeApple.className}`}
          >
            {p.name.split(" ")[0]}
          </p>
        </div>
      );
    });

    return [
      {
        duration: 12000,
        content: () => (
          <div className="bg-notion-orange bg-cover w-full h-full flex place-items-center justify-center content-center">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-25 brightness-100 contrast-150"></div>
            <div className="w-full text-center text-black">
              <p className={`${homemadeApple.className}`}>
                <span className="text-7xl">Welcome,</span>
                <br />
                <span className="text-5xl">{newPeopleNames}!</span>
              </p>
              <p className="mt-5">
                Proudly presenting
                <br />
                the newest members of {config.teamName}.<br />
                We&apos;re so happy you&apos;re here!
              </p>
              <div className="mt-5 relative w-full overflow-hidden">
                <div className="flex flex-row gap-5 animate-[scroll_12s_linear_infinite] whitespace-nowrap">
                  {newPeopleImages}
                  {newPeopleImages}
                </div>
                <style jsx>{`
                  @keyframes scroll {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-150%);
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        ),
      },
    ];
  } else {
    // Many members layout - intro slide + chunked people slides
    const peopleChunks = chunk(newPeopleWithPhotos, 4);
    const newPeopleNames = newPeople.map((p) => p.name);

    const introSlide = {
      duration: 9000,
      content: () => (
        <div className="bg-notion-orange bg-cover w-full h-full flex flex-col">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-25 brightness-100 contrast-150"></div>
          <div className="z-10 text-center text-black px-4 pt-16">
            <p className={`${homemadeApple.className} text-7xl`}>Welcome!</p>
            <p className="mt-5 text-2xl">
              {newPeople.length} new{" "}
              {newPeople.length === 1 ? "person has" : "people have"} joined{" "}
              {config.teamName}!
            </p>
            <p className="mt-3">We&apos;re so happy you&apos;re here!</p>
          </div>
          <div className="flex-1 relative overflow-hidden mt-4">
            <ScrollingText
              strings={newPeopleNames}
              className={homemadeApple.className}
            />
          </div>
        </div>
      ),
    };

    const peopleSlides = peopleChunks.map((peopleGroup, chunkIndex) => ({
      duration: 6000,
      content: () => (
        <div className="bg-notion-orange bg-cover w-full h-full flex place-items-center justify-center content-center">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-25 brightness-100 contrast-150"></div>
          <div className="w-full text-center text-black px-4">
            <p className={`${homemadeApple.className} text-4xl mb-6`}>
              New faces! ({chunkIndex + 1}/{peopleChunks.length})
            </p>
            <div className="grid grid-cols-2 gap-4 justify-items-center max-w-[300px] mx-auto">
              {peopleGroup.map((p) => (
                <div key={p.name} className="flex flex-col items-center">
                  <div className="rounded-full overflow-hidden border-4 w-[100px] h-[100px] border-black">
                    <Image
                      src={p.photo!}
                      alt={`Photo of ${p.name}`}
                      className="object-cover w-full h-full"
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className={`mt-1 text-lg ${homemadeApple.className}`}>
                    {p.name.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    }));

    return [introSlide, ...peopleSlides];
  }
};

export default NewMembersStory;
