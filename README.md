# Loja de carros - Api 
### Autor: Ricardo Lima de Lemos 
### Sobre o projeto

O projeto é uma API REST de uma loja online de carros.     

## Instruções de Uso

1. Clone este repositório.
2. Certifique-se de ter o Nodejs versão 18.18 instalado e em execução.
3. Instale as dependências utilizando `npm install`.
4. Certifique-se de configurar corretamente as variáveis de ambiente,  crie um arquivo .env para a conexão com o banco de dados seguindo o arquivo .env.example.
5. Execute a aplicação utilizando o comando  `npm run dev ` no terminal.
6. As rotas estarão disponíveis em `http://localhost:<porta>`.


## Rotas

### Temos as seguintes rotas disponíveis  

1. **[http://localhost:<porta>/Cars](http://localhost:<porta>/Cars)**:
   - Rota que requer autenticação de usuários para acesso. Permite as seguintes operações:
     - **Métodos disponíveis**: POST, PUT e DELETE.

2. **[http://localhost:<porta>/PublicCars](http://localhost:<porta>/PublicCars)**:
   - Rota pública que possibilita a visualização de carros na página inicial sem a necessidade de autenticação.
     - **Métodos disponíveis**: GET.

3. **[http://localhost:<porta>/Login](http://localhost:<porta>/Login)**:
   - Rota responsável pela autenticação do usuário.
     - **Métodos disponíveis**: POST.

4. **[http://localhost:<porta>/User](http://localhost:<porta>/User)**:
   - Rota para o cadastro de usuários.
     - **Métodos disponíveis**: POST.

## Tecnologias Utilizadas

- **MongoDB**: Banco de dados no SQL
- **Next.js**: Framework utilizado para o desenvolvimento do backend.
- **MD5**: Utilizado para mascarar senhas no banco de dados.
- **JWT**: JSON Web Token utilizado para autenticação.
- **Multer**: Utilizado para realizar o upload de imagens, trabalhando com o formato `multipart/formdata`.




  
