# FFmpeg Transmitter
Esse foi desenvolvido como trabalho final da disciplina de Sistemas Multimidias e tem como objetivo permitir a realização de transmissões usando o FFmpeg

## Como executar

### Backend
**Requisitos:**
- nodejs
- yarn/npm
- ffmpeg

Após clonar este repositório instale as dependencias necessárias usando o comando:
```shell
yarn install
```

Com as dependencias instaladas execute o comando a seguir para executar o backend em modo de desenvolvimento:
```shell
yarn dev
```

Para executar a aplicação utilizando os arquivos compilados execute:
```shell
yarn compile
```
Para compilar os arquivos utilizando o `tsc` e logo em seguida:
```shell
yarn start
```
para iniciar a aplicação a partir dos arquivos compilados.

### Frontend
Ao rodar o backend(como citado anteriormente), o frontend da aplicação ficará disponível no endereço `/public` do backend(por exemplo `localhost:3000/public`).

> **Observação:** Para rodar o front corretamente, é necessário estar rodando em _localhost_ ou em um domínio com certificado SSL(HTTPS) configurado, pois as APIS de mídia dos navegadores(necessário nesse projeto para utilizar o microfone) só funcionam em conexões seguras.

#### Codecs
Por padrão a aplicação só irá exibir alguns codecs pré-selecionados com melhorias garantias de funcionamento, para exibir todos os codecs disponíveis marque a caixa `Modo avançado` logo abaixo do campo de codecs.

#### Output do FFmpeg
Caso deseje acompanhar a saída gerada pelo comando do FFmpeg, marque a caixa `Log output`(que se encontro logo abaixo do botão "Parar transmissão").

## Informações Adicionais

### Customizar porta da aplicação
Por padrão a aplicação irá rodar na porta `3000`, mas isso pode ser alterado modificando a variável de ambiente `PORT` como no exemplo a seguir.
```shell
PORT=4001 yarn start
```

### Modificando frontend

### API_URL
Caso você modifique a porta da aplicação, ou queria apontar para um backend diferente, modifique a variável `API_URL` na página `public/index.html`.

### BASIC_MODE_CODECS
Por padrão a aplicação só irá exibir alguns codecs pré-selecionados, para modificar quais serão esses codecs modifique o array da variável `BASIC_MODE_CODECS` presente no arquivo `public/index.html`(você deve usar o mesmo nome do codec que seria usado na linha de comando do FFmpeg).

### DEFAULT_CODEC
Através da variável `DEFAULT_CODEC`(no arquivo `public/index.html`) é possível modificar o codec que será pre-selecionado no _startup_ da página.