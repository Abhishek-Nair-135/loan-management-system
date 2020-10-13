FROM node:12
WORKDIR /loan-app

COPY package*.json ./

RUN npm install

COPy . /loan-app

EXPOSE 3000
CMD ["npm", "test"]