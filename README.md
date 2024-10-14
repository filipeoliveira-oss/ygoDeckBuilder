![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue) ![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)

# Yu Gi Oh Deck Builder

This project is designed to help Yu-Gi-Oh! players build decks more easily by using data from existing websites. It allows users to create new decks, import their card collections, and view detailed card stats. With these features, players can efficiently manage their cards and make better deck-building decisions when playing with friends.

You can visit the current website in [YGO Deck Builder](https://ygodeckbuildercoheso.netlify.app/)

#### Please be aware that this site is still under constant development

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. (PENSAR SE VAI REMOVER)See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To run this project you must have NodeJs v20.17.0 (or higher) installed. To do so, please head to their website [NodeJs](https://nodejs.org/)

### Installing

First you need to clone this project

```
git clone https://github.com/filipeoliveira-oss/ygoDeckBuilder.git
```

once you have it cloned, run this command in the root of the repository

```
npm install
```

once installed, run

```
npm run dev
```

Done, you have your Dev Environment up and running.

![screenshot](./public/main.png)

## New Tournament Module

if you simply want to use this module, you can just create an account and use it. Although, if you want to edit this part of code, a few steps must be followed

1. You need to create an account on [Supabase](https://supabase.com/)
2. After that, create a new project to host your database, auth and storage
3. Once you have the project created, get the credentials and place them in a .env file to use across the app and follow the steps in the documentation to create the client
4. Go to the Dashboard => SQL Editor
5. Run the files from ./src/supabase/*
6. Go to Auth  => Providers and enable email and Discord
7. Go to Storage => create a public bucket with the name `competitorsPhoto` and define the MIME types as `image/*`
8. Crate a policie for insert(anon), update(anon) and select(public) 

## Built With

* [React](https://react.dev/) - The library for web and native user interfaces
* [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
* [YGOProdeck](https://ygoprodeck.com/) - A Yu Gi Oh Community
* [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js
* [Framer Motion](https://www.framer.com/motion/) - Framer Motion animation library
* [Radix-ui](https://www.radix-ui.com/primitives) - A component library
* [papaparse](https://www.papaparse.com/) -  Powerful CSV Parser for JavaScript
* [file-saver](https://github.com/eligrey/FileSaver.js#readme) - Solution to saving files on the client-side
* [RecoilJS](https://recoiljs.org/) - A state management library for React
* [Supabase](https://supabase.com/) - A state management library for React

## Acknowledgments

* I’m incredibly grateful to all my friends who inspired me to create this solution for our game.
* A huge thanks to all the creators of the technologies used, more specially for YGO Pro Deck to make this website possible due to it's [API](https://ygoprodeck.com/api-guide/) and a ton of other features in their website

## Contact

If this project helped you in any way or if you just want to talk and give ideas to this project, please feel free to contact me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/filipeoliveirasilva/)
