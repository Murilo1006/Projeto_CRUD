'use strict';

const limparFormulario = (endereco) =>{
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

const preencherFormulario = (endereco) =>{
    document.getElementById('endereco').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
}

const eNumero = (numero) => /^[0-9]+$/.test(numero);

const cepValido = (cep) => cep.length == 8 && eNumero(cep);

const pesquisarCep = async() => {
    limparFormulario();
    
    const cep = document.getElementById('cep').value;
    const url = `http://viacep.com.br/ws/${cep}/json/`;
    if (cepValido(cep)){
        const dados = await fetch(url);
        const endereco = await dados.json();
        if (endereco.hasOwnProperty('erro')){
            document.getElementById('endereco').value = 'Esse CEP não existe!';
        }else {
            preencherFormulario(endereco);
            document.getElementById('numero').focus();
        }
    }else{
        document.getElementById('endereco').value = 'CEP incorreto!';
    }
    
}

document.getElementById('cep')
        .addEventListener('focusout' ,pesquisarCep);


let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editIndex = null;

document.getElementById("btnSalvar").addEventListener("click", function () {

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim();

    if (!nome || !sobrenome || !celular) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    const cliente = {
        nome,
        sobrenome,
        celular,
        cep,
        endereco,
        numero,
        bairro,
        cidade,
        estado
    };

    if (editIndex !== null) {
        clientes[editIndex] = cliente;
        editIndex = null;
        document.getElementById("btnSalvar").innerText = "Salvar";
    } else {
        clientes.push(cliente);
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));
    atualizarTabela();
    limparCamposFormulario();
});


function atualizarTabela(lista = clientes) {

    const tabela = document.getElementById("tabelaClientes");
    tabela.innerHTML = "";

    lista.forEach((cliente, index) => {

        tabela.innerHTML += `
            <tr>
                <td>${cliente.nome} ${cliente.sobrenome}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.endereco}, ${cliente.numero} - ${cliente.bairro}, ${cliente.cidade}/${cliente.estado}</td>
                <td class="acoes">
                    <button class="btn-editar" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-excluir" onclick="excluirCliente(${index})">Excluir</button>
                </td>

            </tr>
        `;
    });
}


window.excluirCliente = function(index) {

    if (confirm("Deseja realmente excluir este cliente?")) {
        clientes.splice(index, 1);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        atualizarTabela();
    }
}


window.editarCliente = function(index) {

    const cliente = clientes[index];

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("sobrenome").value = cliente.sobrenome;
    document.getElementById("celular").value = cliente.celular;
    document.getElementById("cep").value = cliente.cep;
    document.getElementById("endereco").value = cliente.endereco;
    document.getElementById("numero").value = cliente.numero;
    document.getElementById("bairro").value = cliente.bairro;
    document.getElementById("cidade").value = cliente.cidade;
    document.getElementById("estado").value = cliente.estado;

    editIndex = index;
    document.getElementById("btnSalvar").innerText = "Atualizar";
}


function limparCamposFormulario() {

    document.getElementById("nome").value = "";
    document.getElementById("sobrenome").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("cep").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";

    editIndex = null;
    document.getElementById("btnSalvar").innerText = "Salvar";
}

document.getElementById("btnLimpar")
        .addEventListener("click", limparCamposFormulario);


document.getElementById("filtroNome")
        .addEventListener("input", function () {

    const texto = this.value.toLowerCase();

    const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(texto) ||
        cliente.sobrenome.toLowerCase().includes(texto)
    );

    atualizarTabela(filtrados);
});


atualizarTabela();
