# Folosim imaginea oficială Node ca bază
FROM node:18-alpine

# Setăm directorul de lucru în container
WORKDIR /app

# Copiem fișierele package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele
RUN npm install

# Copiem restul codului aplicației
COPY . .

# Construim proiectul pentru producție
RUN npm run build

# Folosim un server static pentru a servi fișierele build-uite
# De exemplu, folosim "serve" (instalat global)
RUN npm install -g serve

# Expunem portul pe care va rula aplicația (default 3000 pentru serve)
EXPOSE 3000

# Comanda pentru a porni serverul static
CMD ["serve", "-s", "dist", "-l", "3000"]
