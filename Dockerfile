FROM node:20

WORKDIR /src

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN yarn

RUN yarn migrate

COPY . .

EXPOSE 6666

# Run the server
CMD ["yarn", "start"]

