import React, { useState, useEffect, useRef } from 'react';

export const Cube3D: React.FC = () => {
  const [rotation, setRotation] = useState({ x: -18, y: 32 });
  const targetRotation = useRef({ x: -18, y: 32 });
  const isHovered = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized coords from -1 to 1
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      // Map mouse to rotation angles
      targetRotation.current = {
        x: -ny * 35 - 12,
        y: nx * 55 + 25,
      };
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Smooth lerp animation loop
    let animationFrameId: number;
    let autoAngle = 0;

    const animate = () => {
      if (!isHovered.current) {
        autoAngle += 0.35;
        targetRotation.current = {
          x: Math.sin(autoAngle * 0.02) * 15 - 10,
          y: autoAngle,
        };
      }

      setRotation((prev) => ({
        x: prev.x + (targetRotation.current.x - prev.x) * 0.08,
        y: prev.y + (targetRotation.current.y - prev.y) * 0.08,
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const faces = [
    {
      id: 'front',
      name: 'JavaScript',
      tag: 'Lógica & DOM',
      icon: 'JS',
      accent: '#f7df1e',
      border: 'rgba(247, 223, 30, 0.4)',
      bg: 'rgba(247, 223, 30, 0.08)',
      transform: 'translateZ(90px)',
    },
    {
      id: 'back',
      name: 'Python',
      tag: 'Back-end & APIs',
      icon: 'PY',
      accent: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.4)',
      bg: 'rgba(56, 189, 248, 0.08)',
      transform: 'rotateY(180deg) translateZ(90px)',
    },
    {
      id: 'right',
      name: 'CSS3',
      tag: 'Design & Grid',
      icon: '#',
      accent: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.4)',
      bg: 'rgba(59, 130, 246, 0.08)',
      transform: 'rotateY(90deg) translateZ(90px)',
    },
    {
      id: 'left',
      name: 'HTML5',
      tag: 'Estrutura Web',
      icon: '</>',
      accent: '#f97316',
      border: 'rgba(249, 115, 22, 0.4)',
      bg: 'rgba(249, 115, 22, 0.08)',
      transform: 'rotateY(-90deg) translateZ(90px)',
    },
    {
      id: 'top',
      name: 'SQL',
      tag: 'Banco de Dados',
      icon: 'DB',
      accent: '#a855f7',
      border: 'rgba(168, 85, 247, 0.4)',
      bg: 'rgba(168, 85, 247, 0.08)',
      transform: 'rotateX(90deg) translateZ(90px)',
    },
    {
      id: 'bottom',
      name: 'Full-Stack',
      tag: 'Sites Completos',
      icon: 'DEV',
      accent: '#10b981',
      border: 'rgba(16, 185, 129, 0.4)',
      bg: 'rgba(16, 185, 129, 0.08)',
      transform: 'rotateX(-90deg) translateZ(90px)',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-purple-600/15 blur-3xl pointer-events-none translate-y-12" />

      {/* Cybernetic decorative grid ring */}
      <div className="absolute w-80 h-80 rounded-full border border-neutral-800/80 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-96 h-96 rounded-full border border-dashed border-blue-500/15 pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />

      {/* 3D Scene Perspective Container */}
      <div 
        className="w-48 h-48 relative cursor-grab active:cursor-grabbing"
        style={{
          perspective: '800px',
        }}
      >
        {/* Rotating 3D Cube */}
        <div
          className="w-full h-full relative preserve-3d transition-transform ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {faces.map((face) => (
            <div
              key={face.id}
              className="absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-between border backdrop-blur-md shadow-2xl transition-all duration-300"
              style={{
                transform: face.transform,
                borderColor: face.border,
                backgroundColor: face.bg,
                boxShadow: `0 0 25px ${face.bg}, inset 0 0 15px ${face.bg}`,
              }}
            >
              {/* Top Face Header */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: face.accent }} />
                  {face.name}
                </span>
                <span className="text-[9px] opacity-60">100 Fases</span>
              </div>

              {/* Center Face Symbol */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl tracking-tighter shadow-lg border"
                style={{
                  backgroundColor: 'rgba(15, 17, 26, 0.85)',
                  borderColor: face.border,
                  color: face.accent,
                  textShadow: `0 0 12px ${face.accent}`,
                }}
              >
                {face.icon}
              </div>

              {/* Bottom Face Tag */}
              <div className="w-full text-center">
                <span 
                  className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border"
                  style={{
                    color: face.accent,
                    borderColor: face.border,
                    backgroundColor: 'rgba(10, 12, 18, 0.6)',
                  }}
                >
                  {face.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow under cube */}
      <div 
        className="w-40 h-8 rounded-full bg-black/60 blur-md mt-10 transition-transform duration-200"
        style={{
          transform: `scale(${1 - Math.sin(rotation.x * 0.01) * 0.15})`,
        }}
      />

      {/* Interactive Helper Text */}
      <div className="mt-4 text-center">
        <p className="text-xs font-mono text-neutral-400 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mova o mouse para girar o cubo 3D</span>
        </p>
        <p className="text-[11px] text-neutral-500 mt-0.5">
          5 linguagens • 100 fases progressivas • Do Zero ao Site Completo
        </p>
      </div>
    </div>
  );
};
