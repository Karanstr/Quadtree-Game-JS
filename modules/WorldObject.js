"use strict";

import Grid from "./Grid.js"
import Vector2 from "./Vector2.js"
import Render from "./Render.js"

class WorldObject {
  //Figure out the distinction between world position and screen position?
  constructor(position, length, tableSize, defaultValue) {
    this.grid = new Grid(tableSize, defaultValue);
    this.length = length.clone();
    this.blockLength = this.length.divide(this.grid.dimensions);
    this.position = position.clone();
    this.velocity = new Vector2(0, 0);
    this.debug = true;
  }

  //Figure out why html canvas sucks at drawing adjacent squares
  Render() {
    for (let i = 0; i < this.grid.binaryGrids.length; i++) {
      let boxes = Render.greedyMesh(this.grid.binaryGrids[i]);
      if (boxes.length == 0) { continue }
      boxes.forEach((box) => {
        let point = box[0], length = box[1].add(new Vector2(1, 1)).subtract(point);
        Render.drawBox(this.position.add(point.multiply(this.blockLength)),
          length.multiply(this.blockLength), Blocks.get(i));
        if (this.debug) {
          Render.outlineBox(this.position.add(point.multiply(this.blockLength)),
            length.multiply(this.blockLength))
        }
      })
    }
  }

  //Eventually redo this so it only generates keys velocity matches
  //Instead of generating all keys, then matching them to velocity
  pointToKey(point, velocity) {
    let translatedPoint = point.subtract(this.position);
    let offset = new Vector2(.01, .01), keys = [];
    for (let xShift = 0; xShift < 2; xShift++) {
      for (let yShift = 0; yShift < 2; yShift++) {
        let scaledX, scaledY;
        if (translatedPoint.x == 0 && xShift == 0) { scaledX = -1 }
        else {
          let limit = offset.x - xShift * offset.x * 2
          scaledX = Math.floor((translatedPoint.x + limit) / this.blockLength.x)
        }
        if (translatedPoint.y == 0 && yShift == 0) { scaledY = -1 }
        else {
          let limit = offset.y - yShift * offset.y * 2
          scaledY = Math.floor((translatedPoint.y + limit) / this.blockLength.y)
        }
        try { keys.push(this.grid.hash(scaledX, scaledY)) }
        catch (error) { keys.push(undefined) }
      }
    }
    return keys
  }


}

export default WorldObject

const Blocks = new Map();
Blocks.set(0, 'red')
Blocks.set(1, 'blue')