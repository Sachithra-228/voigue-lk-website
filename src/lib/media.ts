/**
 * Every swappable photo / video on the site lives here.
 * Leave a value empty ("") to render the neutral placeholder; set it to a path under /public
 * (e.g. "/images/home/hero-1.mp4") or a full https URL once the real asset is supplied.
 */
export const media = {
  home: {
    /** Short looping moments cut from the promo footage; they play one after another behind the hero copy. */
    heroClips: [] as string[],
    heroPoster: "",
    foundation: "",
    experience: { culture: "", trust: "", growth: "" }
  },
  about: {
    hero: "",
    future: ""
  },
  life: {
    heroVideo: "",
    heroPoster: "",
    peopleTeam: "",
    peoplePortrait: "",
    peopleMoment: "",
    /** YouTube video ID of the full promotional video (the part after v= in the URL). */
    promoYouTubeId: ""
  },
  careers: {
    hero: "",
    remote: "",
    hybrid: "",
    onsite: ""
  }
};
