<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float, ContactShadows, Grid } from '@threlte/extras';
	import * as THREE from 'three';

	interface Props {
		isDark: boolean;
		isMobile?: boolean;
		isTablet?: boolean;
		pointer?: { x: number; y: number };
		scrollProgress?: number;
	}

	let {
		isDark,
		isMobile = false,
		isTablet = false,
		pointer = { x: 0, y: 0 },
		scrollProgress = 0
	}: Props = $props();

	// Generate nodes representing "services"
	const nodeCount = $derived(isMobile ? 3 : isTablet ? 8 : 15);
	const nodes = $derived(
		Array.from({ length: nodeCount }, (_, i) => ({
			position: new THREE.Vector3(
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 6 + 2,
				(Math.random() - 0.5) * 8
			),
			id: i,
			scale: 0.08 + Math.random() * 0.18,
			speed: 0.3 + Math.random() * 0.8,
			offset: Math.random() * Math.PI * 2
		}))
	);

	// Create connections between nearby nodes
	const edges = $derived(
		nodes
			.map((node) => {
				return [...nodes]
					.filter((n) => n.id !== node.id)
					.sort((a, b) => a.position.distanceTo(node.position) - b.position.distanceTo(node.position))
					.slice(0, 2)
					.map((target) => ({ start: node.position, end: target.position }));
			})
			.flat()
	);

	const primaryColor = '#0b63b8';

	// Interaction & Animation State
	let rotation = $state(0);
	let parallaxX = $state(0);
	let parallaxY = $state(0);
	let entranceZ = $state(30); // Start far away
	let time = $state(0);
	const targetZ = $derived(isMobile ? 18 : 14);

	// 4. Scroll response (Computed)
	const scrollShift = $derived(scrollProgress * 5);
	const opacityScale = $derived(Math.max(0, 1 - scrollProgress * 1.5));

	useTask((delta) => {
		if (opacityScale <= 0) return;
		time += delta;

		// 1. Entrance Fly-in (Damped)
		entranceZ = THREE.MathUtils.lerp(entranceZ, targetZ, 0.02);

		// 2. Idle Base Rotation
		rotation += delta * 0.06;

		// 3. Pointer Parallax (Damped)
		const targetPX = pointer.x * 1.2;
		const targetPY = pointer.y * 0.8;
		parallaxX = THREE.MathUtils.lerp(parallaxX, targetPX, 0.04);
		parallaxY = THREE.MathUtils.lerp(parallaxY, targetPY, 0.04);
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[parallaxX, 4 + parallaxY + scrollShift, entranceZ]}
	fov={35}
/>

<T.AmbientLight intensity={isDark ? 0.4 : 0.8} />
<T.DirectionalLight position={[10, 10, 10]} intensity={1} />
<T.PointLight position={[-5, 5, 5]} intensity={2 * opacityScale} color={primaryColor} />

<T.Group rotation.y={rotation} scale={opacityScale}>
	<!-- Nodes -->
	{#each nodes as node}
		<Float speed={node.speed} rotationIntensity={0.5} floatIntensity={0.8}>
			<T.Mesh position={node.position.toArray()}>
				<T.SphereGeometry args={[node.scale, 32, 32]} />
				<T.MeshStandardMaterial
					color={primaryColor}
					emissive={primaryColor}
					emissiveIntensity={(0.4 + Math.sin(time * 2 + node.offset) * 0.3) * (isDark ? 3.5 : 1.2)}
					roughness={0.05}
					metalness={0.9}
				/>
			</T.Mesh>
		</Float>
	{/each}

	<!-- Edges (Network connections) -->
	{#each edges as edge}
		<T.Mesh>
			<T.TubeGeometry
				args={[new THREE.CatmullRomCurve3([edge.start, edge.end]), 1, 0.012, 8, false]}
			/>
			<T.MeshBasicMaterial
				color={primaryColor}
				transparent
				opacity={(0.08 + Math.sin(time * 3) * 0.04) * (isDark ? 1 : 0.5)}
			/>
		</T.Mesh>
	{/each}
</T.Group>

<!-- Subtle Grid Floor -->
<Grid
	position.y={0}
	cellColor={primaryColor}
	sectionColor={primaryColor}
	sectionThickness={0}
	fadeDistance={25}
	cellSize={1}
	infiniteGrid
	transparent
	opacity={0.05 * opacityScale}
/>

{#if isDark}
	<ContactShadows
		opacity={0.4 * opacityScale}
		blur={2}
		scale={20}
		far={10}
		color={primaryColor}
	/>
{/if}
