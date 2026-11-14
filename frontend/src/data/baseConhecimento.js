export const GUIAS_EMERGENCIA = [
  {
    id: 'fiz-pix',
    titulo: 'Fiz um Pix para um golpista agora!',
    urgencia: 'URGENTE',
    passos: [
      '1. Ligue IMEDIATAMENTE para o SAC do seu banco (o número está atrás do seu cartão) e diga: "Fui vítima de golpe e quero acionar o MED (Mecanismo Especial de Devolução)".',
      '2. Peça o bloqueio cautelar do valor na conta de destino antes que o golpista saque o dinheiro.',
      '3. Guarde o protocolo de atendimento do banco e o comprovante do Pix.',
      '4. Registre um Boletim de Ocorrência (BO) na Delegacia Virtual do seu estado ou presencialmente e envie o BO para o banco.'
    ]
  },
  {
    id: 'cliquei-link',
    titulo: 'Cliquei em um link estranho no WhatsApp ou SMS',
    urgencia: 'ALTA',
    passos: [
      '1. Feche a página imediatamente e NÃO digite CPF, senha ou código recebido por SMS.',
      '2. Ative o MODO AVIÃO do celular ou desligue o Wi-Fi e os dados móveis por 10 minutos para cortar qualquer conexão externa.',
      '3. Peça a um familiar de confiança para ajudar a trocar a senha do seu aplicativo do banco e do seu e-mail principal usando outro aparelho.',
      '4. Desinstale qualquer aplicativo desconhecido que tenha sido baixado recentemente no celular.'
    ]
  },
  {
    id: 'roubo-celular',
    titulo: 'Perdi ou roubaram meu celular desbloqueado',
    urgencia: 'URGENTE',
    passos: [
      '1. Use o telefone de um familiar e ligue para os seus bancos pedindo o bloqueio imediato do acesso digital e dos cartões.',
      '2. Ligue para a sua operadora (Vivo, Claro, TIM) e peça o bloqueio do chip e do aparelho pelo IMEI.',
      '3. Acesse o site "Encontre Meu Dispositivo" (Google) ou iCloud (Apple) para apagar os dados do aparelho à distância.',
      '4. Avise seus familiares no WhatsApp (por outro número) para não transferirem dinheiro caso alguém peça usando seu nome.'
    ]
  },
  {
    id: 'falso-motoboy',
    titulo: 'Ligaram dizendo que vão buscar meu cartão',
    urgencia: 'ALTA',
    passos: [
      '1. DESLIGUE O TELEFONE NA HORA. Bancos NUNCA mandam motoboy ou portador buscar cartão bloqueado, clonado ou cortado na sua casa.',
      '2. Mesmo que digam para você cortar o cartão ao meio, o chip continua funcionando e o golpista usa para fazer compras.',
      '3. Aguarde 5 minutos e, se quiser tirar dúvida, ligue de outro telefone para o número oficial impresso atrás do seu cartão.'
    ]
  }
];

export const PERGUNTAS_RAPIDAS = [
  {
    categoria: 'WhatsApp & Pix',
    pergunta: 'Pediram um Pix no WhatsApp dizendo ser meu filho ou parente'
  },
  {
    categoria: 'Bancos',
    pergunta: 'Ligaram da central do banco dizendo que há uma compra suspeita'
  },
  {
    categoria: 'INSS',
    pergunta: 'Recebi mensagem pedindo foto ou link para Prova de Vida do INSS'
  },
  {
    categoria: 'Boletos & Compras',
    pergunta: 'Como saber se um boleto, site ou promoção é verdadeiro?'
  },
  {
    categoria: 'WhatsApp Clonado',
    pergunta: 'Pediram um código de 6 dígitos que chegou no meu SMS'
  },
  {
    categoria: 'Empréstimo',
    pergunta: 'Ofereceram empréstimo consignado fácil ou dinheiro esquecido'
  }
];

export function responderAssistenteCompleto(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  if (t.includes('6 dígitos') || t.includes('código') || t.includes('clon') || t.includes('sms')) {
    return {
      titulo: '🛑 GOLPE DO CÓDIGO DE 6 DÍGITOS (CLONAGEM DE WHATSAPP)',
      resposta:
        'NUNCA informe códigos de 6 dígitos recebidos por SMS para ninguém! Esse código é a chave da sua conta do WhatsApp. Golpistas fingem ser de empresas, bancos ou eventos para pedir esse número e roubar seu WhatsApp para pedir dinheiro aos seus contatos.',
      dicaExtra: 'Ative a "Confirmação em Duas Etapas" nas configurações do seu WhatsApp criando um PIN de 6 números que só você sabe.'
    };
  }

  if (t.includes('pix') || t.includes('filho') || t.includes('parente') || t.includes('transfer') || t.includes('novo número')) {
    return {
      titulo: '🛑 GOLPE DO FALSO PARENTE / NOVO NÚMERO',
      resposta:
        'Golpistas pegam a foto do seu filho(a) ou neto(a) nas redes sociais, compram um chip novo e inventam uma emergência ("meu celular quebrou", "preciso pagar uma conta urgente"). NUNCA transfira dinheiro sem antes ligar por voz para o número antigo da pessoa ou fazer uma chamada de vídeo.',
      dicaExtra: 'Combine uma "palavra-senha secreta" com seus familiares para confirmar pedidos reais de ajuda financeira.'
    };
  }

  if (t.includes('banco') || t.includes('central') || t.includes('compra') || t.includes('gerente') || t.includes('cartão') || t.includes('ligação') || t.includes('ligaram')) {
    return {
      titulo: '🏦 GOLPE DA FALSA CENTRAL BANCÁRIA (0800 FALSO)',
      resposta:
        'Mesmo que apareça o número 0800 ou 4004 do banco na tela do seu celular, desligue! Os golpistas usam programas que falsificam o número no visor. Nenhum banco liga pedindo para você fazer um "Pix de estorno", instalar aplicativo de suporte ou digitar senha no teclado.',
      dicaExtra: 'Se quiser confirmar se existe compra suspeita, desligue, espere 5 minutos ou use outro telefone e ligue no número atrás do seu cartão.'
    };
  }

  if (t.includes('inss') || t.includes('prova de vida') || t.includes('aposentadoria') || t.includes('benefício')) {
    return {
      titulo: '📋 ORIENTAÇÃO OFICIAL SOBRE O INSS',
      resposta:
        'O INSS NÃO envia links por WhatsApp, SMS ou e-mail para realizar Prova de Vida e NÃO envia funcionários na sua casa sem agendamento oficial. Hoje a Prova de Vida é feita automaticamente pelo cruzamento de dados do governo (vacinação, votação, atendimento no SUS ou movimentação bancária).',
      dicaExtra: 'Para qualquer consulta, use apenas o aplicativo oficial "Meu INSS" ou ligue gratuitamente no telefone 135.'
    };
  }

  if (t.includes('boleto') || t.includes('site') || t.includes('promoção') || t.includes('loja')) {
    return {
      titulo: '🛒 VERIFICAÇÃO DE BOLETOS E COMPRAS ONLINE',
      resposta:
        '1) Desconfie de preços muito abaixo do mercado em anúncios de redes sociais.\n2) Antes de pagar um boleto ou Pix, olhe na tela do seu banco quem é o "Beneficiário / Recebedor": se você comprou de uma loja, tem que aparecer o CNPJ e o nome da empresa — nunca o nome de uma pessoa física.',
      dicaExtra: 'Prefira comprar em sites conhecidos digitando o endereço direto no navegador, sem clicar em links patrocinados.'
    };
  }

  if (t.includes('empréstimo') || t.includes('consignado') || t.includes('dinheiro esquecido') || t.includes('resgate')) {
    return {
      titulo: '💰 ALERTA DE FALSO EMPRÉSTIMO E VALORES A RECEBER',
      resposta:
        'Nenhuma instituição financeira séria cobra "taxa antecipada", "seguro" ou "depósito de liberação" para liberar empréstimo ou dinheiro esquecido. Além disso, não envie fotos da frente e verso do seu RG/CNH nem faça "selfie" (foto do rosto) por WhatsApp para desconhecidos.',
      dicaExtra: 'Consultas de valores esquecidos são feitas EXCLUSIVAMENTE no site oficial do Banco Central (valoresareceber.bcb.gov.br).'
    };
  }

  if (t.includes('link') || t.includes('cliquei') || t.includes('vírus')) {
    return {
      titulo: '🔒 PASSO A PASSO SE VOCÊ CLICOU EM UM LINK',
      resposta:
        '1) Feche a tela na hora e não preencha nenhum campo.\n2) Coloque o celular no Modo Avião por alguns minutos.\n3) Se você chegou a digitar sua senha do banco, ligue imediatamente para o banco para bloquear o acesso e peça ajuda a um familiar para trocar suas senhas.',
      dicaExtra: 'Use a aba "Emergência Rápida" aqui no Assistente para ver o guia completo.'
    };
  }

  return {
    titulo: '🛡️ ORIENTAÇÃO GERAL DE SEGURANÇA',
    resposta:
      'Recebi sua pergunta! Para proteger seu dinheiro e seus dados, siga sempre os 3 passos de ouro:\n• PARE: Não aja com pressa, mesmo que a mensagem diga "urgente" ou "último dia".\n• DESCONFIE: Bancos, INSS e lojas não pedem senhas, códigos por SMS ou Pix por mensagem.\n• CONFIRME: Ligue você mesmo para o número oficial ou pergunte a um familiar de confiança antes de clicar.',
    dicaExtra: 'Experimente tocar em uma das perguntas prontas ou abrir o "Guia de Emergência" ao lado!'
  };
}

export const POSTS_INICIAIS_COMUNIDADE = [
  {
    id: 101,
    autor: 'Dona Helena (68 anos)',
    cidade: 'Aracaju - SE',
    categoria: 'Golpe do WhatsApp',
    nivelRisco: 'ALTO',
    tempo: 'Hoje, às 14:20',
    titulo: 'Tentaram se passar pelo meu filho usando foto do Instagram',
    texto: 'Pessoal, hoje recebi mensagem de um número novo com a foto do meu filho pedindo R$ 850 no Pix dizendo que o celular dele tinha caído na água. Em vez de responder, liguei para o número antigo dele e ele estava trabalhando normalmente! Fiquem atentos!',
    curtidas: 28,
    curtidoPorMim: false,
    comentarios: [
      {
        id: 1,
        autor: 'Sr. Carlos (71 anos)',
        texto: 'Fez muito bem, Dona Helena! Aconteceu igualzinho comigo semana passada.'
      },
      {
        id: 2,
        autor: 'Equipe GolpeZero 50+',
        texto: 'Excelente atitude! Sempre ligue para o número antigo antes de fazer qualquer transferência.'
      }
    ]
  },
  {
    id: 102,
    autor: 'Sr. Antônio (74 anos)',
    cidade: 'São Cristóvão - SE',
    categoria: 'Falso INSS',
    nivelRisco: 'ALTO',
    tempo: 'Ontem, às 16:45',
    titulo: 'SMS falso sobre bloqueio da aposentadoria por Prova de Vida',
    texto: 'Chegou uma mensagem no meu celular dizendo que meu benefício do INSS seria suspenso hoje se eu não clicasse num link azul para confirmar meus dados. Apaguei a mensagem na hora e conferi pelo telefone 135: meu benefício está normal!',
    curtidas: 42,
    curtidoPorMim: false,
    comentarios: [
      {
        id: 3,
        autor: 'Dona Marta (65 anos)',
        texto: 'Obrigada por avisar! Minha vizinha recebeu essa mesma mensagem hoje cedo.'
      }
    ]
  },
  {
    id: 103,
    autor: 'Mariana Costa (Familiar)',
    cidade: 'Itabaiana - SE',
    categoria: 'Falso Banco / 0800',
    nivelRisco: 'MEDIO',
    tempo: 'Há 2 dias',
    titulo: 'Dica para configurar o WhatsApp dos pais contra clonagem',
    texto: 'Ativei hoje a "Confirmação em Duas Etapas" no WhatsApp da minha mãe e deixei a foto de perfil visível apenas para os contatos salvos na agenda. Isso evita que golpistas peguem a foto dela para aplicar golpes!',
    curtidas: 35,
    curtidoPorMim: false,
    comentarios: []
  }
];