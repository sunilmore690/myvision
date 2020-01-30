import { disableFormatOptionsTextIfNoBoundingBoxes, hideExportLabelsPopUp, displayExportLabelsPopUp } from '../facadeWorkersUtils/exportDatasetsPopup/style';
import { getExportDatasetsPopUpOpenState } from '../facadeWorkersUtils/stateManager';

// the logic here will need to be exported into a shared styles file for popups
function windowHasScrollbar() {
  if (typeof window.innerWidth === 'number') {
    return window.innerWidth > document.documentElement.clientWidth;
  }
  const rootElem = document.documentElement || document.body;
  let overflowStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowStyle = rootElem.currentStyle.overflow;
  }
  overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;
  let overflowYStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowYStyle = rootElem.currentStyle.overflowY;
  }
  overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
  const contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
  const overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
  const alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

  return (contentOverflows && overflowShown) || (alwaysShowScroll);
}

function validateFullPopUpVisible(popupLabelParentElement) {
  if (windowHasScrollbar()) {
    popupLabelParentElement.style.top = '';
    popupLabelParentElement.style.bottom = '5px';
  } else {
    popupLabelParentElement.style.bottom = '';
  }
}

function calculateElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function setPopUpPosition(exportLabelsPopupParentElement, exportDatasetsButton) {
  const divOffset = calculateElementOffset(exportDatasetsButton);
  exportLabelsPopupParentElement.style.top = `${divOffset.top}px`;
  exportLabelsPopupParentElement.style.left = '65px';
}

function toggleExportDatasetsPopUp() {
  const exportLabelsPopupParentElement = document.getElementById('export-labels-popup-parent');
  const exportDatasetsButton = document.getElementById('exportDatasetsButton');
  if (!getExportDatasetsPopUpOpenState()) {
    disableFormatOptionsTextIfNoBoundingBoxes();
    setPopUpPosition(exportLabelsPopupParentElement, exportDatasetsButton);
    displayExportLabelsPopUp();
    validateFullPopUpVisible(exportLabelsPopupParentElement);
  } else {
    hideExportLabelsPopUp();
  }
}

export { toggleExportDatasetsPopUp as default };