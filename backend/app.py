from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Load environment variables
load_dotenv(dotenv_path='key.env')

app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

API_KEY = os.getenv('RIOT_API_KEY')
custom_headers = {
    "User-Agent": "Mozilla/5.0",
    "X-Riot-Token": API_KEY
}

@app.route('/api/version', methods=['GET'])
def get_latest_version():
    url = "https://ddragon.leagueoflegends.com/api/versions.json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        versions = response.json()
        return jsonify({"version": versions[0]})
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

@app.route('/')
def index():
    return "Welcome to the Riot API Server!"

@app.route('/api/account/<string:gameName>/<string:tagLine>', methods=['GET'])
def get_account_data(gameName, tagLine):
    base_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/summoner/by-puuid/<string:puuid>', methods=['GET'])
def get_summoner_data(puuid):
    base_url = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        data = response.json()

        rank_url = f"https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{data['id']}"
        rank_response = requests.get(rank_url, headers=custom_headers)
        rank_response.raise_for_status()
        rank_data = rank_response.json()

        return jsonify({
            "summonerLevel": data["summonerLevel"],
            "profileIconId": data["profileIconId"],
            "rank": rank_data[0] if rank_data else None
        })
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/matches/by-puuid/<string:puuid>', methods=['GET'])
def get_match_history(puuid):
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

def fetch_match_data(match_id, puuid):
    match_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
    retries = 3
    delay = 2
    for i in range(retries):
        try:
            response = requests.get(match_url, headers=custom_headers)
            response.raise_for_status()
            match_data = response.json()
            participant = next(
                (p for p in match_data['info']['participants'] if p['puuid'] == puuid), None
            )

            if participant:
                # Retrieve summoner spells
                summoner_spells = [
                    participant.get('summoner1Id'),
                    participant.get('summoner2Id')
                ]

                # Extract rune data for primary and secondary rune styles
                runes_data = participant.get('perks', {}).get('styles', [])
                primary_rune_style = runes_data[0]['selections'][0]['perk'] if len(runes_data) > 0 and 'selections' in runes_data[0] else None
                sub_rune_style = runes_data[1]['style'] if len(runes_data) > 1 else None

                # Create a `runes` dictionary with primary and sub styles
                runes = {
                    "primaryStyle": primary_rune_style,
                    "subStyle": sub_rune_style
                }

                participants = [
                    {
                        "championName": p['championName'],
                        "summonerName": p['summonerName']
                    } for p in match_data['info']['participants']
                ]

                return {
                    "matchId": match_id,
                    "champion": participant['championName'],
                    "win": participant['win'],
                    "kills": participant['kills'],
                    "deaths": participant['deaths'],
                    "assists": participant['assists'],
                    "items": [
                        participant['item0'], participant['item1'], participant['item2'],
                        participant['item3'], participant['item4'], participant['item5'], participant['item6']
                    ],
                    "summonerSpells": summoner_spells,
                    "runes": runes,
                    "gameMode": match_data['info'].get('gameMode', 'Unknown'),
                    "participants": participants,
                    "gameCreation": match_data['info']['gameCreation'],
                    "totalMinionsKilled": participant.get('totalMinionsKilled', 0),
                    "goldEarned": participant.get('goldEarned', 0),
                    "gameDuration": match_data['info'].get('gameDuration', 1)
                }

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and i < retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                return None

@app.route('/api/matches/winrate/<string:puuid>', methods=['GET'])
def get_match_history_with_win_rate(puuid):
    limit = int(request.args.get('limit', 10))
    offset = int(request.args.get('offset', 0))

    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start={offset}&count={limit}"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        match_ids = response.json()

        wins = 0
        total_matches = len(match_ids)
        match_details = []

        with ThreadPoolExecutor() as executor:
            future_to_match = {executor.submit(fetch_match_data, match_id, puuid): match_id for match_id in match_ids}
            for future in as_completed(future_to_match):
                match_data = future.result()
                if match_data:
                    match_details.append(match_data)
                    if match_data["win"]:
                        wins += 1

        match_details.sort(key=lambda x: x["gameCreation"], reverse=True)
        win_rate = (wins / total_matches) * 100 if total_matches > 0 else 0

        return jsonify({
            "totalMatches": total_matches,
            "wins": wins,
            "losses": total_matches - wins,
            "winRate": round(win_rate, 2),
            "matchDetails": match_details
        })
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/champion-mastery/<string:puuid>', methods=['GET'])
def get_champion_mastery(puuid):
    base_url = f"https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top"
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        mastery_data = response.json()

        top_mastery = mastery_data[:3]
        return jsonify({"topMastery": top_mastery})
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

def get_champion_performance(puuid):
    limit = 100  # Last 100 games
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?count={limit}"

    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        match_ids = response.json()

        champion_stats = {}
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(fetch_match_data, match_id, puuid) for match_id in match_ids]
            for future in as_completed(futures):
                match_data = future.result()
                if match_data:
                    champ = match_data["champion"]
                    stats = champion_stats.setdefault(champ, {
                        'games': 0, 'wins': 0, 'kills': 0, 'deaths': 0, 'assists': 0, 'cs': 0
                    })
                    stats['games'] += 1
                    stats['wins'] += 1 if match_data['win'] else 0
                    stats['kills'] += match_data['kills']
                    stats['deaths'] += match_data['deaths']
                    stats['assists'] += match_data['assists']
                    stats['cs'] += match_data['totalMinionsKilled'] / (match_data['gameDuration'] / 60)

        champion_performance = sorted(
            [
                {
                    'champion': champion,
                    'games': stats['games'],
                    'win_rate': round((stats['wins'] / stats['games']) * 100, 2),
                    'average_kda': f"{stats['kills'] / stats['games']:.1f}/{stats['deaths'] / stats['games']:.1f}/{stats['assists'] / stats['games']:.1f}",
                    'average_cs_per_min': round(stats['cs'] / stats['games'], 2),
                }
                for champion, stats in champion_stats.items()
            ],
            key=lambda x: x['games'],
            reverse=True
        )[:5]  # Limit to top 5 champions by games played

        return jsonify({"championPerformance": champion_performance})
    except requests.exceptions.RequestException as err:
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
