import { useRef, useEffect } from 'react';

/**
 * TiltCard — wraps children in a 3D perspective tilt that follows the mouse.
 * Uses rAF-based spring interpolation so the motion feels physical, not snappy.
 */
export default function TiltCard({ children, className = '', style = {}, maxTilt = 6, glare = true }) {
  const cardRef  = useRef(null);
  const glareRef = useRef(null);

  const spring = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, scale: 1 });
  const target = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, scale: 1 });
  const rafId  = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    const gl = glareRef.current;
    if (!el) return;

    const STIFFNESS = 0.07;
    const THRESHOLD = 0.01;

    function tick() {
      const s = spring.current;
      const t = target.current;

      s.rx    += (t.rx    - s.rx)    * STIFFNESS;
      s.ry    += (t.ry    - s.ry)    * STIFFNESS;
      s.tx    += (t.tx    - s.tx)    * STIFFNESS;
      s.ty    += (t.ty    - s.ty)    * STIFFNESS;
      s.scale += (t.scale - s.scale) * STIFFNESS;

      el.style.transform = `
        perspective(800px)
        rotateX(${s.rx}deg)
        rotateY(${s.ry}deg)
        translate(${s.tx}px, ${s.ty}px)
        scale(${s.scale})
      `;

      if (gl) {
        const glareAngle = Math.atan2(s.ry, -s.rx) * (180 / Math.PI) + 90;
        const glareOpacity = isHovering.current
          ? Math.sqrt(s.rx * s.rx + s.ry * s.ry) / maxTilt * 0.12
          : 0;
        gl.style.opacity = glareOpacity;
        gl.style.background = `linear-gradient(${glareAngle}deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)`;
      }

      const settled =
        Math.abs(t.rx - s.rx) < THRESHOLD &&
        Math.abs(t.ry - s.ry) < THRESHOLD &&
        Math.abs(t.scale - s.scale) < 0.0005;

      if (!settled) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    }

    function startLoop() {
      if (!rafId.current) rafId.current = requestAnimationFrame(tick);
    }

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      target.current.ry    =  nx * maxTilt;
      target.current.rx    = -ny * maxTilt;
      target.current.tx    =  nx * 3;
      target.current.ty    =  ny * 3;
      target.current.scale = 1.015;
      startLoop();
    }

    function onMouseEnter() {
      isHovering.current = true;
      el.style.transition = 'box-shadow 0.3s ease';
      el.style.boxShadow  = '0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)';
      startLoop();
    }

    function onMouseLeave() {
      isHovering.current = false;
      target.current = { rx: 0, ry: 0, tx: 0, ty: 0, scale: 1 };
      el.style.boxShadow = '';
      startLoop();
    }

    el.addEventListener('mousemove',  onMouseMove);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove',  onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.1s',
          }}
        />
      )}
    </div>
  );
}
