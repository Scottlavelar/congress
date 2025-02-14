import { fireEvent } from 'custom-card-helpers';

type ValidHassDomEvent = keyof HASSDomEvents;

export interface ProvideHassElement {
  provideHass(element: HTMLElement);
}

interface HassDialog<T = HASSDomEvents[ValidHassDomEvent]> extends HTMLElement {
  showDialog(params: T);
  closeDialog?: () => boolean | void;
}

interface ShowDialogParams<T> {
  dialogTag: string;
  dialogImport: () => Promise<unknown>;
  dialogParams: T;
  addHistory?: boolean;
}

interface LoadedDialogInfo {
  element: Promise<HassDialog>;
  closedFocusTargets?: Set<Element>;
}

interface LoadedDialogsDict {
  [tag: string]: LoadedDialogInfo;
}

var LOADED: LoadedDialogsDict = {};

export var isEmbeddedInPopup = (element: HTMLElement) => {
  let root = element as any;
  while (root && root.parentNode) {
    if (root.parentNode === document) {
      break;
    } else if (root.parentNode instanceof DocumentFragment) {
      root = root.parentNode.host;
    } else {
      root = root.parentNode;
    }
    if (root.tagName.toUpperCase() == 'BODY') return false;
    else if (root.tagName.toUpperCase() == 'BROWSER-MOD-POPUP') return true;
  }
  return false;
};

export var getPopupRootElement = (element: HTMLElement) => {
  let root = element as any;
  while (root && root.parentNode) {
    if (root.parentNode === document) {
      break;
    } else if (root.parentNode instanceof DocumentFragment) {
      root = root.parentNode.host;
    } else {
      root = root.parentNode;
    }
    if (root.tagName.toUpperCase() == 'BODY') break;
  }
  return root;
};

export var showDialog = async (
  element: HTMLElement & ProvideHassElement,
  config: ShowDialogParams<unknown>,
  useAlternativeDialog?: boolean
) => {
  var popupRoot = useAlternativeDialog
    ? getPopupRootElement(element)
    : useAlternativeDialog === undefined
    ? isEmbeddedInPopup(element)
      ? getPopupRootElement(element)
      : null
    : null;

  if (popupRoot === null) {
    fireEvent(element, 'show-dialog', config);
  } else {
    if (!(config.dialogTag in LOADED)) {
      if (!config.dialogImport) {
        return;
      }
      LOADED[config.dialogTag] = {
        element: config.dialogImport().then(() => {
          var dialogEl = document.createElement(config.dialogTag) as HassDialog;
          element.provideHass(dialogEl);
          return dialogEl;
        }),
      };
    }
    var dialogElement = await LOADED[config.dialogTag].element;
    popupRoot.appendChild(dialogElement);
    dialogElement.showDialog(config.dialogParams);
  }
};
