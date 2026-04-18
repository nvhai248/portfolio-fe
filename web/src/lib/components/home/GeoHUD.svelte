<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	interface WeatherData {
		temp: number;
		code: number;
		city: string;
	}

	let time = $state(new Date());
	let weather: WeatherData | null = $state(null);
	let isLoading = $state(true);

	// Fallback: Ho Chi Minh City
	const DEFAULT_COORDS = { lat: 10.762622, lon: 106.660172, city: 'Ho Chi Minh City' };

	onMount(() => {
		// 1. Clock Logic
		const clockInterval = setInterval(() => {
			time = new Date();
		}, 1000);

		// 2. Geolocation & Weather Logic
		const fetchWeather = async (lat: number, lon: number, cityName: string) => {
			try {
				const res = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
				);
				const data = await res.json();
				weather = {
					temp: Math.round(data.current_weather.temperature),
					code: data.current_weather.weathercode,
					city: cityName
				};
			} catch (e) {
				console.error('Weather fetch error:', e);
			} finally {
				isLoading = false;
			}
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Local');
				},
				() => {
					fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.city);
				},
				{ timeout: 5000 }
			);
		} else {
			fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, DEFAULT_COORDS.city);
		}

		return () => clearInterval(clockInterval);
	});

	const getWeatherIcon = (code: number) => {
		if (code === 0) return 'wb_sunny';
		if (code <= 3) return 'cloud';
		if (code >= 51 && code <= 67) return 'rainy';
		if (code >= 71 && code <= 77) return 'ac_unit';
		if (code >= 95) return 'thunderstorm';
		return 'partly_cloudy_day';
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	};
</script>

<Reveal type="fade" delay={800} duration={1000}>
	<div class="glass-card flex flex-col items-end gap-2 overflow-hidden rounded-[2.5rem] p-7 shadow-3xl transition-all duration-500 hover:border-primary/20 dark:hover:border-blue-500/20">
		<div class="flex flex-col items-end">
			<span class="font-mono text-4xl font-black tracking-tighter [color:var(--ui-text)] sm:text-5xl">
				{formatTime(time)}<span class="animate-pulse opacity-50">:</span><span class="text-2xl opacity-40">{time.getSeconds().toString().padStart(2, '0')}</span>
			</span>
			<span class="text-[0.7rem] font-black uppercase tracking-[0.3em] [color:var(--ui-text-subtle)]">
				{formatDate(time)}
			</span>
		</div>

		<div class="mt-4 flex items-center gap-4 border-t [border-color:var(--ui-border)] pt-5">
			{#if isLoading}
				<div class="flex items-center gap-2 animate-pulse">
					<div class="h-6 w-6 rounded-full [background-color:var(--ui-bg-muted)]"></div>
					<div class="h-4 w-16 rounded [background-color:var(--ui-bg-muted)]"></div>
				</div>
			{:else if weather}
				<div class="flex flex-col items-end">
					<div class="flex items-center gap-4">
						<span class="material-symbols-outlined text-3xl [color:var(--ui-primary)] dark:text-blue-400">
							{getWeatherIcon(weather.code)}
						</span>
						<span class="text-2xl font-black [color:var(--ui-text)]">{weather.temp}°C</span>
					</div>
					<span class="text-[0.65rem] font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">
						{weather.city}
					</span>
				</div>
			{/if}
		</div>
	</div>
</Reveal>
