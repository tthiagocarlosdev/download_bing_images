# Download Bing Images

Com este script node.js você vai baixar várias imagens do site [bing.com](https://www.bing.com/)

O site [bing.com](https://www.bing.com/) sempre publica várias imagens em vários países. Eu sempre gostei de baixar essas imagens para colocar como plano de fundo no meu computador ou como tela de bloqueio. Todos os dias várias imagens são publicadas em diferentes países. 

No site [Bing Wallpaper](https://bingwallpaper.anerg.com/) você pode encontrar imagens de vários países a partir do ano de 2009. Eu sempre baixava manualmente. Acessava o site, cada país, cada mês, clicava em cada imagem e baixava. Mas aí pensei, por que não automatizar esse processo e baixar todas as imagens de uma vez?

Com ajuda do [Chatgpt](https://chatgpt.com/), criei esse script que, basta informar o ano que eu quero e ele vai baixar todas as imagens do ano informado de uma lista de 11 países (que são os países que aparecem no site [Bing Wallpaper](https://bingwallpaper.anerg.com/)). 

O script foi configurado para baixar as imagens com resolução de 1920x1080p, porém algumas imagens antigas são menores do que essa resolução. Abaixo segue a documentação do script e você pode copiar o código e executar em sua máquina. O código do script está no arquivo **download_dynamic.js**.

## Orientações iniciais

Importante destacar que você deve ter o **node** instalado em sua máquina, antes de executar o script.

Instale a biblioteca `axios` :

```shell
npm install axios
```

Copie os arquivos do projeto (sem a pasta `node_modules`) e rode o seguinte comando para instalar todas as dependências novamente com base no `package.json`:

```shell
npm install
```

## Lista de países

O arquivo `countries.js` é um **module.exports** o qual fornecerá para o script a lista com todos os países e com os códigos de cada país. **ATENÇÃO**, você deve criar esse arquivo antes de rodar o script.

```js
// countries.js

module.exports = [
    { name: 'United States', code: 'us', startDate: '200905' },
    { name: 'United Kingdom', code: 'uk', startDate: '200907' },
    { name: 'New Zealand', code: 'nz', startDate: '200907' },
    { name: 'Japan', code: 'jp', startDate: '200907' },
    { name: 'Italia', code: 'it', startDate: '202208' },
    { name: 'France', code: 'fr', startDate: '201110' },
    { name: 'España', code: 'es', startDate: '202208' },
    { name: 'Deutschland', code: 'de', startDate: '200907' },
    { name: 'China', code: 'cn', startDate: '200907' },
    { name: 'Canada', code: 'ca', startDate: '200907' },
    { name: 'Australia', code: 'au', startDate: '200905' },
];
```



## Declaração de Variáveis e importação de dependências

Aqui vamos importar alguns módulos, bibliotecas e a lista de países:

```js
const fs = require('fs'); // Importa o módulo 'fs' para manipulação de arquivos no sistema
const path = require('path'); // Importa o módulo 'path' para lidar com caminhos de arquivos e diretórios
const axios = require('axios'); // Importa a biblioteca 'axios' para fazer requisições HTTP
const cheerio = require('cheerio'); // Importa a biblioteca 'cheerio' para manipulação e extração de dados de HTML
const countries = require('./countries'); // Importa a lista de países a partir de um arquivo local chamado 'countries.js'
```

Em seguida temos a variável **YEAR**, onde o usuário deve colocar manualmente o ano o qual ele quer baixar as imagens.

```js
const YEAR = '2009'; // Define manualmente o ano desejado para baixar as imagens no formato YYYY
```

A variável **DOWNLOAD_FOLDER** define o local/pasta/diretório onde você salvará as imagens. Voc%e não precisa criar a pasta, ela será criada automaticamente, porém o caminho deve informado e o nome da pasta será o último desse caminho.

- Windows 

```js
const DOWNLOAD_FOLDER = 'C:\\Users\\SeuUsuario\\Downloads\\bing_download';
```

- Linux/macOS

```js
const DOWNLOAD_FOLDER = '/home/seuusuario/Downloads/bing_download';
```

No meu caso, eu coloquei desta forma na minha máquina: 

```js
const DOWNLOAD_FOLDER = '/home/th/Pictures/bing'; // Define o diretório onde as imagens serão salvas
```



## Rodando o Script

Com os arquivos **`coutries.js`** e **`download_dynamic.js`** criados, **`node`** e biblioteca **`axios`** instalados, o **ano** informado e o **caminho da pasta** onde as imagens serão salvas, você pode rodar o script com o seguinte comando:

```sh
node download_dynamic.js
```



## sucess_download_list e error_download_list

Além do arquivo com a lista de países e o arquivo principal, teremos mais dois arquivos gerados automaticamente a parti da primeira execução. Os arquivos `sucess_download_list.js` e `error_download_list.js`.

`sucess_download_list.js` armazena uma lista com objetos que informam o nome de cada imagem, de qual país ela foi baixada e a data no formato YYYYMM.

```js
module.exports = [
  {
    "image": "HorseheadNebula.jpg",
    "country": "us",
    "date": "200905"
  },
  {
    "image": "Porcupine.jpg",
    "country": "us",
    "date": "200905"
  },
  ....
  {
    "image": "Purnululu.jpg",
    "country": "au",
    "date": "200912"
  } 
];
```

'error_download_list.js' armazena uma lista com o link de imagens que não foram baixadas devido a algum erro:

```js
module.exports = [];
```

sucess_download_list e error_download_list:

```js
const SUCCESS_LIST_FILE = 'sucess_download_list.js'; // Caminho do arquivo que armazenará a lista de imagens baixadas com sucesso
const ERROR_LIST_FILE = 'error_download_list.js'; // Caminho do arquivo que armazenará a lista de erros de download
```

Verificacação da pasta de download:

```js
// Verifica se a pasta de destino das imagens já existe, se não existir, cria a pasta
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true }); // Cria a pasta e subpastas, se necessário
}
```

Verificação dos arquivos `sucess_download_list.js` e `error_download_list.js`:

```js
// Verifica se os arquivos de listas de sucesso e erro já existem e os carrega, caso contrário, inicializa listas vazias
const successList = fs.existsSync(SUCCESS_LIST_FILE) ? require(`./${SUCCESS_LIST_FILE}`) : []; // Lista de imagens já baixadas
const errorList = fs.existsSync(ERROR_LIST_FILE) ? require(`./${ERROR_LIST_FILE}`) : []; // Lista de imagens que falharam no download
```

**newDownloads** será um contador que informará quantas imagens foram baixadas ao final da execução do script:

```js
let newDownloads = 0; // Variável que contabiliza quantas novas imagens foram baixadas durante a execução do script
```

## Função principal `main( )`

O script inicia a partir da função principal para iniciar o processo de download.

```js
main();
```

Declaração da função assíncrona principal que gerencia o fluxo de execução do script. Dentro desta função temos um **`for (const country of countries)`** que itera sobre a lista de países. Para cada país, chamamos a função **`await processCountry(country);`** passando como parâmetro o objeto de cada país e aguardando sua conclusão antes de prosseguir.

**`console.log(...)`**: Exibe a quantidade total de imagens baixadas durante a execução do script.

```js
async function main() {
    for (const country of countries) {
        await processCountry(country);
    }

    console.log(`\n 📥 ${newDownloads} novas imagens foram baixadas nesta execução.`);
}
```

## Função `processCountry()`

Função assíncrona que processa todas as imagens de um determinado país ao longo de um ano. Ela exibe mensagens no console para acompanhar o progresso da execução. Temos um **`for (let month = 1; month <= 12; month++)`** que itera sobre todos os meses do ano. O **`formattedMonth = month.toString().padStart(2, '0')`** formata o mês para garantir dois dígitos (ex: "01" a "12"). **`monthYear = `${YEAR}${formattedMonth}`;`** cria a string no formato `YYYYMM`, usada na busca de imagens.

**`await getAllImageIds(country.code, monthYear)`** é uma função que obtém os IDs das imagens disponíveis para aquele país e mês. Em **`if (imageIds.length === 0)`** caso nenhuma imagem seja encontrada, a função pula para o próximo mês. O **`for (const imageId of imageIds)`** itera sobre os IDs das imagens e inicia o download de cada uma e por último o **`await downloadImage(country.code, monthYear, imageId)`** é uma função que realiza o download da imagem.

```js
async function processCountry(country) {
    // Exibe uma mensagem informando que a busca de imagens para o país começou
    console.log(`\n 🔎 Buscando imagens para ${country.name.toUpperCase()} (${country.code}) no ano ${YEAR}...`);
    console.log(`----------------------------------------------\n`);

    // Itera pelos 12 meses do ano
    for (let month = 1; month <= 12; month++) {
        // Formata o número do mês para ter sempre dois dígitos (ex: "01", "02", ..., "12")
        const formattedMonth = month.toString().padStart(2, '0');
        // Cria a string que representa o ano e o mês no formato "YYYYMM"
        const monthYear = `${YEAR}${formattedMonth}`;

        // Exibe no console qual mês está sendo processado
        console.log(`\n 📅 Processando mês: ${monthYear} para ${country.name} (${country.code})`);
        console.log(`----------------------------------------------`);

        // Obtém a lista de IDs das imagens disponíveis para o país e o mês especificados
        const imageIds = await getAllImageIds(country.code, monthYear);

        // Verifica se há imagens disponíveis; se não houver, exibe uma mensagem e passa para o próximo mês
        if (imageIds.length === 0) {
            console.log(`⚠️ Nenhuma imagem encontrada para ${country.name} (${country.code}) no mês ${monthYear}. Pulando...`);
            continue; // Passa para o próximo mês
        }

        // Exibe a quantidade de imagens encontradas e informa que os downloads serão iniciados
        console.log(`📸 ${imageIds.length} imagens encontradas para ${country.name} no mês ${monthYear}. Iniciando download...`);

        // Percorre a lista de imagens encontradas e realiza o download de cada uma
        for (const imageId of imageIds) {
            await downloadImage(country.code, monthYear, imageId);
        }
    }
}
```

## Função `getAllImageIds( )`

Função assíncrona que busca os IDs das imagens disponíveis para um país em um determinado mês e ano.

**`archiveUrl = ...`**: Cria a URL que aponta para o arquivo de imagens do site.

**`await axios.get(archiveUrl)`**: Faz a requisição HTTP para obter a página do arquivo de imagens.

**`cheerio.load(response.data)`**: Carrega o HTML da página para ser manipulado de forma semelhante ao jQuery.

**`const imageIds = []`**: Inicializa um array para armazenar os IDs das imagens encontradas.

**`$('a[href\*="/detail/' + countryCode + '/"]')`**: Seleciona todos os links que levam à página de detalhes das imagens.

**`href.split('/').pop()`**: Extrai o ID da imagem do link encontrado.

**`if (!imageIds.includes(imageId)) { imageIds.push(imageId); }`**: Adiciona o ID ao array, garantindo que não haja duplicatas.

```js
async function getAllImageIds(countryCode, monthYear) {
    // Monta a URL do arquivo de imagens com base no código do país e no período (YYYYMM)
    const archiveUrl = `https://bingwallpaper.anerg.com/archive/${countryCode}/${monthYear}`;

    try {
        // Faz uma requisição HTTP para obter o conteúdo da página
        const response = await axios.get(archiveUrl);

        // Carrega o HTML da resposta para permitir manipulação com o Cheerio
        const $ = cheerio.load(response.data);

        // Inicializa um array para armazenar os IDs das imagens encontradas
        const imageIds = [];

        // Seleciona todos os links que contêm "/detail/{countryCode}/" no atributo href
        $('a[href*="/detail/' + countryCode + '/"]').each((i, el) => {
            const href = $(el).attr('href'); // Obtém o valor do atributo href
            const imageId = href.split('/').pop(); // Extrai o ID da imagem do link
            
            // Garante que o ID não seja adicionado duplicadamente ao array
            if (!imageIds.includes(imageId)) {
                imageIds.push(imageId);
            }
        });

        // Retorna a lista de IDs das imagens encontradas
        return imageIds;
    } catch (error) {
        // Em caso de erro na requisição, exibe uma mensagem e retorna um array vazio
        console.error(`❌ Erro ao acessar ${archiveUrl}:`, error.message);
        return [];
    }
}
```



## Função `downloadImage( )`

**Define o nome do arquivo de imagem**

- O nome do arquivo é gerado usando o `imageId`, adicionando a extensão `.jpg`.

**Verifica se a imagem já foi baixada**

- A função verifica na `successList` se já existe um registro com o mesmo nome de arquivo.
- Se a imagem já foi baixada, exibe uma mensagem e pula para a próxima.

**Obtém a URL da imagem**

- Chama `getImageUrl(countryCode, imageId)` para obter o link de download da imagem.
- Se não encontrar a URL, adiciona o `imageId` à lista de erros e encerra a função.

**Define o caminho do arquivo**

- Define onde a imagem será salva usando `DOWNLOAD_FOLDER` e `fileName`.

**Faz o download da imagem**

- Usa `axios` para fazer a requisição HTTP GET da URL da imagem.
- Define `responseType: 'stream'` para tratar os dados como um fluxo contínuo.
- Escreve os dados diretamente no arquivo local usando `fs.createWriteStream(filePath)`.

**Registra o download bem-sucedido**

- Adiciona um objeto com `image`, `country` e `date` à lista `successList`.
- Incrementa o contador de downloads (`newDownloads`).

**Salva a lista de sucessos e erros**

- Salva os dados no arquivo `sucess_download_list.js` (downloads bem-sucedidos).
- Se houver erro, exibe a mensagem e salva a URL da imagem com erro no `error_download_list.js`

```js
async function downloadImage(countryCode, monthYear, imageId) {
    // Define o nome do arquivo de imagem com base no ID
    const fileName = `${imageId}.jpg`;

    // Verifica se a imagem já foi baixada anteriormente, consultando a lista de sucesso
    if (successList.some(entry => entry.image === fileName)) {
        console.log(`🔄 ${fileName} já foi baixado. Pulando...`);
        return; // Sai da função se a imagem já foi baixada
    }

    // Obtém a URL da imagem a partir do ID e do código do país
    const imageUrl = await getImageUrl(countryCode, imageId);
    
    // Se a URL da imagem não for encontrada, adiciona o ID à lista de erros e retorna
    if (!imageUrl) {
        errorList.push(imageId);
        return;
    }

    // Define o caminho completo onde a imagem será salva
    const filePath = `${DOWNLOAD_FOLDER}/${fileName}`;

    try {
        // Faz a requisição HTTP para baixar a imagem como um fluxo de dados (stream)
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        // Salva a imagem no diretório de destino
        response.data.pipe(fs.createWriteStream(filePath));

        console.log(`✔ Download concluído: ${fileName}`);

        // Adiciona o registro detalhado da imagem baixada na lista de sucesso
        successList.push({
            image: fileName,  // Nome do arquivo baixado
            country: countryCode, // Código do país correspondente
            date: monthYear // Mês e ano da imagem no formato YYYYMM
        });

        newDownloads++; // Incrementa o contador de novos downloads
        saveList(SUCCESS_LIST_FILE, successList); // Atualiza o arquivo de lista de downloads bem-sucedidos
    } catch (error) {
        // Em caso de erro no download, registra a URL na lista de erros e salva a lista de erros
        console.error(`❌ Erro ao baixar ${imageUrl}:`, error.message);
        errorList.push(imageUrl);
        saveList(ERROR_LIST_FILE, errorList);
    }
}
```

