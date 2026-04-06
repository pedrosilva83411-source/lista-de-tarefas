"use strict";

// ===== ELEMENTOS DO HTML =====
const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("listaTarefas");

const total = document.getElementById("total");
const concluidas = document.getElementById("concluidas");
const pendentes = document.getElementById("pendentes");

// == FILTRO DE TAREFAS
let filtroAtual = "todas";

// ===== ARRAY DE TAREFAS =====
let tarefas = [];

// ===== BOTÃO DE TAREFAS ====
botao.addEventListener("click", () => {
  adicionarTarefa();
});

//== SALVAR TAREFAS NO STORAGE
function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// ==== FUNÇÃO ADICIONAR TAREFA ====
function adicionarTarefa() {
  const texto = input.value;

  if (texto === "") return;

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  };

  tarefas.push(novaTarefa);

  input.value = "";

  renderizarTarefas();
  salvarTarefas();
}

// === FUNÇÃO PARA ATUALIZAR CONTADORES ===
function atualizarContador() {
  // Total de tarefas
  total.textContent = tarefas.length;
  
  // Tarefas concluídas
  const tarefasConcluidas = tarefas.filter(t => t.concluida).length;
  concluidas.textContent = tarefasConcluidas;
  
  // Tarefas pendentes
  const tarefasPendentes = tarefas.filter(t => !t.concluida).length;
  pendentes.textContent = tarefasPendentes;
}

// === FUNÇÃO PARA REMOVER TAREFA ===
function removerTarefa(id) {
  tarefas = tarefas.filter(tarefa => tarefa.id !== id);
  renderizarTarefas();
  salvarTarefas();
}

// === FUNÇÃO DE RENDERIZAR TAREFAS ===
function renderizarTarefas() {
  lista.innerHTML = "";

  let tarefasFiltradas = tarefas;

  if (filtroAtual === "pendentes") {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  }

  if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  //== CASO NÃO TENHA NENHUMA TAREFA
  if(tarefasFiltradas.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma tarefa encontrada";
    li.style.textAlign = "center";
    li.style.color = "#999";
    lista.appendChild(li);
  }

  tarefasFiltradas.forEach((tarefa) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    //=== MARCAR TAREFA COMO CONCLUIDA
    span.addEventListener("click", () => {
      tarefa.concluida = !tarefa.concluida;
      renderizarTarefas();
      salvarTarefas();
    });

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "X";
    botaoRemover.classList.add("btn-remover");
    botaoRemover.addEventListener("click", () => {
      removerTarefa(tarefa.id);
    });

    li.appendChild(span);
    li.appendChild(botaoRemover);

    lista.appendChild(li);
  });

  atualizarContador();
}

// == BOTÕES PARA FILTRAR TAREFAS ===
const botoesFiltro = document.querySelectorAll(".filtros button");

function atualizarBotoesFiltro() {
  botoesFiltro.forEach((botao) => {
    if (botao.dataset.filtro === filtroAtual) {
      botao.classList.add("filtro-atual");
    } else {
      botao.classList.remove("filtro-atual");
    }
  });
}

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    atualizarBotoesFiltro();
    renderizarTarefas();
  });
});

// CARREGAR TAREFAS AO INICIAR
function carregarTarefas() {
  const salvas = localStorage.getItem("tarefas");
  if (salvas) {
    tarefas = JSON.parse(salvas);
    renderizarTarefas();
  }
  atualizarBotoesFiltro(); // Marca o botão inicial
}

//== TAREFAS COM ENTER
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    adicionarTarefa();
  }
});

//=== CARREGAR TAREFAS SALVAS AO INICIAR A PAGINA
carregarTarefas();