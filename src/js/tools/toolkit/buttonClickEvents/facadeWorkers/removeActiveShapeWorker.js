import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData, isPolygonDrawingFinished, resetDrawPolygonMode } from '../../../../canvas/objects/polygon/polygon';
import { clearBoundingBoxData, isBoundingBoxDrawingFinished, resetDrawBoundingBoxMode } from '../../../../canvas/objects/boundingBox/boundingBox';
import { removeEditedPolygonId, removeActiveLabelObject } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import {
  getAddingPolygonPointsState, getContinuousDrawingState, getCurrentImageId,
  getRemovingPolygonPointsState, setRemovingPolygonPointsState, getPolygonDrawingInProgressState,
} from '../../../stateMachine';
import { isLabelling, removeTargetShape } from '../../../labellerModal/labellingProcess';
import { hideLabellerModal } from '../../../labellerModal/style';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { removeLabel } from '../../../../canvas/objects/label/label';
import { removeLabelFromListOnShapeDelete, getCurrentlySelectedLabelShape } from '../../../labelList/labelList';
import { removeShape, getNumberOfShapes } from '../../../../canvas/objects/allShapes/allShapes';
import { removeTickSVGOverImageThumbnail } from '../../../imageList/imageList';
import {
  setRemovePointsButtonToDefault,
  setRemoveShapeButtonToDisabled,
  setPolygonEditingButtonsToDisabled,
} from '../../styling/stateMachine';

function removeBoundingBox(canvas, mLGeneratedObject) {
  const activeObject = mLGeneratedObject || canvas.getActiveObject()
    || getCurrentlySelectedLabelShape();
  if (activeObject && activeObject.shapeName === 'bndBox') {
    removeShape(activeObject.id);
    removeLabel(activeObject.id, canvas);
    removeActiveLabelObject();
    removeLabelFromListOnShapeDelete(activeObject.id);
    clearBoundingBoxData();
    return true;
  }
  return false;
}

function removeIfContinuousDrawing(canvas) {
  if (getContinuousDrawingState()) {
    if (isLabelling()) {
      if (isPolygonDrawingFinished()) {
        hideLabellerModal();
        removeTargetShape();
        resetDrawPolygonMode();
      } else if (isBoundingBoxDrawingFinished()) {
        hideLabellerModal();
        removeTargetShape();
        resetDrawBoundingBoxMode();
      }
      return true;
    }
    if (getPolygonDrawingInProgressState()) {
      if (getRemovingPolygonPointsState()) {
        setRemovePointsButtonToDefault();
        setRemovingPolygonPointsState(false);
      }
      resetNewPolygonData();
      purgeCanvasMouseEvents(canvas);
      assignDrawPolygonEvents(canvas);
      return true;
    }
  }
  return false;
}

function removeActiveShapeEvent(canvas) {
  if (!removeIfContinuousDrawing(canvas) && !removeBoundingBox(canvas)) {
    if (isAddingPointsToPolygon()) {
      purgeCanvasMouseEvents(canvas);
      assignAddPointsOnExistingPolygonEvents(canvas);
      clearAllAddPointsData();
      setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    } else if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    const polygonId = removePolygon(getCurrentlySelectedLabelShape());
    removeLabelFromListOnShapeDelete(polygonId);
    removePolygonPoints();
    removeEditedPolygonId();
    if (setPolygonEditingButtonsToDisabled()) window.editShapes();
  }
  if (getNumberOfShapes() === 0) {
    removeTickSVGOverImageThumbnail(getCurrentImageId());
  }
  setRemoveShapeButtonToDisabled();
}

export { removeActiveShapeEvent, removeBoundingBox };
