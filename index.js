require( "dotenv" ).config();
const { Client, MessageMedia } = require( "whatsapp-web.js" );
const qrCode = require( "qrcode-terminal" );
const axios = require( "axios" );

const client = new Client({});

console.log( "Starting Connection" );
client.on( "qr", qr => {
  qrCode.generate( qr, { small: true } );
});

client.on( "ready", () => {
  console.clear();
  console.log( "Whatsapp Is Connected" );
});

client.on( "message_create", message => {
  const { to, from, body } = message;
  const command = body.split(' ')[0];
  const sender = from.includes( process.env.WHATSAPP_NUMBER ) ? to : from
  if ( command === "📷" ) {
    generateSticker( message, sender );
  }
});

client.initialize();

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
}