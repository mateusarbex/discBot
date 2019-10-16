Providencie sua própria chave de desenvolvedor da Steam, Discord e da Bungie

Crie um arquivo config no root com as seguintes propriedades
{
    "prefix" // prefixo que deseja escolher
    "token" // token do discord
    "steamToken" // token da api da steam
    "header":{"X-API-Key"} // header para a api da Bungie.net junto com o token da Bungie.net
    "BaseURL" // URL para chamadas de api da Bungie.net. ex: https://www.bungie.net/Platform
}

Um bot genérico com comandos diversos