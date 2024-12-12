FROM node:20

WORKDIR /

# Copy package files
COPY package.json yarn.lock ./src ./

# Install dependencies with yarn
RUN ["yarn"]

# RUN ["node", "./src/db/migrations/createSchema.js"]

# RUN ["yarn", "migrate"]

COPY . .

EXPOSE 16666

# Run the server
CMD ["yarn", "game"]

