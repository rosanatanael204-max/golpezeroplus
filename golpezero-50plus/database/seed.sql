BEGIN;

-- Cadastro das categorias
INSERT INTO categorias (nome, icone, descricao)
SELECT v.nome, v.icone, v.descricao
FROM (VALUES
    ('WhatsApp', 'chat', 'Golpes por aplicativos de mensagens'),
    ('Bancos', 'account_balance', 'Fraudes bancárias'),
    ('Segurança Digital', 'link', 'Links e mensagens fraudulentas'),
    ('Encomendas', 'local_shipping', 'Fraudes envolvendo entregas'),
    ('Promoções', 'card_giftcard', 'Falsos prêmios e promoções'),
    ('Compras', 'shopping_bag', 'Fraudes em compras pela internet')
) AS v(nome, icone, descricao)
WHERE NOT EXISTS (
    SELECT 1 FROM categorias c WHERE c.nome = v.nome
);

-- Cadastro dos golpes
INSERT INTO golpes (
    titulo, descricao, como_evitar,
    nivel_risco, categoria_id, criado_em
)
SELECT
    v.titulo,
    v.descricao,
    v.como_evitar,
    v.nivel_risco,
    (
        SELECT MIN(c.id)
        FROM categorias c
        WHERE c.nome = v.categoria
    ),
    CURRENT_TIMESTAMP
FROM (VALUES
    (
        'Golpes pelo WhatsApp',
        'Criminosos podem se passar por familiares, amigos ou empresas.',
        'Ligue para o número antigo ou faça uma chamada de voz para confirmar a identidade antes de enviar dinheiro.',
        'ALTO',
        'WhatsApp'
    ),
    (
        'Falsos contatos de bancos',
        'Golpistas fingem ser funcionários do banco para conseguir senhas e informações financeiras.',
        'Não informe senhas ou códigos por telefone. Encerre o contato e procure o banco pelos canais oficiais.',
        'ALTO',
        'Bancos'
    ),
    (
        'Links e mensagens suspeitas',
        'Mensagens podem direcionar para páginas falsas que imitam sites conhecidos.',
        'Não abra links suspeitos. Acesse o site da empresa digitando o endereço oficial diretamente no navegador.',
        'ALTO',
        'Segurança Digital'
    ),
    (
        'Falsas encomendas',
        'Criminosos enviam mensagens sobre encomendas retidas ou taxas que precisam ser pagas.',
        'Consulte o rastreamento diretamente no site ou aplicativo oficial da transportadora ou dos Correios.',
        'MEDIO',
        'Encomendas'
    ),
    (
        'Falsos prêmios e promoções',
        'Mensagens informam que você ganhou um prêmio, mas exigem pagamentos ou dados pessoais para recebê-lo.',
        'Desconfie de prêmios inesperados. Verifique a promoção nos canais oficiais da empresa e não pague taxas sem confirmar sua legitimidade.',
        'MEDIO',
        'Promoções'
    ),
    (
        'Falsas lojas virtuais',
        'Páginas falsas oferecem produtos por preços muito abaixo do mercado para receber pagamentos sem entregar a compra.',
        'Pesquise a reputação da loja, confira os dados da empresa e evite comprar por links recebidos de desconhecidos.',
        'ALTO',
        'Compras'
    )
) AS v(titulo, descricao, como_evitar, nivel_risco, categoria)
WHERE NOT EXISTS (
    SELECT 1 FROM golpes g WHERE g.titulo = v.titulo
);

COMMIT;