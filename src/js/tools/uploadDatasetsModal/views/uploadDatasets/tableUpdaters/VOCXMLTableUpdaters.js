import {
  insertRowToAnnotationsTable, insertRowToImagesTable, enableFinishButton, disableFinishButton,
  changeAllImagesTableRowsToDefault,
} from '../style';
import validateVOCXMLFormat from '../formatValidators/VOCXMLValidator';
import {
  IMAGE_FILES_OBJECT, VALID_ANNOTATION_FILES_ARRAY,
  ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR,
} from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';

function validateExistingImages(datasetObject) {
  if (datasetObject[VALID_ANNOTATION_FILES_ARRAY].length > 0) {
    let foundValid = false;
    Object.keys(datasetObject[IMAGE_FILES_OBJECT]).forEach((key) => {
      const imageFile = datasetObject[IMAGE_FILES_OBJECT][key];
      const validationResult = validateVOCXMLFormat(imageFile);
      if (!validationResult.error) { foundValid = true; }
      const { name } = imageFile.body.fileMetaData;
      insertRowToImagesTable(name, validationResult);
      datasetObjectManager.updateImageFileErrorStatus(name, validationResult.error);
    });
    if (foundValid) {
      enableFinishButton();
    } else {
      disableFinishButton();
    }
  } else {
    changeAllImagesTableRowsToDefault();
    disableFinishButton();
  }
}

function updateVOCXMLTables(parsedObj, validationResult) {
  const datasetObject = datasetObjectManager.getDatasetObject();
  const fileName = parsedObj.body.fileMetaData.name;
  if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    insertRowToImagesTable(fileName, validationResult);
    if (validationResult.valid) { enableFinishButton(); }
  }
  if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
    validateExistingImages(datasetObject);
    insertRowToAnnotationsTable(fileName, validationResult);
  }
}

export { updateVOCXMLTables as default };