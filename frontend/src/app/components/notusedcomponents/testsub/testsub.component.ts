import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as fabric from 'fabric';
import { GameStateService } from '../../../services/gamestate.service';

@Component({
  selector: 'app-testsub',
  imports: [FormsModule,CommonModule],
  templateUrl: './testsub.component.html',
  styleUrl: './testsub.component.css'
})
export class TestsubComponent implements OnInit, AfterViewInit {

  private canvas!: fabric.Canvas;
  public brushColor: string = '#000000'; // Default brush color
  public brushWidth: number = 5; // Default brush size
  public isErasing: boolean = false; // Eraser mode flag
  private backgroundColor: string = "white"; // Background color (same as canvas)

  gameStateManagerService = inject(GameStateService)
  currentGameState:string | undefined = ''

  // change color of brush
  // change width of brush
  // erase
    //a. clear canvas
    //b. erase line ( need width? )
  // ensure compatibility with mobile
  // ensure size doesnt change much


  ngOnInit(): void {
    this.initializeCanvas();
    this.gameStateManagerService.gameStateManager$.subscribe(d=>this.currentGameState=d?.gameState)
  }

  ngAfterViewInit(): void {
    this.canvas.backgroundColor='#FFFFFF'
    this.updateBrush();
  }

  private initializeCanvas(): void {
    this.canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      width: window.innerWidth - 60,
      height: window.innerHeight * 0.6,
      backgroundColor: "#FFFFFF"
    });
    this.updateBrush();
  }

  public updateBrush(): void {
    if (this.canvas) {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.isErasing ? this.backgroundColor : this.brushColor;
      this.canvas.freeDrawingBrush.width = this.brushWidth;
    }
  }

  public setBrushColor(color: string): void {
    this.brushColor = color;
    this.isErasing = false; // Disable erasing mode
    this.updateBrush();
  }

  public setBrushSize(size: any): void {
  
    this.brushWidth= size.target.value;
    // this.brushWidth = size;
    this.updateBrush();
  }

  public enableEraser(): void {
    this.isErasing = true;
    this.updateBrush();
  }

  public clearCanvas(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = this.backgroundColor; // Reset background
  }
}
