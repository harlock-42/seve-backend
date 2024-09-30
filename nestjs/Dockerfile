FROM node:20-alpine3.16

ARG PAT_TOKEN
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_PORT
ARG DB_HOST
ARG UPLOAD_FILE_PATH
ARG UPLOAD_PDF_PATH
ARG API_SECRET
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USER
ARG SMTP_PASSWORD
ARG JWT_SECRET
ARG PORT

ENV PAT_TOKEN = ${PAT_TOKEN}
ENV DB_USERNAME = ${DB_USERNAME}
ENV DB_PASSWORD = ${DB_PASSWORD}
ENV DB_DATABASE = ${DB_DATABASE}
ENV DB_PORT = ${DB_PORT}
ENV DB_HOST = ${DB_HOST}
ENV UPLOAD_FILE_PATH = ${UPLOAD_FILE_PATH}
ENV UPLOAD_PDF_PATH = ${UPLOAD_PDF_PATH}
ENV API_SECRET = ${API_SECRET}
ENV SMTP_HOST = ${SMTP_HOST}
ENV SMTP_PORT = ${SMTP_PORT}
ENV SMTP_USER = ${SMTP_USER}
ENV SMTP_PASSWORD = ${SMTP_PASSWORD}
ENV JWT_SECRET = ${JWT_SECRET}
ENV PORT = ${PORT}

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