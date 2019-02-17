export enum WebSocketMessageTypes {
  Ping = 'PING',
  Pong = 'PONG',

  Player = 'PLAYER',
  SubscribePlayer = 'SUBSCRIBE_PLAYER',
  UnsubscribePlayer = 'UNSUBSCRIBE_PLAYER',

  Game = 'GAME',
  SubscribeGame = 'SUBSCRIBE_GAME',
  UnsubscribeGame = 'UNSUBSCRIBE_GAME',

  GameInfo = 'GAME_INFO',
  SubscribeGameInfo = 'SUBSCRIBE_GAME_INFO',
  UnsubscribeGameInfo = 'UNSUBSCRIBE_GAME_INFO',

  GameList = 'GAME_LIST',
  SubscribeGameList = 'SUBSCRIBE_GAME_LIST',
  UnsubscribeGameList = 'UNSUBSCRIBE_GAME_LIST',
}
