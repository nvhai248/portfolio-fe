// src/lib/stores/music.svelte.ts
import { browser } from '$app/environment';

const songFiles = [
	"BTS - Dynamite (Audio).mp3",
	"Bad Bunny, Jhay Cortez - DÁKITI (Audio).mp3",
	"Billie Eilish, ROSALÍA - Lo Vas A Olvidar   Euphoria OST.mp3",
	"Calling My Phone.mp3",
	"Cardi B - Up [Official Audio].mp3",
	"DJ Khaled ft. Drake - POPSTAR (Official Audio).mp3",
	"Doja Cat - Streets (Audio).mp3",
	"HOLIDAY.mp3",
	"Harry Styles - Treat People With Kindness (Official Audio).mp3",
	"Harry Styles - Watermelon Sugar (Official Audio).mp3",
	"Justin Bieber - Anyone (Visualizer).mp3",
	"Kygo, Donna Summer - Hot Stuff (Audio).mp3",
	"Madison Beer - Baby (Official Audio).mp3",
	"Martin Garrix - Pressure (ft. Tove Lo).mp3",
	"Miley Cyrus & Dua Lipa - Prisoner (Audio).mp3",
	"Shawn Mendes, Justin Bieber - Monster.mp3",
	"Silk City, Ellie Goulding - New Love (Official Audio) ft. Diplo, Mark Ronson.mp3",
	"Sweet Melody - Little Mix (Official Audio).mp3",
	"The Kid LAROI - WITHOUT YOU (Official Audio).mp3",
	"The Weeknd - Blinding Lights (Official Audio).mp3",
	"The Weeknd - Save Your Tears (Official Audio).mp3",
	"Travis Scott, HVME - Goosebumps (Remix - Official Audio).mp3",
	"drivers license.mp3"
];

const covers = [
	'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&h=600&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&h=600&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&h=600&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&h=600&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&h=600&auto=format&fit=crop',
];

export type Track = {
	id: number;
	title: string;
	artist: string;
	src: string;
	cover: string;
};

const fullPlaylist = songFiles.map((file, i) => {
	const parts = file.replace('.mp3', '').split(' - ');
	return {
		id: i,
		title: parts[1] || parts[0],
		artist: parts[1] ? parts[0] : 'Unknown Artist',
		src: `/songs/${file}`,
		cover: covers[i % covers.length]
	};
});

class MusicStore {
	playlist = $state<Track[]>(fullPlaylist);
	currentTrackIndex = $state(0);
	paused = $state(true);
	currentTime = $state(0);
	duration = $state(0);
	volume = $state(0.8);
	hasInteracted = $state(false); // To detect if user ever played music to show FAB dynamically

	get currentTrack() {
		return this.playlist[this.currentTrackIndex];
	}

	get isPlaying() {
		return !this.paused;
	}

	play() {
		this.paused = false;
		this.hasInteracted = true;
	}

	pause() {
		this.paused = true;
	}

	toggle() {
		this.paused = !this.paused;
		this.hasInteracted = true;
	}

	nextTrack() {
		this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
	}

	prevTrack() {
		this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
	}

	jumpToTrack(index: number) {
		this.currentTrackIndex = index;
		this.hasInteracted = true;
	}
}

export const musicStore = new MusicStore();

if (browser) {
	try {
		const saved = localStorage.getItem('portfolio-music-state-v1');
		if (saved) {
			const parsed = JSON.parse(saved);
			if (typeof parsed.currentTrackIndex === 'number' && parsed.currentTrackIndex < musicStore.playlist.length && parsed.currentTrackIndex >= 0) {
				musicStore.currentTrackIndex = parsed.currentTrackIndex;
			}
			if (typeof parsed.volume === 'number') {
				musicStore.volume = parsed.volume;
			}
		}
	} catch (e) {}
}
