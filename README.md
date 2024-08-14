![Logo](public/logos/real-estate-care-logo.png)
# Project Title: Real Estate Care

### Description
This project is build with [Ionic/vue](https://ionicframework.com/docs/vue/overview).

## State Management
State Management is done with [Pinia](https://pinia.vuejs.org/).

## Typescript disabled
This project was build with plain JS.

## Latest app version is on the main branch

## Install project
```sh
npm install
```

## Ionic CLI is needed
```sh
npm install -g @ionic/cli@latest
```
## Demo user account
- Username: user
- Password: 123

## Start server
```sh
ionic serve
```

## HTTP Client
Uses [axios](https://axios-http.com/docs/intro) for api calls. (installed with "npm install")
```sh
npm install axios
```

## CSS Pre-processor
Uses sass for better CSS. (Installed with "npm install")
```sh
npm install -D sass
```

## Vue PDF renderer.
Uses [vue-pdf-embed](https://github.com/hrynko/vue-pdf-embed) to render pdf files and pdf objects. (Installed with "npm install")
```sh
npm install -d vue-pdf-embed
```

## Dummy data
- Data db: <br/>Uses [RealEstateCareJSON](https://json-real-estate-care-3167f11da290.herokuapp.com/) for dummy data. 
It's my private heroku JSON server. [GitHub](https://github.com/BabyLizzy-FunTime-Lab/JsonRealEstateCare)
- Media: <br/>Images and PDF's are stored and fetched as Base64 encoded strings, on and from 
[RealEstateCareJSON](https://json-real-estate-care-3167f11da290.herokuapp.com/).

## Error notes
- Blocked aria-hidden:<br/> 
This error appears to originate from the datepicker npm package used in this app. I haven't used the aria-hidden
attribute in this application.
- PDF encoding issues:<br/>
Under the modifications part of an inspection, it is possible to safe and view a pdf. I am getting 
warnings in the console regarding this process. The component works, but needs more work to resolve
these issues.

