import React, { useEffect, useRef, useState } from "react";
import style from "../styles/modules/AnimatedBackground.module.scss";
import { debounce } from "../util";

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
  private _rotation: number;

  /**
   * Size of the particle
   */

  public readonly size: number;

  /**
   * Hex color of the particle
   */

  public readonly color: string;

  /**
   * Velocity of the particle
   */

  public readonly velocity: number;

  /**
   * X-Axis movement speed
   */

  public readonly movementX: number;

  /**
   * Y-Axis movement speed
   */

  public readonly movementY: number;

  /**
   * Staticity of the particle
   */

  public readonly staticity: number;

  /**
   * Magnetism of the particle
   */

  public readonly magnetism: number;

  /**
   * Smooth factor of the particle
   */

  public readonly smoothFactor: number;

  /**
   * Rotation speed of the particle
   */

  public readonly rotationSpeed: number;

  /**
   * Amount of sides of the particle
   */

  public readonly sides: number | true;

  constructor({ width, height }: ParticleProps) {
    const randomBetween = (min: number, max: number): number => {
      return Number((Math.random() * (min - max) + max).toFixed(2));
    };

    const handleMouseMove = (event: MouseEvent) => {
      this._mouseX = event.x;
      this._mouseY = event.y;
    };

    this.color = colors[Math.round(Math.random() * colors.length)];
    const random: number = Math.random();
    this.sides = random < 0.33 ? true : random < 0.66 ? 3 : 4;
    this._translateX = randomBetween(0, width);
    this._translateY = randomBetween(0, height);
    this.size = randomBetween(0.5, 3.5) * 1.5;
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
    this._rotation = Math.random() * 360;
    this.rotationSpeed = 0.1 + Math.random();
    if (random < 0.5) this.rotationSpeed *= -1;

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
    this._rotation += this.rotationSpeed;
  }

  /**
   * X-Offset to the X-Translation in the canvas
   */

  public get x(): number {
    return this._x;
  }

  /**
   * Y-Offset to the Y-Translation in the canvas
   */

  public get y(): number {
    return this._y;
  }

  /**
   * X-Translation of the particle position
   */

  public get translateX(): number {
    return this._translateX;
  }

  /**
   * Y-Translation of the particle position
   */

  public get translateY(): number {
    return this._translateY;
  }

  /**
   * Function to update the height of the canvas on resize
   *
   * @param height new height
   *
   * @returns void
   */

  public setHeight(height: number): void {
    this._height = height;
  }

  /**
   * Function to update the width of the canvas on resize
   *
   * @param width new width
   *
   * @returns void
   */

  public setWidth(width: number): void {
    this._width = width;
  }

  /**
   * X-Position of the mouse
   */

  public get mouseX(): number {
    return this._mouseX;
  }

  /**
   * Y-Position of the mouse
   */

  public get mouseY(): number {
    return this._mouseY;
  }

  /**
   * Rotation of the particle
   */

  public get rotation(): number {
    return this._rotation;
  }
}

const ids: Array<number> = []; //all animationframe id's [used to cancel the frames on reset]

const AnimatedBackground: React.FC = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const context: CanvasRenderingContext2D = canvas.current?.getContext("2d");
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { width, height } = dimensions;
  const amount: number = Math.floor((width / 100) * (height / 100) * 0.8) > 20 ? Math.floor((width / 100) * (height / 100) * 0.8) : 20;

  let particles: Array<Particle> = []; //array with all particles
  let id: undefined | number; //current animationframe id
  let last: number = Date.now(); //timestamp of last frame
  let now: number = 0; //current timestamp
  let fpsInterval: number = 1000 / 60; //milliseconds between two frames

  const handleResize = debounce(() => {
    for (let i = 0; i < ids.length; i++) cancelAnimationFrame(ids[i]);
    if (!canvas || canvas.current.offsetWidth === 0 || canvas.current.offsetHeight === 0) return handleResize();
    else setDimensions({ width: canvas.current.offsetWidth, height: canvas.current.offsetHeight });
  }, 50);

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

  const drawPolygon = (x: number, y: number, sides: number, size: number, color: string, degrees: number) => {
    const strokeWidth: number = 2;
    const radians = (degrees * Math.PI) / 180;
    context.translate(x, y);
    context.rotate(radians);
    context.beginPath();
    context.moveTo(size * Math.cos(0), size * Math.sin(0));
    for (let i = 1; i <= sides; i += 1) {
      context.lineTo(size * Math.cos((i * 2 * Math.PI) / sides), size * Math.sin((i * 2 * Math.PI) / sides));
    }
    context.closePath();
    context.fillStyle = "#0a0a0a";
    context.strokeStyle = color;
    context.lineWidth = strokeWidth;
    context.stroke();
    context.fill();
    context.rotate(-radians);
    context.translate(-x, -y);
  };

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
          if (particle.sides === true) {
            context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            context.strokeStyle = particle.color;
            context.fillStyle = "#0a0a0a";
            context.lineWidth = 2;
            context.stroke();
            context.fill();
          } else {
            drawPolygon(particle.x, particle.y, particle.sides, particle.size, particle.color, particle.rotation + particle.rotationSpeed);
          }

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
