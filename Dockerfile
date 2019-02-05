FROM node:dubnium

RUN mkdir -p /app/data/tmp

COPY . /app

WORKDIR /app

RUN npm i

EXPOSE 80

ENV LC_BASE http://example.com

CMD [ "npm", "start" ]

