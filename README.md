# Bot Criador de Sticker Whatsapp

Ao receber qualquer imagem no seu whatsapp que contenha o emoji: 📷, ele é convertido automáticamente para uma sticker.
Sendo assim optimizando a criação de stickers dentro do whatsapp.

## Autores

- [@emanuellresende](https://github.com/emanuellresendee)

## Contribuindo

Contribuições são sempre bem-vindas!

Veja `contribuindo.md` para saber como começar.

Por favor, siga o `código de conduta` desse projeto.


## Funcionalidades

- Criar Stickers No Whatsapp


## Melhorias

Em breve será adicionado as seguintes melhorias:
* Download de Videos do Youtube ( Ou qualquer outro link enviado )
* Criar Automaticamente Giffs com os videos enviados.


## Uso/Exemplos
Primeiramente Começamos Importando as seguintes libs que são utilizadas no projeto.
* Dotenv: Para armazenar seu numero do whatsapp
* Whatsappweb: Para realizar a comunicação com a api do whatsapp.
* QrCode: Para gerar o qrCode para conectar com sua whatsapp.
```javascript
require( "dotenv" ).config();
const { Client, MessageMedia } = require( "whatsapp-web.js" );
const qrCode = require( "qrcode-terminal" );
const axios = require( "axios" );
}
```

Realizamos a conexão com o whatsapp e então retornamos que está conectado assim que ler o qrCode e conectar.
```javascript
console.log( "Starting Connection" );
client.on( "qr", qr => {
  qrCode.generate( qr, { small: true } );
});

client.on( "ready", () => {
  console.clear();
  console.log( "Whatsapp Is Connected" );
});
```

Realizamos a verificação da mensagem criada se primeiramente, ela é mensagem sua ou de outra pessoa, e caso a mensagem seja uma imagem chamamos, a função seguinte que é responsavel por criar a sticker.
```javascript
client.on( "message_create", message => {
  const { to, from, body } = message;
  const command = body.split(' ')[0];
  const sender = from.includes( process.env.WHATSAPP_NUMBER ) ? to : from
  if ( command === "📷" ) {
    generateSticker( message, sender );
  }
});
```

Aqui realizamos a verificação se é uma imagem ou o link para uma imagem, caso for um link utilizamos o axios para realizar o download da imagem, se nao for utilizamos a propria função da lib do whatsapp de download e então a convertemos.
```javascript
const generateSticker = async ( message, sender ) => {
  const { body, type, reply } = message;
  if ( type === "image" ) {
    try {
      const { data } = await message.downloadMedia();
      const image = await new MessageMedia( "image/jpeg", data, "image.jpg" );
      await client.sendMessage( sender, image, { sendMediaAsSticker: true } );
    } catch ( e ) {
      reply( "❌ Error To Process Image" );
    }
  } else {
    try {
      const url = body.substring( body.indexOf(" ") ).trim();
      const { data } = await axios.get( url, { responseType: "arraybuffer" } );
      const returnedB64 = Buffer.from( data ).toString("base64");
      const image = await new MessageMedia( "image/jpeg", returnedB64, "image.jpg" );
      await client.sendMessage( sender, image, { sendMediaAsSticker: true } );
    } catch ( e ) {
      reply( "❌ Unable to generate a sticker with this link" );
    }
  }
```


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env, colocar seu numero sem o numero "9" extra.

`WHATSAPP_NUMBER`

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/emanuellresende/whatsapp-sticker-bot
```

Entre no diretório do projeto

```bash
  cd whatsapp-sticker-bot
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  node index.js
```

