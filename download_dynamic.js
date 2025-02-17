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

const YEAR = '2024'; // Define manualmente o ano desejado (YYYY)
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

    console.log(`\n📥 ----------------------------------------------- 📥`);
    console.log(`📥 ${newDownloads} novas imagens foram baixadas do ano ${YEAR}.`);
    console.log(`📥 Total de fotos geral: ${successList.length}`);
    console.log(`📥 Total de falhas geral: ${errorList.length}`);
    console.log(`📥 ----------------------------------------------- 📥\n`);
}

// Inicia a execução do script
main();
