import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './MorphingParticles.css';

const MorphingParticles = ({
    mode = 'cursor',
    targetRef = null,
    color1 = '#676A72',
    color2 = '#FF4641',
    color3 = '#346BF1',
    particleCount = 2500
}) => {
    const containerRef = useRef();
    const canvasRef = useRef();
    const mouse = useRef({ x: 0, y: 0 });
    const targetBounds = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const currentMode = useRef(mode);

    useEffect(() => {
        currentMode.current = mode;
    }, [mode]);

    useEffect(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            0.1, 2000
        );
        camera.position.z = 1000;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });

        const updateSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            camera.left = width / -2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = height / -2;
            camera.updateProjectionMatrix();
        };
        updateSize();

        // Particle Data
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const rotations = new Float32Array(particleCount);

        const ambientData = new Float32Array(particleCount * 3);
        const driftSpeeds = new Float32Array(particleCount);
        const driftPhase = new Float32Array(particleCount);
        const borderAssigned = new Uint8Array(particleCount);

        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);
        const c3 = new THREE.Color(color3);
        const palette = [c1, c2, c3];

        for (let i = 0; i < particleCount; i++) {
            // Random spread for ambient mode
            ambientData[i * 3] = (Math.random() - 0.5) * window.innerWidth * 1.5;
            ambientData[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight * 1.5;
            ambientData[i * 3 + 2] = 0;

            positions[i * 3] = ambientData[i * 3];
            positions[i * 3 + 1] = ambientData[i * 3 + 1];
            positions[i * 3 + 2] = 0;

            // Use original palette colors
            const col = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;

            // Smaller size now — elongation handled in shader (Made 3x smaller)
            sizes[i] = (Math.random() * 16 + 10) / 2;

            // Random rotation per particle for rice-grain orientation
            rotations[i] = Math.random() * Math.PI;

            driftSpeeds[i] = 0.0001 + Math.random() * 0.0005;
            driftPhase[i] = Math.random() * Math.PI * 2;

            // Assign only a portion to border to keep the background alive
            borderAssigned[i] = Math.random() < 0.4 ? 1 : 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));

        // Keep a copy of base sizes so we can restore them when cursor moves away
        const baseSizes = new Float32Array(sizes);

        const material = new THREE.PointsMaterial({
            size: 2, // Also decreased base size
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: false
        });

        // Shader: per-particle size attribute + rice-grain (elongated ellipse) shape with rotation
        material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                'uniform float size;',
                'attribute float size;\nattribute float rotation;\nvarying float vRotation;'
            );
            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size;',
                'gl_PointSize = size * 1.0;\nvRotation = rotation;' // Removed the 3.0x multiplier
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                `varying float vRotation;
                void main() {
                    vec2 p = gl_PointCoord - vec2(0.5);
                    float c = cos(vRotation);
                    float s = sin(vRotation);
                    vec2 rotated = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
                    // Elongated ellipse: thin on x, long on y → rice shape
                    float d = (rotated.x * rotated.x) / (0.12 * 0.12) + (rotated.y * rotated.y) / (0.45 * 0.45);
                    if(d > 1.0) discard;
                `
            );
        };

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const onMouseMove = (event) => {
            mouse.current.x = event.clientX - window.innerWidth / 2;
            mouse.current.y = -(event.clientY - window.innerHeight / 2);
        };

        window.addEventListener('mousemove', onMouseMove);

        const updateTargetBounds = () => {
            if (currentMode.current === 'border' && targetRef?.current) {
                const rect = targetRef.current.getBoundingClientRect();
                targetBounds.current = {
                    x: rect.left - window.innerWidth / 2 + rect.width / 2,
                    y: -(rect.top - window.innerHeight / 2 + rect.height / 2),
                    width: rect.width,
                    height: rect.height
                };
            }
        };

        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 1;
            updateTargetBounds();

            const posAttr = particles.geometry.attributes.position;
            const posArray = posAttr.array;

            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                const x = posArray[idx];
                const y = posArray[idx + 1];

                let tx, ty;

                if (currentMode.current === 'border' && targetRef?.current && borderAssigned[i]) {
                    const b = targetBounds.current;
                    const radius = 24; // Approximate button border-radius

                    // Total perimeter of a rounded rectangle
                    const straightW = Math.max(0, b.width - 2 * radius);
                    const straightH = Math.max(0, b.height - 2 * radius);
                    const perimeter = 2 * straightW + 2 * straightH + 2 * Math.PI * radius;

                    // Map particle index to a position along the perimeter
                    const p = i / particleCount;
                    // Add a tiny slow rotation over time (SLOWER)
                    const offsetP = (p + time * 0.00005) % 1.0;
                    let dist = offsetP * perimeter;

                    // Organic, breathing thickness based on time and position (SLOWER)
                    const pulse = Math.sin(time * 0.01 + i) * 8;
                    const thickness = (Math.random() - 0.5) * (15 + pulse);
                    const jitter = (Math.random() - 0.5) * 15;

                    // Compute (tx, ty) along the rounded rectangle path
                    if (dist < straightW) {
                        // Top edge
                        tx = b.x - straightW / 2 + dist;
                        ty = b.y + b.height / 2;
                    } else if (dist < straightW + (Math.PI / 2) * radius) {
                        // Top-right corner
                        const angle = ((dist - straightW) / (Math.PI / 2 * radius)) * (Math.PI / 2);
                        tx = b.x + straightW / 2 + Math.sin(angle) * radius;
                        ty = b.y + straightH / 2 + Math.cos(angle) * radius;
                    } else if (dist < straightW + straightH + (Math.PI / 2) * radius) {
                        // Right edge
                        tx = b.x + b.width / 2;
                        ty = b.y + straightH / 2 - (dist - (straightW + (Math.PI / 2) * radius));
                    } else if (dist < straightW + straightH + Math.PI * radius) {
                        // Bottom-right corner
                        const angle = Math.PI / 2 + ((dist - (straightW + straightH + (Math.PI / 2) * radius)) / (Math.PI / 2 * radius)) * (Math.PI / 2);
                        tx = b.x + straightW / 2 + Math.sin(angle) * radius;
                        ty = b.y - straightH / 2 + Math.cos(angle) * radius;
                    } else if (dist < 2 * straightW + straightH + Math.PI * radius) {
                        // Bottom edge
                        tx = b.x + straightW / 2 - (dist - (straightW + straightH + Math.PI * radius));
                        ty = b.y - b.height / 2;
                    } else if (dist < 2 * straightW + straightH + 1.5 * Math.PI * radius) {
                        // Bottom-left corner
                        const angle = Math.PI + ((dist - (2 * straightW + straightH + Math.PI * radius)) / (Math.PI / 2 * radius)) * (Math.PI / 2);
                        tx = b.x - straightW / 2 + Math.sin(angle) * radius;
                        ty = b.y - straightH / 2 + Math.cos(angle) * radius;
                    } else if (dist < 2 * straightW + 2 * straightH + 1.5 * Math.PI * radius) {
                        // Left edge
                        tx = b.x - b.width / 2;
                        ty = b.y - straightH / 2 + (dist - (2 * straightW + straightH + 1.5 * Math.PI * radius));
                    } else {
                        // Top-left corner
                        const angle = 1.5 * Math.PI + ((dist - (2 * straightW + 2 * straightH + 1.5 * Math.PI * radius)) / (Math.PI / 2 * radius)) * (Math.PI / 2);
                        tx = b.x - straightW / 2 + Math.sin(angle) * radius;
                        ty = b.y + straightH / 2 + Math.cos(angle) * radius;
                    }

                    // Apply thickness and jitter normal to the curve (approximated here as uniform scatter)
                    tx += jitter;
                    ty += thickness;
                } else {
                    // Ambient drift
                    const shiftX = Math.sin(time * driftSpeeds[i] + driftPhase[i]) * 300;
                    const shiftY = Math.cos(time * driftSpeeds[i] * 0.8 + driftPhase[i]) * 300;

                    tx = ambientData[idx] + shiftX;
                    ty = ambientData[idx + 1] + shiftY;

                    // Mouse attraction
                    const dx = mouse.current.x - tx;
                    const dy = mouse.current.y - ty;
                    const distMouse = Math.sqrt(dx * dx + dy * dy);
                    if (distMouse < 600) {
                        tx += dx * (1 - distMouse / 600) * 0.4;
                        ty += dy * (1 - distMouse / 600) * 0.4;
                    }
                }

                const lerpSpeed = (currentMode.current === 'border' && borderAssigned[i]) ? 0.06 : 0.025;
                posArray[idx] += (tx - x) * lerpSpeed;
                posArray[idx + 1] += (ty - y) * lerpSpeed;
            }

            posAttr.needsUpdate = true;

            // Boost particle size near cursor
            const sizeAttr = particles.geometry.attributes.size;
            const sizeArray = sizeAttr.array;
            const mx = mouse.current.x;
            const my = mouse.current.y;
            const cursorRadius = 180;
            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                const dx = mx - posArray[idx];
                const dy = my - posArray[idx + 1];
                const d = Math.sqrt(dx * dx + dy * dy);
                const boost = d < cursorRadius ? 1.0 + (1.0 - d / cursorRadius) * 1.0 : 1.0;
                sizeArray[i] = baseSizes[i] * boost;
            }
            sizeAttr.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', updateSize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', updateSize);
            renderer.dispose();
        };
    }, [particleCount, color1, color2, color3, targetRef]);

    return (
        <div className="morphing-particles-container" ref={containerRef}>
            <canvas className="morphing-particles-canvas" ref={canvasRef} />
        </div>
    );
};

export default MorphingParticles;
