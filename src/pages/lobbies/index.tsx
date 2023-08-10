import React from 'react';
import Widget from '~/frontend/components/Widget';
import Button from '~/frontend/components/Button';
import LobbyCard from '~/frontend/components/LobbyCard';

const Lobbies = () => {
  return (
    <div className="flex flex-col items-center">
      <Widget header="Lobbies" className="w-full">
        <Button text="Create" href="lobbies/create" />
        <LobbyCard />
        <LobbyCard />
        <LobbyCard />
      </Widget>
    </div>
  );
};

export default Lobbies;
