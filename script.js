const form = document.getElementById('chat-form');
const speakButton = document.getElementById('speak-button');
const responseTextarea = document.getElementById('response');
const chatContainer = document.getElementById('chat-container');

require('dotenv').config();
const apiKey = process.env.API_KEY;

let lista_scarpe_proposte = [];  // Array globale per salvare le parole trovate
let lista_scarpe_da_portare = [];  // Array globale per salvare le parole trovate

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    responseTextarea.value = 'Spiacente, il tuo browser non supporta il riconoscimento vocale.';
    alert('Spiacente, il tuo browser non supporta il riconoscimento vocale.');
}

if (recognition) {
    recognition.lang = 'it-IT'; // Set language to Italian
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        speakButton.textContent = 'Ascoltando...';
        speakButton.disabled = true;
    };

    recognition.onresult = async function(event) {
        const speechResult = event.results[0][0].transcript;
        speakButton.textContent = 'Inizia a parlare';
        speakButton.disabled = false;
        console.log(speechResult);
        

        // Esegui diverse azioni in base ai risultati
        if (checkbox1 && checkbox2) {
            console.log('Entrambi i checkbox sono selezionati!');
        } else if (checkbox1) {
            console.log('Solo il Checkbox 1 è selezionato.');
        } else if (checkbox2) {
            console.log('Solo il Checkbox 2 è selezionato.');
        } else {
            console.log('Nessuno dei checkbox è selezionato.');
        }


        // Aggiungi il messaggio dell'utente alla cronologia
        appendMessage(speechResult, 'user');

        try {
            
            if (checkbox1 && checkbox2) {
                console.log('Scarpe da donna impermeabili!');
                lista_scarpe_donna = new Array('Beta 7212LG', 'Cofra Alice', 'Dike Meteor Like S3',
                    'U-power Candy');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `Sei un assistente virtuale chiamata Joy e parli italiano. Sei una commessa di un negozio di scarpe antinfortunistica e aiuti le persone a scegliere il modello più adatto a loro. Questa è la lista di scarpe antinfortunistiche presenti in negozio tra cui scegliere: ${lista_scarpe_donna}. Stai molto attenta alle proprietà delle scarpe, devi essere precisissima ma molto sintetica. Preferisci le scarpe di fascia superiore. Le U-power Candy sono ammortizzate, le Dike Meteor Like S3 sono ammortizzate, le Cofra Alice sono leggere, le Beta 7212LG sono economiche ma resistenti.`
                            },
                            { 
                                role: 'user', 
                                content: speechResult 
                            }
                        ],
                        temperature: 0.2,
                        top_p: 0.7,
                        n: 1,
                        stream: false,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    responseTextarea.value = data.choices[0].message.content;
                    const assistantMessage = data.choices[0].message.content;
                    //pubblico prime 6 immagini
                    lista_scarpe_proposte = [];
                    for (let i = 0; i < lista_scarpe_donna.length; i++) {
                        if (assistantMessage.includes(lista_scarpe_donna[i])) {  // Controlla se la frase contiene la parola corrente
                            console.log(`La parola "${lista_scarpe_donna[i]}" è presente nella frase.`);
                            lista_scarpe_proposte.push(lista_scarpe_donna[i]);  // Aggiunge la parola trovata all'array `lista_scarpe_proposte`
                        }
                    }
                    // Aggiungi il messaggio dell'assistente alla cronologia
                    appendMessage(assistantMessage, 'assistant');
                    //document.images["imag1"].src = `./images/${lista_scarpe_proposte[0]}.png`;
                    for (let i = 0; i < 6; i++) {
                        document.images[`imag${i}`].src = `./images/non_disponibile.png`;
                    }
                    for (let i = 0; i < lista_scarpe_proposte.length; i++) {
                        if(i<6){
                            document.images[`imag${i}`].src = `./images/${lista_scarpe_proposte[i]}.png`;
                        }
                    }
                } else {
                    responseTextarea.value = 'Errore: Impossibile elaborare la tua richiesta.';
                    appendMessage('Errore: Impossibile elaborare la tua richiesta.', 'assistant');
                }
            }
            else if (checkbox1) {
                console.log('Scarpe da donna non impermeabili.');
                lista_scarpe_donna = new Array('Lotto First 700', 'Diadora Athena Text Low', 'U-power June',
                    'Sparco Practice rosa',
                    'Technosafe Neon Rosa', 'U-power Michelle', 'Reebok Fusion Flexweave',
                    'Reebok Wos Ox', 'Diadora Run Net Airbox', 'Beta 7214LN', 'Cofra Ace',
                    'Cofra Eva', 'Dike Like S1P', 'Giasco Free SB FO', 'Giasco Helsinky SB FO',
                    'Giasco Polo',
                    'U-power Light One', 'U-power Lolly', 'U-power Lucky', 'U-power Scandy',
                    'U-power Verok');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                    role: 'system',
                                    content: `Sei un assistente virtuale chiamata Joy e parli italiano. Sei una commessa di un negozio di scarpe antinfortunistica e aiuti le persone a scegliere il modello più adatto a loro. Questa è la lista di scarpe antinfortunistiche presenti in negozio tra cui scegliere: ${lista_scarpe_donna}. Stai molto attenta alle proprietà delle scarpe, devi essere precisissima ma molto sintetica. Preferisci le scarpe di fascia superiore. Scarpe ammortizzate: Technosafe Neon Rosa, U-power Michelle (molto ammortizzate), Diadora Run Net Airbox, Dike Like S1P, U-power Lolly, U-power Verok. Scarpe leggere: U-power Michelle, Lotto First 700, Sparco Practice rosa, Reebok Fusion Flexweave, Reebok Wos Ox, Cofra Eva. Sandali traspiranti: Cofra Ace, Giasco Free SB FO, Giasco Helsinky SB FO, U-power Light One, U-power Scandy. Scarpe economiche ma buone: Technosafe Neon Rosa, Beta 7214LN, Cofra Eva.`
                            },
                            { 
                                    role: 'user', 
                                    content: speechResult 
                            }
                        ],
                        temperature: 0.2,
                        top_p: 0.7,
                        n: 1,
                        stream: false,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                    }),
                });
    
                if (response.ok) {
                        const data = await response.json();
                        responseTextarea.value = data.choices[0].message.content;
                        const assistantMessage = data.choices[0].message.content;
                        //pubblico prime 6 immagini
                        lista_scarpe_proposte = [];
                        for (let i = 0; i < lista_scarpe_donna.length; i++) {
                            if (assistantMessage.includes(lista_scarpe_donna[i])) {  // Controlla se la frase contiene la parola corrente
                                console.log(`La parola "${lista_scarpe_donna[i]}" è presente nella frase.`);
                                lista_scarpe_proposte.push(lista_scarpe_donna[i]);  // Aggiunge la parola trovata all'array `lista_scarpe_proposte`
                            }
                        }
                        // Aggiungi il messaggio dell'assistente alla cronologia
                        appendMessage(assistantMessage, 'assistant');
                        for (let i = 0; i < 6; i++) {
                            document.images[`imag${i}`].src = `./images/non_disponibile.png`;
                        }
                        for (let i = 0; i < lista_scarpe_proposte.length; i++) {
                            if(i<6){
                                document.images[`imag${i}`].src = `./images/${lista_scarpe_proposte[i]}.png`;
                            }
                        }
                } else {
                        responseTextarea.value = 'Errore: Impossibile elaborare la tua richiesta.';
                        appendMessage('Errore: Impossibile elaborare la tua richiesta.', 'assistant');
                }
            }
            else if(checkbox2) {
                console.log('Scarpe da uomo impermeabili.');
                lista_scarpe_uomo = new Array('Technosafe Detroit',
                    'Diadora Shark Stable impact low', 'Technosafe Neon new', 'U-power Matt',
                    'Base k-energy', 'Lotto HIT 250', 'U-power Peter', 'Reebok BB4500',
                    'Beta 7320NA', 'Panther Evo Black Low', 'Reebok Fusion Formidable',
                    'Reebok Leather WP Oxford', 'Diadora Glove MID',
                    'Base Marathon', 'Cofra Monti', 'Giasco Baden',
                    'Giasco Ercolano', 'Giasco Soccer', 'Grisport Bassano', 'Grisport Marostica',
                    'Lotto Jump 700', 'Sparco Nitro S3', 'U-power Hummer', 'U-power Strong',
                    'U-power Velar');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `Sei un assistente virtuale chiamata Joy e parli italiano. Sei una commessa di un negozio di scarpe antinfortunistica e aiuti le persone a scegliere il modello più adatto a loro. Questa è la lista di scarpe antinfortunistiche presenti in negozio tra cui scegliere: ${lista_scarpe_uomo}. Stai molto attenta alle proprietà delle scarpe, devi essere precisissima ma molto sintetica. Preferisci le scarpe di fascia superiore. Scarpe ammortizzate: Diadora Shark Stable impact low, Technosafe Neon new, U-power Matt (molto ammortizzate), Base k-energy, U-power Peter, U-power Hummer, U-power Strong, U-power Velar. Scarpe leggere: U-power Matt (molto leggere), U-power Peter, Reebok BB4500, Reebok Fusion Formidable (molto leggere), Reebok Leather WP Oxford, Cofra Monti, Sparco Nitro S3. Scarpe larghe: Lotto HIT 250, Lotto Jump 700. Scarpe economiche ma buone: Technosafe Detroit, Technosafe Neon new, Beta 7320NA, Cofra Monti, Base Marathon.`
                            },
                            { 
                                role: 'user', 
                                content: speechResult 
                            }
                        ],
                        temperature: 0.2,
                        top_p: 0.7,
                        n: 1,
                        stream: false,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                    }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    responseTextarea.value = data.choices[0].message.content;
                    const assistantMessage = data.choices[0].message.content;
                    //pubblico prime 6 immagini
                    lista_scarpe_proposte = [];
                    for (let i = 0; i < lista_scarpe_uomo.length; i++) {
                        if (assistantMessage.includes(lista_scarpe_uomo[i])) {  // Controlla se la frase contiene la parola corrente
                            console.log(`La parola "${lista_scarpe_uomo[i]}" è presente nella frase.`);
                            lista_scarpe_proposte.push(lista_scarpe_uomo[i]);  // Aggiunge la parola trovata all'array `lista_scarpe_proposte`
                        }
                    }
                    // Aggiungi il messaggio dell'assistente alla cronologia
                    appendMessage(assistantMessage, 'assistant');
                    for (let i = 0; i < 6; i++) {
                        document.images[`imag${i}`].src = `./images/non_disponibile.png`;
                    }
                    for (let i = 0; i < lista_scarpe_proposte.length; i++) {
                        if(i<6){
                            document.images[`imag${i}`].src = `./images/${lista_scarpe_proposte[i]}.png`;
                        }
                    }
                } else {
                    responseTextarea.value = 'Errore: Impossibile elaborare la tua richiesta.';
                    appendMessage('Errore: Impossibile elaborare la tua richiesta.', 'assistant');
                }
            }
            else {
                console.log('Scarpe da uomo non impermeabili.');
                lista_scarpe_uomo = new Array('Reebok FE4 Adventure', 'Base Berlin', 'Lotto First 700', 'Reebok Speed Tr Safety',
                    'Sparco Cup NRGF', 'Cofra Accelerator', 'Reebok Fusion Flexweave',
                    'U-power Egon', 'U-power Robin', 'Sparco Gymkhana Martini Racing',
                    'Rossini Saslong', 'Technosafe South Beach', 'Beta New Flex 7213G', 'Issa Station',
                    'Reebok Excel Light', 'Diadora Glove MDS Matryx Low',
                    'Diadora Run Net Airbox Low', 'Diadora Run Text Low', 'Base Colosseum',
                    'Base k-balance',
                    'Base k-move', 'Cofra Ace', 'Diadora Glove II', 'Giasco Free SB FO',
                    'Giasco Helsinky SB FO', 'Giasco Peru',
                    'Issa Atene', 'Issa Sparta', 'Lotto Hit 400', 'Lotto Jump 500',
                    'Sparco Practice verdi', 'U-power Better', 'U-power Demon',
                    'U-power Light One', 'U-power Lucky', 'U-power Point', 'U-power Push',
                    'U-power Yellow',
                    'U-power Reflex', 'U-power Scandy', 'U-power Sky', 'U-power Ultra',
                    'U-power Vortix', 'Technosafe Neon Verde');
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `Sei un assistente virtuale chiamata Joy e parli italiano. Sei una commessa di un negozio di scarpe antinfortunistica e aiuti le persone a scegliere il modello più adatto a loro. Questa è la lista di scarpe antinfortunistiche presenti in negozio tra cui scegliere: ${lista_scarpe_uomo}. Stai molto attenta alle proprietà delle scarpe, devi essere precisissima ma molto sintetica. Preferisci le scarpe di fascia superiore. Scarpe ammortizzate: U-power Egon, U-power Robin (molto ammortizzate), Diadora Glove MDS Matryx Low, Diadora Run Net Airbox Low, Base k-balance, Base k-move, U-power Point, U-power Push, U-power Yellow, U-power Ultra, Technosafe Neon Verde. Scarpe leggere: U-power Robin, Reebok FE4 Adventure, Lotto First 700, Reebok Speed Tr Safety, Cofra Accelerator, Reebok Fusion Flexweave, Reebok Excel Light, Lotto Hit 400, Lotto Jump 500, Sparco Practice verdi. Scarpe larghe: tutte le Lotto. Sandali traspiranti: U-power Light One, Giasco Free SB FO, Giasco Helsinky SB FO, Giasco Peru, U-power Scandy, U-power Ultra (non sandalo ma traspirante). Scarpe economiche ma buone: Technosafe South Beach, Technosafe Neon Verde, Issa Station, U-power Demon, Base Berlin, Base Berlin, Sparco Cup NRGF.`
                            },
                            { 
                                role: 'user', 
                                content: speechResult 
                            }
                        ],
                        temperature: 0.2,
                        top_p: 0.7,
                        n: 1,
                        stream: false,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                    }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    responseTextarea.value = data.choices[0].message.content;
                    const assistantMessage = data.choices[0].message.content;
                    //pubblico prime 6 immagini
                    lista_scarpe_proposte = [];
                    for (let i = 0; i < lista_scarpe_uomo.length; i++) {
                        if (assistantMessage.includes(lista_scarpe_uomo[i])) {  // Controlla se la frase contiene la parola corrente
                            console.log(`La parola "${lista_scarpe_uomo[i]}" è presente nella frase.`);
                            lista_scarpe_proposte.push(lista_scarpe_uomo[i]);  // Aggiunge la parola trovata all'array `lista_scarpe_proposte`
                        }
                    }
                    // Aggiungi il messaggio dell'assistente alla cronologia
                    appendMessage(assistantMessage, 'assistant');
                    for (let i = 0; i < 6; i++) {
                        document.images[`imag${i}`].src = `./images/non_disponibile.png`;
                    }
                    for (let i = 0; i < lista_scarpe_proposte.length; i++) {
                        if(i<6){
                            document.images[`imag${i}`].src = `./images/${lista_scarpe_proposte[i]}.png`;
                        }
                    }
                } else {
                    responseTextarea.value = 'Errore: Impossibile elaborare la tua richiesta.';
                    appendMessage('Errore: Impossibile elaborare la tua richiesta.', 'assistant');
                }
            } 
        } catch (error) {
            console.error(error);
            responseTextarea.value = 'Errore: Impossibile elaborare la tua richiesta.';
            appendMessage('Errore: Impossibile elaborare la tua richiesta.', 'assistant');
        }
    };

    recognition.onerror = function(event) {
        speakButton.textContent = 'Inizia a parlare';
        speakButton.disabled = false;
        console.error('Errore di riconoscimento vocale:', event.error);
    };

    recognition.onend = function() {
        speakButton.textContent = 'Inizia a parlare';
        speakButton.disabled = false;
    };

    speakButton.addEventListener('click', () => {
        recognition.start();
    });
}

// Funzione per aggiungere messaggi alla cronologia della chat
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const messageText = document.createElement('p');
    messageText.textContent = text;

    messageDiv.appendChild(messageText);
    responseTextarea.appendChild(messageDiv);

    // Scroll alla fine della chat
    responseTextarea.scrollTop = responseTextarea.scrollHeight;
}

// Funzione per gestire il clic sui pulsanti
function portaScarpe(imageNumber) {
    console.log(`Ti faccio portare la scarpa ${lista_scarpe_proposte[imageNumber-1]}`);
    lista_scarpe_da_portare.push(lista_scarpe_proposte[imageNumber-1]);
    // Qui puoi eseguire altre azioni, come reindirizzare l'utente o modificare contenuti
}

function stopRecognition(){
    for (let i = 0; i < 6; i++) {
        document.images[`imag${i}`].src = `./images/non_disponibile.png`;
    }
    for (let i = 0; i < lista_scarpe_da_portare.length; i++) {
        if(i<6){
            document.images[`imag${i}`].src = `./images/${lista_scarpe_da_portare[i]}.png`;
        }
    }
    console.log("Stop");
    responseTextarea.value = 'Spero di esserle stata utile, queste sono le scarpe che ha scelto. A presto!';
}
