# Intro

I advise you to use a 3rd party lib like [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber). But if your project cannot accept 3rd party packages because of lake of resource or anything else you can use the introduced regex in this repo.

# Wrong regexs

-   `/^[a-zA-Z0-9\-().\s]{10,15}$/`
-   `/^\d{7,}$/`
