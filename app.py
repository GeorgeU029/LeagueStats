from flask import Flask, jsonify, request, render_template
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv(dotenv_path='key.env')

app = Flask(__name__)

# Enable CORS
CORS(app)

API_KEY = os.getenv('RIOT_API_KEY')
PORT = int(os.getenv('PORT', 3000))

custom_headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "X-Riot-Token": API_KEY
}

# Serve the index.html file
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/account/<string:gameName>/<string:tagLine>', methods=['GET'])
def get_account_data(gameName, tagLine):
    base_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
    
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        status_code = response.status_code if 'response' in locals() else 500
        return jsonify({"error": str(err)}), status_code

@app.route('/api/summoner/by-puuid/<string:puuid>', methods=['GET'])
def get_summoner_data(puuid):
    base_url = f"https://americas.api.riotgames.com/fulfillment/v1/summoners/by-puuid/{puuid}"
    
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        status_code = response.status_code if 'response' in locals() else 500
        return jsonify({"error": str(err)}), status_code

@app.route('/api/matches/by-puuid/<string:puuid>', methods=['GET'])
def get_match_history(puuid):
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10"
    
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as err:
        status_code = response.status_code if 'response' in locals() else 500
        return jsonify({"error": str(err)}), status_code

@app.route('/api/matches/<string:matchId>', methods=['GET'])
def get_match_stats(matchId):
    base_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}"
    
    try:
        response = requests.get(base_url, headers=custom_headers)
        response.raise_for_status()
        match_data = response.json()

        puuid = request.args.get('puuid')
        # Assuming you're trying to extract information for a specific player based on the first participant PUUID
        player_data = next((participant for participant in match_data['info']['participants'] if participant['puuid'] == puuid), None)

        if player_data:
            # Construct the response with relevant details
            match_stats = {
                "champion": player_data["championName"],  # Champion name instead of ID
                "win": player_data["win"],
                "items": [player_data[f"item{i}"] for i in range(6)],  # Add all item slots (item0 to item5)
                "kills":player_data["kills"]
            }
            return jsonify(match_stats)
        else:
            return jsonify({"error": "Player data not found."}), 404
            
    except requests.exceptions.HTTPError as err:
        status_code = response.status_code if 'response' in locals() else 500
        return jsonify({"error": str(err)}), status_code

            
    except requests.exceptions.HTTPError as err:
        status_code = response.status_code if 'response' in locals() else 500
        return jsonify({"error": str(err)}), status_code


if __name__ == '__main__':
    app.run(port=PORT, debug=True)
