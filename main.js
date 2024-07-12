const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();


console.log(process.env.session_path)
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: process.env.session_path
    })

});


client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message_create', async (message) => {
    if (message.location) {
        // console.log(message.location);
        let user = await message.getContact();
        const chat = await message.getChat();

        var responseMsg = "dari " + user.name + "Nomor : " + user.id.user + " latitude : " + message.location.latitude + " longitude : " + message.location.longitude
        
        console.log(responseMsg);
        const url = process.env.sheet_url;

        const data = {
            Nama: user.name,
            Nomor: user.id.user,
            Latitude: message.location.latitude,
            Longitude: message.location.longitude,
            Url: `https://maps.google.com/?q=${message.location.latitude},${message.location.longitude}`
        };

        const responseMsg2 = `✨ Terima Kasih! ✨\n\nData Anda telah berhasil dikirim. Berikut adalah informasi yang kami terima:\n\n📌 Nama: ${data.Nama}\n📞 Nomor: ${data.Nomor}\n🌍 Lokasi:\n    Latitude: ${data.Latitude}\n    Longitude: ${data.Longitude}\n📍 [Lihat di Google Maps](${data.Url})\n\nJika ada informasi lebih lanjut yang Anda butuhkan, jangan ragu untuk menghubungi kami.\n\nTerima kasih atas kerjasamanya! 😊`;


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                
                 chat.sendMessage(responseMsg2);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    } else {
        // const chat = await message.getChat();
        // let user = await message.getContact();
        // // await chat.sendMessage(`Hello @${user.id.user}`, {
        // //     mentions: [user]
        // // });
        // console.log(user.name)


    }


});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.initialize();


