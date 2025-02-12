const temas = [
    { nome: "Escuro", classe: "tema-escuro" },
    { nome: "Branco", classe: "tema-branco" },
    { nome: "Azul e Branco", classe: "tema-azul-branco" }
];

let temaAtual = 0;

function alternarTema() {
    const body = document.body;
    const container = document.querySelector('.container');

    // Remove todas as classes de tema
    body.classList.remove(...temas.map(tema => tema.classe));
    container.classList.remove(...temas.map(tema => tema.classe));

    // Aplica o próximo tema
    temaAtual = (temaAtual + 1) % temas.length;
    body.classList.add(temas[temaAtual].classe);
    container.classList.add(temas[temaAtual].classe);
}

// Função para alternar entre abas
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Função para alternar entre abas do inventário
function showInventarioTab(categoria) {
    document.querySelectorAll('.inventario-categoria').forEach(tab => tab.classList.remove('active'));
    document.getElementById(categoria).classList.add('active');
    document.querySelectorAll('.inventario-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="showInventarioTab('${categoria}')"]`).classList.add('active');
}

// Função para salvar configurações
function salvarConfiguracoes() {
    const pvTotal = document.getElementById('pv-total-input').value;
    const sanidadeTotal = document.getElementById('sanidade-total-input').value;
    const manaTotal = document.getElementById('mana-total-input').value;
    const cargaTotal = document.getElementById('carga-total-input').value;
    const ca = document.getElementById('ca-input').value;
    const deslocamento = document.getElementById('deslocamento-input').value;

    localStorage.setItem('pvTotal', pvTotal);
    localStorage.setItem('sanidadeTotal', sanidadeTotal);
    localStorage.setItem('manaTotal', manaTotal);
    localStorage.setItem('cargaTotal', cargaTotal);
    localStorage.setItem('ca', ca);
    localStorage.setItem('deslocamento', deslocamento);

    atualizarInformacoes();
}

// Função para atualizar informações na aba de Informações
function atualizarInformacoes() {
    document.getElementById('pv-total').textContent = localStorage.getItem('pvTotal') || 0;
    document.getElementById('sanidade-total').textContent = localStorage.getItem('sanidadeTotal') || 0;
    document.getElementById('mana-total').textContent = localStorage.getItem('manaTotal') || 0;
    document.getElementById('carga-total').textContent = localStorage.getItem('cargaTotal') || 0;
    document.getElementById('ca').textContent = localStorage.getItem('ca') || 0;
    document.getElementById('deslocamento').textContent = localStorage.getItem('deslocamento') || 0;
}

// Função para adicionar item ao inventário
function adicionarItem(categoria) {
    const container = document.getElementById(`inventario-container-${categoria}`);

    const novoItem = document.createElement('div');
    novoItem.classList.add('item', 'minimizado');
    novoItem.innerHTML = `
        <div class="nome">
            <input type="text" placeholder="Nome do Item" class="nome-input">
        </div>
        <div class="descricao">
            <textarea placeholder="Descrição do Item"></textarea>
            <input type="number" placeholder="Peso do Item">
            <input type="number" placeholder="Mobilidade">
            <input type="number" placeholder="Classe de Armadura">
            <input type="number" placeholder="Carga">
            <button class="remove-item" onclick="removerItem(this)">Remover</button>
        </div>
    `;

    // Adiciona evento de clique para expandir/recolher o item
    novoItem.querySelector('.nome').addEventListener('click', function (e) {
        if (e.target.classList.contains('nome-input')) return;
        novoItem.classList.toggle('expandido');
    });

    // Atualiza informações ao adicionar item
    novoItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', atualizarValores);
    });

    container.appendChild(novoItem);
}

// Função para remover item do inventário
function removerItem(botao) {
    const item = botao.closest('.item');
    item.remove();
    atualizarValores();
}

// Função para atualizar valores com base nos itens
function atualizarValores() {
    let cargaAtual = 0;
    let deslocamentoTotal = parseInt(localStorage.getItem('deslocamento')) || 0;
    let caTotal = parseInt(localStorage.getItem('ca')) || 0;

    document.querySelectorAll('.item').forEach(item => {
        const carga = parseInt(item.querySelector('input[placeholder="Carga"]').value) || 0;
        const mobilidade = parseInt(item.querySelector('input[placeholder="Mobilidade"]').value) || 0;
        const caItem = parseInt(item.querySelector('input[placeholder="Classe de Armadura"]').value) || 0;

        cargaAtual += carga;
        deslocamentoTotal += mobilidade;
        caTotal += caItem;
    });

    document.getElementById('carga-atual').textContent = cargaAtual;
    document.getElementById('deslocamento').textContent = deslocamentoTotal;
    document.getElementById('ca').textContent = caTotal;
}

// Função para adicionar habilidade
function adicionarHabilidade() {
    const container = document.getElementById('habilidades-container');

    const novaHabilidade = document.createElement('div');
    novaHabilidade.classList.add('habilidade', 'minimizado');
    novaHabilidade.innerHTML = `
        <div class="nome">
            <input type="text" placeholder="Nome da Habilidade" class="nome-input">
        </div>
        <div class="descricao">
            <textarea placeholder="Descrição da Habilidade"></textarea>
            <input type="number" placeholder="Custo da Habilidade" class="custo-input">
            <button class="usar-habilidade" onclick="usarHabilidade(this)">Usar</button>
            <button class="remove-habilidade" onclick="removerHabilidade(this)">Remover</button>
        </div>
    `;

    // Adiciona evento de clique para expandir/recolher a habilidade
    novaHabilidade.querySelector('.nome').addEventListener('click', function (e) {
        if (e.target.classList.contains('nome-input')) return;
        novaHabilidade.classList.toggle('expandido');
    });

    container.appendChild(novaHabilidade);
}

// Função para remover habilidade
function removerHabilidade(botao) {
    const habilidade = botao.closest('.habilidade');
    habilidade.remove();
}

// Função para usar habilidade
function usarHabilidade(botao) {
    const habilidade = botao.closest('.habilidade');
    const custo = habilidade.querySelector('.custo-input').value;
    const manaAtual = document.getElementById('mana-atual').textContent;

    if (custo && manaAtual) {
        const novaMana = parseInt(manaAtual) - parseInt(custo);
        if (novaMana >= 0) {
            document.getElementById('mana-atual').textContent = novaMana;
            alert(`Habilidade usada! Mana restante: ${novaMana}`);
        } else {
            alert('Mana insuficiente!');
        }
    } else {
        alert('Preencha o custo da habilidade e a mana atual!');
    }
}

// Função para filtrar perícias com base na busca
document.getElementById('busca-pericias').addEventListener('input', function () {
    const termo = this.value.toLowerCase();
    const fields = document.querySelectorAll('#pericias .field');

    fields.forEach(field => {
        const label = field.querySelector('label').textContent.toLowerCase();
        if (label.includes(termo)) {
            field.style.display = 'flex';
        } else {
            field.style.display = 'none';
        }
    });
});

// Função para salvar automaticamente os dados
function salvarAutomaticamente() {
    const dados = {
        pvAtual: document.getElementById('pv-atual').textContent,
        sanidadeAtual: document.getElementById('sanidade-atual').textContent,
        deslocamento: document.getElementById('deslocamento').textContent,
        manaAtual: document.getElementById('mana-atual').textContent,
        cargaAtual: document.getElementById('carga-atual').textContent,
        ca: document.getElementById('ca').textContent,
        nome: document.getElementById('nome').value,
        tendencia: document.getElementById('tendencia').value,
        idade: document.getElementById('idade').value,
        altura: document.getElementById('altura').value,
        descricao: document.getElementById('descricao').value,
        lacos: document.getElementById('lacos').value,
        forca: document.getElementById('forca').value,
        destreza: document.getElementById('destreza').value,
        vigor: document.getElementById('vigor').value,
        intelecto: document.getElementById('intelecto').value,
        presenca: document.getElementById('presenca').value,
        atletismo: document.getElementById('atletismo').value,
        luta: document.getElementById('luta').value,
        acrobacia: document.getElementById('acrobacia').value,
        furtividade: document.getElementById('furtividade').value,
        iniciativa: document.getElementById('iniciativa').value,
        reflexos: document.getElementById('reflexos').value,
        investigacao: document.getElementById('investigacao').value,
        medicina: document.getElementById('medicina').value,
        sobrevivencia: document.getElementById('sobrevivencia').value,
        pontaria: document.getElementById('pontaria').value,
        pilotagem: document.getElementById('pilotagem').value,
        mecanica: document.getElementById('mecanica').value,
        diplomacia: document.getElementById('diplomacia').value,
        labia: document.getElementById('labia').value,
        intimidacao: document.getElementById('intimidacao').value,
        percepcao: document.getElementById('percepcao').value,
        vontade: document.getElementById('vontade').value,
        adestramento: document.getElementById('adestramento').value,
        charme: document.getElementById('charme').value,
        intuicao: document.getElementById('intuicao').value,
        fortitude: document.getElementById('fortitude').value
    };

    localStorage.setItem('dadosFicha', JSON.stringify(dados));
}

// Função para carregar os dados salvos
function carregarDados() {
    const dados = JSON.parse(localStorage.getItem('dadosFicha')) || {};

    document.getElementById('pv-atual').textContent = dados.pvAtual || 0;
    document.getElementById('sanidade-atual').textContent = dados.sanidadeAtual || 0;
    document.getElementById('deslocamento').textContent = dados.deslocamento || 0;
    document.getElementById('mana-atual').textContent = dados.manaAtual || 0;
    document.getElementById('carga-atual').textContent = dados.cargaAtual || 0;
    document.getElementById('ca').textContent = dados.ca || 0;
    document.getElementById('nome').value = dados.nome || '';
    document.getElementById('tendencia').value = dados.tendencia || '';
    document.getElementById('idade').value = dados.idade || '';
    document.getElementById('altura').value = dados.altura || '';
    document.getElementById('descricao').value = dados.descricao || '';
    document.getElementById('lacos').value = dados.lacos || '';
    document.getElementById('forca').value = dados.forca || '';
    document.getElementById('destreza').value = dados.destreza || '';
    document.getElementById('vigor').value = dados.vigor || '';
    document.getElementById('intelecto').value = dados.intelecto || '';
    document.getElementById('presenca').value = dados.presenca || '';
    document.getElementById('atletismo').value = dados.atletismo || '';
    document.getElementById('luta').value = dados.luta || '';
    document.getElementById('acrobacia').value = dados.acrobacia || '';
    document.getElementById('furtividade').value = dados.furtividade || '';
    document.getElementById('iniciativa').value = dados.iniciativa || '';
    document.getElementById('reflexos').value = dados.reflexos || '';
    document.getElementById('investigacao').value = dados.investigacao || '';
    document.getElementById('medicina').value = dados.medicina || '';
    document.getElementById('sobrevivencia').value = dados.sobrevivencia || '';
    document.getElementById('pontaria').value = dados.pontaria || '';
    document.getElementById('pilotagem').value = dados.pilotagem || '';
    document.getElementById('mecanica').value = dados.mecanica || '';
    document.getElementById('diplomacia').value = dados.diplomacia || '';
    document.getElementById('labia').value = dados.labia || '';
    document.getElementById('intimidacao').value = dados.intimidacao || '';
    document.getElementById('percepcao').value = dados.percepcao || '';
    document.getElementById('vontade').value = dados.vontade || '';
    document.getElementById('adestramento').value = dados.adestramento || '';
    document.getElementById('charme').value = dados.charme || '';
    document.getElementById('intuicao').value = dados.intuicao || '';
    document.getElementById('fortitude').value = dados.fortitude || '';
}

// Salvar automaticamente ao alterar qualquer campo
document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach(campo => {
    campo.addEventListener('input', salvarAutomaticamente);
});

// Carregar dados ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    atualizarInformacoes();
    atualizarValores();
});
