FROM node:alpine

WORKDIR /app

# `/app/node_modules/.bin`을 $PATH 에 추가
ENV PATH /app/node_modules/.bin:$PATH

# COPY ./frontend/package*.json ./
COPY ./frontend/package*.json ./

RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# RUN npm install react-scripts@3.4.1 -g

CMD ["npm", "start"]