FROM node:20

WORKDIR /src

# Copy package files
COPY D:\Dev\Sparta\team\oreno-turn-BE\package.json D:\Dev\Sparta\team\oreno-turn-BE\yarn.lock ./

# Install dependencies with yarn
RUN ["yarn"]

RUN ["yarn", "migrate"]

COPY . .

EXPOSE 6666

# Run the server
CMD ["yarn", "lobby"]

