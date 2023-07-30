import React, { useReducer } from 'react';
import DropZone from '~/frontend/components/fileUpload/DropZone';

export interface UploadInfo {
  inDropZone: boolean;
  fileList: File[];
}

const Upload = () => {
  // reducer function to handle state changes
  const reducer = (
    state: UploadInfo,
    // I think that the inDropZone property and files property should be optional
    // since the dispatch function does not use them every time in DropZone.tsx.
    action: { type: string; inDropZone: boolean; files: File[] },
  ) => {
    switch (action.type) {
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
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
