import React from 'react';
import Match from './Match';

function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    console.log('No matches to display.');
    return <div id="match-info"><h2>No match history found.</h2></div>;
  }

  console.log('Displaying matches:', matches); // Log the matches array

  return (
    <div id="match-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rbg(26,26,46)', borderRadius: '5px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)' }}>
      <h2>Match History</h2>
      {matches.map((match, index) => (
        <Match key={match.matchId || index} match={match} />
      ))}
    </div>
  );
}

export default MatchList;
