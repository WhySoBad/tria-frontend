import React, { useEffect, useRef, useState } from 'react';
import style from '../../../styles/modules/Sections.module.scss';

const Title = (props): JSX.Element => {
  return (
    <section id={'title'} className={style['title-container']}>
      <h1
        style={{
          padding: '2rem 4rem',
          background: '#1b1d23',
          borderRadius: '10px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        Title.
      </h1>
      <PatternCanvas size={10} />
    </section>
  );
};

interface PatternProps {
  size: number;
}

const Pattern: React.FC<PatternProps> = ({ size }): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handler: () => void = (): void => {
    const width: number = ref.current.clientWidth;
    const height: number = ref.current.clientHeight;
    const padding: number = Math.ceil(size * 0.75);
    const xAmount: number = Math.floor((width + size * 2) / (size + padding));
    const yAmount: number = Math.floor((height + size * 2) / (size + padding));
    setAmount({ x: xAmount, y: yAmount });
  };

  useEffect(() => {
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (ref.current) handler();
  }, [ref.current]);

  const tiles: Array<any> = new Array(amount.x * amount.y).fill(null);

  return (
    <main
      style={{
        position: 'absolute',
        height: '100%',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
      ref={ref}
    >
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${amount.x}, ${size}px)`,
          gridTemplateRows: `repeat(${amount.y}, ${size}px)`,
          gap: `${Math.ceil(size * 0.75)}px`,
        }}
      >
        {tiles.map((_: any, index: number) => (
          <Tile key={index} />
        ))}
      </main>
    </main>
  );
};

interface TileProps {}

const Tile: React.FC<TileProps> = (): JSX.Element => {
  const [color, setColor] = useState('#333');

  const rand1: string = '#08851a';
  const rand2: string = '#19b02e';
  // const rand3: string = '#257831';
  const rand3: string = '#1b1d23';

  useEffect(() => {
    const random: number = Math.random();
    if (random < 0.33) setColor(rand1);
    else if (random < 0.66) setColor(rand2);
    else setColor(rand3);

    setInterval(() => {
      const random: number = Math.random();
      if (random < 0.33) setColor(rand1);
      else if (random < 0.66) setColor(rand2);
      else setColor(rand3);
    }, 3000);
  }, []);

  return (
    <div
      onClick={() => setColor('orange')}
      onMouseEnter={() => setColor('#6c736d')}
      onMouseLeave={() => {
        const random: number = Math.random();
        if (random < 0.33) setColor(rand1);
        else if (random < 0.66) setColor(rand2);
        else setColor(rand3);
      }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '5px',
        backgroundColor: color,
        transition: 'all 0.1s',
        //  border: 'solid 2px #000',
      }}
    />
  );
};

const PatternCanvas: React.FC<PatternProps> = ({ size }): JSX.Element => {
  const canvasDimensions: number = 1000;
  const padding: number = Math.ceil(size * 0.75);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvas: HTMLCanvasElement | null = canvasRef.current;
  const rect: DOMRect | undefined = canvas?.getBoundingClientRect();

  const context:
    | CanvasRenderingContext2D
    | null
    | undefined = canvas?.getContext('2d');

  const handler: () => void = (): void => {
    const width: number = canvasRef.current.clientWidth;
    const height: number = canvasRef.current.clientHeight;
    const xAmount: number = Math.floor((width + size * 2) / (size + padding));
    const yAmount: number = Math.floor((height + size * 2) / (size + padding));
    draw();
  };

  useEffect(() => {
    window.addEventListener('resize', render);
    draw();
    return () => window.removeEventListener('resize', render);
  }, []);
  useEffect(() => {
    if (canvasRef.current) render();
  }, [canvasRef.current]);

  const render: () => void = (): void => {
    draw();
  };

  const draw: () => void = (): void => {
    const width: number = canvasRef?.current?.offsetWidth;
    const height: number = canvasRef?.current?.offsetHeight;
    const xAmount: number = Math.floor((width + size * 2) / (size + padding));
    const yAmount: number = Math.floor((height + size * 2) / (size + padding));

    const relation: number = width / 1000;

    const adjusted: number = size * relation;
    const adjustedPadding: number = padding * relation;
    /* const yAdjusted: number = 1000 / yAmount; */

    console.log(adjusted, xAmount, yAmount, height, size, padding);
    if (!context) return;

    context.fillStyle = '#1b1d23';
    context.fillRect(
      0,
      0,
      canvasRef?.current?.clientWidth,
      canvasRef?.current?.clientHeight,
    );
    const rand1: string = '#08851a';
    const rand2: string = '#19b02e';
    const rand3: string = '#1b1d23';
    for (let i = 0; i < yAmount; i++) {
      for (let j = 0; j < xAmount; j++) {
        const y: number = -0.5 * adjusted + (adjusted + adjustedPadding) * i;
        const x: number = -0.5 * adjusted + (adjusted + adjustedPadding) * j;

        const random: number = Math.random();
        context.fillStyle =
          random < 0.33 ? rand1 : random < 0.66 ? rand2 : rand3;
        context.fillRect(x, y, adjusted, adjusted);
      }
    }
  };

  return (
    <canvas
      style={{
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        height: '100%',
      }}
      width={canvasDimensions}
      height={canvasDimensions}
      ref={canvasRef}
    />
  );
};

export default Title;
