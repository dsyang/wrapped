# Wrapped

This is a silly little weekend project creating a "Wrapped" for my engineering team.
It's fully configurable, meaning that you too can create a "Wrapped" for your team.

## Setup

First, clone this entire repository and install dependencies:

```
git clone https://github.com/dsyang/wrapped
cd wrapped
npm i
```

### 1. Configuration

Then, create a configuration file `config.json` and place it in the root of the repo.
You can find a detailed description of the schema in [`config.ts`](data/config.ts).
Below is an example file.

<details>
<summary>Example for a `config.json`</summary>

```json
{
  "teamName": "Web Infra",
  "from": "2023-02-01",
  "to": "2024-02-01",
  "periodName": "fiscal year 2023",
  "people": [
    {
      "name": "Big Bird",
      "github": "bigbird",
      "slack": "bigbird",
      "from": "2023-01-15",
      "to": "2023-12-31",
      "excludeFromLeaderboard": false,
      "new": false,
      "photo": "/photos/bigbird.jpg",
      "highlight": {
        "photo": "/photos/bigbird_highlight.jpg",
        "caption": "Had an amazing time at the team retreat!",
        "captionPosition": "bottom"
      }
    },
    {
      "name": "Cookie Monster",
      "github": "cookiemonster",
      "new": true,
      "photo": "/photos/cookie.jpg",
      "highlight": {
        "photo": "/photos/cookie_highlight.jpg",
        "caption": "I got to enjoy a bunch of cookies during my vacation in Hawaii!",
        "captionPosition": "top"
      }
    },
    {
      "name": "Count von Count",
      "github": "countvcount",
      "new": true,
      "photo": "/photos/count.jpg",
      "highlight": {
        "photo": "/photos/count_highlight.jpg",
        "caption": "Here's a picture of me at Glacier national park during road trip to Chicago!"
      }
    },
    {
      "name": "Elmo",
      "github": "elmo",
      "to": "2023-07-01"
    },
    {
      "name": "Bert",
      "github": "bert",
      "excludeFromLeaderboard": true
    }
  ],
  "highlights": [
    {
      "photo": "/photos/team_highlight.jpg",
      "caption": "We had fun at the team offsite!",
      "captionPosition": "top"
    }
  ],
  "lifeMoments": [
    {
      "photo": "/photos/baby.jpg",
      "name": "Sarah",
      "type": "baby",
      "caption": "Welcome baby Emma!",
      "captionPosition": "bottom"
    },
    {
      "photo": "/photos/wedding.jpg",
      "name": "John",
      "type": "wedding",
      "caption": "Congratulations on your wedding!"
    },
    {
      "photo": "/photos/promotion.jpg",
      "name": "Alice",
      "type": "promotion",
      "caption": "Well-deserved promotion to Senior Engineer!"
    }
  ],
  "git": {
    "repoPath": "/Users/felix/code/notion-next",
    "folders": [
      "src/desktop",
      "src/client"
    ]
  },
  "github": {
    "token": "ghp_12345678...",
    "owner": "makenotion",
    "repo": "notion-next"
  },
  "slack": {
    "token": "xoxp-123456...",
    "channels": [
      "eng-team-web-infra",
      "eng-team-web-infra-triage"
    ],
    "ignoreEmoji": [
      "github",
      "link",
      "v"
    ],
    "ignoreBots": [
      "github",
      "slackbot"
    ],
    "storyOptions": {
      "oneStoryPerChannel": "auto"
    }
  },
  "projects": ["My cool project A", "My cool project B"]
}
```

**Note:** This example shows a subset of team members and projects for brevity. See [`src/data/config.ts`](src/data/config.ts) for all available configuration options including:
- Per-person date ranges (`from`/`to`)
- Custom Slack usernames (`slack` field)
- Leaderboard exclusions (`excludeFromLeaderboard`)
- Additional life moment types (`birthday`, `wedding`, `promotion`, `anniversary`)
- And more!
</details>

### 2. Fetch Data
Then, fetch data with `npm run cli create`. The command takes a few CLI arguments:

 - `--skip-git`: Don't fetch `git` information
 - `--skip-github`: Don't fetch GitHub information
 - `--skip-slack`: Don't fetch Slack information
 - `--skip-fetch`: Will still run all the fetchers but instructs the fetchers to
  avoid fetching new data if possible.
 - `--refresh-prs`: Reset github cache to assume there are more PRs

### 3. Create the Website

The website portion is a Next.js React app. You can find information about how to
deploy your website once built with https://nextjs.org/docs/pages/building-your-application/deploying.

You probably want to customize your `wrapped` a bit. It's all just React, so edit your
heart out!

The command line tools available are:

 - `npm run dev`: Build and run a local dev server
 - `npm run build`: Build an optimized production build
 - `npm run lint`: Run prettier

### 4. Deployment

Before deploying, prepare your project for publishing:

```bash
npm run publish-ready
```

This command will:
- Build the project
- Remove sensitive tokens from config.json
- Clean up large data files (keeping only *.light.json files)
- Help you manage Vercel project configurations

For deploying to Vercel with multiple projects:

```bash
# Deploy to production
vercel --prod

# Or if you have multiple Vercel projects configured:
# The publish-ready script will help you select the right project configuration
npm run publish-ready
vercel --prod
```

### License

All code is MIT. Images in `/public/backgrounds/` are from [Notion's Digital Drop](https://ntn.so/digitaldrop) and are (C) Copyright Notion Labs, Inc.
