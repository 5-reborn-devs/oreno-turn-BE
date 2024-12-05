FROM node:20

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn install --production

COPY . .

EXPOSE 3000

# Run the server
CMD ["node", "src/server.js"]