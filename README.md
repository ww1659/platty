# Welcome to Platty

Hello. This is an attempt at creating an events platform to allow users to browse events, join events, and for admins, create events. This was built using Next App router and the integrated API routes. Supabase is used for Authentication as well as hosting the database.

## Hosted Version

You can access the hosted version of the project at [https://platty-jhx3isvhc-ww1659s-projects.vercel.app](https://platty-jhx3isvhc-ww1659s-projects.vercel.app). You can sign up for a new account, or sign in as a guest with admin rights (to be able to create events). These are test credentials so won't allow any Google actions to take place, but this account is configured as a community admin for event creation.

## Table of Contents

- [Features](#features)
- [To-Do's](#to-do's)
- [Installation Instructions](#instructions)

## Features

- User Authentication: Allow users to register and log in and log out with personalised accounts linked with Supabase. You can also log in with Google through OAuth, although this is currently not a verified app, so you will have to click through a lot of Google warnings first.

- Add an event to Google Calendar: this can be done through the My Events Page. If a user is logged in with Google, this works either by passing through the valid access token OR by refreshing this with the refresh token. Otherwise a user will be prompted to sign in with Google.

- Pay for events which are not free with Stripe: this is configured in test mode as there won't be an exchange of money. A user can use some dummy card details to 'pretend' to pay, and therefore go through the stripe flow. Dummy card details: 4242 4242 4242 4242 and then any Exp Date / Security number.

- Create Events: Site Admin can create events for the whole site (in this case platty-all), whereas community admins can create events for their specific community. Admins cannot create events, although this can be changed. All the forms (including event creation) are built with a Zod Schema and protected thus.

- Notifications: this is not yet implemented but has started to be built. Admins will get notifications when users request to join communities.

- Sort / Filter Events: By Price, Date, Community or a simple search.

- Allow users to add events to their personal events list. This is currently displayed with a Tanstack table (through Shadcn) but I don't think it works very well and have plans to implement a calendar view instead.

- Styling with Shadcn: tailwind and radix UI. Consistent theme throughout (other than the embedded Stripe form). Dark Mode toggle built in.

- Loading States and Skeletons.

- Unsplash API to generate Images

### To-Do

In short... LOTS. This is a non-exhaustive list of bugs and changes I need to address or update:

- Page reload on changing tab. Not sure why this is happening.
- Error handling. Login and Sign up error handling is not done particularly well. Redirects from Google and Stripe are not handled well. API routes could do with more specific error handling for edge cases.
- Testing: I would like to build a testing suite and a testing DB (with SupaB)
- Seed file: this is a tricky one as although I had started building a seed file, the UUID's created with Supabase are random so I can't configure other tables easily.
- Rendering of certain pages - sometimes a page doesn't detect the user state in context and doesn't render correctly. Need to figure out why.

### Installation Instructions ()

1. Clone this project.

2. You will need to retrieve some environment variables:

- UNSPLASH ACCESS & SECRET KEY
- SUPABASE URL & ANON KEY
- STRIPE PUBLISHABLE & SECRET KEY
- GOOGLE CLIENT ID & SECRET

These can be configured in your .env.local file at the root of your project.

```bash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
NEXT_PUBLIC_UNSPLASH_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

3. For dependencies:

```
npm install
```

4. Scripts can be found in the `package.json`. To build and deploy the app to your localhost, run the 'dev' script.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Thanks!
