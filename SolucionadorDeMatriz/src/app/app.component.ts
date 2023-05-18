import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  matrixSize: number = 2;
  matrix: number[][] = [[]];
  constants: number[] = [];
  resultantMatrix: number[][] = [[]];
  resultantConstants: number[] = [];
  matrixHistory: number[][][] = [];
  constantsHistory: number[][] = [];
  showResult: boolean = false;
  noSolution: boolean = false;

  constructor() {
    this.updateMatrixSize();
  }

  updateMatrixSize() {
    if (this.matrixSize < 0) return;
    this.matrix = new Array(this.matrixSize)
      .fill(0)
      .map(() => new Array(this.matrixSize).fill(null));
    this.constants = new Array(this.matrixSize).fill(null);
    this.resultantMatrix = this.matrix.map((x) => x.slice());
    this.resultantConstants = this.constants.slice();
    this.showResult = false;
    this.noSolution = false;
  }

  solve() {
    this.noSolution = false;
    this.resultantMatrix = this.matrix.map((x) => x.slice());
    this.resultantConstants = this.constants.slice();
    this.matrixHistory = [];
    this.matrixHistory.push(this.resultantMatrix.map((x) => x.slice()));

    // Getting each line pivot and nullifying lines below using that pivot
    for (let i = 0; i < this.resultantMatrix.length; i++) {
      if (!this.getLinePivot(i)) return;
      this.nullifyLinesToBottom(i, i);
    }

    // Nullifying lines above each pivot -> Gauss-Jordan
    for (let i = this.resultantMatrix.length - 1; i > 0; i--) {
      this.nullifyLinesToTop(i);
    }

    this.showResult = true;
  }

  getLinePivot(line: number): boolean {
    if (this.resultantMatrix[line][line] == 0) {
      if (!this.removeZeroFromPivot(line)) {
        return false;
      }
    }

    let pivotInitialValue: number = this.resultantMatrix[line][line];
    for (let i = 0; i < this.resultantMatrix.length; i++) {
      this.resultantMatrix[line][i] /= pivotInitialValue;
    }
    this.resultantConstants[line] /= pivotInitialValue;
    this.matrixHistory.push(this.resultantMatrix.map((x) => x.slice()));
    this.constantsHistory.push(this.resultantConstants.slice());
    return true;
  }

  removeZeroFromPivot(line: number): boolean {
    for (let i = line + 1; i < this.resultantMatrix.length; i++) {
      if (this.resultantMatrix[i][line] != 0) {
        this.addLines(line, i);
        return true;
      }
    }
    this.noSolution = true;
    return false;
  }

  addLines(line1: number, line2: number) {
    for (let i = 0; i < this.resultantMatrix.length; i++) {
      this.resultantMatrix[line1][i] += this.resultantMatrix[line2][i];
    }
    this.resultantConstants[line1] += this.resultantConstants[line2];
  }

  nullifyLinesToBottom(baseLine: number, column: number) {
    for (let i = baseLine + 1; i < this.resultantMatrix.length; i++) {
      let multiplier: number = this.resultantMatrix[i][column];
      for (let j = 0; j < this.resultantMatrix.length; j++) {
        this.resultantMatrix[i][j] -=
          multiplier * this.resultantMatrix[baseLine][j];
      }
      this.resultantConstants[i] -=
        multiplier * this.resultantConstants[baseLine];
    }
    this.matrixHistory.push(this.resultantMatrix.map((x) => x.slice()));
    this.constantsHistory.push(this.resultantConstants.slice());
  }

  nullifyLinesToTop(baseLine: number) {
    for (let i = baseLine - 1; i >= 0; i--) {
      let multiplier: number = this.resultantMatrix[i][baseLine];
      for (let j = 0; j < this.resultantMatrix.length; j++) {
        this.resultantMatrix[i][j] -=
          multiplier * this.resultantMatrix[baseLine][j];
      }
      this.resultantConstants[i] -=
        multiplier * this.resultantConstants[baseLine];
    }
    this.matrixHistory.push(this.resultantMatrix.map((x) => x.slice()));
    this.constantsHistory.push(this.resultantConstants.slice());
  }

  checkForNullInMatrix() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix.length; j++) {
        if (this.matrix[i][j] == null) return true;
      }
    }
    return false;
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
