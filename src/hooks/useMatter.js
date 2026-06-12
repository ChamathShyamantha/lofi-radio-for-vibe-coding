import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { PHYSICS_ITEMS } from '../data/physicsItems';

export function useMatter(containerRef, getAudioData) {
  const engineRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, MouseConstraint, Mouse, World, Bodies, Body, Composite, Events } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio, 2)
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const wallOptions = { isStatic: true, render: { visible: false }, restitution: 0.9 };
    const thickness = 60;
    World.add(engine.world, [
      Bodies.rectangle(width / 2, -thickness / 2, width, thickness, wallOptions),
      Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, wallOptions),
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, wallOptions),
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, wallOptions)
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.1, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const spawnItem = (x, y) => {
      // Limit bodies to ~25
      const allBodies = Composite.allBodies(engine.world);
      const dynamicBodies = allBodies.filter(b => !b.isStatic && b.label !== 'Mouse Constraint');
      if (dynamicBodies.length >= 25) {
        // Remove oldest dynamic body
        World.remove(engine.world, dynamicBodies[0]);
      }

      const itemDef = PHYSICS_ITEMS[Math.floor(Math.random() * PHYSICS_ITEMS.length)];
      const body = Bodies.rectangle(x, y, itemDef.width, itemDef.height, {
        frictionAir: 0.02,
        restitution: 0.9,
        render: { sprite: { texture: itemDef.texture } }
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      World.add(engine.world, body);
    };

    // Store spawn on engine for external access
    engine.spawnItem = spawnItem;

    for (let i = 0; i < 8; i++) {
      spawnItem(width * 0.2 + Math.random() * width * 0.6, height * 0.2 + Math.random() * height * 0.6);
    }

    Events.on(engine, 'beforeUpdate', () => {
      frameRef.current++;
      const bodies = Composite.allBodies(engine.world);

      // Beat nudges
      if (getAudioData && frameRef.current % 4 === 0) { // every 4th frame to save CPU
        const audioData = getAudioData();
        if (audioData) {
          let bassEnergy = 0;
          for (let i = 0; i < 4; i++) bassEnergy += audioData[i];
          bassEnergy /= 4;
          
          if (bassEnergy > 230) {
            for (const body of bodies) {
              if (body.isStatic) continue;
              const forceMag = 0.0003 * body.mass * (bassEnergy / 255);
              Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * forceMag,
                y: (Math.random() - 0.5) * forceMag
              });
            }
          }
        }
      }

      if (mouseConstraint.body) return;
      const mousePos = mouse.position;
      if (!mousePos.x || !mousePos.y) return;

      for (const body of bodies) {
        if (body.isStatic) continue;
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < 14400 && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const forceMag = 0.00015 * body.mass;
          Body.applyForce(body, body.position, { x: (dx / dist) * forceMag, y: (dy / dist) * forceMag });
        }
      }
    });

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      if (document.hidden) {
        Runner.stop(runner);
      } else {
        Runner.run(runner, engine);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, [containerRef, getAudioData]);

  return { engine: engineRef.current };
}
