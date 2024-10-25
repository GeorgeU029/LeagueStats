from flask import Flask, jsonify, request, render_template
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv(dotenv_path='key.env')

app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

API_KEY = os.getenv('RIOT_API_KEY')
PORT = int(os.getenv('PORT', 3000))

custom_headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "X-Riot-Token": API_KEY
}

# Summoner Spell ID to Name Mapping
SUMMONER_SPELLS = {
    1: "SummonerBoost",       # Cleanse
    3: "SummonerExhaust",     # Exhaust
    4: "SummonerFlash",       # Flash
    6: "SummonerHaste",       # Ghost
    7: "SummonerHeal",        # Heal
    11: "SummonerSmite",      # Smite
    12: "SummonerTeleport",   # Teleport
    13: "SummonerMana",       # Clarity
    14: "SummonerDot",        # Ignite
    21: "SummonerBarrier",    # Barrier
    32: "SummonerMark",       # Mark
    39: "SummonerSnowURFSnowball_Mark"  # Ultra Rapid Fire Snowball
}

# Get the latest version of the game data from Riot's data dragon
@app.route('/api/version', methods=['GET'])
def get_latest_version():
    url = "https://ddragon.leagueoflegends.com/api/versions.json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        versions = response.json()
        return jsonify({"version": versions[0]})  # Return the latest version
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

# Serve the index.html file
@app.route('/')
def index():
    return "Welcome to the Riot API Server!"

# Fetch account data by Game Name and Tag Line
@app.route('/api/account/<string:gameName>/<string:tagLine>', methods=['GET'])
def get_account_data(gameName, tagLine):
    base_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

# Fetch summoner data by PUUID and include summoner's level and rank
@app.route('/api/summoner/by-puuid/<string:puuid>', methods=['GET'])
def get_summoner_data(puuid):
    base_url = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        data = response.json()

        # Fetch rank information
        rank_url = f"https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{data['id']}"
        rank_response = requests.get(rank_url, headers=custom_headers)
        rank_response.raise_for_status()
        rank_data = rank_response.json()

        # Combine summoner info and rank info
        return jsonify({
            "summonerLevel": data["summonerLevel"],
            "profileIconId": data["profileIconId"],
            "rank": rank_data[0] if rank_data else None  # Get rank info, if available
        })
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

# Fetch match data by PUUID
@app.route('/api/matches/by-puuid/<string:puuid>', methods=['GET'])
def get_match_history(puuid):
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

# Fetch individual match details
@app.route('/api/matches/<string:matchId>', methods=['GET'])
def get_match_data(matchId):
    puuid = request.args.get('puuid')
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        match_data = response.json()

        # Find participant info for this summoner
        participant = next(p for p in match_data['info']['participants'] if p['puuid'] == puuid)

        # Calculate game duration in minutes and seconds
        game_duration_seconds = match_data['info']['gameDuration']
        game_duration = f"{game_duration_seconds // 60}m {game_duration_seconds % 60}s"

        # Map summoner spells from IDs to spell names
        summoner_spells = [
            SUMMONER_SPELLS.get(participant['summoner1Id'], 'Unknown'),
            SUMMONER_SPELLS.get(participant['summoner2Id'], 'Unknown')
        ]

        # Collect participant data (champion name and summoner name)
        participants = [
            {
                "championName": p['championName'],
                "summonerName": p['summonerName']
            } for p in match_data['info']['participants']
        ]

        return jsonify({
            "matchId": matchId,
            "champion": participant['championName'],
            "win": participant['win'],
            "items": [
                participant['item0'], participant['item1'], participant['item2'],
                participant['item3'], participant['item4'], participant['item5'], participant['item6']
            ],
            "kills": participant['kills'],
            "deaths": participant['deaths'],
            "assists": participant['assists'],
            "summonerSpells": summoner_spells,
            "runes": participant['perks']['styles'],
            "gameDuration": game_duration,
            "participants": participants,
        })
    except requests.exceptions.HTTPError as err:
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
