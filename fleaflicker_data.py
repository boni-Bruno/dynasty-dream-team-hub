import requests  # Biblioteca para fazer chamadas HTTP

# Configurações da sua liga
LEAGUE_ID = "1181975218791636992"  # ID da sua liga Fleaflicker
YEAR = 2024  # Ano da temporada
WEEK = 1  # Semana para buscar as pontuações (exemplo: semana 1)

# URL da API para buscar os dados do Fleaflicker
def get_fleaflicker_scores(league_id, season, scoring_period):
    url = f"https://www.fleaflicker.com/api/FetchLeagueScoreboard?sport=NFL&league_id={league_id}&season={season}&scoring_period={scoring_period}"
    try:
        # Fazendo a requisição à API
        response = requests.get(url)
        response.raise_for_status()  # Lança um erro se a requisição falhar
        data = response.json()  # Converte a resposta para JSON

        # Retorna os dados extraídos da API
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API Fleaflicker: {e}")
        return None

# Função principal para exibir os dados
def main():
    # Faz a chamada à API
    data = get_fleaflicker_scores(LEAGUE_ID, YEAR, WEEK)

    # Verifica se os dados foram retornados com sucesso
    if data is not None:
        # Exibindo informações básicas dos jogos
        print("\nDados dos jogos retornados pela API do Fleaflicker:")
        for game in data.get("games", []):  # Obtém a lista de jogos
            home_team = game["home"]["name"]
            away_team = game["away"]["name"]
            print(f"{home_team} VS {away_team}")
    else:
        print("Não foi possível obter os dados da API.")

# Executa o script
if __name__ == "__main__":
    main()