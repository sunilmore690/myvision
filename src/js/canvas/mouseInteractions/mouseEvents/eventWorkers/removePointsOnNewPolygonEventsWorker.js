import {
  setEditablePolygon, removePolygonPoint,
} from '../../../objects/polygon/alterPolygon/alterPolygon';

let removingPoints = false;
let canvas = null;

function setRemovablePointsEventsCanvas(canvasObj, polygonObj) {
  canvas = canvasObj;
  // edit this
  if (polygonObj) {
    setEditablePolygon(canvas, polygonObj, true, true);
  }
}

function pointMouseDownEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    removePolygonPoint(event.target.pointId);
  }
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point' && event.target.fill === 'red') {
    event.target.stroke = 'red';
    canvas.renderAll();
  }
}

function pointMouseUpEvents() {
  // filler function for the default parent call
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'black';
    canvas.renderAll();
  }
}

function getRemovingPointsState() {
  return removingPoints;
}

function setRemovingPointsStateToFalse() {
  removingPoints = false;
}

export {
  setRemovingPointsStateToFalse,
  pointMouseUpEvents, pointMouseOutEvents,
  pointMouseDownEvents, pointMouseOverEvents,
  setRemovablePointsEventsCanvas, getRemovingPointsState,
};
