import React from 'react';
import { UploadInfo } from '~/pages/upload';

const FilePreview = ({ fileData }: { fileData: UploadInfo }) => {
  return (
    <div className="flex mt-4 gap-4">
      <div className="flex-col items-center">
        {/* loop over the fileData */}
        <ol>
          {fileData.fileList.map((f: any) => {
            return (
              <li key={f.lastModified} className="flex mt-4 gap-4">
                {/* display the filename and type */}
                <div key={f.name}>{f.name}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default FilePreview;
