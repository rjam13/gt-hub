import React, { DragEvent } from 'react';
import Image from 'next/image';
import FilePreview from './FilePreview';
import upload from '~/frontend/assets/upload.svg';
import { UploadInfo } from '~/pages/upload';

const DropZone = ({ data, dispatch }: { data: UploadInfo; dispatch: any }) => {
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f: { name: string }) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', files });
      // reset inDropZone to false
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  };

  interface Event<T = EventTarget> {
    target: T;
  }
  // handle file selection via input element
  const handleFileSelect = (e: Event<HTMLInputElement>) => {
    // get files from event on the input element as an array
    const targetFiles = e.target.files;
    let files = targetFiles != null ? [...targetFiles] : null;

    // ensure a file or files are selected
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f: { name: string }) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add selected file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', files });
    }
  };

  // to handle file uploads
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    const files = data.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    files.forEach((file: File) => formData.append('files', file));

    // Upload the files as a POST request to the server using fetch
    // Note: /api/fileupload is not a real endpoint, it is just an example
    const response = await fetch('/api/fileupload', {
      method: 'POST',
      body: formData,
    });

    //successful file upload
    if (response.ok) {
      alert('Files uploaded successfully');
    } else {
      // unsuccessful file upload
      alert('Error uploading files');
    }
  };

  return (
    <>
      <div
        className={`flex flex-col justify-center items-center rounded-2xl p-8 border-4 border-dashed ${
          data.inDropZone && 'border-amber-500'
        }`}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        <Image src={upload} alt="upload" height={50} width={50} />
        <input
          id="fileSelect"
          type="file"
          multiple
          className="border-0 h-px truncate p-0 absolute whitespace-nowrap  w-px"
          onChange={(e) => handleFileSelect(e)}
        />
        <label className="btn" htmlFor="fileSelect">
          You can select multiple Files
        </label>
        <h3 className="mt-4">or drag &amp; drop your files here</h3>
      </div>
      {/* Pass the selectect or dropped files as props */}
      <FilePreview fileData={data} />
      {data.fileList.length > 0 && (
        <button tabIndex={0} className="btn" onClick={uploadFiles}>
          Upload
        </button>
      )}
    </>
  );
};

export default DropZone;
