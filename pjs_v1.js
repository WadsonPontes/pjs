/*
* Author: Wadson Pontes
* Date: 08/07/2019
* Version: 1.0
*/

// VARIÁVEIS ---------------------------------------------------------------------------------------------------
const eventos = [];
const b = localStorage;

// FUNCÕES ----------------------------------------------------------------------------------------------------
function iniciar() {
	converter(document.body); // Converte o corpo para Elemento
	temporizador = setInterval(loop, 0); // Inicia o loop infinito que vai gerenciar os eventos
}

function converter(nomeOuHTML) { // Converte HTML em Elemento
	let html, tipo, subtipo, nome, classe, pai;

	if (typeof nomeOuHTML === "string") html = document.querySelector(`#${nomeOuHTML}`);
	else html = nomeOuHTML;
	if (html.id != null && window[html.id] != null) return window[html.id];

	tipo = html.nodeName.toLowerCase();
	classe = html.className;
	pai = html.parentNode;
	if (tipo == "body") {tipo = "corpo"; nome = "corpo";}
	else nome = html.id;

	if (tipo == "img") tipo = "imagem";
	else if (tipo == "textarea") tipo = "campo";
	else if (tipo == "input") {
		subtipo = html.type.toLowerCase();

		if (subtipo == "button") tipo = "botao";
		else if (subtipo == "text" || subtipo == "password" || subtipo == "number") tipo = "campo";
		else if (subtipo == "checkbox" || subtipo == "radio") tipo = "caixa_de_selecao";
	} // else tipo = tipo;
	return criar(tipo, nome, classe, pai);
}

function criar(tipo, nome, classe, pai, texto, atributo, valor) { // Cria Elemento
	window[nome] = new Elemento(tipo, nome, classe, pai, texto, atributo, valor);
	return window[nome];
}

function apagar(elemento) { // Apaga Elemento
	elemento.pai.h.removeChild(elemento.h);
	delete window[elemento.nome];
}

function agendar(atraso, ordem, func, ...args) {
	if (typeof atraso !== "number") { // agendar(func, ...args);
		args = [ordem, func, ...args];
		func = atraso;
		ordem = maiorOrdem();
		atraso = 0;
	}
	else if (typeof ordem !== "number") { // agendar(atraso, func, ...args);
		args = [func, ...args];
		func = ordem;
		ordem = maiorOrdem();
		
	} // else agendar(atraso, ordem, func, ...args);
	func = (typeof func === "string") ? window[func] : func; // func pode ser String ou Function
	eventos.push({tipo:"funcao", atraso:numero(atraso), vezes:0, ordem:numero(ordem), func:func, args:args});
}

function repetir(atraso, vezes, func, ...args) {
	if (typeof atraso !== "number") { // repetir(func, ...args);
		args = [vezes, func, ...args];
		func = atraso;
		vezes = -1;
		atraso = 0;
	}
	else if (typeof vezes !== "number") { // repetir(atraso, func, ...args);
		args = [func, ...args];
		func = vezes;
		vezes = -1;
		
	} // else repetir(atraso, vezes, func, ...args);
	func = (typeof func === "string") ? window[func] : func; // func pode ser String ou Function
	return eventos.push({tipo:"funcao", atraso:numero(atraso), vezes:numero(vezes), ordem:0, func:func, args:args});
}

function parar(_evento) {
	eventos[i].splice(eventos[i].indexOf(_evento), 1);
}

function pararTodos() {
	eventos = eventos.filter(item => item.vezes == 0);
}

function animando(_id) {
	eventos[_id].h.url = `${eventos[_id].imgs}${eventos[_id].quadro_atual}.png`;

	if (contarAnim(_id) == true) eventos[_id].quadro_atual++;
	if (eventos[_id].quadro_atual > eventos[_id].quadros) {
		eventos.splice(_id, 1);
		_id--;
	}
	return _id;
}

function girando(_id) {
	eventos[_id].h.angulo = contarGiro(_id);

	if (eventos[_id].tempo_passado >= eventos[_id].duracao) {
		eventos[_id].h.angulo = eventos[_id].angulo;
		eventos.splice(_id, 1);
		_id--;
	}
	return _id;
}

function movendo(_id) {
	eventos[_id].h.x = contarMoveX(_id);
	eventos[_id].h.y = contarMoveY(_id);

	if (eventos[_id].tempo_passado >= eventos[_id].duracao) {
		eventos[_id].h.posicao(eventos[_id].x, eventos[_id].y);
		eventos.splice(_id, 1);
		_id--;
	}
	return _id;
}

function loop() {
	for (let i = 0; i < eventos.length; i++) {
		if ((eventos[i].ordem == 0 || eventos[i].ordem == menorOrdem(i) || eventos[i].tempo_inicial != null) && contarAtraso(i)) {
			if (eventos[i].tipo == "mover") i = movendo(i);
			else if (eventos[i].tipo == "girar") i = girando(i);
			else if (eventos[i].tipo == "animar") i = animando(i);
			else if (eventos[i].tipo == "funcao") {
				eventos[i].func(...eventos[i].args);
				if (eventos[i].vezes > -1) {
					eventos[i].vezes--;
					if (eventos[i].vezes == -1) {
						eventos.splice(i, 1);
						i--;
					}
					else {
						delete eventos[i].tempo;
					}
				}
			}
		}
	}
}

function contarAtraso(_id) {
	eventos[_id].tempo = eventos[_id].tempo || performance.now();

	if (performance.now() - eventos[_id].tempo >= eventos[_id].atraso) return true;
	return false;
}

function contarAnim(_id) {
	eventos[_id].tempo_inicial = eventos[_id].tempo_inicial || performance.now();

	if (performance.now() - eventos[_id].tempo_inicial >= eventos[_id].duracao / (eventos[_id].quadros || 1)) {
		eventos[_id].tempo_inicial = performance.now();
		return true
	}
	return false;
}

function contarGiro(_id) {
	eventos[_id].angulo_original = eventos[_id].angulo_original || eventos[_id].h.angulo;
	eventos[_id].tempo_inicial = eventos[_id].tempo_inicial || performance.now();
	eventos[_id].tempo_passado = performance.now() - eventos[_id].tempo_inicial;
	return eventos[_id].angulo_original + (eventos[_id].angulo - eventos[_id].angulo_original) * (eventos[_id].tempo_passado / (eventos[_id].duracao || 1));
}

function contarMoveX(_id) {
	eventos[_id].x_original = eventos[_id].x_original || eventos[_id].h.x;
	eventos[_id].tempo_inicial = eventos[_id].tempo_inicial || performance.now();
	eventos[_id].tempo_passado = performance.now() - eventos[_id].tempo_inicial;
	return eventos[_id].x_original + (eventos[_id].x - eventos[_id].x_original) * (eventos[_id].tempo_passado / (eventos[_id].duracao || 1));
}

function contarMoveY(_id) {
	eventos[_id].y_original = eventos[_id].y_original || eventos[_id].h.y;
	eventos[_id].tempo_inicial = eventos[_id].tempo_inicial || performance.now();
	eventos[_id].tempo_passado = performance.now() - eventos[_id].tempo_inicial;
	return eventos[_id].y_original + (eventos[_id].y - eventos[_id].y_original) * (eventos[_id].tempo_passado / (eventos[_id].duracao || 1));
}

function maiorOrdem() {
	let maior = -Infinity;

	if (eventos.length == 0 || todosAtrasados() == true) return 0;
	for (let i = 0; i < eventos.length; i++) {
		if (eventos[i].ordem > maior && eventos[i].atraso <= 0) maior = eventos[i].ordem;
	}
	maior++;
	return maior;
}

function menorOrdem(_id) {
	let menor = +Infinity;

	if (todosAtrasados() == true) return eventos[_id].ordem;
	for (let i = 0; i < eventos.length; i++) {
		if (eventos[i].ordem < menor && eventos[i].atraso <= 0) menor = eventos[i].ordem;
	}
	return menor;
}

function todosAtrasados() {
	for (let i = 0; i < eventos.length; i++) {
		if (eventos[i].atraso <= 0) return false;
	}
	return true;
}

function pedir() {
	let arg = arguments;
	let xhttp = new XMLHttpRequest();
	let mensagem = "";
	let retorno = typeof arg[arg.length - 1] === "function" ? true : false;
	let tam = retorno ? arg.length - 1 : arg.length;

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (retorno) arg[arg.length - 1](JSON.parse(this.responseText));
		}
	}
	if (typeof arg[1] === "string" || typeof arg[1] === "number" || typeof arg[1] === "boolean") mensagem = "arg1=" + encodeURIComponent(arg[1]);
	for (let i = 2; i < tam; i++) mensagem += "&arg" + i + "=" + encodeURIComponent(arg[i]);

	xhttp.open("POST", arg[0], true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(mensagem);
}

function letra(_letra) {
  return _letra.toLowerCase() != _letra.toUpperCase();
}

function numero(_numero) {
	return Number(_numero);
}

function inteiro(_numero) {
	return parseInt(_numero);
}

function real(_numero) {
	return parseFloat(_numero);
}

function arredondar(_numero) {
	return Math.round(_numero);
}

function minimo(...args) {
	return Math.min(...args);
}

function maximo(...args) {
	return Math.max(...args);
}

function aleatorio(min, max) {
	return Math.floor((Math.random() * (max - min + 1)) + min);
}

function embaralhar(vetor) {
    for (let i = vetor.length; i >= 0; i++) {
        let j = Math.floor(Math.random() * i);

        [vetor[i], vetor[j]] = [vetor[j], vetor[i]];
    }
    return vetor;
}

function ordenar(vetor) {
	return vetor.sort();
}

function inverter(vetor) {
	return vetor.reverse();
}

class Elemento { // PAI recebe: String, HTML ou Elemento e transforma-se em Elemento
	tipo;
	pai;
	h;
	api = new Object();
	v = new Object();
	constructor(tipo, nome, classe, pai, texto, atributo, valor) {
		this.criarHTML(tipo, nome, classe, pai);
		this.nome = nome;
		this.classe = classe;
		this.inicializar(texto, atributo, valor);
	}

	criarHTML(tipo, nome, classe, pai) {
		let html = document.querySelector(`#${nome}`);

		if (html != null) this.h = html;
		this.tipo = tipo.toLowerCase();
		this.pai = (typeof pai === "string") ? window[pai] : ((pai.h != null) ? pai : ((this.tipo == "corpo") ? pai : (window[pai.id] || converter(pai))));

		if (this.tipo == "corpo") {
			html = document.body;
			this.h = html;
		}
		else if (this.tipo == "button" || this.tipo == "botão" || this.tipo == "botao") {
			this.tipo = "botao";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "button";
		}
		else if (this.tipo == "radio" || this.tipo == "caixa_selecao_unica" || this.tipo == "caixa_de_selecao_unica" || this.tipo == "caixa_selecao" || this.tipo == "caixa_de_selecao") {
			this.tipo = "caixa_de_selecao";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "radio";
			this.h.name = classe;
		}
		else if (this.tipo == "checkbox" || this.tipo == "caixa_de_selecao_multipla" || this.tipo == "caixa_selecao_multipla" || this.tipo == "caixa_multipla_selecao") {
			this.tipo = "caixa_de_selecao";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "checkbox";
			this.h.name = classe;
		}
		else if (this.tipo == "textarea" || this.tipo == "caixa_de_texto" || this.tipo == "caixa de texto" || this.tipo == "caixa_texto" || this.tipo == "caixa texto") {
			this.tipo = "campo";
			if (html == null) this.h = document.createElement("textarea");
		}
		else if (this.tipo == "input" || this.tipo == "campo" || this.tipo == "campo texto" || this.tipo == "campo_texto" || this.tipo == "campo de texto" || this.tipo == "campo_de_texto") {
			this.tipo = "campo";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "text";
		}
		else if (this.tipo == "password" || this.tipo == "campo_senha" || this.tipo == "campo senha" || this.tipo == "campo de senha" || this.tipo == "campo_de_senha") {
			this.tipo = "campo";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "password";
		}
		else if (this.tipo == "campo_numero" || this.tipo == "campo numero" || this.tipo == "campo de numero" || this.tipo == "campo_de_numero") {
			this.tipo = "campo";
			if (html == null) this.h = document.createElement("input");
			this.h.type = "number";
		}
		else if (this.tipo == "label") {
			if (html == null) this.h = document.createElement("label");
			this.h.htmlFor = this.pai.nome;
			this.pai = this.pai.pai;
		}
		else if (this.tipo == "img" || this.tipo == "image" || this.tipo == "imagem") {
			this.tipo = "imagem";
			if (html == null) this.h = document.createElement("img");
		}
		else {
			if (html == null) this.h = document.createElement(this.tipo);
		}
		if (html == null) this.pai.h.appendChild(this.h);
	}

	inicializar(texto, atributo, valor) {
		if (texto != null) {
			this.pretexto = texto;

			if (atributo != null) this[atributo](valor);
		}
	}

	apagar() {
		apagar(this);
	}

	get nome() {
		return this.h.id;
	}

	set nome(_nome) {
		delete window[this.nome];
		window[_nome] = this;
		this.h.id = _nome;
	}

	get classe() {
		return this.h.className;
	}

	set classe(_classe) {
		this.h.className = _classe;
	}

	addClasse(_classe) {
		this.h.classList.add(_classe);
	}

	removerClasse(_classe) {
		this.h.classList.remove(_classe);
	}

	trocarClasse(_classe) {
		this.h.classList.toggle(_classe);
	}

	contemClasse(_classe) {
		return this.h.classList.contains(_classe);
	}

	get pretexto() {
		if (this.tipo == "botao") return this.h.value;
		else if (this.tipo == "campo") return this.h.placeholder;
		else if (this.tipo == "caixa_de_selecao") return this.api.label.texto;
		else if (this.tipo == "imagem") return this.h.src;
		else return this.h.innerHTML;
	}

	set pretexto(_texto) {
		if (this.tipo == "botao") this.h.value = _texto;
		else if (this.tipo == "campo") this.h.placeholder = _texto;
		else if (this.tipo == "caixa_de_selecao") this.api.label = criar("label", `label_${this.nome}`, this.classe, this, _texto);
		else if (this.tipo == "imagem") this.h.src = _texto;
		else this.h.innerHTML = _texto;
	}

	get texto() {
		if (this.tipo == "botao" || this.tipo == "campo") return this.h.value;
		else if (this.tipo == "caixa_selecao") return this.api.label.texto;
		else if (this.tipo == "imagem") return this.h.src;
		return this.h.innerHTML;
	}

	set texto(_texto) {
		if (this.tipo == "botao" || this.tipo == "campo") this.h.value = _texto;
		else if (this.tipo == "caixa_de_selecao") this.api.label.texto = _texto;
		else if (this.tipo == "imagem") this.h.src = _texto;
		else this.h.innerHTML = _texto;
	}

	get numero() {
		return numero(this.texto);
	}

	set numero(_numero) {
		this.texto = numero(_numero);
	}

	get corDaFonte() {
		return this.h.style.color;
	}

	set corDaFonte(_cor) {
		this.h.style.color = _cor;
	}

	get url() {
		if (this.tipo == "imagem") return this.h.src;
		return this.h.style.backgroundImage.slice(5, -2);
	}

	set url(_url) {
		if (this.tipo == "imagem") this.h.src = _url;
		else {
			this.h.style.backgroundImage = `url(${_url})`;
			this.h.style.backgroundSize = "cover";
		}
	}

	get x() {
		return this.h.offsetLeft;
	}

	set x(_x) {
		this.h.style.left = `${_x}px`;
	}

	get y() {
		return this.h.offsetTop;
	}

	set y(_y) {
		this.h.style.top = `${_y}px`;
	}

	get angulo() {
		let _angulo = this.h.style.transform.slice(7, -4);

		if (_angulo == "") return 0;
		return inteiro(_angulo);
	}

	set angulo(_angulo) {
		this.h.style.transform = `rotate(${_angulo}deg`;
	}

	posicao(_x, _y) {
		this.h.style.left = `${_x}px`;
		this.h.style.top = `${_y}px`;
	}

	get largura() {
		return this.h.clientWidth;
	}

	set largura(_largura) {
		this.h.style.width = `${_largura}px`;
	}

	get altura() {
		return this.h.clientHeight;
	}

	set altura(_altura) {
		this.h.style.height = `${_altura}px`;
	}

	tamanho(_largura, _altura) {
		this.h.style.width = `${_largura}px`;
		this.h.style.height = `${_altura}px`;
	}

	set margemDireita(_margem) {
		this.h.style.marginRight = `${_margem}px`;
	}

	set margemEsquerda(_margem) {
		this.h.style.marginLeft = `${_margem}px`;
	}

	set margemCima(_margem) {
		this.h.style.marginTop = `${_margem}px`;
	}

	set margemBaixo(_margem) {
		this.h.style.marginBottom = `${_margem}px`;
	}

	mostrar() {
		this.h.style.visibility = "visible";
	}

	esconder() {
		this.h.style.visibility = "hidden";
	}

	ativar() {
		this.h.disabled = false;
	}

	desativar() {
		this.h.disabled = true;
	}

	marcar() {
		this.h.checked = true;
	}

	desmarcar() {
		this.h.checked = false;
	}

	get marcado() {
		return this.h.checked;
	}

	sobrepor() {
		this.pai.h.appendChild(this.h);
	}

	set addFilho(_filho) {
		this.h.appendChild(_filho);
	}

	get filhos() {
		return this.h.children;
	}

	evento(_tipo, _func, _func2) {
		let that = this;

		if (_tipo == "onclick" || _tipo == "click" || _tipo == "clique" || _tipo == "clicado") {
			this.h.addEventListener("click", function() { _func(that); });
		}
		else if (_tipo == "onmouseover" || _tipo == "mouseover" || _tipo == "mouse_em_cima" || _tipo == "mouse em cima") {
			this.h.addEventListener("mouseenter", function() { _func(that); });
			this.h.addEventListener("mouseleave", function() { _func2(that); });
		}
		else if (_tipo == "onmousedown" || _tipo == "mousedown" || _tipo == "mouseclicou" || _tipo == "mouse clicou" || _tipo == "mouse_clicou" || _tipo == "clicou" || _tipo == "segurou") {
			this.h.addEventListener("mousedown", function() { _func(that); });
		}
		else if (_tipo == "onmouseup" || _tipo == "mouseup" || _tipo == "mousesoltou" || _tipo == "mouse soltou" || _tipo == "mouse_soltou" || _tipo == "soltou") {
			this.h.addEventListener("mouseup", function() { _func(that); });
		}
		else if (_tipo == "onkeydown" || _tipo == "keydown" || _tipo == "tecla" || _tipo == "tecla pressionada" || _tipo == "tecla_pressionada" || _tipo == "teclapressionada" || _tipo == "pressionado" || _tipo == "teclado") {
			this.h.addEventListener("keydown", function(e) { _func(e); });
		}
		else if (_tipo == "onmousemove" || _tipo == "mousemove" || _tipo == "mouse moveu" || _tipo == "mouse_moveu" || _tipo == "movimento do mouse" || _tipo == "movimento_do_mouse" || _tipo == "mouse move" || _tipo == "mouse_move") {
			this.h.addEventListener("mousemove", function(e) { _func(e); });
		}
		else if (_tipo == "onresize" || _tipo == "resize" || _tipo == "redirecionar" || _tipo == "redirecionado" || _tipo == "redirecionou" || _tipo == "redimensionar" || _tipo == "redimensionado" || _tipo == "redimensionou" || _tipo == "tela_redirecionada" || _tipo == "tela_redirecionou" || _tipo == "tela_redimensionada" || _tipo == "tela_redimensionou") {
			this.h.addEventListener("resize", function() { _func(that); });
		}
	}

	contarQuadros(_quadros) { // Retorna true _quadros vezes por segundo
		if (this.api.quadros == null || performance.now() - this.api.quadros > 1000) this.api.quadros = performance.now();

		if (performance.now() - this.api.quadros >= 1000 / (_quadros || 1)) {
			this.api.quadros = performance.now();
			return true;
		}
		return false;
	}

	contarTempo(_tempo) { // Retorna true quando passar o _tempo (em milissegundos)
		if (this.api.tempo == null || performance.now() - this.api.tempo >= _tempo + 1000) this.api.tempo = performance.now();

		if (performance.now() - this.api.tempo >= _tempo) {
			this.api.tempo = performance.now();
			return true;
		}
		return false;
	}

	// imgs é o nome padrão dos quadros
	// Os quadros devem ser em PNG
	// Os quadros devem ter o nome: imgsI.png, com 1 < I < quadros
	animar(_duracao, _imgs, _quadros, _atraso, _ordem) {
		if (_atraso == null) { // animacao(duração, imagens, quadros);
			_atraso = 0;
			_ordem = maiorOrdem();
		}
		else if (_ordem == null) { // animacao(duração, imagens, quadros, atraso);
			_ordem = maiorOrdem();
		} // else animacao(duração, imagens, quadros, atraso, ordem);
		eventos.push({tipo:"animar", atraso:numero(_atraso), vezes:0, ordem:numero(_ordem), h:this, duracao:numero(_duracao), imgs:imgs, quadros:numero(_quadros), quadro_atual:1});
	}

	girar(_duracao, _angulo, _atraso, _ordem) {
		if (_atraso == null) { // girar(duração, angulo);
			_atraso = 0;
			_ordem = maiorOrdem();
		}
		else if (_ordem == null) { // girar(duração, angulo, atraso);
			_ordem = maiorOrdem();
		} // else girar(duração, angulo, atraso, ordem);
		eventos.push({tipo:"girar", atraso:numero(_atraso), vezes:0, ordem:numero(_ordem), h:this, duracao:numero(_duracao), angulo:numero(_angulo)});
	}

	mover(_duracao, _x, _y, _atraso, _ordem) {
		if (typeof _x === "object") { // mover(duração, destino);
			if (_atraso == null) _ordem = maiorOrdem(); // mover(duração, destino, atraso);
			else _ordem = _atraso; // mover(duração, destino, atraso, ordem);
			if (_y == null) _atraso = 0; // mover(duração, destino);
			else _atraso = _y; // mover(duração, destino, atraso);
			_y = _x.y;
			_x = _x.x;
		}
		else { // mover(duração, x, y);
			if (_atraso == null) _atraso = 0; // mover(duração, x, y);
			if (_ordem == null) _ordem = maiorOrdem(); // mover(duração, x, y, atraso);
		}
		eventos.push({tipo:"mover", atraso:numero(_atraso), vezes:0, ordem:numero(_ordem), h:this, duracao:numero(_duracao), x:numero(_x), y:numero(_y)});
	}
}

iniciar();