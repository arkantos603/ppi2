document.addEventListener("DOMContentLoaded", function() {
    let montadoraEditando = null;
    let modeloEditando = null;
    let veiculoEditando = null;

    // Funções para Montadoras
    const formMontadora = document.getElementById("form_montadora");
    if (formMontadora) {
        formMontadora.addEventListener("submit", async function(event) {
            event.preventDefault();
            const nome = document.getElementById("nome").value;
            const pais = document.getElementById("pais").value;
            const ano = document.getElementById("ano").value;

            const montadora = { nome, pais, ano };

            try {
                let response;
                if (montadoraEditando) {
                    // Atualiza a montadora
                    response = await axios.put(`http://127.0.0.1:8000/montadoras_update/${montadoraEditando.id}`, montadora);
                    alert(response.data.mensagem || "Montadora atualizada com sucesso!");
                    montadoraEditando = null; // Resetar a variável de edição
                } else {
                    // Cria uma nova montadora
                    response = await axios.post("http://127.0.0.1:8000/montadoras_save", montadora);
                    alert(response.data.mensagem || "Montadora salva com sucesso!");
                }
                listarMontadoras();
                formMontadora.reset();
            } catch (error) {
                console.error("Erro ao salvar montadora:", error);
            }
        });
    }

    async function listarMontadoras() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/montadoras_list");
            const montadorasList = document.getElementById("montadoras_list");
            montadorasList.innerHTML = "";
            response.data.forEach(montadora => {
                const li = document.createElement("li");
                li.textContent = `${montadora.nome} - ${montadora.pais} - ${montadora.ano} - ID: ${montadora.id}`;

                const botaoEditar = document.createElement("button");
                botaoEditar.innerText = "Editar";
                botaoEditar.onclick = () => {
                    montadoraEditando = montadora;
                    document.getElementById("nome").value = montadora.nome;
                    document.getElementById("pais").value = montadora.pais;
                    document.getElementById("ano").value = montadora.ano;
                };
                li.appendChild(botaoEditar);

                const botaoRemover = document.createElement("button");
                botaoRemover.innerText = "Remover";
                botaoRemover.onclick = async () => {
                    if (confirm(`Tem certeza que deseja remover a montadora ${montadora.nome}?`)) {
                        try {
                            await axios.delete(`http://127.0.0.1:8000/montadoras_delete/${montadora.id}`);
                            alert(`Montadora ${montadora.nome} removida com sucesso!`);
                            listarMontadoras();
                        } catch (error) {
                            console.error("Erro ao remover montadora:", error);
                        }
                    }
                };
                li.appendChild(botaoRemover);

                montadorasList.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao listar montadoras:", error);
        }
    }

    // Funções para Modelos
    const formModelo = document.getElementById("form_modelo");
    if (formModelo) {
        formModelo.addEventListener("submit", async function(event) {
            event.preventDefault();
            const nome = document.getElementById("nome_modelo").value;
            const montadoraId = document.getElementById("montadora_id").value;
            const valorReferencia = document.getElementById("valor_referencia").value;
            const motorizacao = document.getElementById("motorizacao").value;
            const turbo = document.getElementById("turbo").checked;
            const automatico = document.getElementById("automatico").checked;

            const modelo = {
                nome,
                montadora_id: montadoraId,
                valor_referencia: valorReferencia,
                motorizacao,
                turbo,
                automatico
            };

            try {
                let response;
                if (modeloEditando) {
                    response = await axios.put(`http://127.0.0.1:8000/modelos_update/${modeloEditando.id}`, modelo);
                    alert(response.data.mensagem || "Modelo atualizado com sucesso!");
                    modeloEditando = null; // Resetar a variável de edição
                } else {
                    response = await axios.post("http://127.0.0.1:8000/modelos_save", modelo);
                    alert(response.data.mensagem || "Modelo salvo com sucesso!");
                }
                listarModelos();
                formModelo.reset();
            } catch (error) {
                console.error("Erro ao salvar modelo:", error);
            }
        });
    }

    async function listarModelos() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/modelos_list");
            const modelosList = document.getElementById("modelos_list");
            modelosList.innerHTML = "";
            response.data.forEach(modelo => {
                const li = document.createElement("li");
                li.textContent = `${modelo.nome} - ${modelo.montadora_id} - ${modelo.valor_referencia} - ${modelo.motorizacao} - ${modelo.turbo ? "Turbo" : "Não Turbo"} - ${modelo.automatico ? "Automático" : "Manual"} - ID: ${modelo.id}`;

                const botaoEditar = document.createElement("button");
                botaoEditar.innerText = "Editar";
                botaoEditar.onclick = () => {
                    modeloEditando = modelo; 
                    document.getElementById("nome_modelo").value = modelo.nome;
                    document.getElementById("montadora_id").value = modelo.montadora_id;
                    document.getElementById("valor_referencia").value = modelo.valor_referencia;
                    document.getElementById("motorizacao").value = modelo.motorizacao;
                    document.getElementById("turbo").checked = modelo.turbo;
                    document.getElementById("automatico").checked = modelo.automatico;
                };
                li.appendChild(botaoEditar);

                const botaoRemover = document.createElement("button");
                botaoRemover.innerText = "Remover";
                botaoRemover.onclick = async () => {
                    if (confirm(`Tem certeza que deseja remover o modelo ${modelo.nome}?`)) {
                        try {
                            await axios.delete(`http://127.0.0.1:8000/modelos_delete/${modelo.id}`);
                            alert(`Modelo ${modelo.nome} removido com sucesso!`);
                            listarModelos();
                        } catch (error) {
                            console.error("Erro ao remover modelo:", error);
                        }
                    }
                };
                li.appendChild(botaoRemover);

                modelosList.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao listar modelos:", error);
        }
    }

    // Funções para Veículos
    const formVeiculo = document.getElementById("form_veiculo");
    if (formVeiculo) {
        formVeiculo.addEventListener("submit", async function(event) {
            event.preventDefault();
            const modeloId = document.getElementById("modelo_id").value;
            const cor = document.getElementById("cor").value;
            const anoFabricacao = document.getElementById("ano_fabricacao").value;
            const anoModelo = document.getElementById("ano_modelo").value;
            const valor = document.getElementById("valor").value;
            const placa = document.getElementById("placa").value;
            const vendido = document.getElementById("vendido").checked;

            const veiculo = {
                modelo_id: modeloId,
                cor,
                ano_fabricacao: anoFabricacao,
                ano_modelo: anoModelo,
                valor,
                placa,
                vendido
            };

            try {
                let response;
                if (veiculoEditando) {
                    response = await axios.put(`http://127.0.0.1:8000/veiculos_update/${veiculoEditando.id}`, veiculo);
                    alert(response.data.mensagem || "Veículo atualizado com sucesso!");
                    veiculoEditando = null;
                } else {
                    response = await axios.post("http://127.0.0.1:8000/veiculos_save", veiculo);
                    alert(response.data.mensagem || "Veículo salvo com sucesso!");
                }
                listarVeiculos();
                formVeiculo.reset();
            } catch (error) {
                console.error("Erro ao salvar veículo:", error);
            }
        });
    }

    async function listarVeiculos() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/veiculos_list");
            const veiculosList = document.getElementById("veiculos_list");
            veiculosList.innerHTML = "";
            response.data.forEach(veiculo => {
                const li = document.createElement("li");
                li.textContent = `${veiculo.modelo_id} - ${veiculo.cor} - ${veiculo.ano_fabricacao} - ${veiculo.ano_modelo} - ${veiculo.valor} - ${veiculo.placa} - ${veiculo.vendido ? "Vendido" : "Disponível"} - ID: ${veiculo.id}`;

                const botaoEditar = document.createElement("button");
                botaoEditar.innerText = "Editar";
                botaoEditar.onclick = () => {
                    veiculoEditando = veiculo;
                    document.getElementById("modelo_id").value = veiculo.modelo_id;
                    document.getElementById("cor").value = veiculo.cor;
                    document.getElementById("ano_fabricacao").value = veiculo.ano_fabricacao;
                    document.getElementById("ano_modelo").value = veiculo.ano_modelo;
                    document.getElementById("valor").value = veiculo.valor;
                    document.getElementById("placa").value = veiculo.placa;
                    document.getElementById("vendido").checked = veiculo.vendido;
                };
                li.appendChild(botaoEditar);

                const botaoRemover = document.createElement("button");
                botaoRemover.innerText = "Remover";
                botaoRemover.onclick = async () => {
                    if (confirm(`Tem certeza que deseja remover o veículo com placa ${veiculo.placa}?`)) {
                        try {
                            await axios.delete(`http://127.0.0.1:8000/veiculos_delete/${veiculo.id}`);
                            alert(`Veículo com placa ${veiculo.placa} removido com sucesso!`);
                            listarVeiculos();
                        } catch (error) {
                            console.error("Erro ao remover veículo:", error);
                        }
                    }
                };
                li.appendChild(botaoRemover);

                veiculosList.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao listar veículos:", error);
        }
    }

    listarMontadoras();
    listarModelos();
    listarVeiculos();
});