function fazerLogin() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var alertlog = document.getElementById("alertlog");

    if (email === "") {
        alertlog.style.display = "block";
        alertlog.innerHTML =
            "Email não digitado.";
        return;
    } else if (senha === "") {
        alertlog.style.display = "block";
        alertlog.innerHTML =
            "Senha não digitada.";
        return;
    } else if (senha.length < 8) {
        alertlog.style.display = "block";
        alertlog.innerHTML = "Mínimo de 8 digitos.";
        return;
    } else {
        alertlog.style.display = "none";
    }
    mostrarProcessando();
    fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
            "email=" +
            encodeURIComponent(email) +
            "&senha=" +
            encodeURIComponent(senha),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.success) {
                setTimeout(function () {
                    window.location.href = "dashboard.php";
                }, 1000);
                //alert(data.message);
                alertlog.classList.remove("erroBonito");
                alertlog.classList.add("acertoBonito");
                alertlog.innerHTML = data.message;
                alertlog.style.display = "block";
            } else {
                alertlog.style.display = "block";
                alertlog.innerHTML = data.message;
            }
            esconderProcessando();
        })
        .catch((error) => {
            console.error("Erro na requisição", error);
        });
}

// FUNCAO DE LOADING
function mostrarProcessando() {
    var divFundoEscuro = document.createElement('div');
    divFundoEscuro.id = 'fundoEscuro';
    divFundoEscuro.style.position = 'fixed';
    divFundoEscuro.style.top = '0';
    divFundoEscuro.style.left = '0';
    divFundoEscuro.style.width = '100%';
    divFundoEscuro.style.height = '100%';
    divFundoEscuro.style.backgroundColor = 'rgba(0,0,0,0.7)';
    document.body.appendChild(divFundoEscuro);

    var divProcessando = document.createElement("div");
    divProcessando.id = "processandoDiv";
    divProcessando.style.position = "fixed";
    divProcessando.style.top = "50%";
    divProcessando.style.left = "50%";
    divProcessando.style.transform = "translate(-50%, -50%)";
    // divProcessando.innerHTML = '<img src="../img/loading.gif" width="80px" alt="Processando..." title="Processando...">';
    divProcessando.innerHTML = '<lottie-player autoplay loop mode="normal" src="./img/loadingjson.json" style="width: 140px;"></lottie-player>'
    document.body.appendChild(divProcessando);
}

// FUNCAO DE ESCONDER O LOADING
function esconderProcessando() {
    var divProcessando = document.getElementById("processandoDiv");
    var divFundo = document.getElementById('fundoEscuro');
    if (divProcessando) {
        document.body.removeChild(divProcessando);
        documenfunction carregarConteudo(controle) {
            fetch('controle.php', {
                method: 'POST', headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }, body: 'controle=' + encodeURIComponent(controle),
            })
                .then(response => response.text())
                .then(data => {

                    document.getElementById('show').innerHTML = data;
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                });
        }
        t.body.removeChild(divFundo);
    }
}


$('.cpf').mask('000.000.000-00');

$('.telefoneBR').mask('(00) 0 0000-0000');

$('.dinheiro').mask('000.000.000.000.000,00', {reverse: true});


function abrirModalJs(id, inID, innome, idNome, nomeModal, dataTime, abrirModal = 'A', botao, addEditDel, addEditFoto, inFocus, inFocusValue, formulario) {
    const formDados = document.getElementById(`${formulario}`)
    let formEnviado = false;

    var botoes = document.getElementById(`${botao}`);
    const ModalInstacia = new bootstrap.Modal(document.getElementById(`${nomeModal}`))
    if (abrirModal === 'A') {
        ModalInstacia.show();

        const inputFocar = document.getElementById(`${inFocus}`);
        if (inFocusValue !== 'nao') {
            inputFocar.value = inFocusValue;
            setTimeout(function () {
                inputFocar.focus();

            }, 500);
        }
        const ID = document.getElementById(`${inID}`);
        if (inID !== 'nao') {
            ID.value = id;
        }
        const nome = document.getElementById(`${innome}`);
        if (innome !== 'nao') {
            nome.value = idNome;
        }

        let imgVermais = document.getElementById('fotoVermais')
        if (caminhoFoto !== 'nao') {
            imgVermais.src = '../img/perfil/' + `${caminhoFoto}`;

        }

        const submitHandler = function (event) {
            event.preventDefault();

            botoes.disabled = true;

            const form = event.target;
            const formData = new FormData(form);

            if (dataTime !== 'nao') {
                formData.append('dataTime', `${dataTime}`)
            }
            formData.append('controle', `${addEditDel}`)
            if (addEditFoto !== 'nao') {
                let fileInput = document.getElementById(`${addEditFoto}`)
                formData.append('foto', fileInput.files[0]);
            }

            fetch('controle.php', {
                method: 'POST', body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    formEnviado = true;
                    // console.log(data)
                    if (data.success) {
                        alertSuccess(data.message, '#1B7E00')
                        carregarConteudo("listarAdm");
                        ModalInstacia.hide();

                    } else {
                        alertError(data.message)
                        ModalInstacia.hide();
                        carregarConteudo("listarAdm");
                    }
                })
                .catch(error => {
                    botoes.disabled = false;
                    ModalInstacia.hide();
                    carregarConteudo("listarAdm");
                    console.error('Erro na requisição:', error);
                });
        }
        formDados.addEventListener('submit', submitHandler);
        //Escolher o campo que altera o formEnviado para false


    } else {
        botoes.disabled = false;
        ModalInstacia.hide();
    }
}

function alertSuccess(msg, cor) {

    Toastify({
        text: `${msg}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: `${cor}`,
            color: 'white',
        },
    }).showToast();

}

function alertError(msg) {
    Toastify({
        text: `${msg}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#F40000",
            color: 'white',
        },
    }).showToast();

}
