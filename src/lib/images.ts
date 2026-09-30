// Curated Unsplash photos (verified live, free-to-use license) used as
// evocative imagery across the site. `unsplash()` builds a sized/optimized
// CDN URL from a bare photo ID see https://unsplash.com/documentation#dynamically-resizable-images.
function unsplash(id: string, params = "w=1600&q=80&auto=format&fit=crop") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

// A handful of newer Unsplash uploads 404 without their search-result access
// token (ixid/ixlib) attached unlike the older grandfathered IDs above,
// which resolve with just sizing params. Verified live with the token kept.
function unsplashTokened(id: string, ixid: string) {
  return `https://images.unsplash.com/photo-${id}?ixid=${ixid}&ixlib=rb-4.1.0&w=1600&q=80&auto=format&fit=crop`;
}

export const IMAGES = {
  heroRocketLaunch: {
    src: unsplash("1517976487492-5750f3195933"),
    alt: "Rocket launch lifting off with a bright exhaust plume against a dusk sky",
  },
  stargazingMilkyWay: {
    src: unsplash("1444080748397-f442aa95c3e5"),
    alt: "Milky Way arcing over a silhouetted treeline at night",
  },
  rocketLaunchViewing: {
    src: unsplash("1614728263952-84ea256f9679"),
    alt: "Rocket ascending through clouds on a launch trajectory",
  },
  equatorialSafari: {
    src: unsplash("1521651201144-634f700b36ef"),
    alt: "Elephants walking across the African savanna at golden hour",
  },
  aerospaceMuseumDish: {
    src: unsplash("1709195325979-efb62c1f01a8"),
    alt: "Vintage tracking-station radar dish on display outdoors",
  },
  aerospaceMuseumExhibit: {
    src: unsplash("1723431620003-ec73e0ed85b9"),
    alt: "Aerospace museum exhibit with a spacecraft component on display",
  },
  militaryUav: {
    src: unsplashTokened(
      "1707660640341-bc4de41c5737",
      "M3wxMjA3fDB8MXxzZWFyY2h8MTF8fG1pbGl0YXJ5JTIwZHJvbmUlMjBVQVYlMjByZWFwZXJ8ZW58MHx8fHwxNzg0NzE4NzkwfDA"
    ),
    alt: "General Atomics MQ-9 Reaper military UAV in flight",
  },
  earthCityLights: {
    src: unsplash("1451187580459-43490279c0fa"),
    alt: "Earth at night from orbit, city lights tracing coastlines",
  },
  savannaLandscape: {
    src: unsplash("1535940360221-641a69c43bac"),
    alt: "Wide African savanna landscape under an open sky",
  },
  wildlifeGiraffe: {
    src: unsplash("1547970810-dc1eac37d174"),
    alt: "Giraffe standing in open grassland",
  },
  scubaRovPilot: {
    src: unsplashTokened(
      "1608209957132-587daea098f3",
      "M3wxMjA3fDB8MXxzZWFyY2h8N3x8c2N1YmElMjBkaXZlciUyMHVuZGVyd2F0ZXJ8ZW58MHx8fHwxNzg0NzE0NDQ1fDA"
    ),
    alt: "Diver in a full-face mask piloting underwater equipment",
  },
  forestCanopyAerial: {
    src: unsplashTokened(
      "1626657171364-4af23203469b",
      "M3wxMjA3fDB8MXxzZWFyY2h8M3x8Zm9yZXN0JTIwY2Fub3B5JTIwYWVyaWFsJTIwZHJvbmV8ZW58MHx8fHwxNzg0NzE0NDQ3fDA"
    ),
    alt: "Aerial view of dense green forest canopy",
  },
  cargoShipNight: {
    src: unsplashTokened(
      "1621697944804-d0a393f7e01a",
      "M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGNhcmdvJTIwc2hpcCUyMG5pZ2h0JTIwcG9ydHxlbnwwfHx8fDE3ODQ3MTQ0NDd8MA"
    ),
    alt: "Cargo ship docked at a port at night",
  },
  mistyHighlands: {
    src: unsplashTokened(
      "1780930090824-07c2b620f963",
      "M3wxMjA3fDB8MXxzZWFyY2h8MTV8fGdyZWVuJTIwaGlnaGxhbmRzJTIwbWlzdHklMjBoaWxsc3xlbnwwfHx8fDE3ODQ3MTU0NjF8MA"
    ),
    alt: "Misty green highland hills under a cloudy sky",
  },
  riftValleyEscarpment: {
    src: unsplashTokened(
      "1636636985438-4154b379aac5",
      "M3wxMjA3fDB8MXxzZWFyY2h8MXx8Z3JlYXQlMjByaWZ0JTIwdmFsbGV5JTIwZXNjYXJwbWVudCUyMGtlbnlhfGVufDB8fHx8MTc4NDcxNTQ2MXww"
    ),
    alt: "Rift Valley mountain range and escarpment under a cloudy sky",
  },
  indianOceanNight: {
    src: unsplashTokened(
      "1756797949315-c13d9e3f1301",
      "M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kaWFuJTIwb2NlYW4lMjBjb2FzdCUyMG5pZ2h0JTIwc3RhcnN8ZW58MHx8fHwxNzg0NzE1NDY2fDA"
    ),
    alt: "Dramatic dusk sky over a dark ocean coastline",
  },
} as const;
