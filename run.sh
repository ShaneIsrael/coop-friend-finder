#!/usr/bin/env bash
export NODE_ENV=production
export PORT=9000
export REDIS_PORT=6379
export REDIS_HOST=127.0.0.1
export DB_DIR=/databases/core.db
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

export MOTD="October 6th, 2016 - Version 1.0 Update! I now consider this out of beta. You can now create server listings. Global Chat is minimized to the bottom left by default. Chrome push notification support has been added. For questions or feature requests send a message to: Shane75776"
export DONATION_GOAL=100
export POPULAR_GAMES="Halo 5, Rocket League, Destiny, Overwatch, Battlefield 4"

npm install

sequelize db:migrate

sudo service redis-server stop
sudo service redis-server start

npm start
