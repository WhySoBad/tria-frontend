import React, { useEffect, useRef, useState } from "react";
import style from "../../styles/modules/AnimatedBackground.module.scss";
import { debounce } from "../../util";

const colors: Array<string> = ["#CAF0F8", "#ADE8F4", "#90E0EF", "#48CAE4", "#00B4D8", "#0096C7", "#0077B6", "#023E8A", "#03045E"];

interface ParticleProps {
  width: number;
  height: number;
}

class Particle {
  private _width: number;
  private _height: number;
  private _x: number;
  private _y: number;
  private _translateX: number;
  private _translateY: number;
  private _mouseX: number;
  private _mouseY: number;
  public readonly size: number;
  public readonly color: string;
  public readonly velocity: number;
  public readonly movementX: number;
  public readonly movementY: number;
  public readonly staticity: number;
  public readonly magnetism: number;
  public readonly smoothFactor: number;

  constructor({ width, height }: ParticleProps) {
    const randomBetween = (min: number, max: number): number => {
      return Number((Math.random() * (min - max) + max).toFixed(2));
    };

    const handleMouseMove = (event: MouseEvent) => {
      this._mouseX = event.x;
      this._mouseY = event.y;
    };

    this.color = colors[Math.round(Math.random() * colors.length)];
    this._translateX = randomBetween(0, width);
    this._translateY = randomBetween(0, height);
    this.size = randomBetween(0.5, 3.5);
    this.velocity = 20;
    this.movementX = randomBetween(-2, 2) / this.velocity;
    this.movementY = randomBetween(1, 20) / this.velocity;
    this._x = 0;
    this._y = 0;
    this._width = width;
    this._height = height;
    this.staticity = 20;
    this.magnetism = 0.1 + Math.random() * 4;
    this.smoothFactor = 30;
    this._mouseX = 0;
    this._mouseY = 0;
    window.addEventListener("mousemove", handleMouseMove);
  }

  public update(): void {
    if (this._translateX + this.movementX > this._width) this._translateX = 0;
    else if (this._translateX + this.movementX < 0) this._translateX = this._width;
    else this._translateX += this.movementX;

    if (this._translateY + this.movementY > this._height) this._translateY = 0;
    else if (this._translateY + this.movementY < 0) this._translateY = this._height;
    else this._translateY += this.movementY;

    this._x += (this._mouseX / (this.staticity / this.magnetism) - this._x) / this.smoothFactor;
    this._y += (this._mouseY / (this.staticity / this.magnetism) - this._y) / this.smoothFactor;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get translateX(): number {
    return this._translateX;
  }

  public get translateY(): number {
    return this._translateY;
  }

  public setHeight(height: number): void {
    this._height = height;
  }

  public setWidth(width: number): void {
    this._width = width;
  }

  public get mouseX(): number {
    return this._mouseX;
  }

  public get mouseY(): number {
    return this._mouseY;
  }
}

interface AnimatedBackgroundProps {
  amount?: number;
}

const ids: Array<number> = [];

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const context: CanvasRenderingContext2D = canvas.current?.getContext("2d");
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  let particles: Array<Particle> = [];
  const { width, height } = dimensions;
  let id: undefined | number;
  const amount: number = Math.floor((width / 100) * (height / 100) * 0.8);

  const handleResize = debounce(() => {
    for (let i = 0; i < ids.length; i++) cancelAnimationFrame(ids[i]);
    setDimensions({ width: ref.current?.clientWidth || width, height: ref.current?.clientHeight || height });
  }, 100);

  let last: number = Date.now();
  let now: number = 0;
  let fpsInterval: number = 1000 / 60;

  useEffect(() => {
    handleResize();
  }, [ref.current]);

  const handleLoad = () => {
    initialize();
    draw();
  };

  const initialize = debounce(() => {
    for (let i = 0; i < amount; i++) particles.push(new Particle({ height: height, width: width }));
  }, 250);

  const draw = () => {
    now = Date.now();
    const elapsed: number = now - last;

    if (elapsed > fpsInterval) {
      last = now - (elapsed % fpsInterval);

      if (context && ref.current) {
        context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        particles.forEach((particle: Particle) => {
          particle.update();
          context.translate(particle.translateX, particle.translateY);
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
          context.fillStyle = particle.color;
          context.fill();
          context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        });
      }
    }

    id = requestAnimationFrame(draw);
    if (!ids.find((number: number) => number === id)) ids.push(id);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (canvas.current && height !== 0 && width !== 0) handleLoad();
  }, [canvas.current, dimensions]);

  return <section ref={ref} className={style["container"]} children={<canvas ref={canvas} width={width} height={height} className={style["animatedbackground"]} />} />;
};

export default AnimatedBackground;
