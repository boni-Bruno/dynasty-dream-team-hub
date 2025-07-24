from fleaflicker import Fleaflicker

# Configurações da sua liga
LEAGUE_ID = "1181975218791636992"  # Substitua pelo ID da sua liga
YEAR = 2024  # Ano da temporada

# Inicializa o cliente do Fleaflicker
client = Fleaflicker(LEAGUE_ID)

# Função para obter os dados dos jogadores e pontuações
def get_players_scores():
    try:
        # Obtém jogadores da liga
        players = client.players()  # Retorna os jogadores
        
        # Exibe os jogadores com os pontos
        for player in players:
            print(f"{player['name']}: {player['points']} pontos")  # Nome e pontos de cada jogador
    except Exception as e:
        print(f"Erro ao buscar dados: {e}")

# Chama a função para buscar os dados dos jogadores
if __name__ == "__main__":
    get_players_scores()