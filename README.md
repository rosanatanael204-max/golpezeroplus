# GolpeZero 50+

O GolpeZero 50+ é uma plataforma de prevenção a golpes digitais voltada ao público com 50 anos ou mais, desenvolvida para o MVP Silver Economy da UNINASSAU Aracaju.

## Tecnologias utilizadas

- Web: React e Vite.
- Mobile: Flutter, Dart, Riverpod e Dio.
- Backend: Java, Spring Boot e Hibernate.
- Banco de dados: PostgreSQL.
- Inteligência artificial: Python, Flask e Scikit-learn.
- Machine Learning: TF-IDF e Regressão Logística.

## Funcionalidades

- Cadastro e login de usuários.
- Verificação de mensagens suspeitas.
- Classificação de risco por inteligência artificial.
- Recomendações de segurança.
- Histórico de análises.
- Guia educativo de prevenção a golpes.

## Como executar o projeto

### 1. Banco de dados

Crie um banco PostgreSQL chamado `golpezero`.

Configure as credenciais locais no arquivo `application.properties` do backend Java.

### 2. Inteligência artificial

```bash
cd golpezero-50plus/ai-service-python
pip install -r requirements.txt
python app.py
```

Serviço disponível na porta 5000.

### 3. Backend Java

Em outro terminal, partindo da raiz do projeto:

```bash
cd golpezero-50plus/backend-java
mvn spring-boot:run
```

API disponível na porta 8080.

Após a criação das tabelas pelo Hibernate, execute o arquivo `golpezero-50plus/database/seed.sql` no banco de dados para cadastrar as categorias e os golpes educativos.

### 4. Aplicação Web

Em outro terminal, partindo da raiz:

```bash
cd frontend
npm install
npm run dev
```

### 5. Aplicação Mobile

Em outro terminal, partindo da raiz:

```bash
cd mobile
flutter pub get
flutter devices
flutter run
```

Para utilizar o emulador Android, a URL da API deve ser:

`http://10.0.2.2:8080/api/v1/`

A configuração está localizada em `mobile/lib/core/config/api_config.dart`.

## Arquitetura

As aplicações Web e Mobile consomem a API REST desenvolvida em Spring Boot. O backend realiza a comunicação com o PostgreSQL e com o serviço preditivo desenvolvido em Python.

## Inteligência artificial

O modelo utiliza processamento de texto com TF-IDF e Regressão Logística para identificar padrões associados a golpes digitais.

As mensagens são classificadas em quatro níveis:

- Seguro.
- Suspeito.
- Alto risco.
- Inconclusivo.

A classificação é uma ferramenta de apoio à prevenção, não uma garantia de identificação de fraudes.

## Contexto acadêmico

Projeto desenvolvido para o MVP Silver Economy do curso de Análise e Desenvolvimento de Sistemas da UNINASSAU Aracaju — 2026.2.