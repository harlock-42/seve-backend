FROM node:20-alpine3.16

RUN apk add --no-cache git

RUN mkdir -p /data/pictures

RUN mkdir -p /data/pdf

RUN mkdir -p /var/app/current

COPY . /tmp/

RUN mv /tmp/* /var/app/current/

RUN rm -rf /tmp/*

WORKDIR /var/app/current/

RUN npm ci

# install a compatible version of sharp with alpine
RUN npm install --platform=linuxmusl --arch=x64 sharp

RUN npm run build

CMD ["npm", "run", "start:prod"]