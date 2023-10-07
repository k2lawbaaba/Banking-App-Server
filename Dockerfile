FROM node:latest

WORKDIR /app

COPY   ./ ./

RUN npm install
   
# RUN  npm run start;

EXPOSE 4000

CMD [ "npm", "start" ]

# RUN apt-get remove -y --purge build-essential && \
#     apt-get autoremove -y && \
#     rm -rf /var/lib/apt/lists/*
# ENV NODE_ENV=production