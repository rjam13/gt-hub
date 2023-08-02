import React, { useReducer } from 'react';
import DropZone from '~/frontend/components/fileUpload/DropZone';

export interface UploadState {
  inDropZone: boolean;
  fileList: File[];
}

export interface UploadAction {
  type: string;
  inDropZone?: boolean;
  files?: File[];
}

const Upload = () => {
  // reducer function to handle state changes
  const reducer = (state: UploadState, action: UploadAction) => {
    switch (action.type) {
      case 'SET_IN_DROP_ZONE':
        if (action.inDropZone)
          return { ...state, inDropZone: action.inDropZone };
        return { ...state, inDropZone: false };
      case 'ADD_FILE_TO_LIST':
        if (action.files)
          return { ...state, fileList: state.fileList.concat(action.files) };
        return { ...state };
      default:
        return state;
    }
  };

  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  return (
    <div>
      <DropZone data={data} dispatch={dispatch} />
    </div>
  );
};

export default Upload;
