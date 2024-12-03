# html-to-pdf

## Description

This project aims to ease the conversion from HTML pages to PDF file.
By sending an HTML file to this API, you get a ReadableStream containing your HTML content into a PDF file.

## How to use it?

To use this API, you have to send a POST request with a multipart/form-data body containing your HTML file.

## Project setup

This project needs to have `chromium` installed. It must be in `usr/bin/chromium`

To install all the Node dependencies:

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment
