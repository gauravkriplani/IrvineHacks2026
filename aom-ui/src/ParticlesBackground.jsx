import { useEffect, useRef } from 'react';

export default function ParticlesBackground({ hoverTargetRef, isHovering }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const particles = [];
        const particleCount = 200; // Dense enough to form a visible outline

        // Color palette inspired by the screenshot dots: deep blue, soft purple, sunset orange, light grey
        const colors = [
            'rgba(30, 80, 200, 0.8)',
            'rgba(140, 60, 180, 0.7)',
            'rgba(220, 80, 60, 0.8)',
            'rgba(150, 150, 150, 0.6)'
        ];

        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        setSize();
        window.addEventListener('resize', setSize);

        // Global mouse default center
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            if (!isHovering) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });

        class Particle {
            constructor() {
                this.reset();
                // Randomize initial position so they aren't all born in the center at once
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }

            reset() {
                this.x = width / 2;
                this.y = height / 2;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.4 + 0.1;
                this.radius = Math.random() * 1.2 + 0.8;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = 0;
                this.distance = 0;
                // Random offset for shape snapping so they don't all go to the same pixel
                this.shapeOffset = Math.random();
            }

            // Helper to get a point on a pill (stadium) perimeter
            getPillPoint(rect) {
                const { left, top, width, height } = rect;
                const r = height / 2;
                const L = width - height; // Linear segment length
                const perimeter = 2 * L + 2 * Math.PI * r;
                let pos = this.shapeOffset * perimeter;

                // 1. Bottom straight
                if (pos < L) return { x: left + r + pos, y: top + height };
                pos -= L;
                // 2. Right semicircle
                if (pos < Math.PI * r) {
                    const a = -Math.PI / 2 + (pos / r);
                    return { x: left + width - r + Math.cos(a) * r, y: top + r + Math.sin(a) * r };
                }
                pos -= Math.PI * r;
                // 3. Top straight
                if (pos < L) return { x: left + width - r - pos, y: top };
                pos -= L;
                // 4. Left semicircle
                const a = Math.PI / 2 + (pos / r);
                return { x: left + r + Math.cos(a) * r, y: top + r + Math.sin(a) * r };
            }

            update(targetRect, isAttracting) {
                if (isAttracting && targetRect) {
                    const point = this.getPillPoint(targetRect);
                    const dx = point.x - this.x;
                    const dy = point.y - this.y;

                    // High attraction, low swirl to form a sharp shape
                    this.x += dx * 0.04;
                    this.y += dy * 0.04;
                    this.angle += 0.02;

                    this.opacity = Math.min(1, this.opacity + 0.1);
                } else {
                    // Normal expansion mode
                    this.distance += this.speed;
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;

                    // Subtle parallax drift
                    const driftX = (width / 2 - mouseX) * 0.005;
                    const driftY = (height / 2 - mouseY) * 0.005;
                    this.x += driftX;
                    this.y += driftY;


                    // Fade logic
                    if (this.distance < 100) {
                        this.opacity = this.distance / 100;
                    } else if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
                        // Reset when off screen, with a buffer
                        this.reset();
                    }

                    const maxDist = Math.max(width, height) / 2;
                    if (this.distance > maxDist * 0.8) {
                        this.opacity -= 0.01;
                        if (this.opacity <= 0) this.reset();
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.opacity);

                // Draw as small slightly stretched dashes to imply motion, like the screenshot
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                ctx.beginPath();
                ctx.fillStyle = this.color;
                // Draw a tiny flattened oval (dash)
                ctx.ellipse(0, 0, this.radius * 2, this.radius * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height); // Hard clear for crisp dots

            // Figure out hover target
            let targetRect = null;
            if (isHovering && hoverTargetRef?.current) {
                targetRect = hoverTargetRef.current.getBoundingClientRect();
            }

            particles.forEach((p) => {
                p.update(targetRect, isHovering);
                p.draw();
            });

            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', setSize);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [hoverTargetRef, isHovering]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // Behind everything
                pointerEvents: 'none', // Don't block clicks
                background: 'radial-gradient(circle at center, #ffffff 0%, #f4f5f7 100%)' // Very subtle off-white/grey bg
            }}
        />
    );
}
