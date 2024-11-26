FROM node:18.20.1
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 3000
CMD ["node", "patient-service.js"]

