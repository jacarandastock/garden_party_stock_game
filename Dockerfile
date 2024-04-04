# use node:lts as base image
FROM node:lts

# set WORKDIR as /mini_quiz_game_fontend
WORKDIR /mini_quiz_game_fontend

# copy package.json and yarn.lock to workdir
COPY package*.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# copy all files to workdir
COPY . .

# build for production with minification
RUN yarn build

# use nginx:stable-alpine as base image
FROM nginx:stable-alpine

# copy dist folder to nginx html folder
COPY --from=0 /mini_quiz_game_fontend/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]