FROM node:22.14.0

WORKDIR /app

COPY . .
# RUN npm i


EXPOSE 3000
ENV PORT=3000


RUN npm ci --no-audit
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]