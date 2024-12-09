FROM node:20

WORKDIR /src

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn add

COPY . .

EXPOSE 3000

# Run the server
CMD ["node", "server.js"]