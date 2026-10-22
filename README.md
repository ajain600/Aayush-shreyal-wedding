# Wedding invitation (static site)

    index.html
    css/styles.css
    js/config.js      <- EDIT THIS: names, parents, dates, venues, contact numbers, media paths
    js/script.js
    images/           <- your JPGs / PNGs (see images/README.txt)
    media/            <- your videos / audio (see media/README.txt)

## 1. Edit
Open js/config.js and set names, dates, venues and RSVP contact numbers. Drop your own files into images/ and media/.

## 2. Test locally (needs Node.js)
    cd wedding-invite
    npx serve .
Open the address it prints. To test on your phone use http://<your-PC-IP>:3000 on the same Wi-Fi.

## 3. Push to GitHub
Create an empty repository on github.com (no README), then inside this folder:
    git init
    git add .
    git commit -m "Wedding invitation"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
    git push -u origin main

## 4. Host on Vercel (free)
vercel.com -> sign in with GitHub -> Add New -> Project -> import the repo -> leave settings as they are (framework "Other") -> Deploy.
Every later `git push` updates the live site.

## 5. Domain
Vercel project -> Settings -> Domains -> add yourdomain.com and www.yourdomain.com. At your registrar add the records Vercel shows:
    A      @     76.76.21.21 (or the value on the Vercel card)
    CNAME  www   value shown on the Vercel card
Remove old A / CNAME / AAAA records for @ and www. Wait for "Valid Configuration".
