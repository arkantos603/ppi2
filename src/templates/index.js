document.addEventListener('DOMContentLoaded', () => {
    let montadoraEditando = null;
    let modeloEditando = null;
    let veiculoEditando = null;

    async function carregar_montadoras() {
        try {
            const response = await axios.get('http://localhost:8000/montadoras_list');
            const montadoras = response.data;
            const lista = document.getElementById('montadoras_list');

            if (lista) {
                lista.innerHTML = '';

                montadoras.forEach(montadora => {
                    const item = document.createElement('li');
                    const linha = `Nome: ${montadora.nome}, País: ${montadora.pais}, Ano de fabricação: ${montadora.ano} ID: ${montadora.id}`;
                    item.innerText = linha;

                    const botaoEditar = document.createElement('button');
                    botaoEditar.innerText = 'Editar';
                    botaoEditar.style.marginLeft = '10px';

                    botaoEditar.addEventListener('click', () => {
                        montadoraEditando = montadora;  // Armazena a montadora atual para edição
                        document.getElementById('nome').value = montadora.nome;
                        document.getElementById('pais').value = montadora.pais;
                        document.getElementById('ano').value = montadora.ano;
                        document.getElementById('form_montadora').scrollIntoView(); // Foca no formulário
                    });

                    const botaoRemover = document.createElement('button');
                    botaoRemover.innerText = 'Remover';
                    botaoRemover.style.marginLeft = '5px';

                    botaoRemover.addEventListener('click', async () => {
                        if (confirm(`Tem certeza que deseja remover a montadora ${montadora.nome}?`)) {
                            await axios.delete(`http://localhost:8000/montadoras_delete/${montadora.id}`);
                            alert(`Montadora ${montadora.nome} removida com sucesso!`);
                            carregar_montadoras();
                        }
                    });

                    item.appendChild(botaoEditar);
                    item.appendChild(botaoRemover);

                    lista.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar montadoras:', error);
        }
    }

    function manipular_formulario_montadoras() {
        const form_montadora = document.getElementById('form_montadora');
        if (!form_montadora) return;

        const input_nome = document.getElementById('nome');
        const input_pais = document.getElementById('pais');
        const input_ano = document.getElementById('ano');

        form_montadora.onsubmit = async (event) => {
            event.preventDefault();
            const nome_montadora = input_nome.value;
            const pais_montadora = input_pais.value;
            const ano_montadora = input_ano.value;

            try {
                if (montadoraEditando) {
                    await axios.put(`http://localhost:8000/montadoras_update/${montadoraEditando.uuid}`, {
                        nome: nome_montadora,
                        pais: pais_montadora,
                        ano: ano_montadora
                    });
                    alert(`Montadora ${montadoraEditando.nome} atualizada com sucesso!`);
                    montadoraEditando = null;
                } else {
                    await axios.post('http://localhost:8000/montadoras_save', {
                        nome: nome_montadora,
                        pais: pais_montadora,
                        ano: ano_montadora
                    });
                    alert('Montadora cadastrada com sucesso!');
                }

                carregar_montadoras();
                form_montadora.reset(); 
            } catch (error) {
                console.error('Erro ao salvar montadora:', error);
            }
        };
    }

    async function carregar_modelos() {
        try {
            const response = await axios.get('http://localhost:8000/modelos_list');
            const modelos = response.data;
            const lista = document.getElementById('modelos_list');

            if (lista) {
                lista.innerHTML = '';

                modelos.forEach(modelo => {
                    const item = document.createElement('li');
                    const linha = `Nome: ${modelo.nome}, Montadora ID: ${modelo.montadora_id}, Valor: ${modelo.valor_referencia}, Motorização: ${modelo.motorizacao}, Turbo: ${modelo.turbo}, Automático: ${modelo.automatico}, ID: ${modelo.id}`;
                    item.innerText = linha;

                    // Criando o botão de Editar
                    const botaoEditar = document.createElement('button');
                    botaoEditar.innerText = 'Editar';
                    botaoEditar.style.marginLeft = '10px';

                    botaoEditar.addEventListener('click', () => {
                        modeloEditando = modelo;
                        document.getElementById('nome').value = modelo.nome;
                        document.getElementById('montadora_id').value = modelo.montadora_id;
                        document.getElementById('valor_referencia').value = modelo.valor_referencia;
                        document.getElementById('motorizacao').value = modelo.motorizacao;
                        document.getElementById('turbo').checked = modelo.turbo;
                        document.getElementById('automatico').checked = modelo.automatico;
                        document.getElementById('form_modelo').scrollIntoView();
                    });

                    const botaoRemover = document.createElement('button');
                    botaoRemover.innerText = 'Remover';
                    botaoRemover.style.marginLeft = '5px';

                    botaoRemover.addEventListener('click', async () => {
                        if (confirm(`Tem certeza que deseja remover o modelo ${modelo.nome}?`)) {
                            await axios.delete(`http://localhost:8000/modelos_delete/${modelo.id}`);
                            alert(`Modelo ${modelo.nome} removido com sucesso!`);
                            carregar_modelos();
                        }
                    });

                    item.appendChild(botaoEditar);
                    item.appendChild(botaoRemover);

                    lista.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    }

    function manipular_formulario_modelos() {
        const form_modelo = document.getElementById('form_modelo');
        if (!form_modelo) return;

        const input_nome = document.getElementById('nome');
        const input_montadora_id = document.getElementById('montadora_id');
        const input_valor_referencia = document.getElementById('valor_referencia');
        const input_motorizacao = document.getElementById('motorizacao');
        const input_turbo = document.getElementById('turbo');
        const input_automatico = document.getElementById('automatico');

        form_modelo.onsubmit = async (event) => {
            event.preventDefault();
            const nome_modelo = input_nome.value;
            const montadora_id = input_montadora_id.value;
            const valor_referencia = input_valor_referencia.value;
            const motorizacao = input_motorizacao.value;
            const turbo = input_turbo.checked;
            const automatico = input_automatico.checked;

            try {
                if (modeloEditando) {
                    await axios.put(`http://localhost:8000/modelos_update/${modeloEditando.id}`, {
                        nome: nome_modelo,
                        montadora_id: montadora_id,
                        valor_referencia: valor_referencia,
                        motorizacao: motorizacao,
                        turbo: turbo,
                        automatico: automatico
                    });
                    alert(`Modelo ${modeloEditando.nome} atualizado com sucesso!`);
                    modeloEditando = null;
                } else {
                    await axios.post('http://localhost:8000/modelos_save', {
                        nome: nome_modelo,
                        montadora_id: montadora_id,
                        valor_referencia: valor_referencia,
                        motorizacao: motorizacao,
                        turbo: turbo,
                        automatico: automatico
                    });
                    alert(`Modelo ${nome_modelo} criado com sucesso!`);
                }

                form_modelo.reset();
                carregar_modelos();
            } catch (error) {
                console.error('Erro ao salvar modelo:', error);
            }
        };
    }

    async function carregar_veiculos() {
        try {
            const response = await axios.get('http://localhost:8000/veiculos_list');
            const veiculos = response.data;
            const lista = document.getElementById('veiculos_list');

            if (lista) {
                lista.innerHTML = '';

                veiculos.forEach(veiculo => {
                    const item = document.createElement('li');
                    const vendidoText = veiculo.vendido ? 'Sim' : 'Não';
                    const linha = `Modelo ID: ${veiculo.modelo_id}, Cor: ${veiculo.cor}, Ano de Fabricação: ${veiculo.ano_fabricacao}, Ano do Modelo: ${veiculo.ano_modelo}, Valor: R$ ${veiculo.valor.toFixed(2)}, Placa: ${veiculo.placa}, Vendido: ${vendidoText}`;
                    item.innerText = linha;

                    const botaoEditar = document.createElement('button');
                    botaoEditar.innerText = 'Editar';
                    botaoEditar.style.marginLeft = '10px';

                    botaoEditar.addEventListener('click', () => {
                        veiculoEditando = veiculo;
                        document.getElementById('modelo_id').value = veiculo.modelo_id;
                        document.getElementById('cor').value = veiculo.cor;
                        document.getElementById('ano_fabricacao').value = veiculo.ano_fabricacao;
                        document.getElementById('ano_modelo').value = veiculo.ano_modelo;
                        document.getElementById('valor').value = veiculo.valor;
                        document.getElementById('placa').value = veiculo.placa;
                        document.getElementById('vendido').checked = veiculo.vendido;
                        document.getElementById('form_veiculo').scrollIntoView(); 
                    });

                    const botaoRemover = document.createElement('button');
                    botaoRemover.innerText = 'Remover';
                    botaoRemover.style.marginLeft = '5px';

                    botaoRemover.addEventListener('click', async () => {
                        if (confirm(`Tem certeza que deseja remover o veículo ${veiculo.modelo_id}?`)) {
                            await axios.delete(`http://localhost:8000/veiculos_delete/${veiculo.id}`);
                            alert(`Veículo ${veiculo.modelo_id} removido com sucesso!`);
                            carregar_veiculos(); 
                        }
                    });

                    item.appendChild(botaoEditar);
                    item.appendChild(botaoRemover);

                    lista.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
        }
    }

    function manipular_formulario_veiculos() {
        const form_veiculo = document.getElementById('form_veiculo');
        if (!form_veiculo) return;
    
        const input_modelo_id = document.getElementById('modelo_id');
        const input_cor = document.getElementById('cor');
        const input_ano_fabricacao = document.getElementById('ano_fabricacao');
        const input_ano_modelo = document.getElementById('ano_modelo');
        const input_valor = document.getElementById('valor');
        const input_placa = document.getElementById('placa');
        const input_vendido = document.getElementById('vendido');
    
        form_veiculo.onsubmit = async (event) => {
            event.preventDefault();
            const modelo_id = input_modelo_id.value;
            const cor = input_cor.value;
            const ano_fabricacao = input_ano_fabricacao.value;
            const ano_modelo = input_ano_modelo.value;
            const valor = parseFloat(input_valor.value);
            const placa = input_placa.value;
            const vendido = input_vendido.checked;
    
            try {
                if (veiculoEditando) {
                    await axios.put(`http://localhost:8000/veiculos_update/${veiculoEditando.id}`, {
                        modelo_id: modelo_id,
                        cor: cor,
                        ano_fabricacao: ano_fabricacao,
                        ano_modelo: ano_modelo,
                        valor: valor,
                        placa: placa,
                        vendido: vendido
                    });
                    alert(`Veículo ${veiculoEditando.modelo_id} atualizado com sucesso!`);
                    veiculoEditando = null; 
                } else {
                    await axios.post('http://localhost:8000/veiculos_save', {
                        modelo_id: modelo_id,
                        cor: cor,
                        ano_fabricacao: ano_fabricacao,
                        ano_modelo: ano_modelo,
                        valor: valor,
                        placa: placa,
                        vendido: vendido
                    });
                    alert(`Veículo cadastrado com sucesso!`);
                }
    
                form_veiculo.reset(); 
                carregar_veiculos();  
            } catch (error) {
                console.error('Erro ao salvar veículo:', error);
            }
        };
    }    

    function app() {
        console.log('App carregado');
        carregar_montadoras();
        manipular_formulario_montadoras();
        carregar_modelos();
        manipular_formulario_modelos();
        carregar_veiculos();
        manipular_formulario_veiculos();
    }

    app();
});
