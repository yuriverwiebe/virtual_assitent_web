// Array de respostas possíveis do assistente
const respostas = [
    "Olá! Como posso ajudar?",
    "Estou aqui para te ajudar.",
    "Diga-me mais sobre o que você precisa."
];

// Função para consultar o tempo e clima
async function consultarTempo(cidade) {
    const apiKey = '99ed92f184a01a0f8c5fcacd5ffb46a6';  // Coloque sua chave de API da OpenWeatherMap aqui
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do clima');
        }
        const data = await response.json();
        const temperatura = data.main.temp;
        const descricao = data.weather[0].description;
        const cidadeNome = data.name;
        const pais = data.sys.country;

        return {
            temperatura,
            descricao,
            cidade: cidadeNome,
            pais
        };
    } catch (error) {
        console.error('Erro ao consultar o clima:', error.message);
        return null;
    }
}

// Função que é chamada quando o usuário envia uma mensagem
async function sendMessage() {
    // Obtém o texto digitado pelo usuário
    const userInput = document.getElementById('user-input').value;
    // Verifica se o campo está vazio ou apenas contém espaços em branco
    if (userInput.trim() === "") return;

    // Obtém o elemento onde as mensagens serão exibidas
    const chatOutput = document.getElementById('chat-output');

    // Função para adicionar mensagem do usuário ao chat
    function addUserMessage(text) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';

        const userLabel = document.createElement('span');
        userLabel.className = 'label';
        userLabel.textContent = 'Usuário: ';
        userMessage.appendChild(userLabel);

        const userText = document.createElement('span');
        userText.textContent = text;
        userMessage.appendChild(userText);

        chatOutput.appendChild(userMessage);
    }

    // Função para adicionar mensagem do assistente ao chat
    function addBotMessage(text) {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';

        const botLabel = document.createElement('span');
        botLabel.className = 'label';
        botLabel.textContent = 'Assistente: ';
        botMessage.appendChild(botLabel);

        const botText = document.createElement('span');
        botText.textContent = text;
        botMessage.appendChild(botText);

        chatOutput.appendChild(botMessage);
    }

    // Verifica se o usuário perguntou "que dia é hoje?"
    if (userInput.toLowerCase() === 'que dia é hoje?') {
        const today = new Date();
        const resposta = `Hoje é ${today.toLocaleDateString('pt-BR')}.`;

        addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
        addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
    } else if (userInput.toLowerCase().includes('clima em')) {
        // Verifica se o usuário mencionou "clima em"
        const cidade = userInput.substring(userInput.indexOf('em') + 3).trim();
        
        // Consulta o tempo e clima da cidade
        const clima = await consultarTempo(cidade);
        if (clima) {
            const resposta = `Atualmente em ${clima.cidade}, ${clima.pais}: ${clima.descricao}, temperatura de ${clima.temperatura}°C.`;
            addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
            addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
        } else {
            const resposta = 'Desculpe, não consegui obter informações sobre o clima dessa cidade.';
            addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
            addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
        }
    } else if (userInput.toLowerCase().includes('calculadora')) {
        // Verifica se o usuário mencionou "calculadora"
        const resposta = `Que tipo de operação você gostaria de fazer?`;

        addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
        addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
    } else if (userInput.toLowerCase().includes('+') || userInput.toLowerCase().includes('-') || userInput.toLowerCase().includes('*') || userInput.toLowerCase().includes('/')) {
        // Verifica se o usuário digitou uma operação matemática
        let resultado;
        try {
            resultado = eval(userInput); // Avalia a expressão matemática
            if (isNaN(resultado)) {
                throw new Error('Expressão inválida');
            }
            const resposta = `O resultado de ${userInput} é ${resultado}`;

            addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
            addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
        } catch (error) {
            console.error('Erro ao calcular:', error.message);
            const resposta = `Desculpe, não consegui calcular. Por favor, tente novamente.`;
            
            addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
            addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
        }
    } else {
        // Se não for nenhum dos casos acima, gera uma resposta aleatória
        const resposta = respostas[Math.floor(Math.random() * respostas.length)];
        
        addUserMessage(userInput); // Adiciona mensagem do usuário ao chat
        addBotMessage(resposta);   // Adiciona resposta do assistente ao chat
    }

    // Limpa o campo de entrada do usuário após enviar a mensagem
    document.getElementById('user-input').value = '';

    // Realiza a rolagem automática para exibir a última mensagem enviada
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
