document.getElementById('fetchAccount').addEventListener('click', function () {
    const gameName = document.getElementById('gameName').value.trim();
    const tagLine = document.getElementById('tagLine').value.trim();

    // Check if the inputs are not empty
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
            `;

            // Now fetch the last match
            fetchLastMatch(data.puuid);
        })
        .catch(error => {
            console.error('Error fetching account data:', error);
            document.getElementById('summoner-info').innerHTML = '<p>Error fetching summoner data. Please check the input.</p>';
        });
});

// Function to fetch last match
function fetchLastMatch(puuid) {
    fetch(`/api/matches/by-puuid/${puuid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(matchIds => {
            if (matchIds.length > 0) {
                const lastMatchId = matchIds[0]; // Get the last match ID
                // Fetch match data using PUUID as a query parameter
                fetch(`/api/matches/${lastMatchId}?puuid=${puuid}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(matchData => {
                        // Log the matchData object to inspect its structure
                        console.log('Match Data:', matchData);

                        // Now directly access the properties from matchData
                        const characterUsed = matchData.champion; // Directly access champion
                        const matchOutcome = matchData.win ? 'Won' : 'Lost'; // Check if the match was won
                        const itemsUsed = matchData.items.join(', '); // Join items into a string
                        const kills= matchData.kills;
                        // Display match info
                        document.getElementById('character').innerText = `Character Used: ${characterUsed}`;
                        document.getElementById('outcome').innerText = `Match Outcome: ${matchOutcome}`;
                        document.getElementById('items').innerText = `Items Used: ${itemsUsed}`;
                        document.getElementById('kills').innerText=`Kills:${kills}`;
                    })
                    .catch(error => {
                        console.error('Error fetching match data:', error);
                        document.getElementById('match-info').innerHTML = '<p>Error fetching match data.</p>';
                    });
            } else {
                document.getElementById('match-info').innerHTML = '<p>No match history found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching match history:', error);
        });
}
