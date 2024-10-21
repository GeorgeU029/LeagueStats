document.getElementById('fetchAccount').addEventListener('click', function () {
    const gameName = document.getElementById('gameName').value.trim();
    const tagLine = document.getElementById('tagLine').value.trim();

    if (!gameName || !tagLine) {
        alert('Please enter both Game Name and Tag Line');
        return;
    }

    // Fetch account data
    fetch(`/api/account/${gameName}/${tagLine}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display summoner info
            document.getElementById('summoner-info').innerHTML = `
                <h2>Summoner Info</h2>
                <p>Name: ${data.gameName}</p>
                <p>ID: ${data.tagLine}</p>
                <p class="rank">Rank: <span id="rank"></span></p>
                <p class="level">Level: <span id="level"></span></p>
            `;

            // Now fetch the rank and level info
            fetchRankAndLevelData(data.puuid);

            // Fetch the latest game version
            fetch('/api/version')
                .then(response => response.json())
                .then(versionData => {
                    const latestVersion = versionData.version;
                    fetchMatches(data.puuid, latestVersion);
                });
        })
        .catch(error => {
            console.error('Error fetching account data:', error);
            document.getElementById('summoner-info').innerHTML = '<p>Error fetching summoner data. Please check the input.</p>';
        });
});

function fetchRankAndLevelData(puuid) {
    fetch(`/api/summoner/by-puuid/${puuid}`)
        .then(response => response.json())
        .then(data => {
            const rankInfo = data.rank ? `${data.rank.tier} ${data.rank.rank}` : 'Unranked';
            document.getElementById('rank').innerText = rankInfo;
            document.getElementById('level').innerText = data.summonerLevel;
        })
        .catch(error => {
            console.error('Error fetching rank and level data:', error);
            document.getElementById('rank').innerText = 'Error fetching rank';
            document.getElementById('level').innerText = 'Error fetching level';
        });
}

function fetchMatches(puuid, version) {
    fetch(`/api/matches/by-puuid/${puuid}`)
        .then(response => response.json())
        .then(matchIds => {
            if (matchIds.length > 0) {
                const limitedMatchIds = matchIds.slice(0, 20);
                document.getElementById('match-info').innerHTML = '<h2>Match History</h2>';
                const matchDataArray = [];
                let fetchPromises = limitedMatchIds.map(matchId => {
                    return fetchMatchData(matchId, puuid, version)
                        .then(matchData => {
                            matchDataArray.push(matchData);
                        });
                });
                Promise.all(fetchPromises).then(() => {
                    matchDataArray.sort((a, b) => b.gameEndTimestamp - a.gameEndTimestamp);
                    matchDataArray.forEach(matchData => {
                        displayMatchData(matchData, version);
                    });
                });
            } else {
                document.getElementById('match-info').innerHTML = '<p>No match history found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching match history:', error);
        });
}

function fetchMatchData(matchId, puuid, version) {
    return fetch(`/api/matches/${matchId}?puuid=${puuid}`)
        .then(response => response.json())
        .then(matchData => {
            return { ...matchData, matchId: matchId, version: version };
        });
}

function displayMatchData(matchData, version) {
    const { matchId, champion, win, items, kills, gameEndTimestamp } = matchData;
    const matchOutcome = win ? 'Won' : 'Lost';

    // Fetch and display item images only if the item ID is valid (not 0)
    const itemImages = items
        .filter(itemId => itemId > 0) // Filter out items that are 0 or invalid
        .map(itemId => `<img src="http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png" class="item-image" alt="Item ${itemId}" />`)
        .join('');

    // Champion image
    const championImage = `<img src="http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png" class="champion-image" alt="${champion}" />`;

    // Construct match information
    const matchInfo = `
        <div class="match">
            <p>${championImage} <strong>Champion:</strong> ${champion}</p>
            <p><strong>Match ID:</strong> ${matchId}</p>
            <p><strong>Outcome:</strong> ${matchOutcome}</p>
            <div class="item-images"><strong>Items Used:</strong> ${itemImages}</div>
            <p><strong>Kills:</strong> ${kills}</p>
            <p><strong>Game End Time:</strong> ${new Date(gameEndTimestamp).toLocaleString()}</p>
            <hr />
        </div>
    `;

    // Append the match info to the match-info section
    document.getElementById('match-info').innerHTML += matchInfo;
}

