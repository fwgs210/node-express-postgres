FROM node:12

COPY package.json package.json  
# Install app dependencies
RUN npm install
COPY . .  

EXPOSE 3000
CMD [ "npm", "start" ]