# PJS - JavaScrip em Português
API de JavaScript focada na criação e gerenciamento dos elementos do DOM com funções em português

## Como instalar

Baixe a última versão da API, coloque-o na pasta de seu projeto e chamei-o dentro do \<BODY\>. Exemplo:
```html
<html>
  <head>
  </head>
  <body>
    <script type="text/javascript" src="pjs.js"></script>
  </body>
</html>
```
*Atenção*: chamá-lo dentro do \<HEAD\> gerará um erro, pois a API tentará criar o Elemento *corpo* antes do \<BODY\> ser inicializado. E todo código JavaScript deve ser escrito ou chamado após a chamada da API.

## Como usar

Para criar um Elemento use a função *criar* ou crie um objeto Elemento diretamente. Exemplos:
```js
let nome_do_campo_texto = new Elemento("campo_texto", "nome_do_campo_texto", "classe_do_campo_texto", "pai_do_campo_texto", "texto_reservado");

criar("imagem", "nome_da_imagem", "", pai_da_imagem);
criar("imagem", "nome_da_imagem", "classe_da_imagem", pai_da_imagem);
criar("imagem", "nome_da_imagem", "classe_da_imagem", "nome_do_pai_da_imagem");
criar("imagem", "nome_da_imagem", "classe_da_imagem", pai_da_imagem, url);

criar("botao", "nome_do_botao", "classe_do_botao", pai_do_botao, texto_do_botao).evento("clique", evento_botao_clicado);
criar("texto", "nome_do_texto", "classe_do_texto", pai_do_texto, texto);
```

Para converter um elemento do DOM em Elemento use a função *converter*. Exemplos:
```js
converter("id_do_elemento");
converter(elemento);
```

Para acessar um Elemento use a variável, automaticamente criado, com o nome do Elemento. Também é possível acessar um Elemento com nome variável usando a variável global *h*. Exemplos:
```js
let nome_do_elemento = "texto_ola_mundo";

converter("frase");

frase.texto = "O texto agora é outro";
h[nome_do_elemento].nome = "novo_nome";
novo_nome.x = 100;
```

Para apagar um Elemento use a função *apagar* ou chame o método *apagar* do Elemento. Exemplos:
```js
apagar(nome_do_elemento);
elemento.apagar();
```

Para criar um evento use o método *evento* do Elemento. Exemplos:
```js
elemento.evento("clique", funcao_clicado);
elemento.evento("mouse_em_cima", funcao_mouse_em_cima, funcao_mouse_fora);
elemento.evento("tecla_pressionada", funcao_tecla_pressionada);
elemento.evento("redirecionou", funcao_redirecionou);
elemento.evento("fechou_a_pagina", funcao_fechou_a_pagina);
```

Para mover um Elemento use seu método *mover*. Exemplos:
```js
elemento.mover(duracao, elemento_destino);
elemento.mover(duracao, elemento_destino, atraso_na_inicializacao);
elemento.mover(duracao, elemento_destino, atraso_na_inicializacao, ordem); // Só será executado depois que todos os eventos de ordem inferior forem executados.

elemento.mover(duracao, x, y);
elemento.mover(duracao, x, y, atraso_na_inicializacao);
elemento.mover(duracao, x, y, atraso_na_inicializacao, ordem);
```

Para girar um Elemento use seu método *girar*. Exemplos:
```js
elemento.girar(duracao, angulo);
elemento.girar(duracao, angulo, atraso_na_inicializacao);
elemento.girar(duracao, angulo, atraso_na_inicializacao, ordem); // Só será executado depois que todos os eventos de ordem inferior forem executados.
```

Para exibir uma animação de um Elemento use seu método *animar*. Exemplos:
```js
elemento.animar(duracao, caminho_das_imagens, numero_de_imagens);
elemento.animar(duracao, caminho_das_imagens, numero_de_imagens, ordem); // Só será executado depois que todos os eventos de ordem inferior forem executados.
```
*Atenção*: todas as imagens da animação devem estar na pasta do endereço fornecido. O nome das imagens deve ser do tipo *i*.png, onde *i* é a ordem em que a imagem deve ser exibida.

Para agendar uma função para ser executada após um determinado praso ou após alguns outros eventos use a função *agendar*. Exemplos:
```js
agendar(minha_funcao, arg_minha_funcao_1, arg_minha_funcao_2, arg_minha_funcao_3, arg_minha_funcao_4, arg_minha_funcao_5);
agendar(atraso, minha_funcao, arg_minha_funcao_1, arg_minha_funcao_2, arg_minha_funcao_3, arg_minha_funcao_4);
agendar(atraso, ordem, minha_funcao, arg_minha_funcao_1); // Só será executado depois que todos os eventos de ordem inferior forem executados.
```

Para chamar uma função um determinado ou indeterminado número de vezes use a função *repetir*. Exemplos:
```js
repetir(minha_funcao, arg_minha_funcao_1, arg_minha_funcao_2, arg_minha_funcao_3, arg_minha_funcao_4, arg_minha_funcao_5);
repetir(atraso, minha_funcao);
repetir(atraso, numero_de_repeticoes, minha_funcao, arg_minha_funcao_1, arg_minha_funcao_2);
```

Para fazer uma requisição AJAX basta usar a função *pedir*. Exemplos:
```js
pedir("endereco_do_php");
pedir("endereco_do_php", funcao_recebe_o_retorno);
pedir("endereco_do_php", variavel_1, variavel_2, variavel_3, variavel_4, variavel_5);
pedir("endereco_do_php", variavel_1, variavel_2, variavel_3, variavel_4, variavel_5, variavel_6, funcao_recebe_o_retorno);
```