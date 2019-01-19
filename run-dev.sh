#!/usr/bin/env bash
export NODE_ENV=development
export PORT=8999
export REDIS_PORT=6379
export REDIS_HOST=127.0.0.1
export DB_DIR=/databases/dev/core.db
export MAX_LISTINGS_ALLOWED=3

export EMAIL_PASSWORD=
export GOOGLE_CLIENT_ID=
export GOOGLE_CLIENT_SECRET=
export GOOGLE_REFRESH_TOKEN=

export TWILIO_PHONE=
export TWILIO_SID=
export TWILIO_TOKEN=
export STRIPE_PUBLIC_KEY=
export STRIPE_SECRET_KEY=

export DONATION_GOAL=100
export MOTD="UPDATES - New profile section (WIP) Add your email to receive game request notifications. Listings page is now much more compact. Chat username text color updated to be more readable. More updates to come!"
export POPULAR_GAMES="Halo 5, Rocket League, Destiny, Overwatch, Battlefield 1"

npm install

sequelize db:migrate

npm start
