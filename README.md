# Download Bing Images

Com este script node.js você vai baixar várias imagens do site [bing.com](https://www.bing.com/)

O site [bing.com](https://www.bing.com/) sempre publica várias imagens em vários países. Eu sempre gostei de baixar essas imagens para colocar como plano de fundo no meu computador ou como tela de bloqueio. Todos os dias várias imagens são publicadas em diferentes países. 

No site [Bing Wallpaper](https://bingwallpaper.anerg.com/) você pode encontrar imagens de vários países a partir do ano de 2009. Eu sempre baixava manualmente. Acessava o site, cada país, cada mês, clicava em cada imagem e baixava. Mas aí pensei, por que não automatizar esse processo e baixar todas as imagens de uma vez?

Com ajuda do [Chatgpt](https://chatgpt.com/), criei esse script que, basta informar o ano que eu quero e ele vai baixar todas as imagens do ano informado de uma lista de 11 países (que são os países que aparecem no site [Bing Wallpaper](https://bingwallpaper.anerg.com/)). 

O script foi configurado para baixar as imagens com resolução de 1920x1080p, porém algumas imagens antigas são menores do que essa resolução. Abaixo segue a documentação do script e você pode copiar o código e executar em sua máquina. O código do script está no arquivo **download_dynamic.js**.



## Como usar o script

Primeiro você deve ter o **nodejs** instalado em sua máquina, antes de executar o script.

Baixe os arquivos **`countries.js`** e **`download_dynamic.js`** (sem a pasta `node_modules`) para a pasta onde você vai executar o projeto.

Abra a pasta do seu projeto, já com os arquivos do mesmo, rode o comando abaixo para instalar todas as dependências novamente com base no `package.json`:

```shell
npm install
```

Ainda no terminal execute o comando abaixo para instalar a biblioteca `axios` :

```shell
npm install axios
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



## Escolhendo o ano

No arquivo **`download_dynamic.js`** você encontrará a variável **`YEAR`**, onde será declarado de qual ano você deseja baixar as imagens.

```js
const YEAR = '2009'; // Define manualmente o ano desejado para baixar as imagens no formato YYYY
```



## Onde salvar as imagens

A variável **`DOWNLOAD_FOLDER`** define o local/pasta/diretório onde as imagens serão salvas. Você não precisa criar a pasta, ela será criada automaticamente, porém o endereço do local onde será salvo as imagens deve informado.

- Windows 

```js
const DOWNLOAD_FOLDER = 'C:\\Users\\SeuUsuario\\Downloads\\bing_download';
```

Significa que as imagens serão salvas na pasta **bing_download** que está dentro da pasta **Downloads** no usuário **SeuUsuario**.

- Linux/macOS

```js
const DOWNLOAD_FOLDER = '/home/seuusuario/Downloads/bing_download';
```

Significa que as imagens serão salvas no diretório **bing_download** que está dentro do diretório **Downloads** no usuário **seuusuario**.

**LEMBRANDO** que a pasta/diretório **bing_download** não precisa estar criada, basta informar o nome da pasta onde serão salvos os arquivos, no endereço da variável **`DOWNLOAD_FOLDER`**.

- No meu caso, o endereço ficou desta forma: 

```js
const DOWNLOAD_FOLDER = '/home/th/Pictures/bing'; // Define o diretório onde as imagens serão salvas
```

Significa que minhas imagens foram salvas na pasta **bing** dentro da pasta **Pictures** do usuário **th**.



## Rodando o Script

Com os arquivos **`coutries.js`** e **`download_dynamic.js`** criados, **`node`** e biblioteca **`axios`** instalados, o **ano** informado e o **caminho da pasta** onde as imagens serão salvas, você pode rodar o script no terminal com o seguinte comando:

```sh
node download_dynamic.js
```

A partir desse momento o script vai começar a baixar as imagens e você verá todo o desenvolvimento do script na tela do terminal.





## Documentação `download_dynamic.js`



## Declaração de Variáveis e importação de dependências

Aqui vamos importar alguns módulos, bibliotecas e a lista de países:

```js
const fs = require('fs'); // Importa o módulo 'fs' para manipulação de arquivos no sistema
const path = require('path'); // Importa o módulo 'path' para lidar com caminhos de arquivos e diretórios
const axios = require('axios'); // Importa a biblioteca 'axios' para fazer requisições HTTP
const cheerio = require('cheerio'); // Importa a biblioteca 'cheerio' para manipulação e extração de dados de HTML
const countries = require('./countries'); // Importa a lista de países a partir de um arquivo local chamado 'countries.js'
```

Em seguida temos a variável **`YEAR`**, onde o usuário deve colocar manualmente o ano o qual ele quer baixar as imagens.

```js
const YEAR = '2009'; // Define manualmente o ano desejado para baixar as imagens no formato YYYY
```

A variável **`DOWNLOAD_FOLDER`** define o local/pasta/diretório onde você salvará as imagens. Você não precisa criar a pasta, ela será criada automaticamente, porém o caminho deve informado e o nome da pasta será o último desse caminho.

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



## sucess_download_list e error_download_list

Além do arquivo com a lista de países e o arquivo principal, teremos mais dois arquivos gerados automaticamente a parti da primeira execução. Os arquivos **`sucess_download_list.js`** e **`error_download_list.js`**.

**`sucess_download_list.js`** armazena uma lista com objetos que informam o nome de cada imagem, de qual país ela foi baixada e a data no formato **YYYYMM**.

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

**`error_download_list.js`** armazena uma lista com o link de imagens que não foram baixadas devido a algum erro:

```js
module.exports = [];
```

**`sucess_download_list`** e **`error_download_list`**:

```js
const SUCCESS_LIST_FILE = 'sucess_download_list.js'; // Caminho do arquivo que armazenará a lista de imagens baixadas com sucesso
const ERROR_LIST_FILE = 'error_download_list.js'; // Caminho do arquivo que armazenará a lista de erros de download
```

Verificacação da pasta de **download**:

```js
// Verifica se a pasta de destino das imagens já existe, se não existir, cria a pasta
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true }); // Cria a pasta e subpastas, se necessário
}
```

Verificação dos arquivos **`sucess_download_list.js`** e **`error_download_list.js`**:

```js
// Verifica se os arquivos de listas de sucesso e erro já existem e os carrega, caso contrário, inicializa listas vazias
const successList = fs.existsSync(SUCCESS_LIST_FILE) ? require(`./${SUCCESS_LIST_FILE}`) : []; // Lista de imagens já baixadas
const errorList = fs.existsSync(ERROR_LIST_FILE) ? require(`./${ERROR_LIST_FILE}`) : []; // Lista de imagens que falharam no download
```

A variável **`newDownloads`** será um contador que informará quantas imagens foram baixadas ao final da execução do script:

```js
let newDownloads = 0; // Variável que contabiliza quantas novas imagens foram baixadas durante a execução do script
```



## Função principal `main()`

O script inicia a partir da função principal para iniciar o processo de download.

```js
main();
```

Declaração da função assíncrona principal que gerencia o fluxo de execução do script. Dentro desta função temos um **`for (const country of countries)`** que itera sobre a lista de países. Para cada país, chamamos a função **`await processCountry(country);`** passando como parâmetro o objeto de cada país e aguardando sua conclusão antes de prosseguir.

**`console.log(...)`**: Exibe a quantidade total de imagens baixadas ao final da execução do script.

```js
async function main() {
    for (const country of countries) {
        await processCountry(country);
    }

    console.log(`\n 📥 ${newDownloads} novas imagens foram baixadas nesta execução.`);
}
```



## Função `processCountry()`

Função assíncrona que processa todas as imagens de um determinado país ao longo de um ano. Ela exibe mensagens no console para acompanhar o progresso da execução. Temos um **`for (let month = 1; month <= 12; month++)`** que itera sobre todos os meses do ano. O **`formattedMonth = month.toString().padStart(2, '0')`** formata o mês para garantir dois dígitos (ex: "01" a "12"). **`monthYear = `${YEAR}${formattedMonth}`;`** cria a string no formato **`YYYYMM`**, usada na busca de imagens.

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



## Função `getAllImageIds()`

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

------



## Função `downloadImage()`

Aqui está a explicação detalhada da função `downloadImage()`, comentada passo a passo:

------

### **Descrição Geral**

A função **`downloadImage()`** baixa uma imagem do site **Bing Wallpaper** com base no código do país (**`countryCode`**), no mês/ano (**`monthYear`**) e no identificador da imagem (**`imageId`**).

- Ela garante que a imagem:
  - Só seja baixada se ainda não estiver registrada como baixada.
  - Seja salva no diretório correto.
  - Tenha seu download registrado com o país e a data.
  - Se houver erro, a URL da imagem seja adicionada a um arquivo de erros.

### **Explicação do Código**

```js
async function downloadImage(countryCode, monthYear, imageId) {
```

- Declara a função **`downloadImage`** como assíncrona (`async`), pois faz chamadas a outras funções assíncronas (como `getImageUrl()` e `axios.get()`).
- Recebe três parâmetros:
  - **`countryCode`**: Código do país da imagem (ex: "us", "br", "jp").
  - **`monthYear`**: Data no formato `YYYYMM` (ex: "202401" para janeiro de 2024).
  - **`imageId`**: Identificador único da imagem no site.

```js
    const fileName = `${imageId}.jpg`;
```

- Define o nome do arquivo da imagem com base no **`imageId`**, adicionando a extensão `.jpg`.

```js
    // Verifica se a imagem já foi baixada antes
    if (successList.some(entry => entry.image === fileName)) {
        console.log(`🔄 ${fileName} já foi baixado. Pulando...`);
        return;
    }
```

- Evita downloads duplicados:
  - Usa **`successList.some()`** para verificar se o nome do arquivo já existe na lista de downloads bem-sucedidos.
  - Se já foi baixado, exibe uma mensagem (`console.log`) e **retorna imediatamente**, evitando um download desnecessário.

```js
    const imageUrl = await getImageUrl(countryCode, imageId);
```

- Chama a função **`getImageUrl()`** para obter a URL da imagem.
- Usa **`await`** porque **`getImageUrl()`** é uma função assíncrona.

```js
    if (!imageUrl) {
        errorList.push(imageId);
        return;
    }
```

- Se a URL da imagem não for encontrada:
  - Adiciona o **`imageId`** à **`errorList`** (lista de erros).
  - Retorna imediatamente, evitando um erro no download.

```js
    const filePath = `${DOWNLOAD_FOLDER}/${fileName}`;
```

- Define o caminho completo onde a imagem será salva, combinando:
  - **`DOWNLOAD_FOLDER`**: Diretório de destino.
  - **`fileName`**: Nome do arquivo.

```js
    try {
```

- Inicia um **bloco `try-catch`** para capturar possíveis erros durante o download.

```js
        const response = await axios({ url: imageUrl, method: 'GET', responseType: 'stream' });
```

- Faz o download da imagem com **`axios.get()`**:
  - **`url: imageUrl`**: A URL da imagem.
  - **`method: 'GET'`**: Método HTTP GET.
  - **`responseType: 'stream'`**: Define que os dados devem ser recebidos como **fluxo de dados** (stream), essencial para downloads de arquivos grandes.

```js
        response.data.pipe(fs.createWriteStream(filePath));
```

- Salva a imagem no disco:
  - **`response.data`** contém os dados da imagem como um fluxo (`stream`).
  - Usa **`fs.createWriteStream(filePath)`** para **gravar os dados diretamente no arquivo** no diretório definido.

```js
        console.log(`✔ Download concluído: ${fileName}`);
```

- Exibe uma mensagem indicando que a imagem foi baixada com sucesso.

```js
        // Adiciona o registro detalhado
        successList.push({
            image: fileName,
            country: countryCode,
            date: monthYear
        });
```

- Adiciona um registro detalhado da imagem baixada na **`successList`**:
  - **`image`**: Nome do arquivo (`imageId.jpg`).
  - **`country`**: Código do país (`countryCode`).
  - **`date`**: Data do download (`monthYear` no formato `YYYYMM`).

```js
        newDownloads++; // Incrementa o contador de novos downloads
```

- **Aumenta o contador** de imagens baixadas com sucesso.

```js
        saveList(SUCCESS_LIST_FILE, successList);
```

- Salva a lista de downloads bem-sucedidos no arquivo **`sucess_download_list.js`**.

```js
    } catch (error) {
```

- Captura qualquer erro que ocorra dentro do `try`.

```js
        console.error(`❌ Erro ao baixar ${imageUrl}:`, error.message);
```

- Exibe uma mensagem de erro no console, incluindo a URL da imagem e a descrição do erro.

```js
        errorList.push(imageUrl);
```

- Adiciona a URL com falha na `errorList`.

```js
        saveList(ERROR_LIST_FILE, errorList);
```

- Salva a lista de erros no arquivo **`error_download_list.js`**.

------

### **Resumo**

1. **Evita downloads duplicados** verificando a lista de sucesso.
2. **Obtém a URL da imagem** com **`getImageUrl()`**.
3. **Faz o download da imagem** e a salva no disco.
4. **Registra o sucesso ou falha** no respectivo arquivo (**`sucess_download_list.js`** ou **`error_download_list.js`**).
5. **Lida com erros** de forma segura e organizada.

Essa função **garante downloads eficientes**, economiza recursos e mantém registros claros.

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

------



## Função `getImageUrl()`

Essa função tem como objetivo **obter a URL direta da imagem** no site **`bingwallpaper.anerg.com`**, com base no código do país e no identificador da imagem.

### **Explicação do Código**

```js
async function getImageUrl(countryCode, imageId) {
```

- Declara uma função assíncrona chamada **`getImageUrl()`**, que recebe dois parâmetros:
  - **`countryCode`**: O código do país (ex: `"us"` para Estados Unidos, `"br"` para Brasil).
  - **`imageId`**: O identificador único da imagem (ex: `"img123456"`).

```js
    const detailUrl = `https://bingwallpaper.anerg.com/detail/${countryCode}/${imageId}`;
    console.log(detailUrl);
```

- **Monta a URL da página de detalhes** da imagem no site, onde há informações sobre a foto.

- Exemplo de URL gerada:

  ```
  https://bingwallpaper.anerg.com/detail/us/img123456
  ```

- **Exibe no console** a URL gerada, útil para depuração.

```js
    try {
        const response = await axios.get(detailUrl);
```

- **Faz uma requisição HTTP GET** usando `axios` para acessar a página de detalhes da imagem.

```js
        const $ = cheerio.load(response.data);
```

- **Carrega o HTML da página** com `cheerio`, permitindo manipulação semelhante ao jQuery.

```js
        const imageUrl = $('a.btn.d-block.btn-secondary[href*="1920"]').attr('href');
```

- Procura no HTML um link (**<a>**) que contenha **"1920"** na URL.
  - Esse link geralmente aponta para a versão **1920x1080** da imagem.

```js
        if (!imageUrl) {
            console.error(`❌ Imagem não encontrada para ${imageId}`);
            return null;
        }
```

- **Se a imagem não for encontrada**, exibe uma mensagem de erro e retorna `null`.

```js
        return imageUrl;
```

- **Retorna a URL da imagem** se encontrada.

```js
    } catch (error) {
        console.error(`❌ Erro ao buscar ${detailUrl}:`, error.message);
        return null;
    }
}
```

- **Se houver erro na requisição** (ex: site fora do ar, conexão ruim), exibe uma mensagem de erro e retorna `null`.

------

### **Exemplo de Execução**

Se chamarmos:

```js
const url = await getImageUrl('us', 'img123456');
console.log(url);
```

E a página contiver:

```html
<a class="btn d-block btn-secondary" href="https://bingwallpaper.com/image1_1920x1080.jpg">Download</a>
```

Então, a função retornará:

```js
"https://bingwallpaper.com/image1_1920x1080.jpg"
```

Se a imagem **não existir**, o console mostrará:

```
❌ Imagem não encontrada para img123456
```

E a função retornará `null`.

### **Resumo**

1. **Acessa a página de detalhes da imagem** usando `axios`.
2. **Usa `cheerio` para extrair o link** da imagem de **1920x1080**.
3. **Lida com erros** e retorna `null` se a imagem não for encontrada.

Essa função é **fundamental** para o script, pois permite obter os links diretos das imagens para o download! 🚀



------



## Função `saveList()`

A função **`saveList()`** salva uma lista de dados em um arquivo JavaScript, garantindo que os registros sejam mantidos entre execuções do script.

- Ela é usada para armazenar:
- **Lista de downloads bem-sucedidos** (`sucess_download_list.js`).
- **Lista de erros de download** (`error_download_list.js`).



### **Explicação do Código**

```js
function saveList(filename, list) {
```

- Declara a função **`saveList()`**, que recebe dois parâmetros:
  - **`filename`**: Nome do arquivo onde a lista será salva (ex: `"sucess_download_list.js"`).
  - **`list`**: A lista de objetos (downloads bem-sucedidos ou erros) que será salva.

```js
    fs.writeFileSync(filename, `module.exports = ${JSON.stringify(list, null, 2)};`);
```

- Usa **`fs.writeFileSync()`** para **escrever** o conteúdo no arquivo de forma **síncrona** (garantindo que o arquivo seja salvo antes de continuar a execução).

- O conteúdo do arquivo será:

  - `module.exports = ...;` → Isso transforma o arquivo em um **módulo JavaScript**, permitindo que a lista seja importada e usada em outras partes do código (`require('./sucess_download_list.js')`).

  - ```
    JSON.stringify(list, null, 2)
    ```

     → Converte a lista para formato JSON legível:

    - **`list`**: A lista que será convertida.
    - **`null`**: Nenhuma modificação nos valores do objeto.
    - **`2`**: Indica que a formatação terá **2 espaços de indentação**, tornando o JSON mais legível.



### **Exemplo de como o arquivo fica**

Se `successList` contiver os seguintes dados:

```js
[
  { "image": "img1.jpg", "country": "us", "date": "202401" },
  { "image": "img2.jpg", "country": "br", "date": "202401" }
]
```

Então, após chamar:

```js
saveList("sucess_download_list.js", successList);
```

O arquivo `sucess_download_list.js` será salvo assim:

```js
module.exports = [
  {
    "image": "img1.jpg",
    "country": "us",
    "date": "202401"
  },
  {
    "image": "img2.jpg",
    "country": "br",
    "date": "202401"
  }
];
```

Isso permite que o arquivo seja **importado e reutilizado** no código, mantendo um histórico de downloads.

### **Resumo**

1. **Salva os dados de forma permanente** entre execuções.
2. **Garante que o formato seja legível** para humanos e para o código.
3. **Permite importação fácil** com `require('./sucess_download_list.js')`.

Essa função é essencial para **persistência de dados** no projeto! 



------



## Script completo do arquivo `download_dynamic.js`

```js
/**
 * Script para baixar automaticamente imagens do Bing Wallpaper de um ano inteiro.
 * Desenvolvido para buscar imagens de um ano especificado para todos os países listados em `countries.js`.
 *
 * Dependências:
 * - Axios: Para fazer requisições HTTP
 * - Cheerio: Para manipular HTML e extrair dados
 * - File System (fs): Para manipulação de arquivos
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const countries = require('./countries'); // Importa a lista de países

const YEAR = '2009'; // Define manualmente o ano desejado (YYYY)
const DOWNLOAD_FOLDER = '/home/th/Pictures/bing'; // Define o caminho da pasta onde as imagens serão salvas

const SUCCESS_LIST_FILE = 'sucess_download_list.js'; // Arquivo onde serão registradas as imagens baixadas
const ERROR_LIST_FILE = 'error_download_list.js'; // Arquivo onde serão registrados os erros de download

// Cria a pasta principal de downloads, se não existir
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

// Lê listas anteriores (se existirem)
const successList = fs.existsSync(SUCCESS_LIST_FILE) ? require(`./${SUCCESS_LIST_FILE}`) : [];
const errorList = fs.existsSync(ERROR_LIST_FILE) ? require(`./${ERROR_LIST_FILE}`) : [];

let newDownloads = 0; // Contador de novos downloads

/**
 * Obtém todos os IDs das imagens disponíveis para um país em um determinado mês.
 * @param {string} countryCode Código do país (ex: 'us' para Estados Unidos)
 * @param {string} monthYear Mês e ano no formato YYYYMM
 * @returns {Promise<string[]>} Lista de IDs de imagens
 */
async function getAllImageIds(countryCode, monthYear) {
    const archiveUrl = `https://bingwallpaper.anerg.com/archive/${countryCode}/${monthYear}`;

    try {
        const response = await axios.get(archiveUrl);
        const $ = cheerio.load(response.data);
        const imageIds = [];

        // Extrai os IDs das imagens do HTML
        $('a[href*="/detail/' + countryCode + '/"]').each((i, el) => {
            const href = $(el).attr('href');
            const imageId = href.split('/').pop();
            if (!imageIds.includes(imageId)) {
                imageIds.push(imageId);
            }
        });

        return imageIds;
    } catch (error) {
        console.error(`❌ Erro ao acessar ${archiveUrl}:`, error.message);
        return [];
    }
}

/**
 * Obtém a URL de download de uma imagem específica.
 * @param {string} countryCode Código do país
 * @param {string} imageId ID da imagem
 * @returns {Promise<string|null>} URL da imagem ou null se não encontrada
 */
async function getImageUrl(countryCode, imageId) {
    const detailUrl = `https://bingwallpaper.anerg.com/detail/${countryCode}/${imageId}`;
    console.log(detailUrl);

    try {
        const response = await axios.get(detailUrl);
        const $ = cheerio.load(response.data);
        const imageUrl = $('a.btn.d-block.btn-secondary[href*="1920"]').attr('href');

        if (!imageUrl) {
            console.error(`❌ Imagem não encontrada para ${imageId}`);
            return null;
        }

        return imageUrl;
    } catch (error) {
        console.error(`❌ Erro ao buscar ${detailUrl}:`, error.message);
        return null;
    }
}

/**
 * Faz o download de uma imagem e a registra na lista de sucesso.
 * @param {string} countryCode Código do país
 * @param {string} monthYear Data no formato YYYYMM
 * @param {string} imageId ID da imagem
 */
async function downloadImage(countryCode, monthYear, imageId) {
    const fileName = `${imageId}.jpg`;

    // Verifica se a imagem já foi baixada antes
    if (successList.some(entry => entry.image === fileName)) {
        console.log(`🔄 ${fileName} já foi baixado. Pulando...`);
        return;
    }

    const imageUrl = await getImageUrl(countryCode, imageId);
    if (!imageUrl) {
        errorList.push(imageId);
        return;
    }

    const filePath = `${DOWNLOAD_FOLDER}/${fileName}`;

    try {
        const response = await axios({ url: imageUrl, method: 'GET', responseType: 'stream' });
        response.data.pipe(fs.createWriteStream(filePath));

        console.log(`✔ Download concluído: ${fileName}`);

        // Adiciona o registro detalhado
        successList.push({
            image: fileName,
            country: countryCode,
            date: monthYear
        });

        newDownloads++; // Incrementa o contador de novos downloads
        saveList(SUCCESS_LIST_FILE, successList);
    } catch (error) {
        console.error(`❌ Erro ao baixar ${imageUrl}:`, error.message);
        errorList.push(imageUrl);
        saveList(ERROR_LIST_FILE, errorList);
    }
}

/**
 * Salva uma lista em um arquivo JSON.
 * @param {string} filename Nome do arquivo
 * @param {Array} list Lista de dados a serem salvos
 */
function saveList(filename, list) {
    fs.writeFileSync(filename, `module.exports = ${JSON.stringify(list, null, 2)};`);
}

/**
 * Processa um país, baixando imagens para todos os meses do ano especificado.
 * @param {Object} country Objeto com nome e código do país
 */
async function processCountry(country) {
    console.log(`\n 🔎 Buscando imagens para ${country.name.toUpperCase()} (${country.code}) no ano ${YEAR}...`);
    console.log(`----------------------------------------------\n`);

    for (let month = 1; month <= 12; month++) {
        const formattedMonth = month.toString().padStart(2, '0');
        const monthYear = `${YEAR}${formattedMonth}`;

        console.log(`\n 📅 Processando mês: ${monthYear} para ${country.name} (${country.code})`);
        console.log(`----------------------------------------------`);

        const imageIds = await getAllImageIds(country.code, monthYear);

        if (imageIds.length === 0) {
            console.log(`⚠️ Nenhuma imagem encontrada para ${country.name} (${country.code}) no mês ${monthYear}. Pulando...`);
            continue;
        }

        console.log(`📸 ${imageIds.length} imagens encontradas para ${country.name} no mês ${monthYear}. Iniciando download...`);
        for (const imageId of imageIds) {
            await downloadImage(country.code, monthYear, imageId);
        }
    }
}

/**
 * Função principal que processa todos os países da lista.
 */
async function main() {
    for (const country of countries) {
        await processCountry(country);
    }

    console.log(`\n 📥 ${newDownloads} novas imagens foram baixadas nesta execução.`);
}

// Inicia a execução do script
main();

```



------



## Conclusão

Espero que você goste deste script, uma solução para um hobby que eu tenho e que me economizou muito tempo.

Com este script eu posso apenas selecionar o ano, executá-lo e enquanto ele baixa minhas imagens eu posso fazer outras atividades.

O **ChatGpt** ajudou bastante na construção, mas claro, **foram necessárias algumas intervenções minhas** para que o script tivesse o funcionamento desejado. Para isso, o conhecimento básico na linguagem e em lógica de programação foram essenciais.
