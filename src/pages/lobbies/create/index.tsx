import React from 'react';
import Widget from '~/frontend/components/Widget';
import Button from '~/frontend/components/Button';
import LobbyCard from '~/frontend/components/LobbyCard';

const CreateLobby = () => {
  return (
    <div className="flex flex-col items-center">
      <Widget header="Create A Lobby" className="w-full">
        <div className="flex flex-col items-center">
          <Button text="Create New" href="create/new" />
          <p>Or</p>
          <p>Choose An Existing Preset</p>
          <LobbyCard isPreset={true} />
          <LobbyCard isPreset={true} />
          <LobbyCard isPreset={true} />
        </div>
      </Widget>
    </div>
  );
};

export default CreateLobby;
