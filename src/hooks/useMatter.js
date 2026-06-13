import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { PHYSICS_ITEMS, petSvg, foodSvg, makeSvgUri } from '../data/physicsItems';

export function useMatter(containerRef, getAudioData, isPlaying) {
  const engineRef = useRef(null);
  const frameRef = useRef(0);
  const getAudioDataRef = useRef(getAudioData);
  const isPlayingRef = useRef(isPlaying);

  // Keep the refs up to date without triggering the effect
  useEffect(() => {
    getAudioDataRef.current = getAudioData;
  }, [getAudioData]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Body, Composite, Events } = Matter;

    const engine = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 0, scale: 0 }
    });
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

    // Disable Matter.js internal mouse events on the canvas
    // to prevent any cursor-based interaction with bodies
    render.canvas.style.pointerEvents = 'none';

    const wallOptions = { isStatic: true, render: { visible: false }, restitution: 0.6, friction: 0 };
    const thickness = 60;
    World.add(engine.world, [
      Bodies.rectangle(width / 2, -thickness / 2, width, thickness, wallOptions),
      Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, wallOptions),
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, wallOptions),
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, wallOptions)
    ]);

    const spawnItem = (x, y) => {
      // Limit bodies to ~25
      const allBodies = Composite.allBodies(engine.world);
      const dynamicBodies = allBodies.filter(b => !b.isStatic && b.label !== 'Mouse Constraint' && b.label !== 'pet');
      if (dynamicBodies.length >= 35) {
        // Remove oldest dynamic body
        World.remove(engine.world, dynamicBodies[0]);
      }

      const itemDef = PHYSICS_ITEMS[Math.floor(Math.random() * PHYSICS_ITEMS.length)];
      const body = Bodies.rectangle(x, y, itemDef.width, itemDef.height, {
        frictionAir: 0.02,
        restitution: 0.5,
        render: { sprite: { texture: itemDef.texture } }
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);
      World.add(engine.world, body);
    };

    // Store spawn on engine for external access
    engine.spawnItem = spawnItem;

    engine.waterDrop = (x, y) => {
      const bodies = Composite.allBodies(engine.world);
      for (const body of bodies) {
        if (body.isStatic) continue;
        const dx = body.position.x - x;
        const dy = body.position.y - y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq > 0 && distSq < 90000) { // Limit ripple radius to 300px
          const dist = Math.sqrt(distSq);
          const forceMag = (0.04 * body.mass) / Math.max(dist / 100, 1);
          Body.applyForce(body, body.position, { x: (dx / dist) * forceMag, y: (dy / dist) * forceMag });
        }
      }
    };

    // Interactive Pet
    const pet = Bodies.rectangle(width / 2, height - 100, 50, 50, {
      restitution: 0.5,
      frictionAir: 0.05,
      friction: 0.2,
      render: { sprite: { texture: makeSvgUri(petSvg) } },
      label: 'pet'
    });
    World.add(engine.world, pet);

    const feedPet = () => {
      const food = Bodies.circle(pet.position.x, -20, 10, {
        restitution: 0.8,
        frictionAir: 0,
        render: { sprite: { texture: makeSvgUri(foodSvg) } }
      });
      World.add(engine.world, food);
    };

    window.driftFM = { spawnItem, feedPet };

    for (let i = 0; i < 25; i++) {
      spawnItem(width * 0.05 + Math.random() * width * 0.9, height * 0.05 + Math.random() * height * 0.9);
    }

    Events.on(engine, 'beforeUpdate', () => {
      frameRef.current++;
      const bodies = Composite.allBodies(engine.world);

      // Music-reactive drift — when music plays, items sway gently
      if (isPlayingRef.current && frameRef.current % 30 === 0) {
        for (const body of bodies) {
          if (body.isStatic || body.label === 'pet') continue;
          const forceMag = 0.0003 * body.mass;
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * forceMag,
            y: (Math.random() - 0.5) * forceMag
          });
        }
      }

      // Gentle random drift — nudge icons every ~90 frames so they float around slowly
      if (!isPlayingRef.current && frameRef.current % 90 === 0) {
        for (const body of bodies) {
          if (body.isStatic || body.label === 'pet') continue;
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.0003 * body.mass,
            y: (Math.random() - 0.5) * 0.0003 * body.mass
          });
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
      engineRef.current = null;
    };
  }, [containerRef]);

  return { engine: engineRef.current };
}

