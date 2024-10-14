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
This app uses sass. (Installed with "npm install")
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
It's my private [Heroku](https://www.heroku.com/home) JSON server. [GitHub](https://github.com/BabyLizzy-FunTime-Lab/JsonRealEstateCare)
- Media: <br/>Images and PDF's are stored and fetched as Base64 encoded strings, on and from 
[RealEstateCareJSON](https://json-real-estate-care-3167f11da290.herokuapp.com/). Some of the demo data gets served from my [Cloudinary](https://cloudinary.com/) account.

## 2-Factor Authentication and login are simulated
At login one must input a simple code to simulate a 2Way Authentication. 
The input code and the dummy code provided by the JSON server are compared in the LoginStore. 
This check would normally take place on the server and the secret code would be generated by a third party service and 
fetched on the server. The login action is also executed on the client side. This is a security problem. Unfortunately
my JSON server isn't capable of running these checks. But a proper server could. This will be fixed in future versions 
of the app.

## Security 
The app prevents code injection by sanitizing inputs values with the sanitizer.js service. However, this is only done 
client side. Ideally inputs should also be sanitized at server side. Unfortunately, my JSON server isn't capable of 
running these kinds of operations.<br/> 
Security issues related to routing and database operations will also be addressed when using a proper server that is
capable of more complex operations. 

## Usability
[Wave](https://wave.webaim.org/) was used to check for major errors in web content accessibility. The RealEstateCare
app triggers no major errors nor alerts. However, there is room for improvement in the structural elements. The WCAG
guidelines are organized around four core principles, often summarized as POUR (Perceivable, Operable, 
Understandable, and Robust). More points of improvement where found after assessing the app on these principles. 
For example, highlighting focus points properly when navigating the app with the TAB button.<br/>
Any further improvements in usability will be added in the next version of the RealEstateCare app.

## Web-design Principals
The 10 guidelines of 
[Jakob Nielsen](https://www.cursuswp.com/10-heuristieken-jakob-nielsen-webdesign-principes-regels-vuistregels-webdesign/)
where followed to provide a positive user experience. The RealEstateCare app provides feedback to the user based on
actions taken and it also provides convenient context sensitive actions. This includes "back buttons", an "undo changes 
button" when updating data and dynamically generated success and fail alerts. I also gave special attention to providing 
the user with a familiar experience and to consistency in style and views.

## Style guides and best practices Ionic & Vue.js 
I endeavoured to follow the style guides and best practices of both Ionic and Vue.js as closely as possible.
Close attention was given to naming conventions and coding conventions. I also stuck to the theming style of ionic
by altering the css without changing the structure. I also used the style guides provided by Vue.js. 
Any changes made to the style where made in scoped scss and using custom names for the modified elements.
 
## Error notes
- Blocked aria-hidden:<br/> 
This error appears to originate from the datepicker npm package used in this app. I haven't used the aria-hidden
attribute in this application.
- PDF encoding issues:<br/>
Under the modifications part of an inspection, it is possible to save and view a pdf. I am getting 
warnings in the console regarding this process. The component works, but needs more work to resolve
these issues.

