/* ================= EDIT EVERYTHING IN THIS FILE ================= */
window.INVITE = {
  groom: "Aayush",
  bride: "Shreyal",
  invocation: "श्री महावीराय नमः",
  groomParents: "S/o Shri Mukesh Saraf & Smt. Anju Saraf",
  brideParents: "D/o Shri Manish Modi & Smt. Seema Modi",
  dateDisplay: "24 November 2026",
  reveal: { day: "Tuesday", date: "24th November", year: "2026", time: "8:00 PM onwards" },
  countdownTo: "2026-11-24T19:00:00+05:30",   // the wedding (Barat)
  /* RSVPs and wishes open WhatsApp to the FIRST number; the guest then sees one-tap buttons to send the same
     message to the others. Format: country code + number, no + or spaces (91 = India). "name" is optional. */
  contacts: [
    { name: "", number: "919713543026" },
    { name: "", number: "919691020600" },
    { name: "", number: "916232400718" }
  ],

  /* Your own media. Same folder layout as the reference pack: put files in images/ and media/ with these names.
     Every slot is optional - a missing file falls back to built-in artwork. */
  media: {
    entranceVideo: "media/entrance-background.mp4",          // loops behind the names on the first screen (the intro video)
    entrancePoster: "images/entrance-video-poster.jpg",      // JPG shown while the intro video loads
    transitionVideo: "media/palace-opening-transition.mp4",  // optional second video that plays after "Open Invitation"
    transitionPoster: "images/transition-poster.jpg",
    transitionSpeed: 1.7,                                    // gate-opening video speed: 1 = normal, 1.7 = a lot faster, 2 = twice as fast
    gardenVideo: "media/formal-garden-background.mp4",       // optional video behind "We are getting married"
    gardenPoster: "images/formal-garden-poster.jpg",         // JPG background behind "We are getting married" (also the video's poster)
    symbol: "images/swastik.png",                              // symbol at the top of the hero (replaces ganeshji.png)
    image: ["images/mehndi-portrait.jpg",
            "images/haldi-portrait.jpg",
            "images/sangeet-portrait.jpg",
            "images/barat-portrait.jpg",
            "images/Phere-portrait.jpg"],
    photos: "images/imagesgallery-01.jpg"
  },


  /* Auto scroll: starts by itself after the invitation opens; touching the screen pauses it and it resumes after resumeAfter ms.
     speed = pixels per second (lower = slower). Set auto: false if you only want the button. */
  autoScroll: { auto: true, speed: 70, startDelay: 2500, resumeAfter: 5000 },

  music: { youtubeId: "", file: "media/background-music.mp3" },

   photos: [
    { src: "images/imagesgallery-01.jpg", caption: "Our little moments" },
   
  ],

  venues: [
    { name: "Station Road, Mungaoli", addr: "103/105 Station Road, Mungaoli, Madhya Pradesh", q: "103/105 Station Road, Mungaoli",
      link: "https://maps.app.goo.gl/GUAk7GgVAKHmEEsR9" },
    { name: "Silk Route, Chanderi",   addr: "Silk Route, Chanderi, Madhya Pradesh",            q: "Silk Route, Chanderi" }
  ],

  /* image: your own illustration/photo for each card (portrait, about 4:5). Missing file = built-in Hindi-title card. */
  events: [
    { hi: "मेहंदी", name: "Mehndi Ceremony", date: "Sunday, 22 November 2026",  short: "22 November 2026", time: "2:00 PM onwards",  venue: 0, color: "#2f5d3a", image: "images/mehndi-portrait.jpg",
      desc: "An afternoon of mehndi, music and laughter as our celebrations begin." },
    { hi: "संगीत",  name: "Sangeet Night",   date: "Monday, 23 November 2026",  short: "23 November 2026", time: "7:00 PM onwards",  venue: 1, color: "#5b2a6e", image: "images/sangeet-portrait.jpg",
      desc: "An evening of songs, dance and joy with family and friends." },
    { hi: "हल्दी",  name: "Haldi Ceremony",  date: "Tuesday, 24 November 2026", short: "24 November 2026", time: "10:00 AM onwards", venue: 1, color: "#a8741a", image: "images/haldi-portrait.jpg",
      desc: "Haldi, laughter and heartfelt blessings on the morning of the wedding." },
    { hi: "फेरे",  name: "Wedding Ceremony",  date: "Tuesday, 24 November 2026", short: "24 November 2026", time: "02:00 PM onwards", venue: 1, color: "#a8741a", image: "images/Phere-portrait.jpg",
      desc: "Two souls, one sacred fire, and a lifetime of togetherness — the Phere." },

    { hi: "बारात",  name: "Barat",           date: "Tuesday, 24 November 2026", short: "24 November 2026", time: "7:00 PM onwards",  venue: 1, color: "#741e2c", image: "images/barat-portrait.jpg",
      desc: "Join us as the baraat arrives and our wedding celebrations begin." }
  ]
};
