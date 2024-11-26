# Step 1: Build the React/Next.js app
FROM node:18.17.0 as build
WORKDIR /app
COPY ./ ./
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm install && npm run build


# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/.next /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
