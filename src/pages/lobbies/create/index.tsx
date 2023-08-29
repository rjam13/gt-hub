import React, { Fragment } from 'react';
import Widget from '~/frontend/components/Widget';
import Button from '~/frontend/components/Button';
import LobbyCard from '~/frontend/components/LobbyCard';
import { trpc } from '~/utils/trpc';

const CreateLobby = () => {
  const lobbySettingsQuery = trpc.lobby.listLobbySettings.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      // params here are the trpc route's return
      getNextPageParam(firstPage) {
        return firstPage.nextCursor;
      },
    },
  );
  console.log(lobbySettingsQuery.data);
  return (
    <div className="flex flex-col items-center">
      <Widget header="Create A Lobby" className="w-full">
        <div className="flex flex-col items-center">
          <Button text="Create New" href="create/new" />
          <p>Or</p>

          <p>Choose An Existing Preset</p>
          {lobbySettingsQuery.data?.pages.map((page, index) => (
            <Fragment key={page.items[0]?.id || index}>
              {page.items.map((lobbySetting) => (
                <Fragment key={lobbySetting.id}>
                  <LobbyCard
                    isPreset={true}
                    tracks={lobbySetting.tracks}
                    title={lobbySetting.title}
                    creator={lobbySetting.creator.name ?? ''}
                    tags={lobbySetting.tags}
                    carRating={
                      lobbySetting.ppRating ?? lobbySetting.grRating[0] ?? 0
                    }
                    href={`create/${lobbySetting.id}`}
                  />
                </Fragment>
              ))}
            </Fragment>
          ))}
          {lobbySettingsQuery.hasNextPage && (
            <Button
              onClick={() => lobbySettingsQuery.fetchNextPage()}
              disabled={
                !lobbySettingsQuery.hasNextPage ||
                lobbySettingsQuery.isFetchingNextPage
              }
              text={
                lobbySettingsQuery.isFetchingNextPage
                  ? 'Loading more...'
                  : lobbySettingsQuery.hasNextPage
                  ? 'Load More'
                  : 'Nothing more to load'
              }
            />
          )}
        </div>
      </Widget>
    </div>
  );
};

export default CreateLobby;
