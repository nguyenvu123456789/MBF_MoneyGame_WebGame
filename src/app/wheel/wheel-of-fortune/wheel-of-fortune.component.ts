import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Sector } from '../sector.model';
import { GameHistoryService } from 'src/app/services/data/game-history.service';
import { AuthService } from 'src/app/services/data/auth.service';

const EMPTY_SECTOR: Sector = {
  id: '',
  color: '#496BE7',
  label: 'Chúc bạn may mắn lần sau',
};

@Component({
  selector: 'dft-wheel-of-fortune',
  templateUrl: './wheel-of-fortune.component.html',
  styleUrls: ['./wheel-of-fortune.component.scss'],
})
export class WheelOfFortuneComponent implements AfterViewInit, OnChanges {
  @Input() prizes: Sector[] = [];
  @Input() font = 'Quicksand';
  @Input() fontSize = 8;
  @Input() borderColor = '#496BE7';
  @Input() spinButtonColor = '#748CE3';
  @Input() spinDuration = 10; // seconds
  @Input() spinSound = 'assets/sound/wheel.wav';
  @Input() gameId: number = 0;

  @Output() spinFinished = new EventEmitter<string>();
  @Output() spinClick = new EventEmitter<void>();

  private sectors: Sector[] = [];

  private friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  private angVel = 0; // Angular velocity
  private ang = 0; // Angle in radians
  private threshold = 0.002; // Threshold to stop the wheel
  private readonly PI = Math.PI;
  private readonly TAU = 2 * Math.PI;
  private arc = 0;
  private ctx!: CanvasRenderingContext2D;
  private tot = 0;
  private spinAudio: HTMLAudioElement | null = null;

  constructor(
    private gh: GameHistoryService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.init();
    this.setupSpinSound();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spinSound']) {
      this.setupSpinSound();
    }

    if (changes['spinDuration']) {
      this.friction = this.predictFriction(this.spinDuration);
    }

    if (changes['prizes'] || changes['font'] || changes['fontSize']) {
      const arr: Sector[] = [];
      this.prizes.forEach((sector) => {
        arr.push(sector);
        arr.push(EMPTY_SECTOR);
      });
      this.sectors = arr;
      this.tot = this.sectors.length;
      this.arc = this.TAU / this.sectors.length;

      this.init();
    }
  }

  private setupCanvas(): void {
    const canvas = document.getElementById('wheel') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();
    this.arc = this.TAU / this.sectors.length;
  }

  private getIndex(): number {
    return Math.floor(this.tot - (this.ang / this.TAU) * this.tot) % this.tot;
  }

  private drawSector(sector: Sector, i: number): void {
    const canvas = document.getElementById('wheel') as HTMLCanvasElement;

    const ang = this.arc * i;
    const rad = this.ctx.canvas.width / 2;
    const centerX = this.ctx.canvas.width / 2;
    const centerY = this.ctx.canvas.height / 2;

    // Draw the sector
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color ?? '';
    this.ctx.moveTo(centerX, centerY);
    this.ctx.arc(centerX, centerY, rad, ang, ang + this.arc);
    this.ctx.lineTo(centerX, centerY);
    this.ctx.fill();

    this.ctx.restore();

    // TEXT
    this.ctx.save();
    this.ctx.translate(
      centerX + rad * Math.cos(ang + this.arc / 2),
      centerY + rad * Math.sin(ang + this.arc / 2)
    );
    this.ctx.rotate(ang + this.arc / 2 + this.PI / 2);
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = sector.id ? '#000000' : '#FFFFFF';
    this.ctx.font = `bold ${(this.fontSize * canvas.width) / 266}px ${
      this.font
    }`;
    const text = sector.label ?? '';
    const lineheight = (this.fontSize * canvas.width) / 266;

    const lines = [];
    const maxLength = (0.8 * 2 * rad * Math.sin(this.arc / 2)) / lineheight;

    const words = text.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      if (currentLine.length + word.length + 1 > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }

    for (let i = 0; i < lines.length; i++) {
      if (sector.id) {
        this.ctx.fillText(lines[i], 0, 0.15 * rad + i * lineheight);
      } else {
        this.ctx.fillText(lines[i], 0, 0.25 * rad + i * lineheight);
      }
    }
    this.ctx.restore();

    // IMAGE
    if (sector.url) {
      const img = new Image();
      img.src = sector.url;
      img.width = (40 * canvas.width) / 266;
      img.height = (40 * canvas.height) / 266;

      img.onload = () => {
        this.ctx.save();
        // Center the image at the middle of the sector
        this.ctx.translate(
          centerX + rad * Math.cos(ang + this.arc / 2),
          centerY + rad * Math.sin(ang + this.arc / 2)
        );
        this.ctx.rotate(ang + this.arc / 2 + this.PI / 2);
        this.ctx.drawImage(
          img,
          -img.width / 2,
          0.3 * rad,
          img.width,
          img.height
        );
        this.ctx.restore();
      };
    }
  }

  private rotate(): void {
    const canvas = document.getElementById('wheel') as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`;

    const sector = this.sectors[this.getIndex()];
    if (sector) {
      // spinEl.style.background = sector.color ?? '';
    }

    if (this.ang != 0 && this.angVel === 0) {
      this.spinAudio?.pause();
      this.spinFinished.emit(sector.id);
    }
  }

  private frame(): void {
    if (!this.angVel) return;
    this.angVel *= this.friction; // Decrement velocity by friction

    if (this.angVel < this.threshold) this.angVel = 0; // Bring to stop
    this.ang += this.angVel; // Update angle
    this.ang %= this.TAU; // Normalize angle

    this.rotate();
  }

  private engine(): void {
    this.frame();
    requestAnimationFrame(() => this.engine());
  }

  private init(): void {
    if (!this.ctx) {
      return;
    }
    // clear all context
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.sectors.forEach((sector, i) => this.drawSector(sector, i));
    this.rotate(); // Initial rotation
    this.engine(); // Start engine
  }

  spin() {
    if (this.angVel) {
      return;
    }
    const userLoggedIn = this.authService.getUserInfo();
    this.gh
      .apiPlayGame({ gameId: this.gameId, msisdn: userLoggedIn.msisdn })
      .subscribe({
        next: (res) => {
          if (res.code === 0) {
            const prizeId = res.body.prizeId;
            this.spinToSector(prizeId.toString());

            this.spinClick.emit();
          }
        },
      });
  }

  public spinToSector(id: string): void {
    let targetIndex = -1;
    if (!id) {
      // spin to random empty sector
      const emptySectors = this.sectors.filter((sector) => !sector.id);
      const randomIndex = Math.floor(Math.random() * emptySectors.length);
      targetIndex = this.sectors.findIndex(
        (sector) => sector === emptySectors[randomIndex]
      );
    } else {
      targetIndex = this.sectors.findIndex((sector) => sector.id === id);
    }

    if (targetIndex === -1) {
      return;
    }

    if (this.spinSound && this.spinAudio) {
      this.spinAudio.play();
    }

    this.ang = 0; // Reset angle

    const targetAngle = this.arc * (this.tot - targetIndex);
    const currentAngle = this.ang % this.TAU;

    // Calculate the distance to the target angle
    const angleDiff = (targetAngle - currentAngle + this.TAU) % this.TAU;
    this.angVel = this.calculateAngVel(this.friction, angleDiff);
  }

  private calculateAngVel(friction: number, ang: number): number {
    const target = 10 * this.TAU + ang - this.arc * Math.random();
    let sum = 0;
    let i = 1;
    while ((target / sum) * Math.pow(friction, i) >= this.threshold) {
      sum += Math.pow(friction, i);
      i++;
    }
    return target / sum;
  }

  private setupSpinSound(): void {
    if (this.spinSound) {
      this.spinAudio = new Audio(this.spinSound);
    }
  }

  private predictFriction(y: number): number {
    const data = [
      { x: 0.9, y: 1.3 },
      { x: 0.924, y: 1.679 },
      { x: 0.926, y: 1.7 },
      { x: 0.933, y: 1.886 },
      { x: 0.95, y: 2.4 },
      { x: 0.96, y: 2.94 },
      { x: 0.97, y: 3.78 },
      { x: 0.98, y: 5.37 },
      { x: 0.99, y: 9.6 },
      { x: 0.991, y: 10.5 },
      { x: 0.995, y: 17 },
      { x: 0.999, y: 30 },
    ];

    for (let i = 0; i < data.length - 1; i++) {
      if (y >= data[i].y && y <= data[i + 1].y) {
        const x =
          data[i].x +
          ((data[i + 1].x - data[i].x) * (y - data[i].y)) /
            (data[i + 1].y - data[i].y);
        return x;
      }

      if (y < data[0].y) {
        return data[0].x;
      }

      if (y > data[data.length - 1].y) {
        return data[data.length - 1].x;
      }
    }

    return 0.991;
  }
}
