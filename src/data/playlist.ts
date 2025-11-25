// 1. 여기에만 주소를 추가하세요. (자동으로 모든 페이지 반영)
export const musicData = [
  `그냥 틀어놓고 듣는 겨울 플리🧣 | <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/0GF9Ve4kqJXmKn21W4O3xQ?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  `(가을에) 듣는 락 | <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/57aYiyrSHqKP04ARm90UrQ?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  `Run Harder Rock Louder | <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/04hwdkpx8ZJRKdcFSCWv7I?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  `걸그룹 모음.ZIP | <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5j2s4PfRvQc2wfJUenMOUb?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  `Take a Coffe Break / 커피 한 잔 | <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/3EbTjClRMaegW1hHBdnfGf?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  "Rock Harder Lift Heavier💪 | https://open.spotify.com/playlist/2UYRSDkXa1NMp1Xc6y6kdU?si=823de504530e4d61",
  "POV : You're vibin' with me.| https://open.spotify.com/playlist/3EfB3KIAcCmIo82XEn9mh2?si=7bb321e370874e90",
  "남은 인생 10년 | https://open.spotify.com/playlist/5qufcOX9C03LnDcE6N3XeB?si=5fbfb3b67cc24e03",
  "Mozart Mayhem | https://open.spotify.com/playlist/6KGTTOd6LzbPZs1I3GG7Mj?si=e9a12b4f6227404e",
  "HIT THE GYM/RUNNIN🏃‍♀️ | https://open.spotify.com/playlist/0EWazPeaznzh1Cydl0PH7g?si=541b2db28d614194",
  "힘들고 지칠 때 | https://open.spotify.com/playlist/2imU2BhLHMx7vi3G4M0T65?si=fd4013d584dd4520",
  "(에어컨 없이 못 사는) 여름☀️ | https://open.spotify.com/playlist/3dmI1kfDKPb4HVsO1JxWRJ?si=649def43bca0444e",
  "사랑해, 보고싶다 | https://open.spotify.com/playlist/4P9JvzxkXjYo9UQkaoeA5O?si=3e73a575caba4d79",
  "(연인 없이 즐기는) 봄🌸 | https://open.spotify.com/playlist/2GockWpG6xoAOUblRA6Pk8?si=fee9503ffd114333",
  "(붕어빵 먹고 싶은) 겨울❄️ | https://open.spotify.com/playlist/3R5U0jTfbiFQYoGfxfFoNI?si=6ffd4b621f214618",
  "No Matter Rock | https://open.spotify.com/playlist/7EXXNM5Zv9EjeBLjoHqH4a?si=df94d472fcef402b",
  "No Lyrics, No Problem | https://open.spotify.com/playlist/0SCqR2BhGw0lZMmaruhFCN?si=0605b017007d42b6",
  "Not Hip-Pop, Just Hip-Hop | https://open.spotify.com/playlist/2llqHtJdNZutEzfotUNirp?si=d22b00a6476045ad",
  "GIRLtopia MotherF | https://open.spotify.com/playlist/5cGOKSYcmgX1fjjQb3hgo4?si=90003d99e0fd4d28",
  "sum:her | https://open.spotify.com/playlist/14ubugy2hqj3rdPG6i5Dga?si=b902ce8740874a08"
];

// 2. [공용 로직] 주소 변환기 (export 붙여서 내보냄)
export const getEmbedSrc = (input: string) => {
  if (!input) return "";
  let rawInput = input.trim();
  if (rawInput.includes('<iframe')) {
    const match = rawInput.match(/src=["'](.*?)["']/);
    return match ? match[1] : "";
  }
  if (rawInput.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${rawInput.split('youtu.be/')[1].split('?')[0]}`;
  }
  if (rawInput.includes('youtube.com/watch?v=')) {
    return `https://www.youtube.com/embed/${rawInput.split('v=')[1].split('&')[0]}`;
  }
  if (rawInput.includes('open.spotify.com') && !rawInput.includes('/embed')) {
     return rawInput.replace('.com/', '.com/embed/');
  }
  return rawInput;
};

// 3. [공용 로직] 파싱 함수 (export 붙여서 내보냄)
export const parseMusicEntry = (entry: string) => {
    const parts = entry.includes("|") ? entry.split("|") : ["", entry];
    const title = parts[0].trim();
    const url = parts.length > 1 ? parts.slice(1).join("|").trim() : parts[1];
    
    const src = getEmbedSrc(url);
    const isVideo = src.includes("youtube");
    const isSpotify = src.includes("spotify");
    const isApple = src.includes("apple");
    
    const displayTitle = title || (isSpotify ? "Spotify Mix" : isApple ? "Apple Music" : isVideo ? "YouTube Video" : "My Music");

    return { title: displayTitle, src, isVideo };
}