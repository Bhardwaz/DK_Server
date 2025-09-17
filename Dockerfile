FROM node:20-alpine

WORKDIR /home/app
COPY package*.json .
RUN npm install

# Copy rest of the source code
COPY . .

# Expose app port
EXPOSE 4001

# Start app
CMD ["npm", "start"]
