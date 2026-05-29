import { useState, useEffect, useRef, useCallback } from "react";

// ─── TOKENS ──────────────────────────────────────────────────
const BG      = "#080E18";
const SURFACE = "#0F1825";
const CARD    = "#131E2E";
const BORDER  = "rgba(255,255,255,0.06)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.4)";
const DIM     = "rgba(255,255,255,0.12)";

// ─── AUDIO URLs (Google Drive) ───────────────────────────────
const BASE = "https://cdwrsxodibacsxialahw.supabase.co/storage/v1/object/public/audios";
const DRIVE_AUDIO = {
  intro:       `${BASE}/Intro.mp3`,
  manifiesto:  `${BASE}/Manifiesto.mp3`,
  transicion:  `${BASE}/Transicion Modulos a Motor IA.mp3`,
  1:  `${BASE}/Modulo 1.mp3`,
  2:  `${BASE}/Modulo 2.mp3`,
  3:  null,
  4:  `${BASE}/Modulo 4.mp3`,
  5:  `${BASE}/Modulo 5.mp3`,
  6:  `${BASE}/Modulo 6.mp3`,
  7:  `${BASE}/Modulo 7.mp3`,
  8:  `${BASE}/Modulo 8.mp3`,
  9:  `${BASE}/Modulo 9.mp3`,
  10: `${BASE}/Modulo 10.mp3`,
  11: `${BASE}/Modulo 11.mp3`,
  12: `${BASE}/Modulo 12.mp3`,
  13: `${BASE}/Modulo 13.mp3`,
  14: `${BASE}/Modulo 14.mp3`,
  15: `${BASE}/Modulo 15.mp3`,
  16: `${BASE}/Modulo 16.mp3`,
  17: `${BASE}/Modulo 17.mp3`,
  18: `${BASE}/Modulo 18.mp3`,
};

// ─── DATA ─────────────────────────────────────────────────────
const PILLARS = [
  { id:1, num:"I",   name:"Cuerpo",               subtitle:"La base biológica de todo lo demás",       color:"#7ECBA1", emoji:"🌿", modules:[1,2,3,4,5,6] },
  { id:2, num:"II",  name:"Mente",                 subtitle:"Entrenamiento mental y fortaleza",         color:"#A78BD4", emoji:"🧠", modules:[7,8,9,10] },
  { id:3, num:"III", name:"Conciencia",             subtitle:"Presencia, asombro y percepción",         color:"#6BA8D4", emoji:"✨", modules:[11,12] },
  { id:4, num:"IV",  name:"Equilibrio",             subtitle:"Las dimensiones de una vida completa",   color:"#C4A882", emoji:"⚖️", modules:[13,14,15] },
  { id:5, num:"V",   name:"Relaciones y propósito", subtitle:"Conectar desde la plenitud",             color:"#A8C49A", emoji:"🌱", modules:[16,17,18] },
];

const MODULES = {
  1:  { title:"Dormir bien para vivir mejor",             accent:"#7ECBA1", time:"10 min", tags:["Sueño","Huberman","Cortisol"] },
  2:  { title:"Luz natural, movimiento y cafeína",        accent:"#7ECBA1", time:"8 min",  tags:["Mañana","Adenosina","Ritmo"] },
  3:  { title:"Elongación matutina consciente",           accent:"#7ECBA1", time:"9 min",  tags:["Cuerpo","Tensión","Práctica"] },
  4:  { title:"Alimentación consciente",                  accent:"#7ECBA1", time:"10 min", tags:["Microbiota","Inflamación","Energía"] },
  5:  { title:"Entrenar el cerebro como un músculo",      accent:"#7ECBA1", time:"10 min", tags:["Neuroplasticidad","Hábitos"] },
  6:  { title:"Meditación — el observador",               accent:"#7ECBA1", time:"9 min",  tags:["Atención","Sam Harris","Presencia"] },
  7:  { title:"El filtro estoico",                        accent:"#A78BD4", time:"11 min", tags:["Epicteto","Reencuadre","Control"] },
  8:  { title:"Visualización negativa y gratitud activa", accent:"#D4A574", time:"10 min", tags:["Premeditatio","Gap","Irvine"] },
  9:  { title:"El sistema inmune mental",                 accent:"#E07B6A", time:"11 min", tags:["Séneca","Resiliencia","Incomodidad"] },
  10: { title:"Anti-victimización y responsabilidad",     accent:"#7ECBA1", time:"10 min", tags:["Epicteto","Tikkún","Fracaso"] },
  11: { title:"Asombro, delight y capacidad de asombro",      accent:"#6BA8D4", time:"9 min",  tags:["Irvine","Naturaleza","Delight"] },
  12: { title:"Vivir el presente — la última vez",        accent:"#9B8EC4", time:"8 min",  tags:["Impermanencia","Irvine","Piloto auto"] },
  13: { title:"El mapa de equilibrio — 7 dimensiones",   accent:"#C4A882", time:"10 min", tags:["Sabán","Árbol de vida","Chequeo"] },
  14: { title:"Materia, generosidad y límites",           accent:"#B8956A", time:"9 min",  tags:["Séneca","Límites","Generosidad"] },
  15: { title:"Profundidad y ligereza",                   accent:"#82A8C4", time:"8 min",  tags:["Sabán","Equilibrio","Ligereza"] },
  16: { title:"Estar bien con uno para estar bien",       accent:"#A8C49A", time:"10 min", tags:["Soledad","Dependencia","Diálogo"] },
  17: { title:"Relaciones de equilibrio — crecer juntos", accent:"#8FC4B4", time:"9 min",  tags:["Vínculos","Límites","Conversación"] },
  18: { title:"Propósito — el alma del sistema",          accent:"#C4A8D4", time:"11 min", tags:["Frankl","Tikkún","Manifiesto"] },
};

// Inline module content — condensed per module
const MODULE_CONTENT = {
  1: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Dormir bien para vivir mejor",
    body: [
      { type: "p", text: "Hay una pregunta que se hacen pocas personas antes de empezar a trabajar en su bienestar: ¿estoy durmiendo bien?" },
      { type: "p", text: "No \"¿estoy durmiendo suficiente?\" — esa también importa — sino algo más preciso: ¿la calidad de mi sueño está siendo la que mi cuerpo y mi mente necesitan para funcionar de verdad?" },
      { type: "p", text: "El sueño no es el tiempo que no estás despierto. Es el momento en que el cuerpo se repara, el cerebro consolida lo que aprendiste, el sistema inmune trabaja, las hormonas se regulan y el estado emocional del día siguiente se configura. Sin eso, todo lo demás — la alimentación, el ejercicio, la meditación, el trabajo mental — pierde efectividad." },
      { type: "quote", text: "El sueño es la base invisible del sistema. Si esta base no está, construís sobre arena." },
      { type: "p", text: "Este módulo no es sobre \"dormir más\". Es sobre entender qué pasa en tu cuerpo mientras dormís, por qué ciertas cosas lo mejoran radicalmente y cómo construir el entorno y los hábitos para que el sueño deje de ser algo que te pasa — y se convierta en algo que elegís." },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA",
    title: "Tu cuerpo tiene un reloj interno — y podés calibrarlo",
    body: [
      { type: "p", text: "Dentro de tu cerebro existe una estructura llamada núcleo supraquiasmático. Es el reloj central de tu biología. Regula cuándo sentís sueño, cuándo estás más alerta, cuándo tu cuerpo quema energía, cuándo produce hormonas. Todo." },
      { type: "p", text: "Este reloj funciona en ciclos de aproximadamente 24 horas — lo que la ciencia llama ritmo circadiano. Y la clave es que no es automático: necesita señales externas para calibrarse bien. La señal más poderosa de todas es la luz." },
      { type: "subtitle", text: "Luz solar y cortisol: el arranque del día" },
      { type: "p", text: "Cuando la luz natural entra por tus ojos en las primeras horas de la mañana, activa células especiales de la retina que le mandan una señal directa al reloj interno. Esa señal dispara un pico natural de cortisol." },
      { type: "p", text: "El cortisol tiene mala prensa porque se lo asocia con el estrés crónico. Pero el cortisol matutino es completamente diferente — es el mecanismo de arranque del cuerpo. Te activa, te enfoca, prepara tu sistema inmune. Y lo más importante para el sueño: esa señal de luz de la mañana programa cuándo tu cerebro va a liberar melatonina esa noche — exactamente 14 a 16 horas después." },
      { type: "quote", text: "La forma de dormir bien de noche empieza con lo que hacés en los primeros 30 minutos de la mañana." },
      { type: "subtitle", text: "Adenosina: la presión del sueño" },
      { type: "p", text: "Mientras estás despierto, tu cerebro va acumulando una molécula llamada adenosina. Cuanto más tiempo pasás despierto, más adenosina acumulás — y más presión sentís para dormir. Esa sensación de cansancio al final del día es, literalmente, adenosina acumulada." },
      { type: "p", text: "Cuando dormís, el cerebro la limpia. Por eso después de una buena noche te levantás \"reseteado\". Y por eso la cafeína funciona: no te da energía — bloquea los receptores de adenosina temporalmente. El problema es que la adenosina sigue ahí, esperando. Cuando el café se va, te cae todo junto: el famoso crash de la tarde." },
      { type: "tip", label: "La solución", text: "Esperá 90 a 120 minutos antes del primer café. Dejá que la adenosina residual se limpie naturalmente con la luz y el movimiento. El resultado: la cafeína amplifica tu alerta en lugar de simplemente tapar el cansancio. Y el crash de la tarde, en gran parte, desaparece." },
    ]
  },
  {
    id: "importa",
    label: "POR QUÉ IMPORTA",
    title: "Lo que pasa mientras dormís",
    body: [
      { type: "p", text: "Durante el sueño, el cerebro activa el sistema glinfático: una red de canales que literalmente lava el tejido cerebral y elimina desechos metabólicos. Una limpieza que solo sucede mientras dormís profundo." },
      { type: "p", text: "Al mismo tiempo, el hipocampo transfiere lo que aprendiste durante el día a la memoria de largo plazo. Las emociones se procesan y regulan. La hormona de crecimiento se libera en los primeros ciclos de sueño profundo. El sistema inmune produce citocinas. La sensibilidad a la insulina se restaura." },
      { type: "p", text: "Mientras dormís, tu cuerpo no está en pausa. Está haciendo el trabajo que no puede hacer mientras estás activo." },
      { type: "attributed", text: "Cuando dormís menos de lo que necesitás, no solo estás cansado. Estás literalmente tomando decisiones peores, regulando peor tus emociones y envejeciendo más rápido.", author: "Dr. Matthew Walker, Why We Sleep" },
      { type: "p", text: "La privación de sueño acumulada — incluso una hora menos por noche durante semanas — tiene efectos que la ciencia equipara al alcohol en términos de deterioro cognitivo. El problema: cuando estamos privados de sueño, perdemos la capacidad de percibir cuánto nos afectó." },
      { type: "quote", text: "No podés hackear el sueño. Podés optimizarlo. Pero no existe sustituto para las horas de reparación que el cuerpo necesita." },
    ]
  },
  {
    id: "protocolo",
    label: "PROTOCOLO",
    title: "Cómo construir un buen sueño",
    body: [
      { type: "p", text: "No hace falta hacer todo a la vez. Empezá con lo más impactante y sumá capas." },
      { type: "block", label: "En la mañana — calibrá el reloj", items: [
        { arrow: true, bold: "Luz natural:", text: " Salí afuera en los primeros 30–60 minutos del día. Con días nublados también funciona — solo necesitás más tiempo (15–20 min). Sin anteojos de sol en ese momento." },
        { arrow: true, bold: "Delay de cafeína:", text: " Esperá 90 minutos antes del primer café o mate. Usá ese tiempo para hidratarte y moverte." },
        { arrow: true, bold: "Movimiento:", text: " Aunque sea una caminata de 10 minutos. El movimiento matutino acelera la limpieza de adenosina y activa el cortisol de forma natural." },
      ]},
      { type: "block", label: "Durante el día — cuidá la consistencia", items: [
        { arrow: true, bold: "Horario regular:", text: " Levantarte a la misma hora todos los días — incluyendo fines de semana — es la palanca más subestimada del buen sueño." },
        { arrow: true, bold: "Ejercicio:", text: " Idealmente a la mañana o al mediodía. El ejercicio intenso en las últimas 3 horas antes de dormir puede retrasar el inicio del sueño." },
        { arrow: true, bold: "Comida:", text: " Cenar liviano y al menos 2–3 horas antes de acostarte. La digestión activa compite con el sueño profundo." },
      ]},
      { type: "block", label: "En la noche — preparar el descenso", items: [
        { arrow: true, bold: "Luz tenue:", text: " Diminar las luces del hogar después del anochecer. Evitar pantallas brillantes 60 minutos antes de dormir." },
        { arrow: true, bold: "Temperatura:", text: " El cuerpo necesita bajar su temperatura para entrar en sueño profundo. Dormí en una habitación fresca (18–20°C si es posible)." },
        { arrow: true, bold: "Ritual de apagado:", text: " Crear una rutina de 30–60 minutos que le avise al sistema nervioso que es hora de bajar: leer, estirarte, escribir, ducharte." },
        { arrow: true, bold: "Oscuridad total:", text: " Las persianas o antifaz hacen una diferencia real. Cualquier luz durante la noche puede interrumpir la producción de melatonina." },
      ]},
      { type: "quote", text: "Mejorar el sueño no requiere hacer todo perfecto. Requiere hacer algo consistente. El cuerpo responde a la repetición." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "p", text: "Tomá unos minutos con estas preguntas. No hace falta tener respuestas perfectas — el valor está en el proceso de observación:" },
      { type: "checks", items: [
        "¿A qué hora me duermo y me despierto habitualmente? ¿Hay consistencia o varía mucho?",
        "¿Cómo me siento en los primeros 30 minutos del día? ¿Descansado, pesado, neutro?",
        "¿Qué hago en la hora antes de dormir? ¿Eso me ayuda o me activa?",
        "¿Cuánto tiempo paso en pantallas antes de acostarme?",
        "¿Hay algo en mi entorno de sueño que sé que lo perjudica y todavía no cambié?",
      ]},
      { type: "p", text: "No se trata de juzgarte. Se trata de observar con curiosidad. Lo que no medís, no podés mejorar." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Hay una pregunta que pocas personas se hacen antes de trabajar en su bienestar. ¿Estoy durmiendo bien?\n\nNo «¿suficiente?» — esa también importa — sino algo más preciso. ¿La calidad de mi sueño está siendo la que mi cuerpo necesita para funcionar de verdad?\n\nEl sueño no es el tiempo que no estás despierto. Es el momento en que tu cuerpo se repara. Tu cerebro consolida lo que aprendiste. Tu sistema inmune trabaja. Y el estado emocional del día siguiente... se configura ahí.\n\nSi esta base no está bien, todo lo demás pierde efectividad." },
  { time: "1:30 – 4:30", title: "La ciencia", text: "Dentro de tu cerebro existe el reloj interno de tu cuerpo. Regula cuándo sentís sueño, cuándo estás más alerta, cuándo producís cada hormona. Y este reloj necesita calibrarse. La señal más poderosa es la luz natural.\n\nCuando salís afuera en los primeros 60 minutos del día — dispara un pico de cortisol matutino. El mecanismo de arranque de tu cuerpo. Y programa cuándo tu cerebro va a liberar melatonina esa noche. Exactamente 14 a 16 horas después.\n\nMientras estás despierto, tu cerebro acumula adenosina. Cuanto más tiempo pasás despierto, más tenés. Cuando dormís, el cerebro la limpia. Por eso después de una buena noche te levantás reseteado.\n\nY la cafeína: no te da energía — bloquea los receptores de adenosina. La adenosina sigue ahí. Cuando el café se va, te cae todo junto. El crash de la tarde.\n\nLa solución: esperá 90 minutos antes del primer café. Dejá que la adenosina se limpie sola." },
  { time: "4:30 – 7:00", title: "Por qué importa", text: "Mientras dormís, tu cerebro activa un sistema de limpieza que elimina desechos del tejido cerebral. Cosas que no puede sacar mientras estás activo. Al mismo tiempo, consolida la memoria, procesa emociones, libera hormona de crecimiento, produce defensas.\n\nNo podés hackear el sueño. Podés optimizarlo. Pero no existe sustituto para las horas de reparación que tu cuerpo necesita.\n\nY la privación acumulada — incluso una hora menos por noche durante semanas — tiene efectos que la ciencia equipara al alcohol. El problema: cuando estamos privados de sueño, perdemos la capacidad de percibir cuánto nos afectó." },
  { time: "7:00 – 10:00", title: "El protocolo", text: "No hace falta cambiar todo a la vez. Empezá con tres cosas.\n\nPrimera: salí afuera en los primeros 60 minutos del día. Sin anteojos de sol. Aunque haya nubes.\n\nSegunda: esperá 90 minutos antes del primer café o mate. Hidratate, movete, dejá que la adenosina se limpie sola.\n\nTercera: construí un ritual de apagado de 30 a 60 minutos antes de dormir. Luz tenue, sin pantallas brillantes, temperatura fresca en el cuarto. Avisale a tu sistema nervioso que es hora de bajar.\n\nEl cuerpo responde a la consistencia. No necesitás hacerlo perfecto — necesitás hacerlo repetido." },
  { time: "10:00 – 11:00", title: "Cierre", text: "Hay algo que cambia cuando el sueño deja de ser lo primero que sacrificás cuando estás ocupado — y se convierte en la primera inversión que protegés.\n\nCuando dormís bien, todo lo demás funciona mejor. Pensás con más claridad. Regulás mejor lo que sentís. Tenés más energía para lo que elegís hacer.\n\nEso es lo que trabajamos en este primer módulo. La base invisible de todo lo demás.\n\nEn el próximo módulo seguimos: las primeras horas del día, el movimiento y la cafeína estratégica. Todo conectado." },
],
  },

  2: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Las primeras horas del día lo determinan todo",
    body: [
      { type: "p", text: "Si el Módulo 01 instaló la idea de que el sueño es la base invisible del sistema, este módulo trabaja el puente entre el sueño y el resto del día: lo que hacés en las primeras dos horas después de despertarte." },
      { type: "p", text: "No es exageración decir que esas dos horas son las más importantes de las 24. No porque sean mágicas, sino porque son el momento en que tu cuerpo toma sus señales principales para calibrar el día entero: cuándo vas a tener pico de energía, cuándo vas a bajar, cómo vas a procesar el estrés, cuándo vas a querer dormir esa noche." },
      { type: "quote", text: "Las primeras horas del día no son el comienzo de tu jornada. Son la programación de todo lo que viene después." },
      { type: "p", text: "En este módulo trabajamos tres palancas concretas — luz natural, movimiento y cafeína — que usadas con intención transforman la calidad del día de una forma que la mayoría de la gente nunca experimenta porque nadie les explicó la biología detrás." },
    ]
  },
  {
    id: "luz",
    label: "PALANCA 1",
    title: "La luz natural: el interruptor maestro",
    body: [
      { type: "p", text: "La retina tiene un tipo de células — las células ganglionares fotosensibles — que son especialmente sensibles a la luz de ángulo bajo del amanecer: esa mezcla particular de tonos azules y amarillos que aparece cuando el sol está cerca del horizonte." },
      { type: "p", text: "Cuando esa luz entra por tus ojos, le dice a tu cerebro con absoluta claridad: es de mañana, es hora de activarse. Esa señal dispara cortisol, suprime melatonina residual y pone en marcha los sistemas de alerta, concentración e inmunidad." },
      { type: "block", label: "¿Cuánto tiempo y cómo?", items: [
        { arrow: true, bold: "Tiempo:", text: " 10 a 20 minutos en días soleados. 20 a 30 en días nublados. El exterior sigue siendo 10 a 50 veces más luminoso que cualquier ambiente interior." },
        { arrow: true, bold: "Sin anteojos de sol:", text: " filtran exactamente el tipo de luz que necesitás. Los lentes de contacto y los anteojos de aumento son okay." },
        { arrow: true, bold: "Sin vidrio de por medio:", text: " la luz a través de una ventana pierde la mayor parte de su potencia. Tenés que estar afuera." },
        { arrow: true, bold: "Cuándo:", text: " dentro de los primeros 30 a 60 minutos de despertar. No hace falta mirar el sol — alcanza con estar afuera con los ojos abiertos hacia el cielo." },
      ]},
      { type: "tip", label: "Truco práctico", text: "Combiná la exposición a la luz con algo que ya hacés. Tomar agua afuera, caminar hasta el kiosco, sacar al perro, sentarte con el mate en el balcón. No hace falta agregar 20 minutos extra — alcanza con mover algo que ya hacías hacia afuera." },
      { type: "quote", text: "Ver la luz del amanecer es literalmente el acto más poderoso que podés hacer por tu sueño de esta noche — y por tu energía de hoy." },
    ]
  },
  {
    id: "movimiento",
    label: "PALANCA 2",
    title: "El movimiento matutino: activar el sistema",
    body: [
      { type: "p", text: "El movimiento en las primeras horas del día tiene efectos que van mucho más allá de la condición física. A nivel neurológico, el ejercicio matutino — incluso moderado — dispara dopamina, norepinefrina y serotonina: los neurotransmisores del foco, la motivación y el estado de ánimo." },
      { type: "p", text: "Huberman explica que entrenar dentro de las primeras 3 horas después de despertar capitaliza el ambiente neuroquímico natural de la mañana — cortisol y adrenalina elevados — que ya de por sí predisponen al cuerpo para el esfuerzo. En vez de pelear contra la biología, trabajás con ella." },
      { type: "subtitle", text: "El flujo óptico y la caminata consciente" },
      { type: "p", text: "Cuando caminás, el campo visual se desplaza de forma continua y suave. Ese movimiento del entorno activa el sistema de procesamiento visual del cerebro de una manera que reduce activamente la actividad de la amígdala — el centro del miedo y la ansiedad." },
      { type: "p", text: "En términos simples: caminar afuera en la mañana, aunque sea 10 o 15 minutos, tiene un efecto ansiolítico real. No es una metáfora ni bienestar genérico. Es neuroquímica." },
      { type: "block", label: "¿Qué tipo de movimiento?", items: [
        { arrow: true, bold: "Mínimo efectivo:", text: " una caminata de 10 a 15 minutos afuera ya activa todos los beneficios circadianos y neuroquímicos." },
        { arrow: true, bold: "Óptimo:", text: " ejercicio de mayor intensidad — fuerza, cardio — idealmente en la primera mitad del día." },
        { arrow: true, bold: "A evitar:", text: " ejercicio intenso en las últimas 2 a 3 horas antes de dormir. Eleva la temperatura corporal y retrasa el inicio del sueño profundo." },
      ]},
      { type: "quote", text: "No necesitás una hora en el gimnasio para activar el sistema. Necesitás moverte afuera en la mañana. El resto es optimización." },
    ]
  },
  {
    id: "cafeina",
    label: "PALANCA 3",
    title: "La cafeína estratégica: amplificar, no tapar",
    body: [
      { type: "p", text: "La cafeína es la droga psicoactiva más consumida del mundo. Y la mayoría de la gente la usa mal — no porque sean descuidados, sino porque nadie les explicó cómo funciona." },
      { type: "p", text: "La cafeína no te da energía. Bloquea los receptores de adenosina en el cerebro. Al bloquear sus receptores, enmascara esa señal temporalmente. Cuando el efecto se va — después de 4 a 6 horas — toda la adenosina acumulada te cae de golpe. Eso es el crash de la tarde." },
      { type: "subtitle", text: "El delay de 90 minutos: por qué cambia todo" },
      { type: "p", text: "Durante los primeros 60 a 90 minutos después de despertar, tu cuerpo tiene un pico natural de cortisol. Si tomás cafeína en ese momento, estás añadiendo un estimulante artificial encima de un estímulo natural que ya está trabajando. El resultado no es mejor energía — es tolerancia más rápida y el crash inevitable después." },
      { type: "p", text: "Si en cambio esperás 90 minutos, dos cosas pasan: el cortisol natural llega a su pico y empieza a bajar, y la adenosina residual del sueño se limpia gracias a la luz y el movimiento. Cuando tomás el café en ese momento, la cafeína amplifica un estado de alerta que ya existe." },
      { type: "quote", text: "El café tomado 90 minutos después de despertar es cualitativamente diferente al café tomado apenas te levantás. No es lo mismo enmascarar que amplificar." },
      { type: "block", label: "Cuándo parar", items: [
        { arrow: true, bold: "Regla práctica:", text: " última ingesta de cafeína antes del mediodía. Si querés ser más preciso, contá 10 horas hacia atrás desde tu hora de dormir." },
        { arrow: true, bold: "El mate:", text: " contiene cafeína más teobromina, con una curva de absorción más suave. Pero las mismas reglas aplican en cuanto al horario." },
        { arrow: true, bold: "La meta:", text: " no eliminar el café sino usarlo como una herramienta con intención, no como un reflejo automático al despertar." },
      ]},
    ]
  },
  {
    id: "secuencia",
    label: "PROTOCOLO",
    title: "La mañana ideal — paso a paso",
    body: [
      { type: "p", text: "Lo que hace poderosa a esta rutina no es cada elemento por separado — es la secuencia. Cuando los tres actúan juntos en las primeras horas del día, se potencian." },
      { type: "block", label: "La secuencia completa", items: [
        { arrow: true, bold: "Al despertar:", text: " tomá agua. Hidratarte antes del café marca diferencia — dormiste horas sin líquido." },
        { arrow: true, bold: "Primeros 30–60 min:", text: " salí afuera. Aunque sea 10 minutos. Sin anteojos de sol. Combinalo con algo que ya hacés." },
        { arrow: true, bold: "Movimiento:", text: " si podés, algún tipo de ejercicio en la primera mitad del día. Si no, la caminata ya cuenta." },
        { arrow: true, bold: "Minuto 90:", text: " recién ahí, el primer café o mate. Notá la diferencia en cómo actúa." },
        { arrow: true, bold: "Mediodía:", text: " última cafeína del día. Después, agua, infusiones sin cafeína, lo que quieras." },
      ]},
      { type: "attributed", text: "La rutina matutina no es un ritual de productividad. Es una conversación con tu biología. Cuanto mejor la entendés, mejor te responde.", author: "hapi" },
      { type: "quote", text: "Una semana de esto consistente y vas a notar la diferencia. No porque sea un truco — sino porque estás trabajando con tu biología en lugar de contra ella." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "p", text: "Después de leer o escuchar este módulo, tomaté un momento:" },
      { type: "checks", items: [
        "¿A qué hora tomo el primer café o mate habitualmente? ¿Cuántos minutos después de despertar?",
        "¿Cuándo fue la última vez que salí afuera en los primeros 30 minutos del día?",
        "¿Tengo un crash de energía a media mañana o a media tarde? ¿A qué hora suele ser?",
        "¿Mi movimiento matutino es algo que ocurre o algo que elijo?",
        "¿Qué sería lo más fácil de implementar primero — la luz, el movimiento o el delay de cafeína?",
      ]},
      { type: "p", text: "El objetivo no es hacer todo a la vez. Es instalar una conciencia sobre algo que antes era automático. Esa conciencia ya es un cambio." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:00", title: "Intro", text: "En el módulo anterior hablamos del sueño como la base invisible del sistema.\n\nEste módulo trabaja lo que viene después: las primeras dos horas del día.\n\nNo es exageración decir que esas dos horas son las más importantes de las 24. No porque sean mágicas — sino porque son el momento en que tu cuerpo toma sus señales para calibrar todo lo que viene: cuándo vas a tener energía, cuándo vas a bajar, cómo vas a procesar el estrés.\n\nTres palancas. Luz natural, movimiento y cafeína. Simples. Accesibles. Transformadoras cuando las entendés bien." },
  { time: "1:00 – 3:30", title: "Palanca 1 — La luz", text: "Tu retina tiene células especiales que son sensibles a la luz de la mañana. Esa luz de ángulo bajo del amanecer, esa mezcla de azules y amarillos que existe cuando el sol está cerca del horizonte.\n\nCuando esa luz entra por tus ojos, le dice a tu cerebro con absoluta claridad: es de mañana. Hora de activarse.\n\nEsa señal dispara cortisol, suprime la melatonina residual... y programa cuándo tu cerebro va a liberar melatonina esa noche. 14 a 16 horas después.\n\nDiez a veinte minutos afuera, sin anteojos de sol, en los primeros 60 minutos del día. Sin vidrio de por medio — la ventana filtra demasiado. Afuera.\n\nY lo más importante: no hace falta agregar tiempo extra. Mové hacia afuera algo que ya hacías. El mate, el agua, una caminata corta." },
  { time: "3:30 – 6:00", title: "Palanca 2 — El movimiento", text: "El movimiento matutino activa dopamina, norepinefrina y serotonina. Los neurotransmisores del foco, la motivación y el estado de ánimo. No en dos semanas — esa mañana.\n\nHay algo específico en la caminata al aire libre que merece atención: el flujo óptico. Cuando caminás, el campo visual se desplaza de forma continua. Ese movimiento del entorno reduce activamente la actividad de la amígdala — el centro del miedo y la ansiedad.\n\nEn términos simples: caminar afuera en la mañana, aunque sean 15 minutos, tiene un efecto ansiolítico real. Es neuroquímica, no bienestar genérico.\n\nNo necesitás una hora en el gimnasio. Necesitás moverte afuera. El resto es optimización." },
  { time: "6:00 – 8:30", title: "Palanca 3 — La cafeína", text: "La cafeína no te da energía. Bloquea los receptores de adenosina — la molécula que te da sueño. Temporalmente.\n\nCuando el efecto se va, toda la adenosina que se acumuló te cae de golpe. Eso es el crash de la tarde. No es que el café dejó de funcionar. Es que la deuda se cobró con intereses.\n\nSi en cambio esperás 90 minutos después de despertar — dejás que el cortisol natural llegue a su pico, que la adenosina se limpie con la luz y el movimiento — y recién ahí tomás el café... la cafeína amplifica un estado de alerta que ya existe.\n\nNo es lo mismo enmascarar que amplificar.\n\nY el horario de corte: la cafeína tiene una vida media de 5 a 7 horas. Si tomás café a las 2 de la tarde, la mitad sigue activa a las 8 de la noche. Última cafeína antes del mediodía." },
  { time: "8:30 – 10:00", title: "Los tres juntos", text: "Lo que hace poderosa a esta rutina no es cada elemento por separado. Es la secuencia.\n\nLuz natural calibra el reloj y dispara el cortisol. Movimiento amplifica ese estado y libera los neurotransmisores del foco. La cafeína tardía llega cuando el sistema ya está listo — y amplifica en vez de tapar.\n\nUna semana consistente y vas a notar la diferencia. No porque sea un truco. Porque estás trabajando con tu biología, no contra ella." },
  { time: "10:00 – 11:00", title: "Cierre", text: "Empezá con una sola cosa. La que te parezca más accesible.\n\n¿La luz? Mañana, antes del primer café, salí cinco minutos afuera.\n\n¿El movimiento? Una caminata corta, antes de que el día te absorba.\n\n¿La cafeína? Esperá 90 minutos. Solo un día. Observá cómo actúa diferente.\n\nLas primeras horas del día no son el comienzo de tu jornada. Son la programación de todo lo que viene después.\n\nEn el próximo módulo seguimos construyendo: elongación matutina consciente, el cuerpo como espejo de la mente." },
],
  },

  3: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Liberar el cuerpo antes de que el día lo tense",
    body: [
      { type: "p", text: "Hay una práctica que cuesta casi nada, no requiere salir de la cama, y sin embargo transforma la calidad de las horas que siguen. No es meditación, aunque puede ser meditativa. No es ejercicio, aunque prepara el cuerpo para el movimiento. Es algo más simple y más antiguo: elongar con conciencia." },
      { type: "p", text: "La mayoría de las personas se levantan directamente. Alarma, pantalla, café. El cuerpo pasó 7 u 8 horas relativamente inmóvil, en posiciones que acortan ciertos músculos y comprimen ciertas articulaciones. Y sin transición, lo exponemos al peso del día." },
      { type: "p", text: "El resultado se acumula. Contracturas que no empiezan con un esfuerzo físico sino con años de tensión no liberada. Dolores de cuello y espalda que no tienen origen en el gimnasio sino en el estrés mental que el cuerpo va guardando, capa por capa, sin que nadie lo vacíe." },
      { type: "quote", text: "El cuerpo es el primer lugar donde el estrés se instala. Y la elongación consciente es la forma más accesible de interrumpir ese proceso antes de que empiece." },
      { type: "p", text: "Este módulo propone algo diferente: usar los primeros minutos del día — incluso antes de levantarte — para hacer la transición con conciencia. Elongar, respirar, agradecer. Preparar el cuerpo y la mente juntos para lo que viene." },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA",
    title: "Por qué el cuerpo guarda el estrés",
    body: [
      { type: "p", text: "El sistema nervioso autónomo tiene dos modos principales: simpático (alerta, acción, estrés) y parasimpático (calma, recuperación, digestión). En el mundo moderno, la mayoría de las personas pasan demasiado tiempo en modo simpático — y el cuerpo lo acusa." },
      { type: "p", text: "Cuando el sistema nervioso está en alerta, los músculos se contraen ligeramente de forma crónica, especialmente los del cuello, hombros, trapecios y zona lumbar. Con el tiempo, esa contracción sostenida crea adherencias en la fascia — el tejido conectivo que rodea cada músculo — y eso se vuelve rigidez, dolor, y eventualmente contractura." },
      { type: "tip", label: "El mecanismo", text: "Estirar un músculo de forma lenta y sostenida activa los receptores de Golgi en los tendones, que mandan una señal al sistema nervioso para relajar la contracción. La respiración profunda durante la elongación activa el nervio vago — el principal canal del sistema parasimpático. Cada exhalación larga es una señal directa de calma al cerebro." },
      { type: "quote", text: "Elongar es hablarle al sistema nervioso en su propio idioma. La respuesta es relajación real — no imaginada." },
      { type: "subtitle", text: "El cuello y la espalda: las zonas más críticas" },
      { type: "p", text: "El cuello sostiene el peso de la cabeza — entre 4 y 6 kilos — durante horas de trabajo, pantallas y posiciones que no fueron diseñadas para nuestra anatomía. La espalda, especialmente la zona dorsal y lumbar, concentra una cantidad enorme de tensión postural y emocional que raramente se libera." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Elongación consciente: en la cama, al despertar",
    body: [
      { type: "p", text: "Antes de levantarte, usá 10 a 15 minutos para hacer la transición con el cuerpo. La cama es el lugar perfecto para empezar — la superficie suave permite elongaciones profundas sin impacto." },
      { type: "p", text: "Cada movimiento se hace lento, sin forzar, con respiración consciente. Mientras elongás, observás. Cómo está tu cuerpo hoy, dónde sentís tensión, qué necesita más tiempo." },
      { type: "tip", label: "El agregado que transforma la práctica", text: "Mientras elongás, agradecés. No tiene que ser formal ni elaborado — alcanza con traer a la conciencia tres cosas simples y reales por las que estás agradecido. La gratitud en el cuerpo, mientras se libera, conecta el Pilar I y el Pilar III de hapi en un solo movimiento." },
      { type: "quote", text: "Elongar y agradecer al mismo tiempo no es un truco motivacional. Es instalar dos prácticas fundamentales en el momento del día donde el cerebro está más receptivo: justo al despertar, antes del ruido." },
    ]
  },
  {
    id: "rutina",
    label: "LA RUTINA",
    title: "Secuencia completa — 10 a 15 minutos",
    body: [
      { type: "p", text: "Hacé cada movimiento lento, sin rebote, sosteniendo la posición entre 30 y 60 segundos. Inhalá para preparar, exhalá para profundizar. Si algo duele (no incomoda — duele), retrocedé." },
      { type: "block", label: "Bloque 1 — Despertar suave (en la cama) · 3 min", items: [
        { arrow: true, bold: "01  Respiración de activación:", text: " Tres respiraciones profundas. Observá cómo está tu cuerpo. Traé la primera cosa por la que estás agradecido." },
        { arrow: true, bold: "02  Rodillas al pecho:", text: " Abrazá ambas rodillas. Mecete de lado a lado. Libera la zona lumbar. 30–45 seg." },
        { arrow: true, bold: "03  Torsión lumbar suave:", text: " Rodillas juntas hacia un lado, torso mirando al techo. 30 seg por lado." },
        { arrow: true, bold: "04  Elongación de isquiotibiales:", text: " Una pierna estirada hacia arriba desde el muslo. 30–40 seg por pierna." },
      ]},
      { type: "block", label: "Bloque 2 — Cuello y hombros · 4 min", items: [
        { arrow: true, bold: "05  Inclinación lateral:", text: " Oreja hacia el hombro sin levantar el opuesto. 30–45 seg por lado." },
        { arrow: true, bold: "06  Rotación cervical:", text: " Mentón hacia el hombro. 30 seg por lado. Luego círculos lentos." },
        { arrow: true, bold: "07  Flexión cervical anterior:", text: " Mentón al pecho. Libera suboccipitales. 30 seg." },
        { arrow: true, bold: "08  Apertura de hombros:", text: " Dedos entrelazados detrás de la cabeza, codos hacia atrás. 3 repeticiones." },
      ]},
      { type: "block", label: "Bloque 3 — Espalda dorsal · 4 min", items: [
        { arrow: true, bold: "09  Gato-vaca:", text: " En 4 apoyos. 8 repeticiones siguiendo el ritmo de la respiración." },
        { arrow: true, bold: "10  Elongación dorsal cruzada:", text: " Brazo bajo el cuerpo cruzando al otro lado. El movimiento clave. 45–60 seg por lado." },
        { arrow: true, bold: "11  Postura del niño extendida:", text: " Caderas hacia talones, brazos estirados. Respirá hacia la espalda. 45–60 seg." },
      ]},
      { type: "block", label: "Bloque 4 — Cierre · 2 min", items: [
        { arrow: true, bold: "12  Estiramiento lateral:", text: " Un brazo hacia el lado opuesto arqueando el torso. 30 seg por lado." },
        { arrow: true, bold: "13  Gratitud y cierre:", text: " Tres respiraciones. En cada exhalación, una cosa por la que estás agradecido. Una intención para el día." },
      ]},
    ]
  },
  {
    id: "adaptaciones",
    label: "ADAPTACIONES",
    title: "Si tenés poco tiempo",
    body: [
      { type: "p", text: "La rutina completa son 10 a 15 minutos. Pero si un día tenés menos tiempo, acá están las prioridades:" },
      { type: "block", label: "Versiones según tiempo disponible", items: [
        { arrow: true, bold: "5 minutos:", text: " Rodillas al pecho + torsión lumbar + elongación dorsal cruzada + respiración de cierre. El mínimo efectivo para la espalda." },
        { arrow: true, bold: "8 minutos:", text: " Todo lo anterior más cuello (inclinación lateral + rotación) + postura del niño. Cubre las zonas más críticas." },
        { arrow: true, bold: "15 minutos:", text: " La secuencia completa, con más tiempo en cada posición. El ideal para días con ritmo tranquilo." },
      ]},
      { type: "quote", text: "Lo más importante no es la duración sino la consistencia. Diez minutos todos los días hacen más que cuarenta minutos una vez por semana." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿En qué zona del cuerpo sentí más tensión esta mañana?",
        "¿Hubo algún movimiento donde la incomodidad me dijo algo sobre cómo estoy?",
        "¿La gratitud al elongar fue genuina o mecánica? ¿Qué apareció?",
        "¿Cómo llegué al resto del día después de hacer esta práctica vs días que no la hago?",
        "¿Qué intención me llevé de la práctica de hoy?",
      ]},
      { type: "p", text: "El cuerpo tiene memoria. Lo que hacés en los primeros minutos del día se queda como tono de fondo en las horas que siguen. Esto no es metáfora — es fisiología." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Quedáte donde estás.\n\nNo hace falta levantarte todavía.\n\nLos próximos minutos son para hacer la transición — del sueño al día — con el cuerpo. No con el teléfono, no con las noticias, no con la lista de cosas para hacer.\n\nCon el cuerpo.\n\nDurante las horas que dormiste, ciertos músculos se acortaron. Otros se comprimieron. La espalda, el cuello, los hombros — guardan la tensión de ayer y están listos para acumular la de hoy si no les das un momento de transición.\n\nHoy no." },
  { time: "1:30 – 4:00", title: "Bloque 1 — Despertar suave", text: "Empezamos con tres respiraciones. Inhalá llenando el abdomen — expandí. Exhalá largo, vaciando. Otra vez.\n\nObservá cómo está tu cuerpo hoy. Sin juzgar. Solo mirando.\n\n¿Dónde sentís tensión? ¿Dónde hay peso? ¿Dónde hay liviandad?\n\nMientras observás, traé algo a la mente. Una cosa — simple, real — por la que estás agradecido hoy. No tiene que ser grande. Puede ser la cama. El silencio. Que amaneciste.\n\nAhora, llevá ambas rodillas al pecho. Abrazalas. Mecete suavemente de lado a lado. La zona lumbar que estuvo comprimida mientras dormías empieza a abrirse.\n\nAhora dejá caer las rodillas juntas hacia un lado. El torso queda mirando al techo. Brazos abiertos. Respirá hacia la torsión. Treinta segundos.\n\nCambiá de lado. Mismo tiempo. Misma respiración." },
  { time: "4:00 – 7:00", title: "Bloque 2 — Cuello y hombros", text: "El cuello sostiene el peso de tu cabeza — casi cinco kilos — durante todo el día. Rara vez lo elongamos. Hoy sí.\n\nIncliná la cabeza hacia un hombro, llevando la oreja hacia él. No levantes el hombro opuesto. Sentís el lateral del cuello abrirse. Respirá ahí. Treinta segundos.\n\nCambiá de lado.\n\nAhora girá la cabeza lentamente hacia un lado, mentón hacia el hombro. Sostené. Treinta segundos. Cambiá.\n\nLlevá el mentón hacia el pecho. Sentís la parte posterior del cuello estirarse — esa zona que las pantallas comprimen todo el día. Respirá profundo. Treinta segundos.\n\nEntrelazá los dedos detrás de la cabeza. Codos abiertos hacia atrás. Abrís el pecho. Sostené. Después llevá los codos hacia adelante, cruzándolos. Tres veces." },
  { time: "7:00 – 10:30", title: "Bloque 3 — Espalda dorsal", text: "Este es el corazón de la práctica. Vamos a los músculos dorsales — esos grandes músculos de la espalda que conectan desde los brazos hasta la pelvis y que acumulan tensión postural sin que nadie los trabaje.\n\nPasá a cuatro apoyos — manos y rodillas sobre el colchón.\n\nGato-vaca: inhalá arqueando la espalda hacia abajo, el pecho se abre. Exhalá redondeándola hacia arriba, como un gato que se estira. Ocho veces, siguiendo tu respiración.\n\nAhora viene el movimiento clave.\n\nPasá el brazo derecho por debajo del cuerpo — cruzándolo hacia la izquierda. Apoyá el codo y el antebrazo contra el colchón. Con el brazo izquierdo estirado hacia adelante, usalo como contrapeso para profundizar.\n\nSentís el dorsal derecho abrirse. Esa zona que casi nunca se llega. Respirá hacia ahí. Cuarenta y cinco segundos.\n\nCambiá de lado. Mismo tiempo. Misma respiración.\n\nPostura del niño: llevá las caderas hacia los talones, brazos estirados hacia adelante, frente apoyada. Respirá profundo hacia la espalda — sentís cómo se expande con cada inhalación. Un minuto." },
  { time: "10:30 – 12:00", title: "Cierre", text: "Estiramiento lateral: sentate en el borde de la cama. Levantá un brazo y llevalo hacia el lado opuesto — abrís el espacio intercostal, elongás el dorsal completo. Treinta segundos por lado.\n\nY ahora, el cierre.\n\nVolvé a la posición inicial. Tres respiraciones profundas.\n\nEn cada exhalación — una cosa por la que estás agradecido. Simple. Real. Presente.\n\nY una intención para el día. Una sola palabra o frase. La que venga.\n\nEl cuerpo está listo. La mente también.\n\nAhora sí — empezá el día." },
],
  },

  4: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Cada cuerpo es distinto. Conocer el tuyo es poder.",
    body: [
      { type: "p", text: "Vivimos en la era de la información nutricional más abundante de la historia. Y al mismo tiempo, en la era de la mayor confusión sobre qué comer. Dietas que se contradicen, alimentos demonizados un año y celebrados al siguiente, protocolos opuestos que los dos tienen millones de seguidores." },
      { type: "p", text: "El problema no es la falta de información. Es que la mayoría de esa información ignora algo fundamental: no existe una dieta perfecta universal. Existe la alimentación que funciona para tu cuerpo, en este momento de tu vida." },
      { type: "quote", text: "La alimentación consciente no es una dieta. Es una práctica de autoconocimiento. Aprender a escuchar lo que tu cuerpo dice después de comer es una de las formas más directas de inteligencia corporal." },
      { type: "p", text: "Este módulo cierra el Pilar I de hapi con la cuarta palanca fundamental: lo que ponemos adentro. No para darte un plan rígido sino para instalarte una mirada. Una forma de relacionarte con la comida que entiende la alimentación como un sistema vivo, personalizado y en constante ajuste." },
    ]
  },
  {
    id: "intestino",
    label: "EL SEGUNDO CEREBRO",
    title: "El intestino: mucho más que digestión",
    body: [
      { type: "p", text: "Durante décadas, el intestino fue tratado como un sistema de procesamiento mecánico. Hoy sabemos que esa visión es radicalmente incompleta." },
      { type: "tip", label: "Los números", text: "El intestino alberga aproximadamente 100 millones de neuronas y produce el 90% de la serotonina del cuerpo — el neurotransmisor central del estado de ánimo y el bienestar. Tiene comunicación bidireccional constante con el cerebro a través del nervio vago." },
      { type: "p", text: "La microbiota intestinal — los billones de microorganismos que viven en el intestino — regula la inflamación sistémica, modula el sistema inmune, sintetiza vitaminas y neurotransmisores. Cuando está empobrecida o desequilibrada, los efectos van mucho más allá de la digestión." },
      { type: "p", text: "El Dr. Facundo Pereyra, gastroenterólogo con más de 15 años de investigación en salud digestiva, llama al intestino el órgano estrella. Su trabajo muestra que migrañas crónicas, fatiga, problemas de piel, ansiedad y neblina mental pueden tener raíz en el estado del intestino — específicamente en el síndrome de intestino permeable." },
      { type: "quote", text: "La inflamación crónica de bajo grado es silenciosa, acumulativa y está en la base de muchas enfermedades modernas. El intestino es, en muchos casos, donde empieza." },
    ]
  },
  {
    id: "autotest",
    label: "AUTOCONOCIMIENTO",
    title: "El autotest como punto de partida",
    body: [
      { type: "p", text: "Antes de cambiar lo que comés, el primer paso es observar cómo estás. Este autotest no es un diagnóstico — es un punto de partida para la observación." },
      { type: "block", label: "Señales a observar", items: [
        { arrow: true, bold: "Digestión:", text: " ¿Tenés hinchazón abdominal frecuente, gases, reflujo o alternancia entre diarrea y constipación?" },
        { arrow: true, bold: "Energía:", text: " ¿Sentís fatiga crónica, falta de energía después de comer o neblina mental regular?" },
        { arrow: true, bold: "Piel:", text: " ¿Tenés problemas de piel recurrentes — acné, psoriasis, eczema, rosácea — sin causa dermatológica clara?" },
        { arrow: true, bold: "Dolor:", text: " ¿Sufrís migrañas frecuentes, dolores articulares o musculares sin causa específica?" },
        { arrow: true, bold: "Estado de ánimo:", text: " ¿Tenés ansiedad, irritabilidad o cambios de humor sin explicación?" },
      ]},
      { type: "tip", label: "Interpretación", text: "Si varias generan un sí, el intestino puede ser parte de la ecuación. Si el resultado es mayormente negativo — eso también es información valiosa: el intestino está funcionando bien y el foco puede estar en optimizar. El autotest no reemplaza una consulta médica." },
      { type: "quote", text: "Saber que tu intestino está bien es tan valioso como saber que necesita atención. El autoconocimiento corporal funciona en ambas direcciones." },
    ]
  },
  {
    id: "b15",
    label: "EL PROGRAMA B15",
    title: "La lógica del reseteo intestinal",
    body: [
      { type: "p", text: "Para quienes el autotest detecta síntomas, el Dr. Pereyra diseñó el programa B15: un protocolo de 15 días para restaurar la integridad de la mucosa intestinal, diversificar la microbiota y reducir la inflamación crónica." },
      { type: "block", label: "Las tres etapas", items: [
        { arrow: true, bold: "Días 1–7 — Eliminación:", text: " Se retiran temporalmente los alimentos con mayor potencial inflamatorio: gluten, lácteos, azúcar, alcohol, café, mate y carne roja. El intestino descansa y empieza a desinflamarse." },
        { arrow: true, bold: "Días 8–15 — Reintroducción:", text: " Se van reintroduciendo los alimentos eliminados de a uno, observando la respuesta del cuerpo. Las señales son concretas: hinchazón, fatiga, ansiedad." },
        { arrow: true, bold: "Etapa 3 — Mapa personalizado:", text: " Con la información de la reintroducción, cada persona construye su mapa de alimentación propio. No hay alimentos universalmente prohibidos — hay alimentos que a tu cuerpo le generan inflamación." },
      ]},
      { type: "quote", text: "El objetivo del reseteo no es la restricción permanente. Es el autoconocimiento. Saber cómo responde tu cuerpo específico a cada alimento es una forma de libertad, no de limitación." },
    ]
  },
  {
    id: "principios",
    label: "PRINCIPIOS DE BASE",
    title: "Comer bien sin obsesionarse",
    body: [
      { type: "p", text: "Más allá del reseteo, hay principios generales con fuerte respaldo científico que aplican a casi todos los cuerpos. La clave es integrarlos como hábitos de fondo, no como reglas rígidas." },
      { type: "block", label: "Las cuatro palancas", items: [
        { arrow: true, bold: "30 plantas por semana:", text: " El American Gut Project encontró que las personas que consumen 30 tipos de plantas distintas por semana tienen una microbiota significativamente más diversa. Incluye frutas, verduras, legumbres, frutos secos, semillas y especias." },
        { arrow: true, bold: "Comer todos los colores:", text: " Los polifenoles en alimentos coloridos — frutas rojas, verduras verdes, cúrcuma, cacao, aceite de oliva, té verde — tienen propiedades antiinflamatorias potentes. Meta práctica: al menos tres colores por plato." },
        { arrow: true, bold: "Un fermentado por día:", text: " Chucrut, kombucha, kéfir, miso. Introducen bacterias beneficiosas vivas directamente en el intestino. Una pequeña porción diaria tiene impacto real." },
        { arrow: true, bold: "Reducir ultraprocesados:", text: " No eliminar de golpe sino reducir progresivamente. Los emulsionantes y aditivos dañan la pared intestinal de forma acumulativa. Cada comida real que reemplaza un ultraprocesado es una mejora marginal." },
      ]},
      { type: "quote", text: "No se trata de comer perfecto. Se trata de elevar el porcentaje de comida real en tu dieta. Cada mejora marginal tiene efecto acumulativo en la microbiota y en cómo te sentís." },
    ]
  },
  {
    id: "vnm",
    label: "PRÁCTICA MATUTINA",
    title: "Agua, limón y vinagre de manzana: la ciencia correcta",
    body: [
      { type: "p", text: "Empezar el día con un vaso de agua con vinagre de manzana (VNM) o limón es una práctica con beneficios reales. Vale la pena entender por qué funciona — y separarlo de algunos mitos." },
      { type: "block", label: "Lo que sí tiene respaldo", items: [
        { arrow: true, bold: "Control glucémico:", text: " El VNM tiene evidencia modesta pero real para reducir los picos de glucosa post-comida y mejorar la sensibilidad a la insulina." },
        { arrow: true, bold: "Digestión:", text: " Tanto el VNM como el limón pueden estimular la producción de ácido gástrico y enzimas digestivas." },
        { arrow: true, bold: "Microbiota:", text: " El ácido acético del VNM puede tener efecto prebiótico leve, favoreciendo bacterias beneficiosas." },
        { arrow: true, bold: "Hidratación activa:", text: " Convierte el vaso de agua de la mañana en una práctica con vitamina C, antioxidantes y ácido acético." },
      ]},
      { type: "tip", label: "El mito del pH — aclarándolo", text: "La idea de que el VNM o el limón 'alcalinizan el cuerpo' es técnicamente imprecisa. El pH sanguíneo está regulado con precisión milimétrica — ningún alimento lo cambia. Lo que sí cambia es el pH local del sistema digestivo. Y ahí es donde tienen su efecto real." },
      { type: "quote", text: "En hapi preferimos la precisión. Usar bien una herramienta requiere entender cómo funciona de verdad. La honestidad sobre la ciencia es parte del ADN del sistema." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "Cuando termino de comer, ¿me siento con energía y claridad o pesado y lento?",
        "¿Hay alimentos que intuyo que no me hacen bien pero sigo comiendo? ¿Cuáles?",
        "¿Cuántos tipos de plantas distintas como por semana aproximadamente?",
        "¿Cómo es mi digestión en general? ¿Hay síntomas que normalicé sin cuestionarlos?",
        "¿Cuándo fue el último análisis de sangre completo? ¿Qué mostró?",
      ]},
      { type: "p", text: "La alimentación consciente empieza con observación, no con restricción. Antes de cambiar lo que comés, aprender a escuchar lo que tu cuerpo dice después de cada comida es el primer paso." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Vivimos en la era con más información nutricional disponible de la historia.\n\nY al mismo tiempo — en la era de la mayor confusión sobre qué comer.\n\nDietas que se contradicen. Alimentos demonizados un año y celebrados al siguiente. El problema no es la falta de información. Es que ignora algo fundamental: no existe una dieta perfecta universal. Existe la alimentación que funciona para tu cuerpo, en este momento de tu vida.\n\nEso es lo que trabajamos en este módulo." },
  { time: "1:30 – 4:00", title: "El intestino como segundo cerebro", text: "El intestino produce el 90% de la serotonina del cuerpo. Tiene 100 millones de neuronas. Se comunica en tiempo real con el cerebro a través del nervio vago.\n\nLo que pasa en el intestino impacta directamente en cómo pensás, cómo te sentís y cómo dormís. Y lo que altera esa comunicación, en muchos casos, es la comida.\n\nLa microbiota intestinal regula la inflamación, modula el sistema inmune, sintetiza neurotransmisores. Cuando está empobrecida, los efectos van mucho más allá de la digestión. Migrañas, fatiga, problemas de piel, ansiedad, neblina mental — pueden tener raíz ahí." },
  { time: "4:00 – 5:30", title: "El autotest", text: "Antes de cambiar lo que comés, el primer paso es observar cómo estás.\n\n¿Tenés hinchazón abdominal frecuente? ¿Fatiga crónica o neblina mental? ¿Problemas de piel recurrentes sin causa clara? ¿Migrañas o dolores articulares sin explicación?\n\nSi varias generan un sí, el intestino puede ser parte de la ecuación. Si el resultado es mayormente negativo — eso también es información valiosa. Los dos resultados son autoconocimiento." },
  { time: "5:30 – 8:30", title: "El reseteo y los principios generales", text: "Para quienes detectan síntomas, el programa B15 propone una lógica simple: durante 15 días, eliminás los alimentos con mayor potencial inflamatorio — gluten, lácteos, azúcar, alcohol — y después los reintroducís de a uno, observando la respuesta de tu cuerpo.\n\nEl objetivo no es la restricción permanente. Es el mapa. Saber cómo responde tu cuerpo específico a cada alimento.\n\nMás allá del reseteo: 30 tipos de plantas distintas por semana para diversificar la microbiota. Un alimento fermentado por día. Reducir ultraprocesados. Y comer todos los colores — los polifenoles de los alimentos coloridos son potentes antiinflamatorios naturales." },
  { time: "8:30 – 10:00", title: "VNM, limón y el mito del pH", text: "Empezar el día con agua y un chorrito de vinagre de manzana o limón es una buena práctica. Pero vale la pena entender por qué funciona de verdad.\n\nEl VNM tiene evidencia real para reducir picos de glucosa y estimular la digestión. El limón aporta vitamina C y antioxidantes. Los dos son buenos.\n\nPero la idea de que acidifican o alcalinizan el cuerpo es un mito. El pH sanguíneo está regulado con precisión milimétrica — ningún alimento lo cambia de forma significativa. Lo que sí cambia es el ambiente digestivo local. Y ahí es donde tienen su efecto real.\n\nEn hapi preferimos la precisión. Usar bien una herramienta requiere entender cómo funciona de verdad." },
  { time: "10:00 – 12:00", title: "Cierre — fin del Pilar I", text: "La alimentación consciente no es una dieta. Es una práctica de autoconocimiento.\n\nAprender a escuchar lo que tu cuerpo dice después de comer. Observar sin juzgar. Ajustar con información, no con miedo o culpa.\n\nY entender que lo que comés hoy está construyendo — o deteriorando — tu salud de los próximos años. De forma silenciosa, acumulativa, pero real.\n\nCon este módulo cerramos el Pilar I de hapi. El cuerpo — sueño, mañana, elongación y alimentación — es la base sobre la que se construye todo lo demás.\n\nEn el próximo módulo, empezamos el Pilar II: la mente." },
],
  },

  5: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Tu cerebro no está terminado. Nunca lo estuvo.",
    body: [
      { type: "p", text: "Durante décadas, la neurociencia enseñó una idea que resultó ser profundamente incorrecta: que el cerebro adulto era una estructura fija. Que los circuitos que tenías a los 25 eran, en esencia, los que ibas a tener siempre. Que el carácter era inmutable, los hábitos difíciles de cambiar, y la personalidad más o menos permanente." },
      { type: "p", text: "Esa idea es falsa. Y entender por qué cambia todo." },
      { type: "quote", text: "El cerebro es el único órgano del cuerpo que puede rediseñarse a sí mismo en respuesta a la experiencia. Lo que hacés, pensás y prestás atención moldea literalmente su estructura." },
      { type: "p", text: "Esto es neuroplasticidad: la capacidad del cerebro de reorganizar sus conexiones, formar nuevas sinapsis, y cambiar su estructura funcional a lo largo de toda la vida. Y no es una metáfora — es un hecho biológico medible, con consecuencias prácticas enormes para cómo vivís, cómo aprendés y cómo cambiás." },
      { type: "p", text: "Este módulo abre el Pilar II de hapi. Si el Pilar I construyó las condiciones físicas — el cuerpo como base — el Pilar II empieza con la premisa de que la mente es plástica. Que no sos prisionero de tus patrones. Y que el cambio real es posible si entendés cómo funciona." },
    ]
  },
  {
    id: "mecanismo",
    label: "EL MECANISMO",
    title: "Cómo se reescribe el cerebro",
    body: [
      { type: "p", text: "Cada experiencia, pensamiento repetido y hábito deja una huella física en el cerebro. Las neuronas que se activan juntas se conectan juntas — esta es la regla básica de Hebb, formulada en 1949. Con la repetición, las conexiones se fortalecen. Con el desuso, se debilitan." },
      { type: "tip", label: "La mielina", text: "Cuando una ruta neuronal se usa repetidamente, el cerebro la envuelve en una capa de mielina — una sustancia grasa que actúa como aislante. La mielina puede aumentar la velocidad de transmisión de una señal neuronal hasta 100 veces. Por eso los expertos parecen actuar 'sin pensar': sus circuitos están tan mielinizados que el procesamiento es casi instantáneo." },
      { type: "p", text: "Esto tiene una implicación directa: cada vez que elegís una respuesta diferente a la automática, estás literalmente compitiendo con un circuito establecido — y construyendo uno nuevo. Al principio cuesta. Luego se vuelve más fácil. Eventualmente, el nuevo patrón se vuelve el automático." },
      { type: "subtitle", text: "El papel del error y la dificultad" },
      { type: "p", text: "El cerebro aprende más de los errores que de los aciertos. Cuando cometes un error, el sistema dopaminérgico envía una señal de 'predicción incorrecta' que activa la plasticidad en zonas específicas. La dificultad, la fricción, la sensación de esfuerzo — lejos de ser obstáculos al aprendizaje, son las condiciones que lo activan." },
      { type: "quote", text: "No aprendés haciendo lo que ya sabés hacer. Aprendés haciendo lo que todavía no podés hacer bien." },
    ]
  },
  {
    id: "condiciones",
    label: "LAS CONDICIONES",
    title: "Qué activa y qué bloquea la plasticidad",
    body: [
      { type: "p", text: "La neuroplasticidad no es un estado constante. Hay condiciones que la abren — y condiciones que la cierran. Entender cuáles son te da control sobre cuándo aprender, cuándo cambiar y cuándo descansar." },
      { type: "block", label: "Potenciadores de plasticidad", items: [
        { arrow: true, bold: "Sueño profundo:", text: " Durante el sueño de ondas lentas, el cerebro consolida las conexiones formadas durante el día y elimina las que no se usaron. Sin sueño de calidad, el aprendizaje literalmente no se graba. (Ver Módulo 01)" },
        { arrow: true, bold: "Ejercicio aeróbico:", text: " Eleva el BDNF — factor neurotrófico derivado del cerebro — la proteína que facilita el crecimiento de nuevas neuronas y conexiones. Una caminata de 20 minutos puede duplicar los niveles de BDNF circulantes." },
        { arrow: true, bold: "Novedad y desafío:", text: " El cerebro libera dopamina ante lo nuevo. Esa dopamina activa los circuitos de plasticidad. Rutinas completamente fijas, paradójicamente, pueden frenar el crecimiento cognitivo." },
        { arrow: true, bold: "Atención focalizada:", text: " La plasticidad sigue a la atención. Los cambios estructurales ocurren en los circuitos que se activan de forma intensa y sostenida — no en los que se activan de fondo. (Por eso la meditación y el foco profundo son tan poderosos.)" },
      ]},
      { type: "block", label: "Inhibidores de plasticidad", items: [
        { arrow: true, bold: "Estrés crónico:", text: " El cortisol elevado de forma sostenida daña el hipocampo — la región clave para el aprendizaje y la memoria. El estrés agudo y breve puede facilitar el aprendizaje; el crónico, lo destruye." },
        { arrow: true, bold: "Privación de sueño:", text: " Bloquea la consolidación sináptica. Lo que aprendiste durante el día no se transfiere a largo plazo." },
        { arrow: true, bold: "Distracción constante:", text: " El cerebro que nunca sostiene la atención por más de unos segundos no genera la intensidad de activación necesaria para formar conexiones fuertes." },
      ]},
    ]
  },
  {
    id: "implicaciones",
    label: "IMPLICACIONES",
    title: "Lo que esto significa para vos",
    body: [
      { type: "p", text: "La neuroplasticidad no es un concepto académico. Tiene consecuencias directas en cómo te relacionás con tus propios patrones, hábitos y posibilidades de cambio." },
      { type: "attributed", text: "No somos la suma de nuestros genes ni de nuestras experiencias pasadas. Somos la suma de lo que elegimos prestarle atención.", author: "Estanislao Bachrach, Ágilmente" },
      { type: "p", text: "Esto significa que las historias que te contás sobre vos mismo — 'soy así', 'no puedo cambiar', 'siempre fui impaciente', 'no soy bueno para X' — no son descripciones de hechos biológicos. Son descripciones de circuitos actuales. Y los circuitos cambian." },
      { type: "p", text: "No cambian solos. No cambian de golpe. Y no cambian sin costo — el esfuerzo de ir contra el patrón automático es real. Pero cambian. Y el primer paso para que cambien es dejar de tratarlos como identidad permanente." },
      { type: "tip", label: "La ventana crítica", text: "La plasticidad es máxima en los primeros años de vida, pero nunca desaparece completamente. Lo que sí cambia con la edad es la velocidad y el costo del cambio — requiere más repetición y más atención. Pero la dirección es siempre posible." },
      { type: "quote", text: "El cerebro que usás para cambiar es el mismo que vas a cambiar. Eso no es un obstáculo — es exactamente el punto." },
    ]
  },
  {
    id: "practica",
    label: "EN PRÁCTICA",
    title: "Cómo aprovechar la plasticidad",
    body: [
      { type: "p", text: "La neuroplasticidad no es algo que 'activás' — es algo que aprovechás o desperdicíás según cómo estructurás tu vida. Estas son las palancas más directas:" },
      { type: "block", label: "Las cuatro palancas", items: [
        { arrow: true, bold: "Dormir bien (siempre):", text: " No hay plasticidad sin consolidación. El sueño de calidad que trabajamos en el Módulo 01 es la base de cualquier cambio cognitivo real." },
        { arrow: true, bold: "Foco profundo a diario:", text: " Elegí una cosa — una sola — y dale 25 a 90 minutos de atención sin interrupciones. Este es el ambiente donde la plasticidad ocurre. La dispersión es su enemigo." },
        { arrow: true, bold: "Repetición con variación:", text: " La misma habilidad practicada de formas ligeramente distintas genera más plasticidad que la práctica idéntica repetida. El cerebro aprende más de los errores y ajustes que de la ejecución perfecta." },
        { arrow: true, bold: "Gestión del estrés:", text: " El estrés crónico es el mayor inhibidor de plasticidad que existe. Las prácticas del Pilar II — meditación, perspectiva estoica, propósito — no son solo filosóficas: son condiciones biológicas para el aprendizaje." },
      ]},
      { type: "quote", text: "Lo que prestás atención de forma intensa y repetida se convierte en tu cerebro. Elegir dónde va tu atención es elegir quién vas a ser." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hay algún patrón en mí que trato como parte de mi identidad pero que en realidad es un hábito aprendido?",
        "¿Cuándo fue la última vez que aprendí algo genuinamente nuevo — algo que al principio era difícil?",
        "¿Qué es lo que más interrumpe mi capacidad de foco profundo en un día típico?",
        "¿Estoy usando el sueño, el ejercicio y la atención como potenciadores de plasticidad, o los estoy desperdiciando?",
        "Si mi cerebro cambia en la dirección de lo que más atención le presto — ¿hacia dónde está cambiando el mío ahora mismo?",
      ]},
      { type: "p", text: "La última pregunta es la más incómoda — y la más útil. Respondela con honestidad antes de seguir." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Durante décadas, la neurociencia enseñó algo que resultó ser profundamente incorrecto: que el cerebro adulto era una estructura fija. Que los circuitos que tenías a los 25 eran, en esencia, los que ibas a tener siempre.\n\nEsa idea es falsa.\n\nEl cerebro es el único órgano que puede rediseñarse a sí mismo en respuesta a la experiencia. Lo que hacés, pensás y prestás atención moldea literalmente su estructura.\n\nEsto se llama neuroplasticidad. Y no es una metáfora — es un hecho biológico medible. Con consecuencias prácticas enormes para cómo vivís y cómo cambiás." },
  { time: "1:30 – 4:00", title: "El mecanismo", text: "Cada experiencia, cada pensamiento repetido, cada hábito deja una huella física en el cerebro. Las neuronas que se activan juntas se conectan juntas. Con la repetición, las conexiones se fortalecen. Con el desuso, se debilitan.\n\nCuando una ruta neuronal se usa repetidamente, el cerebro la envuelve en mielina — una sustancia que puede aumentar la velocidad de la señal neuronal hasta 100 veces. Por eso los expertos actúan 'sin pensar'. Sus circuitos están tan establecidos que el procesamiento es casi instantáneo.\n\nY esto tiene una implicación directa: cada vez que elegís una respuesta diferente a la automática, estás compitiendo con un circuito establecido — y construyendo uno nuevo. Al principio cuesta. Luego se vuelve más fácil. Eventualmente, el nuevo patrón se vuelve el automático.\n\nEl cerebro aprende más de los errores que de los aciertos. La dificultad no es el obstáculo al cambio. Es la condición que lo activa." },
  { time: "4:00 – 6:30", title: "Las condiciones", text: "La neuroplasticidad no es un estado constante. Hay condiciones que la abren y condiciones que la cierran.\n\nEl sueño profundo consolida las conexiones formadas durante el día. Sin sueño de calidad, el aprendizaje no se graba. Volvimos al Módulo 01 — todo está conectado.\n\nEl ejercicio aeróbico eleva el BDNF — la proteína que facilita el crecimiento de nuevas neuronas. Una caminata de 20 minutos puede duplicar sus niveles.\n\nLa atención focalizada. La plasticidad sigue a la atención. Los cambios ocurren en los circuitos que se activan de forma intensa y sostenida — no en los que operan de fondo mientras mirás el teléfono.\n\nY el inhibidor más grande: el estrés crónico. El cortisol sostenido daña el hipocampo — la región clave para el aprendizaje. El estrés crónico no solo te hace sentir mal — literalmente bloquea tu capacidad de cambiar." },
  { time: "6:30 – 9:00", title: "Lo que esto significa", text: "Las historias que te contás sobre vos mismo — 'soy así', 'no puedo cambiar', 'siempre fui impaciente' — no son descripciones de hechos biológicos. Son descripciones de circuitos actuales. Y los circuitos cambian.\n\nBackrach lo dice así: no somos la suma de nuestros genes ni de nuestras experiencias pasadas. Somos la suma de lo que elegimos prestarle atención.\n\nNo cambian solos. No cambian de golpe. Requieren esfuerzo real. Pero la dirección siempre es posible.\n\nLo que prestás atención de forma intensa y repetida se convierte en tu cerebro. Elegir dónde va tu atención es, literalmente, elegir quién vas a ser.\n\nEse es el punto de entrada del Pilar II. No el wishful thinking de que podés cambiar — sino la comprensión biológica de por qué es real, bajo qué condiciones ocurre, y qué tenés que hacer para que suceda." },
  { time: "9:00 – 10:00", title: "Cierre", text: "Cuatro palancas para aprovechar la plasticidad: dormir bien, foco profundo diario, repetición con variación, y gestión del estrés. No como conceptos — como prácticas concretas.\n\nEn el próximo módulo empezamos con la más importante del Pilar II: entrenar la atención misma. La meditación — no como práctica espiritual, sino como entrenamiento neurológico directo." },
],
  },

  6: {
    sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Por qué la meditación no es lo que pensás",
    body: [
      { type: "p", text: "Hay pocas palabras que generen más malentendidos que 'meditación'. Para algunos evoca monjes en posición de loto. Para otros es una moda de bienestar. Y para muchos que lo intentaron, es algo que fracasaron: se sentaron, cerraron los ojos, la mente no paró de correr, y concluyeron que no sirven para meditar." },
      { type: "p", text: "Todo eso es un malentendido del punto." },
      { type: "p", text: "La meditación no es vaciar la mente. La mente nunca se vacía. No es relajación, aunque puede producirla. No es una práctica religiosa. No necesita postura especial ni incienso." },
      { type: "quote", text: "La meditación, en su forma más desnuda, es una sola cosa: entrenar la atención. Y entrenar la atención es posiblemente la habilidad más útil que existe para vivir mejor." },
    ]
  },
  {
    id: "observador",
    label: "EL DESCUBRIMIENTO",
    title: "El observador — la idea que cambia todo",
    body: [
      { type: "p", text: "Ahora mismo, hay un flujo de pensamientos en tu cabeza. Quizás sobre lo que tenés que hacer después. Quizás algo que te preocupa. Quizás la voz que comenta lo que estás leyendo." },
      { type: "tip", label: "Una pregunta", text: "¿Quién está observando eso? Si podés notar los pensamientos — si podés decir 'hay preocupación' o 'hay distracción' — entonces hay algo en vos que no es el pensamiento en sí. Hay un observador. Una conciencia que ve sin ser vista." },
      { type: "p", text: "Sam Harris lo describe así: la mayoría de las personas vive completamente identificada con sus pensamientos. No los observa: los habita. Se convierte en ellos. Cuando te enojás, no notás 'hay enojo'. Sos el enojo. Y desde adentro de esa fusión, la reactividad automática es inevitable." },
      { type: "p", text: "La meditación interrumpe esa fusión. No la elimina — los pensamientos siguen llegando. Pero crea una fracción de espacio entre el estímulo y la respuesta." },
      { type: "attributed", text: "Entre estímulo y respuesta hay un espacio. En ese espacio está nuestro poder de elegir nuestra respuesta. En nuestra respuesta está nuestro crecimiento y nuestra libertad.", author: "Viktor Frankl" },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA",
    title: "Qué pasa en el cerebro cuando meditás",
    body: [
      { type: "p", text: "La meditación no es solo filosofía. En las últimas dos décadas, la neurociencia ha producido evidencia sólida sobre sus efectos en la estructura y funcionamiento del cerebro." },
      { type: "block", label: "Los cambios medibles", items: [
        { arrow: true, bold: "Corteza prefrontal:", text: " La meditación regular la fortalece — la región asociada a la regulación emocional y la inhibición de respuestas impulsivas. En paralelo, reduce la reactividad de la amígdala." },
        { arrow: true, bold: "Red neuronal por defecto:", text: " Cuando la mente divaga, activa la misma red que opera en la rumiación y la ansiedad. La meditación entrena la capacidad de desengancharse de esa red cuando no es útil." },
        { arrow: true, bold: "Cambios estructurales:", text: " Un estudio de Harvard (Sara Lazar) mostró que ocho semanas de práctica producen cambios medibles en la densidad de materia gris. El cerebro se reescribe estructuralmente." },
        { arrow: true, bold: "HRV:", text: " La respiración consciente aumenta la variabilidad de la frecuencia cardíaca — indicador de menor estrés crónico y mayor resiliencia. Quienes usan Oura lo van a notar en sus métricas de recuperación." },
      ]},
      { type: "quote", text: "La meditación no es solo una práctica mental. Es una intervención fisiológica medible." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Qué es meditar en la práctica",
    body: [
      { type: "block", label: "Los cinco pasos", items: [
        { arrow: true, bold: "1.", text: " Sentarte en una posición razonablemente cómoda." },
        { arrow: true, bold: "2.", text: " Dirigir la atención a un objeto — habitualmente la respiración." },
        { arrow: true, bold: "3.", text: " Cuando la mente se va a otro lado (y se va — siempre), notar que se fue." },
        { arrow: true, bold: "4.", text: " Volver la atención al objeto, sin juicio, sin frustración." },
        { arrow: true, bold: "5.", text: " Repetir." },
      ]},
      { type: "p", text: "El error más común es creer que el objetivo es que la mente no se vaya. Ese malentendido destruye la práctica antes de que empiece." },
      { type: "p", text: "La mente se va siempre. En los principiantes, cada pocos segundos. En los experimentados, también — solo que notan más rápido que se fueron. El entrenamiento no es detener la mente. Es el momento en que notás que se fue y volvés." },
      { type: "attributed", text: "Perderse no es el fracaso de la meditación. Perderse y darse cuenta es la meditación.", author: "Sam Harris" },
    ]
  },
  {
    id: "malentendidos",
    label: "LOS MITOS",
    title: "Las tres ideas falsas que arruinan la práctica",
    body: [
      { type: "block", label: "Tres mitos a desarmar", items: [
        { arrow: true, bold: "Mito 1 — Tengo que vaciar la mente:", text: " La mente no para. Nunca. El objetivo no es silencio mental sino la capacidad de observar el ruido sin quedar atrapado en él." },
        { arrow: true, bold: "Mito 2 — Necesito mucho tiempo:", text: " Diez minutos diarios de práctica consistente producen cambios medibles. La consistencia gana sobre la duración. Mejor todos los días poco que una vez por semana mucho." },
        { arrow: true, bold: "Mito 3 — Yo no sirvo para meditar:", text: " Nadie no sirve — porque meditar no es una actuación que se puede hacer bien o mal. Si te sentás, ponés atención, la mente se va, y volvés: estás meditando. Que sea difícil significa que el músculo es débil y estás entrenando." },
      ]},
    ]
  },
  {
    id: "guiada",
    label: "PRÁCTICA GUIADA",
    title: "Tu primer entrenamiento — 10 minutos",
    body: [
      { type: "p", text: "Se puede hacer sentado en una silla, en el piso, o donde sea. No hay postura correcta — solo que la columna esté relativamente recta." },
      { type: "block", label: "Preparación — 1 minuto", items: [
        { arrow: true, bold: "", text: "Columna erguida pero no rígida. Ojos cerrados o mirada al suelo." },
        { arrow: true, bold: "", text: "Tres respiraciones profundas: inhalá por la nariz lento, exhalá más lento todavía." },
        { arrow: true, bold: "", text: "Dejá que el cuerpo se asiente. No hay nada que hacer excepto estar acá." },
      ]},
      { type: "block", label: "La práctica — 8 minutos", items: [
        { arrow: true, bold: "", text: "Dejá que la respiración vuelva a su ritmo natural. No la controles — solo observala." },
        { arrow: true, bold: "", text: "Notá la sensación física: el aire entrando, el movimiento del pecho o el abdomen, la pausa entre respiraciones." },
        { arrow: true, bold: "", text: "Cuando aparezca un pensamiento, simplemente notalo: 'hay un pensamiento'. No lo sigas, no lo analices, no lo juzgues." },
        { arrow: true, bold: "", text: "Luego, suavemente, volvé a la respiración. Repetí esto tantas veces como sea necesario." },
      ]},
      { type: "block", label: "El cierre — 1 minuto", items: [
        { arrow: true, bold: "", text: "Notá cómo está el cuerpo antes de abrir los ojos." },
        { arrow: true, bold: "", text: "Preguntaté: ¿con qué actitud quiero salir de acá al resto del día?" },
        { arrow: true, bold: "", text: "Abrí los ojos despacio." },
      ]},
      { type: "quote", text: "Repetido todos los días, esos diez minutos construyen uno de los músculos más útiles que existen." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Cuándo fue la última vez que estuviste completamente presente en algo sin que la mente se fuera?",
        "¿Hay pensamientos que aparecen repetidamente en tu mente? ¿Cuáles? ¿Desde cuándo?",
        "¿Podés recordar un momento reciente donde reaccionaste de una forma que después hubieras elegido diferente?",
        "¿Cuánto de tu sufrimiento cotidiano viene de la realidad y cuánto viene de pensamientos sobre la realidad?",
      ]},
      { type: "p", text: "La última pregunta es la más importante. Para la mayoría de las personas, con honestidad, la respuesta es reveladora." },
    ]
  },
],
    audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Voy a pedirte algo raro para empezar.\n\nAntes de que arranquemos — ahora mismo — fijate qué está pasando en tu mente.\n\n¿Hay pensamientos? ¿Sobre qué? ¿Los elegiste vos, o simplemente aparecieron?\n\nEso que acabás de hacer — esa fracción de segundo donde te convertiste en observador de tu propia mente — eso es lo que vamos a entrenar.\n\nSe llama meditación. Y no es lo que probablemente pensás." },
  { time: "1:30 – 4:00", title: "El observador", text: "La mayoría de las personas vive completamente identificada con sus pensamientos. No los observa: los habita. Se convierte en ellos.\n\nCuando te enojás, no notás 'hay enojo'. Sos el enojo. Cuando te preocupás, no observás la preocupación: la preocupación sos vos. Y desde adentro de esa fusión, la reactividad automática es inevitable.\n\nLa meditación interrumpe esa fusión. No la elimina — los pensamientos siguen llegando. Pero crea una fracción de espacio entre el estímulo y la respuesta.\n\nFrankl escribió: entre el estímulo y la respuesta hay un espacio. En ese espacio está nuestro poder de elegir. En nuestra respuesta está nuestra libertad.\n\nEse espacio se entrena." },
  { time: "4:00 – 6:00", title: "La ciencia y los mitos", text: "La neurociencia produjo evidencia sólida. La meditación regular fortalece la corteza prefrontal y reduce la reactividad de la amígdala. Harvard mostró cambios estructurales en el cerebro después de ocho semanas de práctica. La respiración consciente mejora la HRV — la métrica de recuperación que vas a ver en tu Oura.\n\nPero antes de empezar: tres cosas que arruinan la práctica.\n\nPrimera — creer que tenés que vaciar la mente. La mente no para. Nunca. El objetivo es observar el ruido sin quedar atrapado en él.\n\nSegunda — creer que necesitás mucho tiempo. Diez minutos diarios hacen más que una hora los domingos.\n\nTercera — creer que no servís para meditar. Nadie no sirve. Si te sentás, ponés atención, la mente se va, y volvés: estás meditando." },
  { time: "6:00 – 9:00", title: "Práctica guiada", text: "Cerrá los ojos si podés.\n\nColumna recta pero no rígida. Tres respiraciones profundas. Inhalá lento... exhalá más lento todavía.\n\nDejá que la respiración vuelva a su ritmo natural. Solo observala. El aire entrando. El movimiento. La pausa.\n\nEn algún momento la mente se va a ir a otro lado. Ya lo está haciendo, quizás.\n\nCuando eso pase — cuando te des cuenta — simplemente notalo. Sin enojo. Sin juicio. 'Se fue. Vuelvo.' Y volvés a la respiración.\n\nEse momento donde te diste cuenta de que te fuiste — ese momento es el entrenamiento. Como levantar la pesa.\n\nAntes de abrir los ojos: ¿con qué actitud querés salir de acá al resto del día?\n\nAbrí los ojos cuando quieras." },
  { time: "9:00 – 10:00", title: "Cierre", text: "No importa si la mente se fue veinte veces. Volviste veinte veces. Eso es veinte repeticiones.\n\nMañana, lo mismo. Diez minutos. Sin expectativas. Solo a entrenar.\n\nEn el próximo módulo: el filtro estoico. Ahora que tenés el observador, te damos la herramienta para saber qué hacer en ese espacio." },
],
  },

  7: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Entre lo que pasa y cómo reaccionás, hay un espacio",
    body: [
      { type: "p", text: "Hay una idea que los estoicos llevaban repitiendo hace más de dos mil años y que la neurociencia moderna terminó confirmando: no sufrimos por lo que pasa. Sufrimos por la interpretación que hacemos de lo que pasa." },
      { type: "p", text: "Eso suena simple. Y en teoría lo es. El problema es que la mente no opera en teoría — opera en automático. Cuando algo sucede, el cerebro produce una interpretación en milisegundos, antes de que tengamos tiempo de elegir. Y esa interpretación automática, casi siempre, está sesgada hacia la amenaza." },
      { type: "p", text: "No porque seamos negativos. Sino porque el cerebro fue diseñado para sobrevivir, no para ser feliz. Ese sesgo fue útil en la sabana hace cien mil años. Hoy, en la mayoría de las situaciones cotidianas, solo genera sufrimiento innecesario." },
      { type: "quote", text: "El filtro estoico es una herramienta para interrumpir ese automatismo. Para abrir el espacio entre lo que ocurre y cómo respondés. Ese espacio, pequeño al principio, es donde vive la libertad real." },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA",
    title: "Por qué la mente reacciona antes de que puedas elegir",
    body: [
      { type: "p", text: "La amígdala — la estructura del cerebro que procesa el miedo y la amenaza — actúa mucho más rápido que la corteza prefrontal, donde ocurre el razonamiento consciente. Cuando algo te genera estrés, la amígdala ya activó una respuesta emocional antes de que la parte racional del cerebro haya procesado lo que pasó." },
      { type: "tip", label: "El mecanismo", text: "Esto explica por qué las reacciones impulsivas son tan comunes y tan difíciles de frenar. No es falta de voluntad — es biología. Lo que el entrenamiento mental hace es fortalecer la conexión entre la amígdala y la corteza prefrontal. Con práctica repetida, el cerebro aprende a insertar una pausa entre el estímulo y la respuesta." },
      { type: "attributed", text: "Entre estímulo y respuesta hay un espacio. En ese espacio está nuestro poder de elegir nuestra respuesta. En nuestra respuesta está nuestro crecimiento y nuestra libertad.", author: "Viktor Frankl" },
      { type: "subtitle", text: "El sesgo de negatividad" },
      { type: "p", text: "El cerebro procesa las experiencias negativas con mucha más intensidad que las positivas. Una crítica pesa más que diez elogios. Una pérdida duele más que una ganancia equivalente produce alegría. No es un defecto de carácter — es diseño evolutivo." },
      { type: "p", text: "El filtro estoico no elimina este sesgo. Pero crea un contrapeso: un hábito de observación que le pregunta a la mente si lo que está procesando como amenaza realmente lo es. Muchas veces, la respuesta es no." },
    ]
  },
  {
    id: "herramienta",
    label: "LA HERRAMIENTA",
    title: "El filtro de cuatro pasos",
    body: [
      { type: "p", text: "El filtro estoico es una secuencia de cuatro preguntas que se aplica ante cualquier situación que genera estrés, incomodidad o reacción automática. Con repetición, se vuelve automático." },
      { type: "block", label: "Los cuatro pasos", items: [
        { arrow: true, bold: "1. Detectar:", text: " ¿Qué estoy pensando exactamente? Nombrá el pensamiento con palabras concretas. No 'me siento mal' sino 'estoy pensando que arruiné todo'. La precisión importa — un pensamiento sin nombre tiene más poder que uno nombrado." },
        { arrow: true, bold: "2. Clasificar:", text: " ¿Depende de mí o no depende de mí? Esta es la pregunta central del estoicismo. Si no depende de vos, soltar. Si depende de vos, actuar. Hay una sola cosa siempre en tu poder: tu respuesta." },
        { arrow: true, bold: "3. Reencuadrar:", text: " Si no depende de mí, ¿cómo puedo interpretarlo de forma más útil? El reencuadre no es negar la realidad ni forzar positivismo. Es buscar una interpretación igualmente válida que no genere sufrimiento innecesario." },
        { arrow: true, bold: "4. Acción:", text: " ¿Cuál es el paso concreto que puedo dar desde acá? El filtro siempre cierra con acción — aunque sea mínima. La acción devuelve el sentido de agencia. Y el sentido de agencia es el antídoto del sufrimiento pasivo." },
      ]},
      { type: "tip", label: "La regla de oro", text: "Si depende de mí → actuar. Si no depende de mí → soltar. Lo que nunca tiene sentido es sufrir por algo que no depende de vos." },
    ]
  },
  {
    id: "ejemplos",
    label: "EN LA PRÁCTICA",
    title: "El filtro aplicado a situaciones reales",
    body: [
      { type: "p", text: "El filtro no es para crisis grandes — es para lo cotidiano. Para el mensaje que no llegó, la reunión que salió mal, la crítica que llegó en el momento menos esperado. Ahí es donde más se entrena." },
      { type: "block", label: "Situación: te cancelan una reunión", items: [
        { arrow: false, bold: "Sin filtro:", text: " 'les importa poco, no me respetan' → enojo, desconexión." },
        { arrow: true, bold: "Con filtro:", text: " Clasificar: ¿depende de mí? Solo mi respuesta. Reencuadrar: pueden tener razones que no conozco. Acción: reagendar con claridad." },
      ]},
      { type: "block", label: "Situación: cometés un error en el trabajo", items: [
        { arrow: false, bold: "Sin filtro:", text: " 'soy un desastre, esto me va a costar caro' → espiral de autocrítica." },
        { arrow: true, bold: "Con filtro:", text: " El error ya pasó, no depende de mí. Lo que depende de mí: cómo lo corrijo y qué aprendo." },
      ]},
      { type: "block", label: "Situación: alguien te hace una crítica fuerte", items: [
        { arrow: false, bold: "Sin filtro:", text: " 'me están atacando' → reacción defensiva o silencio." },
        { arrow: true, bold: "Con filtro:", text: " ¿Es realmente un ataque? Puede haber información útil. Acción: escuchar antes de responder." },
      ]},
    ]
  },
  {
    id: "autoconocimiento",
    label: "AUTOCONOCIMIENTO",
    title: "Tu propio mapa de reacciones",
    body: [
      { type: "p", text: "El filtro estoico no funciona igual para todos ni en todos los contextos. Parte del trabajo de hapi es que vayas descubriendo tu propio patrón — en qué situaciones tu mente reacciona más fuerte, qué tipo de amenazas activan más tu amígdala, dónde perdés más rápido el espacio entre estímulo y respuesta." },
      { type: "p", text: "Algunas personas reaccionan más en el trabajo. Otras en vínculos cercanos. Algunas cuando se sienten juzgadas. Otras cuando sienten que pierden control. Esos patrones no son defectos — son información. Y la información es la materia prima del cambio." },
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿En qué tipo de situaciones tu reacción automática suele alejarte de cómo querés ser? ¿Hay algún patrón que se repite?" },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Ejercicio de reencuadre diario — 5 minutos",
    body: [
      { type: "p", text: "Hacela al final del día — no como evaluación, sino como observación. La diferencia importa: evaluar implica juzgar. Observar implica aprender." },
      { type: "block", label: "El ejercicio", items: [
        { arrow: true, bold: "", text: "Elegí una situación del día que te generó estrés, incomodidad o reacción automática." },
        { arrow: true, bold: "", text: "Aplicá el filtro: detectar, clasificar, reencuadrar, acción." },
        { arrow: true, bold: "", text: "Anotá brevemente: ¿qué pensaste automáticamente? ¿Dependía de vos? ¿Cómo podría haberlo interpretado diferente?" },
        { arrow: true, bold: "", text: "Cerrá con: ¿qué me dice esta situación sobre cómo funciono yo?" },
      ]},
      { type: "quote", text: "Con el tiempo, el patrón se vuelve visible. Empezás a reconocer tus triggers. Sabés cuándo tu mente exagera y cuándo tiene razón. Eso es autoconocimiento real — construido desde adentro, no desde un test." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hubo hoy una situación donde reaccioné automáticamente y después me arrepentí de la reacción?",
        "¿Cuánto de lo que me generó estrés hoy dependía realmente de mí?",
        "¿Hay una situación recurrente donde mi mente siempre reacciona de la misma forma? ¿Qué dice eso sobre mí?",
        "¿Apliqué el filtro en algún momento hoy? ¿Qué pasó cuando lo hice?",
        "¿Qué me dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "El entrenamiento mental no elimina las reacciones automáticas — las hace visibles. Y lo que se hace visible se puede elegir. Esa es toda la diferencia." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "Intro", text: "Hay una idea que los estoicos repitieron durante siglos y que la neurociencia moderna terminó confirmando.\n\nNo sufrimos por lo que pasa. Sufrimos por cómo interpretamos lo que pasa.\n\nSuena simple. Y en teoría lo es. El problema es que la mente no opera en teoría — opera en automático.\n\nCuando algo sucede, el cerebro produce una interpretación en milisegundos. Antes de que puedas elegir. Y esa interpretación, casi siempre, está sesgada hacia la amenaza, hacia lo peor, hacia el problema.\n\nNo porque seas negativo. Sino porque el cerebro fue diseñado para sobrevivir, no para ser feliz.\n\nHoy vamos a trabajar la herramienta para interrumpir ese automatismo. Se llama el filtro estoico." },
  { time: "2:00 – 5:30", title: "Los cuatro pasos", text: "El filtro tiene cuatro pasos. Son simples. Con práctica, se vuelven automáticos.\n\nPaso uno: Detectar. ¿Qué estoy pensando exactamente? No 'me siento mal' — sino el pensamiento concreto. 'Estoy pensando que arruiné todo.' Ponerle nombre al pensamiento es el primer movimiento.\n\nPaso dos: Clasificar. ¿Depende de mí o no depende de mí? Epicteto dividía todo en esas dos categorías. Lo que está en tu poder: tus acciones, tu respuesta. Lo que no está en tu poder: lo que hacen otros, el pasado, lo que ya ocurrió.\n\nSi no depende de vos — soltar. Si depende de vos — actuar.\n\nPaso tres: Reencuadrar. Si no depende de mí, ¿cómo puedo interpretarlo de forma más útil? No se trata de forzar positivismo. Se trata de encontrar una interpretación que no genere sufrimiento innecesario.\n\n'Todo salió mal' se convierte en 'no salió como quería, pero puedo corregir'. Mismo evento. Efecto completamente distinto.\n\nPaso cuatro: Acción. Siempre cerrar con algo concreto. La acción devuelve el sentido de agencia. Y el sentido de agencia es el antídoto del sufrimiento pasivo." },
  { time: "5:30 – 9:00", title: "Práctica guiada", text: "Ahora vamos a aplicarlo. Pensá en una situación de hoy — o de esta semana — que te generó estrés, incomodidad, o una reacción que después te cayó mal.\n\nTenés la situación en mente.\n\nPaso uno: ¿Qué pensaste exactamente? Poné el pensamiento en palabras. Concreto.\n\n[pausa — 10 seg]\n\nPaso dos: ¿Dependía de vos eso que te preocupó? ¿O estabas sufriendo por algo fuera de tu control?\n\n[pausa — 10 seg]\n\nSi no dependía de vos — ¿podés soltar eso ahora? No como rendición. Como decisión inteligente de no gastar energía donde no hay nada que hacer.\n\n[pausa — 8 seg]\n\nSi dependía de vos — ¿qué acción concreta podés tomar?\n\n[pausa — 8 seg]\n\nPaso tres: ¿Cómo podrías haber interpretado esa situación de forma más útil, sin negar lo que pasó?\n\n[pausa — 10 seg]\n\nY la pregunta de cierre — esta es la más importante:\n\n¿Qué te dijo esta situación sobre cómo funcionás vos?\n\n[pausa larga — 12 seg]" },
  { time: "9:00 – 10:30", title: "Cierre", text: "El filtro estoico no elimina las reacciones automáticas. Las hace visibles.\n\nY lo que se hace visible se puede elegir.\n\nEsa es toda la diferencia entre reaccionar y responder. Entre ser arrastrado por lo que pasa y elegir cómo querés que te afecte.\n\nEso se entrena. Con cada situación. Con cada aplicación del filtro.\n\nEl próximo módulo va a agregar una capa a esto — cómo entrenás la mente para apreciar lo que ya tenés, antes de perderlo. La visualización negativa no es pesimismo. Es el entrenamiento más efectivo para cerrar el gap entre lo que deseás y lo que tenés.\n\nPor ahora, con esto alcanza." },
] },
  8: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "El problema no es lo que no tenés. Es la distancia entre lo que tenés y lo que creés necesitar.",
    body: [
      { type: "p", text: "Hay una forma de sufrimiento que no aparece en los libros de medicina pero que afecta a la mayoría de las personas: el gap. La distancia entre lo que tenemos y lo que creemos que necesitamos para estar bien." },
      { type: "p", text: "El problema con el gap no es su tamaño — es que el cerebro está diseñado para mantenerlo abierto. Cada vez que conseguís algo que querías, el estándar sube. La satisfacción dura poco. La sensación de falta vuelve. Y así, indefinidamente." },
      { type: "p", text: "Los estoicos identificaron esto hace dos mil años y desarrollaron un conjunto de prácticas para entrenar la mente en la dirección opuesta: no para querer menos, sino para ver más. Para que lo que ya tenés empiece a pesar lo que realmente vale." },
      { type: "quote", text: "Rico no es el que más tiene. Es el que menos necesita para estar bien. Esa es la riqueza que ningún evento externo puede quitarte." },
    ]
  },
  {
    id: "gap",
    label: "EL GAP",
    title: "Por qué la satisfacción siempre parece estar un paso adelante",
    body: [
      { type: "p", text: "La neurociencia llama a este mecanismo 'adaptación hedónica': el cerebro se acostumbra rápido a cualquier nivel de bienestar y vuelve a una línea base. Un aumento de sueldo genera felicidad durante semanas. Una casa nueva, durante meses. Después, se vuelve fondo. Y el deseo apunta al próximo escalón." },
      { type: "tip", label: "El diseño del problema", text: "Este mecanismo no es un defecto — fue útil evolutivamente. Un ancestro que se conformaba con lo que tenía no sobrevivía. Pero hoy, en un mundo donde las necesidades básicas están cubiertas para la mayoría, ese mismo mecanismo genera una insatisfacción crónica sin origen real." },
      { type: "p", text: "Hay dos formas de cerrar el gap. Una es conseguir lo que falta — el camino que todos intentan, el que no tiene fin. La otra es ajustar la percepción de lo que ya tenés. No como conformismo, sino como entrenamiento: ver con más claridad lo que la adaptación hedónica volvió invisible." },
      { type: "p", text: "Las tres técnicas de este módulo son ese entrenamiento. No son positivismos. Son prácticas concretas con mecanismos fisiológicos y psicológicos comprobados." },
    ]
  },
  {
    id: "premeditatio",
    label: "TÉCNICA 1",
    title: "Premeditatio malorum — visualización negativa",
    body: [
      { type: "p", text: "Esta es probablemente la práctica estoica más malinterpretada. 'Premeditatio malorum' significa literalmente 'premeditar los males' — y suena a todo lo opuesto al pensamiento positivo que suele promoverse." },
      { type: "p", text: "La idea no es pensar negativamente. Es imaginar brevemente la pérdida de lo que valorás para despertar la gratitud que la costumbre adormeció. Marco Aurelio lo practicaba. Epicteto lo enseñaba. Séneca escribió sobre ello. Y la investigación moderna en psicología positiva lo respalda." },
      { type: "tip", label: "Cómo funciona", text: "Cuando imaginás no tener algo que das por sentado — salud, un vínculo, tu trabajo, un lugar que querés — el cerebro experimenta una fracción de esa pérdida. Al volver a la realidad, lo que antes era fondo se vuelve figura. El contraste genera gratitud genuina, no forzada." },
      { type: "block", label: "Dos usos prácticos", items: [
        { arrow: true, bold: "Como práctica diaria:", text: " Elegís algo que das por sentado. Imaginás brevemente no tenerlo. Volvés al presente con otro nivel de apreciación. Dos minutos." },
        { arrow: true, bold: "En el momento del problema:", text: " Algo te molesta o preocupa. En lugar de engancharte, expandís el contexto: '¿cuál sería una versión peor de esto?' Automáticamente baja la intensidad emocional y volvés a la perspectiva." },
      ]},
      { type: "quote", text: "No se trata de 'hay gente peor'. Eso mal usado genera culpa. Se trata de ver con más claridad lo que la costumbre hizo invisible." },
    ]
  },
  {
    id: "retrospection",
    label: "TÉCNICA 2",
    title: "Prospective retrospection — tu yo del futuro ya extraña este momento",
    body: [
      { type: "p", text: "William Irvine, filósofo y autor de 'A Guide to the Good Life', desarrolló esta técnica a partir del estoicismo clásico. La llama prospective retrospection: mirar el presente desde el futuro." },
      { type: "p", text: "La idea es simple pero transformadora: imaginás que sos tu yo del futuro — cinco, diez, veinte años adelante — mirando hacia atrás a este momento exacto. Ese yo del futuro ve lo que vos hoy das por sentado como algo extraordinariamente valioso." },
      { type: "tip", label: "La persona que desearía tu vida", text: "Irvine lo plantea así: hay alguien en el mundo — quizás vos mismo en el futuro — que daría mucho por estar exactamente donde estás ahora. Con la salud que tenés. Con los vínculos que tenés. Con las posibilidades que tenés. El futuro vos miraría el presente vos y diría: disfrutalo." },
      { type: "p", text: "Esto no es conformismo ni resignación. Es una herramienta de perspectiva que cierra el gap desde adentro. No cambiando lo que tenés — cambiando cómo lo ves. Y esa diferencia perceptual tiene efectos emocionales reales y medibles." },
      { type: "attributed", text: "Imaginar que el yo futuro mira hacia atrás con nostalgia sobre el presente es una de las formas más efectivas de despertar gratitud sin necesidad de ningún evento externo.", author: "William B. Irvine, The Stoic Path" },
    ]
  },
  {
    id: "dreamlife",
    label: "TÉCNICA 3",
    title: "'You are living the dream life' — reconocer lo que ya es extraordinario",
    body: [
      { type: "p", text: "Esta técnica conecta las dos anteriores y las lleva a una conclusión: lo que tenés hoy — en este momento — es exactamente lo que muchas personas en el mundo, y quizás vos mismo en otro momento de tu vida, considerarían una vida soñada." },
      { type: "p", text: "No es una afirmación vacía. Es un acto de reconocimiento honesto. La salud básica, el acceso a información, la libertad de elegir cómo pasar el tiempo, los vínculos que importan — cada uno de estos elementos es escaso a escala global y a escala histórica." },
      { type: "tip", label: "El contraste real", text: "Una experiencia como vivir en un lugar muy distinto al propio — o simplemente observar con atención — resetea el estándar interno. El efecto dura poco porque la adaptación hedónica vuelve. Pero esta técnica permite recrear ese 'shock de realidad' de forma consciente, sin necesitar el viaje." },
      { type: "block", label: "Las tres anclas", items: [
        { arrow: true, bold: "La salud:", text: " Funciona el cuerpo. La mente opera. Para alguien con una enfermedad crónica, eso es una riqueza incomparable." },
        { arrow: true, bold: "Los vínculos:", text: " Hay personas que te importan y te importan a vos. Eso no es universal ni permanente." },
        { arrow: true, bold: "La posibilidad:", text: " Podés elegir cómo vivir hoy. Podés leer esto. Podés aprender. Para la mayoría de la historia humana, eso fue un lujo extremo." },
      ]},
      { type: "quote", text: "La vida que tenés hoy — con todo lo que falta, con todo lo que no salió — mucha gente la elegiría sin dudar." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Visualización de 2 minutos · 3 gratitudes concretas · Ancla del presente",
    body: [
      { type: "p", text: "Esta práctica combina las tres técnicas en una secuencia de menos de 5 minutos. Puede hacerse a la mañana, al mediodía, o antes de dormir. La consistencia importa más que el momento." },
      { type: "block", label: "La secuencia", items: [
        { arrow: true, bold: "1. Visualización negativa (2 min):", text: " Elegí una cosa que tenés — salud, un vínculo, tu trabajo. Imaginá brevemente no tenerlo. No en detalle, no con drama. Solo lo suficiente para sentir el contraste. Después volvé." },
        { arrow: true, bold: "2. Tres gratitudes concretas:", text: " No abstractas ('la vida', 'la familia'). Concretas y presentes: 'que esta mañana pude despertarme sin dolor', 'la conversación de ayer con X', 'que pude tomar decisiones hoy'. Lo específico activa más que lo genérico." },
        { arrow: true, bold: "3. Prospective retrospection:", text: " Una pregunta: ¿qué vería tu yo de dentro de diez años en este momento que vos hoy no estás viendo? Dejá que la respuesta aparezca. No la fuerces." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hay algo en tu vida que hayas dejado de ver porque te acostumbraste? ¿Qué cosas darías por sentado que, si las perdieras, cambiarían todo?" },
      { type: "quote", text: "La gratitud genuina no se produce decidiendo estar agradecido. Se produce entrenando la percepción para ver lo que la costumbre volvió invisible." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hay algo que doy por sentado hoy que, si lo imaginara perder, cambiaría cómo lo veo?",
        "¿Cuándo fue la última vez que sentí gratitud genuina — no como ejercicio, sino como respuesta a algo real?",
        "¿Qué vería tu yo de dentro de diez años en este momento de tu vida que vos hoy no estás valorando?",
        "¿El gap que sentís ahora es por algo que realmente falta, o por adaptación hedónica a lo que ya tenés?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Cerrar el gap no es resignarse. Es elegir desde la abundancia en lugar de desde la carencia. Y esa elección cambia todo lo que viene después." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "Intro", text: "Hay una forma de sufrimiento que no aparece en los libros de medicina pero que afecta a casi todo el mundo.\n\nSe llama el gap. La distancia entre lo que tenemos y lo que creemos que necesitamos para estar bien.\n\nEl problema con el gap no es su tamaño. Es que el cerebro está diseñado para mantenerlo abierto. Cada vez que conseguís algo que querías, el estándar sube. La satisfacción dura poco. La sensación de falta vuelve.\n\nLos estoicos identificaron esto hace dos mil años. Y desarrollaron un conjunto de prácticas para entrenar la mente en la dirección opuesta.\n\nHoy vemos tres de esas técnicas." },
  { time: "2:00 – 5:00", title: "Premeditatio malorum", text: "La primera técnica se llama premeditatio malorum — premeditar los males.\n\nSuena pesimista. No lo es.\n\nLa idea es imaginar brevemente la pérdida de algo que valorás. No en detalle, no con drama. Lo suficiente para sentir el contraste.\n\nCuando imaginás no tener algo que das por sentado — salud, un vínculo, tu trabajo — el cerebro experimenta una fracción de esa pérdida. Al volver a la realidad, lo que antes era fondo se vuelve figura. El contraste genera gratitud genuina.\n\nDos usos prácticos.\n\nComo práctica diaria: elegís algo, imaginás brevemente no tenerlo, volvés al presente. Dos minutos.\n\nEn el momento del problema: algo te molesta. En lugar de engancharte, preguntás: ¿cuál sería una versión peor de esto? Automáticamente baja la intensidad emocional.\n\nNo se trata de 'hay gente peor'. Eso mal usado genera culpa. Se trata de ver con más claridad lo que la costumbre hizo invisible." },
  { time: "5:00 – 7:30", title: "Prospective retrospection", text: "La segunda técnica la desarrolló William Irvine, filósofo estoico contemporáneo. La llama prospective retrospection.\n\nEs simple: imaginás que sos tu yo del futuro — cinco, diez años adelante — mirando hacia atrás a este momento exacto.\n\nEse yo del futuro ve lo que vos hoy das por sentado como algo extraordinariamente valioso.\n\nIrvine lo plantea así: hay alguien que daría mucho por estar exactamente donde estás ahora. Con la salud que tenés. Con los vínculos que tenés. Con las posibilidades que tenés.\n\nEse alguien sos vos mismo, en el futuro, mirando hacia acá.\n\nEsto cierra el gap desde adentro. No cambiando lo que tenés — cambiando cómo lo ves." },
  { time: "7:30 – 9:00", title: "Práctica guiada", text: "Vamos a hacer la secuencia completa. Tres pasos.\n\nPrimero, elegí una cosa que tenés — puede ser salud, un vínculo, algo cotidiano. Tenerla en mente.\n\n[pausa — 5 seg]\n\nAhora, imaginá brevemente no tenerla. Sin drama. Solo el contraste.\n\n[pausa — 10 seg]\n\nVolvé. Eso que tenés todavía está ahí.\n\n[pausa — 5 seg]\n\nAhora, tres cosas concretas por las que estás agradecido hoy. No abstractas — específicas. Lo que pasó hoy, esta semana, este momento.\n\n[pausa — 15 seg]\n\nY la última pregunta. Tu yo de dentro de diez años mira hacia acá. ¿Qué vería que vos hoy no estás viendo?\n\n[pausa larga — 12 seg]\n\nEso que apareció — eso es lo que ya tenés." },
  { time: "9:00 – 10:00", title: "Cierre", text: "Cerrar el gap no es resignarse a lo que hay.\n\nEs elegir desde la abundancia en lugar de desde la carencia. Y esa diferencia cambia todo lo que viene después — cómo te relacionás, cómo trabajás, cómo vivís lo cotidiano.\n\nEl próximo módulo trabaja el sistema inmune mental — la resiliencia. Séneca se hacía pobre voluntariamente para no tenerle miedo a la pobreza. La incomodidad elegida es la práctica más efectiva de fortaleza que existe.\n\nPrimero la gratitud. Después la fortaleza. El orden importa." },
] },
  9: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "La resiliencia no aparece cuando la necesitás. Se construye antes.",
    body: [
      { type: "p", text: "Hay una diferencia fundamental entre las personas que se quiebran ante la adversidad y las que no. No es suerte, no es carácter de nacimiento, no es fuerza de voluntad. Es entrenamiento." },
      { type: "p", text: "El sistema inmune del cuerpo funciona así: se fortalece por exposición controlada a patógenos, no evitándolos. Un sistema inmune que nunca fue desafiado es un sistema débil. La primera vez que enfrenta algo serio, no sabe cómo responder." },
      { type: "p", text: "La mente funciona exactamente igual. Un sistema nervioso que nunca fue expuesto a incomodidad, frustración o adversidad voluntaria no tiene los recursos para manejarlos cuando llegan. Y siempre llegan." },
      { type: "quote", text: "Entreno en lo incómodo para no romperme en lo difícil. La incomodidad elegida hoy es la fortaleza disponible mañana." },
    ]
  },
  {
    id: "seneca",
    label: "SÉNECA Y LA POBREZA VOLUNTARIA",
    title: "Hacerse pobre voluntariamente para no tenerle miedo a la pobreza",
    body: [
      { type: "p", text: "Séneca era uno de los hombres más ricos de Roma. Y regularmente pasaba períodos de vida austera voluntaria: comida simple, ropa ordinaria, sueño en condiciones básicas. No por ascetismo ni religión. Por entrenamiento." },
      { type: "p", text: "La lógica era clara: si sos rico pero nunca viviste sin lujo, le tenés miedo a perderlo. Ese miedo te controla. Te hace tomar decisiones desde el pánico en lugar de desde la claridad. Séneca quería poder elegir desde la abundancia, no desde el miedo a la escasez." },
      { type: "tip", label: "El principio", text: "No se trata de sufrir. Se trata de demostrarle al sistema nervioso que puede estar bien en condiciones difíciles. Una vez que el cuerpo y la mente saben eso, el miedo a perder lo que tenés se reduce dramáticamente. Y esa libertad interna vale más que cualquier riqueza material." },
      { type: "p", text: "Este mismo principio aplica a cualquier cosa que temés perder: un trabajo, un vínculo, una comodidad, una rutina. La práctica de pasar sin eso — voluntariamente, por períodos cortos — recalibra la dependencia. No eliminás el deseo. Eliminás el miedo." },
      { type: "attributed", text: "Separa unos días durante los que te conformarás con la alimentación más escasa y barata, con ropa ruda y tosca, y dirás: ¿es esto lo que temía?", author: "Séneca, Cartas a Lucilio" },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA",
    title: "Por qué la incomodidad controlada fortalece el sistema",
    body: [
      { type: "p", text: "Andrew Huberman y otros investigadores documentaron los mecanismos fisiológicos detrás de lo que los estoicos descubrieron por observación: la exposición controlada al estrés físico y mental produce adaptaciones reales en el sistema nervioso." },
      { type: "block", label: "Los mecanismos medibles", items: [
        { arrow: true, bold: "Exposición al frío:", text: " Activa la termogénesis, estimula la producción de grasa marrón y entrena la respuesta al estrés agudo. El sistema nervioso aprende a calmar la reacción de pánico. Lo que empezó siendo insoportable se vuelve manejable — y ese aprendizaje se transfiere a otros tipos de estrés." },
        { arrow: true, bold: "Ejercicio de alta intensidad:", text: " El esfuerzo físico genuino — cuando querés parar y seguís — entrena el umbral de tolerancia al malestar. No solo el físico. La mente aprende que puede seguir funcionando aunque el cuerpo proteste." },
        { arrow: true, bold: "Estrés hormético:", text: " Pequeñas dosis de estrés controlado (frío, calor, ayuno, esfuerzo) producen adaptaciones que hacen al sistema más robusto. El mecanismo es el mismo que el del músculo: sin resistencia, no hay crecimiento." },
      ]},
      { type: "quote", text: "La diferencia entre el estrés que destruye y el estrés que fortalece es una sola variable: si lo elegiste o te eligió a vos." },
    ]
  },
  {
    id: "practica_incomodidad",
    label: "LA PRÁCTICA",
    title: "Incomodidad diaria elegida — tres niveles",
    body: [
      { type: "p", text: "No hace falta vivir como un monje ni bañarse en hielo para entrenar el sistema inmune mental. La lógica es acumular pequeñas exposiciones conscientes a la incomodidad de forma consistente. La consistencia importa más que la intensidad." },
      { type: "block", label: "Nivel físico", items: [
        { arrow: true, bold: "Ducha fría:", text: " 30 a 90 segundos de agua fría al final de la ducha. No es necesario hacerla completamente fría. El objetivo es entrenar la respuesta al estrés agudo, no castigarse. Cuando querés salir y aguantás — eso es el entrenamiento." },
        { arrow: true, bold: "Esfuerzo genuino:", text: " En el ejercicio, llegar al punto donde querés parar y sostener un poco más. Ese margen — pequeño y consistente — es donde se construye el umbral." },
        { arrow: true, bold: "Austeridad ocasional:", text: " Un día de comida simple, una noche sin las comodidades habituales, un período sin algo que usás en automático. No para sufrir. Para recordarle al sistema que puede." },
      ]},
      { type: "block", label: "Nivel mental", items: [
        { arrow: true, bold: "Hacer lo difícil primero:", text: " Empezar el día con la tarea que más evitás. Cada vez que lo hacés, el cerebro aprende que puede funcionar sin la gratificación inmediata." },
        { arrow: true, bold: "Conversaciones incómodas:", text: " No evitar los temas difíciles. La evitación sistemática de la incomodidad social construye ansiedad, no protección." },
        { arrow: true, bold: "Exposición al rechazo o al fracaso:", text: " Intentar cosas donde hay probabilidad de fracasar. Cada fracaso procesado conscientemente construye el sistema inmune frente al siguiente." },
      ]},
      { type: "tip", label: "La regla", text: "Que sea incómodo pero no destructivo. No es sufrir por sufrir. Es expandir el umbral de tolerancia de forma gradual y sostenida." },
    ]
  },
  {
    id: "silver_linings",
    label: "SILVER LININGS",
    title: "Entrenar la mente para encontrar lo valioso en la adversidad",
    body: [
      { type: "p", text: "William Irvine describe lo que llama silver linings: la práctica consciente de buscar qué hay de valioso dentro de cada situación adversa. No como positivismo forzado. Como entrenamiento perceptivo." },
      { type: "p", text: "El cerebro, por diseño evolutivo, detecta amenazas y pérdidas con mucha más facilidad que oportunidades y ganancias. La práctica de los silver linings no niega el problema — lo atraviesa buscando activamente qué información o qué posibilidad contiene." },
      { type: "block", label: "Ejemplos reales", items: [
        { arrow: true, bold: "Una tarea aburrida:", text: " La repetición forzada puede revelar una forma mejor de hacerla, o desarrollar paciencia genuina." },
        { arrow: true, bold: "Una crítica dura:", text: " Puede contener información que nadie más se animó a darte. La pregunta útil: ¿hay algo verdadero acá que puedo usar?" },
        { arrow: true, bold: "Un período difícil (pandemia, crisis):", text: " Fuerza reorganización de prioridades, acelera creatividad, profundiza vínculos. Lo que hubiera tardado años en cambiar, cambia en meses." },
        { arrow: true, bold: "El fracaso en algo importante:", text: " Revela supuestos erróneos que el éxito hubiera dejado intactos. Es información cara pero precisa." },
      ]},
      { type: "quote", text: "La pregunta que cambia todo no es '¿por qué me pasa esto?' sino '¿qué puedo obtener de esto?' Ese cambio de una letra transforma la experiencia completa." },
    ]
  },
  {
    id: "bedtime",
    label: "BEDTIME REVIEW",
    title: "El repaso nocturno — de observador a crítico consciente",
    body: [
      { type: "p", text: "Los estoicos tenían una práctica de cierre diario que Marco Aurelio describe en sus Meditaciones y que Epicteto enseñaba a sus alumnos: repasar el día antes de dormir no para juzgarse, sino para aprender." },
      { type: "p", text: "La diferencia con la rumiación es crítica. La rumiación repite el evento sin producir aprendizaje. El bedtime review tiene una estructura: identificar qué pasó, qué reacción tuviste, qué hubieras preferido hacer diferente. Tres preguntas, sin drama." },
      { type: "tip", label: "La secuencia", text: "¿Dónde reaccioné en lugar de responder hoy? ¿Qué hice bien que vale la pena sostener? ¿Qué haría diferente si esa situación vuelve? No es autoflagelación. Es el mismo principio que el atleta que revisa el video del partido: no para castigarse, sino para mejorar la próxima jugada." },
      { type: "p", text: "Esta práctica, sostenida en el tiempo, construye una capacidad de autoconocimiento que ningún test externo puede dar: el mapa real de cómo funcionás bajo presión, con quién reaccionás más, en qué contextos perdés el eje. Esa información es la materia prima del cambio real." },
    ]
  },
  {
    id: "critica",
    label: "CRÍTICA CONSCIENTE",
    title: "Cómo recibir crítica sin defenderse ni quebrarse",
    body: [
      { type: "p", text: "El sistema inmune mental también incluye una capacidad específica: recibir crítica sin que active el modo defensa o el modo derrumbe. Ambos son reacciones automáticas del sistema nervioso — no respuestas elegidas." },
      { type: "block", label: "Dos tipos de crítica — dos respuestas distintas", items: [
        { arrow: true, bold: "Crítica constructiva:", text: " Tiene fundamentos, señala algo específico, viene desde un lugar de información genuina. La respuesta útil: escuchar antes de responder, buscar lo que puede ser verdad, separar la forma del contenido." },
        { arrow: true, bold: "Crítica destructiva:", text: " No tiene fundamentos específicos, viene del estado emocional del otro, busca dañar más que informar. La respuesta útil: no absorberla como verdad, no reaccionar desde el ego herido, dejarla pasar." },
      ]},
      { type: "p", text: "La capacidad de hacer esta distinción en tiempo real — sin ponerse a la defensiva ni quebrarse — es una de las habilidades más valiosas que existe. Y se entrena exactamente igual que el resto: con práctica repetida y con el bedtime review como herramienta de calibración." },
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Cuándo recibís crítica, tu primera reacción es defenderte, cerrarte, o quedarte pensando en eso días después? ¿Qué dice eso sobre dónde está la fragilidad?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hay algo que evitás sistemáticamente por incomodidad? ¿Qué te dice eso sobre dónde está la fragilidad?",
        "¿Elegiste alguna incomodidad voluntaria hoy? ¿Cómo te quedaste después?",
        "¿Hubo alguna situación adversa reciente donde puedas encontrar un silver lining real — no forzado?",
        "¿Qué habrías hecho diferente en algún momento de hoy? ¿Qué aprendés de eso?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "La fortaleza no se construye en los momentos grandes. Se construye en la acumulación de los pequeños: cada ducha fría, cada conversación difícil, cada revisión honesta del día. Ese es el entrenamiento." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "Intro", text: "Hay una diferencia entre las personas que se quiebran ante la adversidad y las que no. No es suerte. No es carácter de nacimiento.\n\nEs entrenamiento.\n\nEl sistema inmune del cuerpo se fortalece por exposición controlada — no evitando patógenos. Un sistema que nunca fue desafiado es un sistema débil.\n\nLa mente funciona exactamente igual. Un sistema nervioso que nunca fue expuesto a incomodidad voluntaria no tiene los recursos para manejarla cuando llega sin aviso. Y siempre llega.\n\nEste módulo es sobre construir ese sistema antes de necesitarlo." },
  { time: "2:00 – 5:00", title: "Séneca y la incomodidad", text: "Séneca era uno de los hombres más ricos de Roma. Y regularmente pasaba períodos de vida austera voluntaria: comida simple, ropa ordinaria, condiciones básicas.\n\nNo por religión. Por entrenamiento.\n\nLa lógica era clara: si sos rico pero nunca viviste sin lujo, le tenés miedo a perderlo. Ese miedo te controla. Séneca quería poder elegir desde la abundancia — no desde el miedo a la escasez.\n\nY lo mismo aplica a lo que vos temés perder hoy: un trabajo, una comodidad, una rutina, un vínculo. Pasar sin eso voluntariamente — por períodos cortos, de forma controlada — recalibra la dependencia.\n\nLa diferencia entre el estrés que destruye y el que fortalece es una sola variable: si lo elegiste o te eligió a vos.\n\nTres prácticas concretas: ducha fría al final de la ducha — 30 a 90 segundos. Hacer lo difícil primero. Y una pequeña austeridad ocasional — algo que usás en automático, un día sin eso." },
  { time: "5:00 – 7:30", title: "Silver linings y bedtime review", text: "William Irvine describe los silver linings: buscar conscientemente qué hay de valioso dentro de cada situación adversa.\n\nNo es positivismo forzado. Es entrenamiento perceptivo.\n\nCada adversidad contiene algo: información que el éxito no hubiera dado, una posibilidad que la comodidad no hubiera forzado, un cambio que de otra forma hubiera tardado años.\n\nLa pregunta que cambia todo no es '¿por qué me pasa esto?' sino '¿qué puedo obtener de esto?'\n\nY al final del día — el bedtime review. Tres preguntas. Sin drama.\n\n¿Dónde reaccioné en lugar de responder hoy?\n¿Qué hice bien que vale sostener?\n¿Qué haría diferente si esa situación vuelve?\n\nNo es rumiación. Es lo que hace el atleta que revisa el video del partido. No para castigarse. Para mejorar la próxima jugada." },
  { time: "7:30 – 9:00", title: "Práctica guiada — bedtime review", text: "Vamos a hacer el bedtime review ahora.\n\nPensá en el día de hoy. Algún momento que se quedó dando vueltas — una reacción, una conversación, algo que hiciste o dejaste de hacer.\n\n[pausa — 8 seg]\n\nPrimera pregunta: ¿reaccioné o respondí? ¿Hubo algún momento donde el automático tomó el control?\n\n[pausa — 10 seg]\n\nSegunda: ¿qué hice bien hoy? No lo más grande — algo concreto y real.\n\n[pausa — 8 seg]\n\nTercera: si esa situación vuelve, ¿qué harías diferente? No desde la culpa — desde el aprendizaje.\n\n[pausa — 10 seg]\n\nY la última: ¿hay algún silver lining en algo difícil que pasó hoy o esta semana? ¿Qué podría contener eso que todavía no estás viendo?\n\n[pausa larga — 12 seg]" },
  { time: "9:00 – 10:00", title: "Cierre", text: "La fortaleza no se construye en los momentos grandes.\n\nSe construye en la acumulación de los pequeños: cada ducha fría, cada conversación difícil, cada revisión honesta del día.\n\nEso es el sistema inmune mental. No la ausencia de adversidad — la capacidad de atravesarla sin quebrarse.\n\nEl próximo módulo trabaja el polo opuesto de todo esto: la anti-victimización y la responsabilidad radical. Cómo el lenguaje que usás para describir lo que te pasa determina el poder que tenés sobre ello.\n\nPrimero la fortaleza. Después la responsabilidad. La secuencia importa." },
] },
  10: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "No siempre sos culpable. Pero siempre sos responsable.",
    body: [
      { type: "p", text: "Hay una idea que genera resistencia inmediata cuando se escucha por primera vez: que la mayor parte del sufrimiento que experimentamos no viene de lo que nos pasa, sino de la posición que adoptamos frente a lo que nos pasa." },
      { type: "p", text: "Esa posición tiene un nombre. Se llama victimización. Y el problema no es que sea falsa — a veces las cosas realmente son injustas, y el dolor es real. El problema es que es inútil. La victimización da alivio inmediato pero debilita a largo plazo." },
      { type: "p", text: "Este módulo no niega la realidad de las circunstancias difíciles. Propone algo distinto: que incluso dentro de lo que no elegiste, siempre hay un margen de elección. Y en ese margen vive todo el poder personal que podés tener." },
      { type: "quote", text: "Si el problema siempre está afuera, la solución también queda afuera. Y eso te deja esperando que el mundo cambie para poder estar bien." },
    ]
  },
  {
    id: "trampa",
    label: "LA TRAMPA",
    title: "Por qué el cerebro prefiere culpar hacia afuera",
    body: [
      { type: "p", text: "El cerebro tiene una tendencia natural a buscar culpables externos porque eso protege momentáneamente al ego. Si el problema está afuera: no hay responsabilidad, no hay incomodidad, no hay necesidad de cambiar nada." },
      { type: "p", text: "En el corto plazo, eso se siente como alivio. En el largo plazo, el costo es enorme: se pierde poder personal, aparece resentimiento crónico, uno queda atrapado esperando que cambien los demás para poder estar bien." },
      { type: "tip", label: "El mecanismo", text: "La victimización genera dependencia emocional. Cuando tu bienestar depende de que otro actúe diferente, de que las circunstancias sean distintas, de que el pasado no haya pasado, el bienestar queda fuera de tu alcance de forma permanente. No porque sea imposible mejorar las circunstancias — sino porque ese no puede ser el único camino." },
      { type: "block", label: "Lo que la victimización genera", items: [
        { arrow: true, bold: "Resentimiento:", text: " la energía que podría ir al cambio se va en la queja." },
        { arrow: true, bold: "Impotencia aprendida:", text: " el sistema nervioso aprende que no puede hacer nada y deja de intentarlo." },
        { arrow: true, bold: "Estancamiento:", text: " sin responsabilidad propia, no hay aprendizaje. El mismo patrón se repite." },
        { arrow: true, bold: "Aislamiento:", text: " la victimización crónica drena los vínculos. Nadie puede sostener indefinidamente ese rol." },
      ]},
    ]
  },
  {
    id: "culpa_vs_responsabilidad",
    label: "UNA DISTINCIÓN CLAVE",
    title: "Culpa vs. responsabilidad — no son lo mismo",
    body: [
      { type: "p", text: "Este es el malentendido más común cuando se habla de responsabilidad radical. Mucha gente lo interpreta como: 'todo lo que te pasa es tu culpa'. No es eso." },
      { type: "block", label: "La diferencia", items: [
        { arrow: true, bold: "Culpa:", text: " paraliza. Genera vergüenza. Drena energía. Mira al pasado. 'Soy un fracaso.' 'Todo me pasa por algo que hice mal.'" },
        { arrow: true, bold: "Responsabilidad:", text: " empodera. Genera aprendizaje. Devuelve control. Mira al futuro. '¿Qué puedo hacer con esto? ¿Qué aprendo? ¿Cómo respondo mejor?'" },
      ]},
      { type: "p", text: "La culpa pregunta: ¿de quién es la falta? La responsabilidad pregunta: ¿qué puedo hacer ahora? Son preguntas que se parecen pero llevan a lugares completamente distintos." },
      { type: "tip", label: "El cambio de pregunta", text: "Cuando algo difícil pasa, el movimiento no es de 'soy culpable' a 'no soy culpable'. Es de 'de quién es la culpa' a '¿qué puedo hacer con esto?' Ese desplazamiento recupera poder sin negar la realidad." },
      { type: "attributed", text: "No controla las cosas el que las posee, sino el que puede prescindir de ellas sin que su ánimo se altere.", author: "Epicteto" },
    ]
  },
  {
    id: "estoico_kabbalah",
    label: "DOS MARCOS",
    title: "El estoicismo y la Kabbalah aplicada — la misma idea desde dos tradiciones",
    body: [
      { type: "p", text: "Tanto el estoicismo como la Kabbalah convergen en un punto central: la verdadera libertad empieza cuando uno deja de entregar el control de su vida a factores externos." },
      { type: "block", label: "Visión estoica", items: [
        { arrow: true, bold: "Lo que depende de mí:", text: " mis pensamientos, mis acciones, mis hábitos, mis respuestas, mis valores. Ahí va la energía." },
        { arrow: true, bold: "Lo que no depende de mí:", text: " opiniones ajenas, el pasado, la economía, las decisiones de otros, los resultados finales. Ahí va la aceptación." },
        { arrow: true, bold: "El entrenamiento:", text: " ante cualquier situación, preguntar: ¿qué parte de esto depende de mí? ¿Qué puedo aprender? ¿Cómo puedo responder mejor?" },
      ]},
      { type: "block", label: "Visión Kabbalah aplicada", items: [
        { arrow: true, bold: "Conciencia reactiva vs. proactiva:", text: " la victimización es una forma de conciencia reactiva — el ego necesita tener razón, sentirse moralmente superior, encontrar culpables." },
        { arrow: true, bold: "Tikkún:", text: " cada dificultad revela algo interno que todavía necesita equilibrio. No para castigarse, sino para evolucionar. La pregunta no es '¿por qué me pasa esto?' sino '¿qué patrón se repite? ¿qué aspecto mío necesita trabajarse?'" },
      ]},
      { type: "quote", text: "Ambas tradiciones dicen lo mismo con distintas palabras: el obstáculo no es el enemigo. El obstáculo es el maestro. La pregunta es si estás dispuesto a aprender." },
    ]
  },
  {
    id: "lenguaje",
    label: "EL LENGUAJE DE VÍCTIMA",
    title: "Cómo el lenguaje revela y refuerza la posición de víctima",
    body: [
      { type: "p", text: "Hay frases que usamos en automático y que, sin que lo notemos, refuerzan la posición de víctima cada vez que las usamos. El lenguaje no es solo una descripción de la realidad — la construye." },
      { type: "block", label: "Frases que ceden poder", items: [
        { arrow: false, bold: "→", text: " 'Me arruinaron el día.'" },
        { arrow: false, bold: "→", text: " 'Por culpa de X no pude hacer Y.'" },
        { arrow: false, bold: "→", text: " 'Si ellos cambiaran, yo estaría bien.'" },
        { arrow: false, bold: "→", text: " 'No puedo porque...' (cuando en realidad es 'elijo no hacer' o 'todavía no sé cómo')." },
        { arrow: false, bold: "→", text: " 'Siempre me pasa esto a mí.'" },
      ]},
      { type: "block", label: "Reencuadres que recuperan poder", items: [
        { arrow: true, bold: "'Me arruinaron el día'", text: " → 'Reaccioné de una forma que no quiero. ¿Qué parte depende de mí?'" },
        { arrow: true, bold: "'No puedo porque X'", text: " → '¿Qué sí puedo hacer dentro de estas condiciones?'" },
        { arrow: true, bold: "'Siempre me pasa esto'", text: " → '¿Qué patrón estoy repitiendo? ¿Qué papel tengo en este ciclo?'" },
      ]},
      { type: "p", text: "La detección del lenguaje de víctima no es para juzgarse. Es para hacer visible algo que opera en automático. Lo que se hace visible se puede elegir." },
    ]
  },
  {
    id: "fracaso",
    label: "EL FRACASO COMO INFORMACIÓN",
    title: "Cuando el fracaso deja de ser identidad y se convierte en datos",
    body: [
      { type: "p", text: "La victimización frente al fracaso tiene una forma específica: convertirlo en identidad. 'Soy un fracaso' en lugar de 'esto no funcionó'. Esa diferencia, aparentemente pequeña, lo cambia todo." },
      { type: "p", text: "El fracaso como identidad paraliza. El fracaso como información moviliza. Un resultado que no fue el esperado contiene datos que el éxito no hubiera dado: supuestos erróneos, habilidades que faltan, ajustes necesarios." },
      { type: "tip", label: "La pregunta que transforma el fracaso", text: "'¿Esto no funcionó' → ¿Qué aprendí? ¿Qué ajusto? ¿Cómo me recupero más rápido esta vez? La verdadera autoconfianza no viene de que todo salga bien. Viene de la evidencia acumulada de que podés atravesar lo difícil y seguir." },
      { type: "p", text: "Las personas más resilientes no son las que menos fracasaron. Son las que más veces se reconstruyeron — y en cada reconstrucción encontraron que eran capaces de más de lo que creían." },
      { type: "quote", text: "La confianza real no es 'todo me sale bien'. Es 'aunque salga mal, voy a poder enfrentarlo'. Y eso solo se construye enfrentando cosas que salen mal." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Detección de lenguaje de víctima · Reencuadre · Stoic testing",
    body: [
      { type: "p", text: "Tres prácticas concretas que se refuerzan entre sí. La primera es de observación, la segunda de reencuadre, la tercera de verificación." },
      { type: "block", label: "1. Detección de lenguaje de víctima", items: [
        { arrow: true, bold: "", text: "Durante el día, prestá atención a las frases que usás — en voz alta o internamente — que ceden poder o culpan hacia afuera." },
        { arrow: true, bold: "", text: "No para juzgarte. Para notarlo. El solo acto de notar interrumpe el automático." },
        { arrow: true, bold: "", text: "Al final del día: ¿cuántas veces usé lenguaje de víctima? ¿En qué contextos aparece más?" },
      ]},
      { type: "block", label: "2. Reencuadre de responsabilidad", items: [
        { arrow: true, bold: "", text: "Ante cualquier situación difícil, aplicar la pregunta: ¿qué parte de esto depende de mí — aunque sea mínima?" },
        { arrow: true, bold: "", text: "No buscar el 100% de responsabilidad en todo. Buscar el margen real de acción que siempre existe." },
        { arrow: true, bold: "", text: "Ese margen, por pequeño que sea, es donde vive el poder personal." },
      ]},
      { type: "block", label: "3. Stoic testing", items: [
        { arrow: true, bold: "", text: "Cuando algo te genera una reacción fuerte, aplicar el filtro del módulo 07: ¿depende de mí o no depende de mí?" },
        { arrow: true, bold: "", text: "Si no depende: soltar activamente, no pasivamente. 'Elijo no gastar energía en esto.'" },
        { arrow: true, bold: "", text: "Si depende: identificar el paso más pequeño posible que podés dar ahora." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿En qué área de tu vida tendés más a ceder poder hacia afuera? ¿Trabajo, vínculos, salud? ¿Hay un patrón que se repite que todavía no nombraste?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Usé lenguaje de víctima hoy — en voz alta o internamente? ¿En qué momento?",
        "¿Hay una situación en tu vida donde esperás que algo externo cambie para poder estar bien? ¿Qué parte depende de vos?",
        "¿Hubo algún fracaso reciente que todavía tratás como identidad en lugar de como información?",
        "¿Qué patrón se repite en tu vida que nadie más puede cambiar — solo vos?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Recuperar el poder personal no es negar lo que pasó. Es elegir no quedar atrapado en ello. Esa elección, tomada una y otra vez, construye una forma de vivir que ninguna circunstancia externa puede quitarte." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "Intro", text: "Hay una idea que genera resistencia cuando se escucha por primera vez.\n\nQue la mayor parte del sufrimiento que experimentamos no viene de lo que nos pasa. Viene de la posición que adoptamos frente a lo que nos pasa.\n\nEsa posición tiene un nombre: victimización.\n\nY el problema no es que sea falsa — a veces las cosas son realmente injustas. El problema es que es inútil. Da alivio inmediato pero debilita a largo plazo.\n\nHoy vamos a trabajar la distinción más importante del sistema: culpa versus responsabilidad. Y cómo recuperar poder personal sin negar la realidad de lo que pasó." },
  { time: "2:00 – 5:00", title: "La trampa y la distinción", text: "El cerebro tiene una tendencia natural a buscar culpables externos. Si el problema está afuera, no hay responsabilidad, no hay incomodidad, no hay necesidad de cambiar nada.\n\nEn el corto plazo, eso se siente como alivio. En el largo plazo, el costo es enorme.\n\nPero hay una distinción crítica que mucha gente confunde:\n\nCulpa y responsabilidad no son lo mismo.\n\nLa culpa paraliza. Mira al pasado. Genera vergüenza. Drena energía. 'Soy un fracaso.'\n\nLa responsabilidad empodera. Mira al futuro. Genera aprendizaje. Devuelve control. '¿Qué puedo hacer con esto?'\n\nEl movimiento no es de 'soy culpable' a 'no soy culpable'. Es de '¿de quién es la culpa?' a '¿qué puedo hacer ahora?'\n\nEse desplazamiento — de una pregunta a otra — lo cambia todo.\n\nEpicteto lo decía así: no nos afecta lo que sucede, sino la interpretación que hacemos de lo que sucede. Y la interpretación es siempre nuestra." },
  { time: "5:00 – 7:30", title: "El lenguaje y el fracaso", text: "Hay frases que usamos en automático que refuerzan la posición de víctima cada vez que las decimos.\n\n'Me arruinaron el día.' 'Por culpa de X no pude hacer Y.' 'Siempre me pasa esto a mí.'\n\nEl lenguaje no solo describe la realidad — la construye. Cada vez que usás esas frases, le estás diciendo al sistema nervioso que el control está afuera.\n\nEl reencuadre no es forzado ni positivo. Es preciso. '¿Qué parte de esto depende de mí? ¿Aunque sea mínima?'\n\nEse margen siempre existe. Y en ese margen vive todo el poder personal.\n\nY frente al fracaso — el movimiento es el mismo. El fracaso como identidad paraliza: 'soy un fracaso'. El fracaso como información moviliza: 'esto no funcionó. ¿Qué aprendo? ¿Cómo ajusto?'\n\nLa verdadera autoconfianza no viene de que todo salga bien. Viene de la evidencia acumulada de que podés atravesar lo difícil y seguir. Eso solo se construye enfrentando cosas que salen mal." },
  { time: "7:30 – 9:00", title: "Práctica guiada", text: "Pensá en una situación actual — trabajo, un vínculo, algo que no salió — donde sentís que el problema está principalmente afuera.\n\n[pausa — 8 seg]\n\nAhora, sin negar lo que pasó, preguntate: ¿hay alguna parte de esto que depende de mí? ¿Aunque sea pequeña?\n\n[pausa — 10 seg]\n\nNo busques el 100%. Buscá el margen real. El paso más pequeño que podés dar desde acá.\n\n[pausa — 10 seg]\n\nAhora el lenguaje: ¿cómo describís esta situación normalmente? ¿Hay alguna frase que usás que ceda poder hacia afuera?\n\n[pausa — 8 seg]\n\nReencuadrá. No para negarla — para verla desde un lugar que te deje con más movimiento.\n\n[pausa — 10 seg]\n\nY la última pregunta: ¿hay algún patrón en tu vida donde esto se repite? ¿Qué dice ese patrón sobre vos — no sobre los demás?\n\n[pausa larga — 12 seg]" },
  { time: "9:00 – 10:00", title: "Cierre", text: "Recuperar el poder personal no es negar lo que pasó.\n\nEs elegir no quedar atrapado en ello. Esa elección — tomada una y otra vez — construye una forma de vivir que ninguna circunstancia externa puede quitarte.\n\nEl próximo módulo cierra el Pilar II y abre el Pilar III: el asombro, el delight y la capacidad de asombro. Después de trabajar la fortaleza y la responsabilidad, viene el polo positivo — entrenar la percepción para ver más de lo que ya está ahí.\n\nPrimero la fortaleza. Después la apertura. El orden importa." },
] },
  11: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "El cerebro se acostumbra a todo. Incluso a lo extraordinario.",
    body: [
      { type: "p", text: "Hubo un momento en tu vida en que ver el cielo estrellado te detuvo. O el mar. O la lluvia sobre los árboles. En algún punto, eso dejó de detenerte. No porque desapareciera — sino porque el cerebro aprendió a ignorarlo." },
      { type: "p", text: "Se llama adaptación perceptiva. El sistema nervioso, para ahorrar energía, deja de procesar lo que clasifica como 'conocido'. Lo extraordinario se vuelve fondo. Y lo que era fuente de asombro se vuelve ruido de fondo." },
      { type: "p", text: "El Pilar III de hapi comienza acá: en recuperar la capacidad de ver. No de pensar más claro ni de reaccionar mejor — sino de percibir más. De volver a sentir el peso y la textura de lo que ya estaba ahí todo el tiempo." },
      { type: "quote", text: "Recuperar la capacidad de asombro es recuperar sensibilidad hacia la vida. Y esa sensibilidad, una vez entrenada, cambia el sabor de todo lo demás." },
    ]
  },
  {
    id: "ciencia",
    label: "LA CIENCIA DEL ASOMBRO",
    title: "Por qué el asombro cambia el cerebro — y el cuerpo",
    body: [
      { type: "p", text: "El asombro — ese estado de admiración que aparece ante algo vasto, bello o incomprensible — tiene efectos fisiológicos medibles. No es solo una experiencia estética." },
      { type: "block", label: "Lo que el asombro produce en el sistema", items: [
        { arrow: true, bold: "Reduce el ego:", text: " las experiencias de asombro disminuyen el autoenfoque. El problema que ocupaba toda la pantalla mental de repente se vuelve pequeño frente a algo más grande." },
        { arrow: true, bold: "Baja el cortisol:", text: " la contemplación de naturaleza y belleza activa el sistema nervioso parasimpático. El mismo efecto que produce la meditación, sin la misma técnica." },
        { arrow: true, bold: "Genera conexión:", text: " el asombro activa el sentido de pertenencia a algo mayor. Marco Aurelio lo llamaba 'la simpatía de todas las cosas' — la sensación de que somos parte de un todo coherente." },
        { arrow: true, bold: "Interrumpe la rumiación:", text: " es difícil estar simultáneamente maravillado y atrapado en pensamientos negativos repetitivos. El asombro ocupa el mismo espacio mental que la preocupación — y lo desplaza." },
      ]},
      { type: "tip", label: "Lo que Marco Aurelio sabía", text: "Las Meditaciones están llenas de instrucciones para contemplar la naturaleza y el cosmos. No como escapismo — como herramienta de perspectiva. El problema cotidiano se vuelve más pequeño cuando uno contempla algo más grande que sí mismo. Eso era práctica diaria, no filosofía abstracta." },
    ]
  },
  {
    id: "delight",
    label: "EL DELIGHT",
    title: "La felicidad no depende de lo que vivís. Depende de la sensibilidad con que vivís lo que ya tenés.",
    body: [
      { type: "p", text: "William Irvine introduce el concepto de delight: no como euforia ni placer intenso, sino como la capacidad de encontrar disfrute genuino en experiencias simples y cotidianas." },
      { type: "p", text: "La mayoría de las personas vive esperando momentos grandes para sentirse bien — logros, vacaciones, reconocimiento. Pero esos momentos son escasos y el cerebro rápidamente se adapta a ellos. Entonces vuelve el vacío y la búsqueda de más estímulo." },
      { type: "p", text: "El entrenamiento del delight va en la dirección opuesta: no más cantidad de experiencias, sino más calidad de presencia en las que ya tenés." },
      { type: "block", label: "Lo que ya está disponible todos los días", items: [
        { arrow: true, bold: "", text: "El primer café de la mañana — si realmente lo tomás en lugar de hacerlo mientras mirás el teléfono." },
        { arrow: true, bold: "", text: "La sensación del cuerpo después de entrenar — si te detenés a sentirla en lugar de pasar al siguiente estímulo." },
        { arrow: true, bold: "", text: "Una conversación genuina — si estás presente en lugar de esperar tu turno para hablar." },
        { arrow: true, bold: "", text: "La luz de la tarde — si la ves en lugar de ignorarla." },
      ]},
      { type: "quote", text: "El cerebro acostumbrado deja de percibir lo que ya conoce. El entrenamiento del delight re-sensibiliza esa percepción. No cambia lo que hay — cambia cuánto de lo que hay podés realmente sentir." },
    ]
  },
  {
    id: "meta_delight",
    label: "META-DELIGHT",
    title: "De momentos de disfrute a una disposición mental permanente",
    body: [
      { type: "p", text: "Irvine va un paso más allá del delight puntual y describe lo que llama meta-delight: no solo disfrutar experiencias específicas, sino desarrollar una disposición mental que encuentra valor, belleza o disfrute en gran parte de la experiencia de estar vivo." },
      { type: "p", text: "Es un cambio de configuración mental, no de circunstancias. La vida deja de ser 'momentos buenos aislados entre estrés' y pasa a ser 'una experiencia continuamente apreciable'." },
      { type: "tip", label: "La base neurológica", text: "La atención repetida modifica circuitos neuronales. Si entrenás gratitud, contemplación, delight y asombro de forma consistente, el cerebro empieza a detectar automáticamente más cosas positivas. No porque la realidad cambie — porque cambia el filtro perceptivo. Eso es neuroplasticidad atencional en acción." },
      { type: "p", text: "Esto combate directamente la adaptación hedónica. Cuando entrenás delight, aumenta la sensibilidad y disminuye la necesidad constante de estímulos externos para sentirse bien. El gap entre lo que tenés y lo que creés necesitar empieza a cerrarse desde adentro." },
      { type: "attributed", text: "La felicidad no depende de lo que sucede, sino de la disposición mental con la que uno lo experimenta.", author: "William B. Irvine, A Guide to the Good Life" },
    ]
  },
  {
    id: "atencion",
    label: "ENTRENAMIENTO ATENCIONAL",
    title: "Lo que consumís mentalmente es lo que el cerebro aprende a buscar",
    body: [
      { type: "p", text: "La mente funciona según aquello que uno entrena a observar. No es metáfora — es fisiología. Las redes neuronales que se activan repetidamente se fortalecen. Las que no se usan se debilitan." },
      { type: "block", label: "La dieta atencional importa", items: [
        { arrow: true, bold: "Si consumís constantemente:", text: " conflicto, redes sociales, comparación, noticias negativas, estímulos artificiales — el cerebro se adapta a vivir en ese estado de alerta y ruido." },
        { arrow: true, bold: "Si entrenás conscientemente:", text: " gratitud, contemplación, delight, asombro, presencia, silencio — el cerebro lentamente reconfigura su modo por defecto hacia esos estados." },
      ]},
      { type: "p", text: "Esto no es ingenuidad ni negación de la realidad. Es lo mismo que hace el atleta con su entrenamiento físico: elegir qué inputs darle al sistema de forma consistente para que produzca outputs distintos." },
      { type: "tip", label: "La conexión con la naturaleza", text: "Caminar descalzo, contemplar árboles, ver el mar, escuchar pájaros, exponerse a luz natural — no son lujos poéticos. Son formas de recalibración biológica documentadas. Bajan cortisol, reducen hiperestimulación, mejoran claridad mental y regulan el sistema nervioso. Huberman lo documenta. Los estoicos lo practicaban. Es lo mismo dicho con distinto lenguaje." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Contemplación de 5 minutos · Entrenamiento del delight · Una ancla diaria",
    body: [
      { type: "p", text: "Tres prácticas que se pueden usar juntas o por separado. La consistencia importa más que la duración. Cinco minutos reales valen más que treinta minutos distraídos." },
      { type: "block", label: "1. Contemplación de 5 minutos", items: [
        { arrow: true, bold: "", text: "Elegí algo en la naturaleza o en tu entorno — el cielo, un árbol, la luz, el sonido de la lluvia." },
        { arrow: true, bold: "", text: "Sin analizar. Sin teléfono. Sin objetivo. Solo observar y sentir." },
        { arrow: true, bold: "", text: "Cuando la mente se vaya — y se va a ir — volvela suavemente. Eso es el entrenamiento." },
        { arrow: true, bold: "", text: "El objetivo no es vaciar la mente. Es entrenarla para regresar a lo que está frente a vos." },
      ]},
      { type: "block", label: "2. Entrenamiento del delight", items: [
        { arrow: true, bold: "", text: "Elegí una experiencia cotidiana de hoy — una comida, una caminata, una ducha, un momento de sol." },
        { arrow: true, bold: "", text: "Vivirla con atención plena y apreciación deliberada. Preguntarte: ¿qué tiene de valioso esto que normalmente ignoro?" },
        { arrow: true, bold: "", text: "No forzar entusiasmo. Solo permitir que lo que ya está ahí llegue más lejos." },
      ]},
      { type: "block", label: "3. Ancla de asombro diaria", items: [
        { arrow: true, bold: "", text: "Una vez al día, buscar conscientemente algo que genere asombro — algo vasto, bello o que te recuerde que sos parte de algo más grande." },
        { arrow: true, bold: "", text: "Puede ser pequeño: la textura de la luz al atardecer, el sonido de la ciudad desde lejos, el cielo en cualquier estado." },
        { arrow: true, bold: "", text: "Tres respiraciones lentas frente a eso. Eso es todo. Repetido todos los días, cambia el cerebro." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Cuándo fue la última vez que algo te detuvo genuinamente — no por sorpresa ni por impacto, sino por belleza o asombro? ¿Qué dice eso sobre el estado actual de tu percepción?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hubo algún momento hoy donde experimenté algo cercano al asombro o al delight — aunque sea pequeño?",
        "¿Qué experiencias cotidianas estoy ignorando que podrían ser fuente de disfrute si les prestara más atención?",
        "¿Qué estoy consumiendo mentalmente que entrena mi cerebro hacia el ruido en lugar de hacia la presencia?",
        "¿Hay algo en tu entorno inmediato que antes te generaba admiración y ahora ignorás por costumbre?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "El asombro no requiere viajes ni eventos extraordinarios. Requiere atención. Y la atención, a diferencia de las circunstancias, siempre está disponible." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Apertura del Pilar III", text: "Llegamos al tercer pilar.\n\nLos dos anteriores trabajaron la base y el entrenamiento: el cuerpo, la mente, la fortaleza, la responsabilidad.\n\nEste pilar trabaja algo diferente. No cómo resistir mejor ni cómo pensar más claro. Sino cómo percibir más. Cómo volver a sentir el peso de lo que ya está ahí.\n\nComienza acá, con la práctica del asombro." },
  { time: "1:30 – 4:00", title: "El cerebro que se acostumbra", text: "Hubo un momento en tu vida en que ver el cielo estrellado te detuvo. O el mar. O la lluvia.\n\nEn algún punto, eso dejó de detenerte. No porque desapareciera — sino porque el cerebro aprendió a ignorarlo.\n\nSe llama adaptación perceptiva. El sistema nervioso, para ahorrar energía, deja de procesar lo que clasifica como 'conocido'.\n\nLo extraordinario se vuelve fondo.\n\nY lo que era fuente de asombro se vuelve ruido.\n\nWilliam Irvine habla del delight: no como euforia, sino como la capacidad de encontrar disfrute genuino en lo simple. Marco Aurelio lo llamó contemplación. La neurociencia lo llama regulación atencional.\n\nTodos hablan de lo mismo: entrenar la percepción para ver más de lo que ya está." },
  { time: "4:00 – 6:30", title: "El entrenamiento", text: "La mente funciona según lo que uno entrena a observar. Si consumís constantemente conflicto, comparación y estímulos artificiales, el cerebro aprende a vivir en ese estado.\n\nPero si entrenás gratitud, contemplación, delight y asombro de forma consistente, el cerebro lentamente reconfigura su modo por defecto.\n\nNo porque la realidad cambie. Porque cambia el filtro perceptivo.\n\nEso es lo que Irvine llama meta-delight: no momentos de disfrute — una disposición mental que encuentra valor en gran parte de la experiencia de estar vivo.\n\nLa vida deja de ser 'momentos buenos aislados entre estrés' y pasa a ser 'una experiencia continuamente apreciable'.\n\nTres respiraciones. Un árbol. El sol en la cara. Prestado de verdad, no de paso.\n\nEso, todos los días, cambia el cerebro." },
  { time: "6:30 – 8:00", title: "Práctica guiada", text: "Hacemos la práctica ahora.\n\nDonde estés, buscá algo en tu entorno que puedas observar. Un objeto, la luz que entra, el cielo si podés verlo, cualquier cosa que esté frente a vos.\n\n[pausa — 5 seg]\n\nAhora observalo como si fuera la primera vez que lo ves. Sin nombre, sin categoría. Solo la forma, la textura, el color, la luz.\n\n[pausa — 12 seg]\n\nCuando la mente se fue — y se fue — volvé. Sin drama.\n\n[pausa — 8 seg]\n\nTres respiraciones lentas. Con cada exhalación, aflojá un poco más.\n\n[pausa — 15 seg]\n\nAhora una pregunta: ¿cuándo fue la última vez que algo te detuvo genuinamente — no por impacto, sino por belleza?\n\n[pausa larga — 12 seg]" },
  { time: "8:00 – 9:00", title: "Cierre", text: "El asombro no requiere viajes ni eventos extraordinarios.\n\nRequiere atención. Y la atención, a diferencia de las circunstancias, siempre está disponible.\n\nEl próximo módulo lleva esto un paso más lejos: la técnica estoica de 'puede ser la última vez'. No para pensar en la muerte — sino para romper el piloto automático y volver a vivir lo cotidiano con intensidad real.\n\nPrimero el asombro. Después la impermanencia. La secuencia transforma todo." },
] },
  12: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Lo que mata la experiencia no es la falta de tiempo. Es la familiaridad inconsciente.",
    body: [
      { type: "p", text: "Tenés una vida llena de momentos que están pasando ahora mismo y que, con alta probabilidad, en algún punto no van a estar más. Una etapa con tus hijos. Una relación. Tu salud en este momento. Una ciudad. Una persona." },
      { type: "p", text: "No es pensamiento oscuro — es la realidad. Y el problema no es que sea así. El problema es que el cerebro lo sabe y aun así actúa como si todo fuera a estar ahí para siempre. Como si pudiera prestarle atención después." },
      { type: "p", text: "Los estoicos desarrollaron una práctica específica para romper ese piloto automático. No para angustiarse con la finitud — sino para usar la conciencia de que las cosas terminan como herramienta para vivirlas de verdad ahora." },
      { type: "quote", text: "No doy nada por hecho, por eso puedo disfrutar todo. Esto no está garantizado." },
    ]
  },
  {
    id: "piloto",
    label: "EL PILOTO AUTOMÁTICO",
    title: "Por qué la familiaridad adormece la experiencia",
    body: [
      { type: "p", text: "El cerebro es una máquina de eficiencia. Una vez que clasifica algo como conocido — una persona, un lugar, una rutina — le asigna menos recursos de procesamiento. Deja de verlo realmente. Lo convierte en fondo." },
      { type: "p", text: "Esto es útil para sobrevivir: no podés procesar todo con la misma intensidad todo el tiempo. Pero el costo es alto: las cosas más valiosas de tu vida — las más familiares — son exactamente las que más se vuelven invisibles." },
      { type: "tip", label: "El paradoja de lo cotidiano", text: "Lo que más importa tiende a estar más cerca. Y lo que está más cerca es lo que el cerebro más ignora. La persona con quien vivís. El cuerpo que tenés. El lugar donde dormís. La capacidad de moverse sin dolor. Todo eso está tan presente que dejó de verse." },
      { type: "p", text: "La técnica de 'la última vez' no cambia las circunstancias. Cambia la calidad de atención que traés a lo que ya está. Y esa diferencia — entre estar presente de verdad o estar de paso — es la diferencia entre vivir y administrar la vida." },
    ]
  },
  {
    id: "ultima_vez",
    label: "LA TÉCNICA",
    title: "Puede ser la última vez — sin dramatismo",
    body: [
      { type: "p", text: "La práctica es simple. Antes o durante una experiencia — una comida con alguien que querés, una caminata, una conversación, incluso algo tan cotidiano como tomar un café tranquilo — te decís a vos mismo: esto podría no repetirse." },
      { type: "p", text: "No como amenaza ni como angustia. Como recordatorio de que está pasando ahora, que es real, y que merece presencia real." },
      { type: "block", label: "Lo que cambia cuando lo aplicás", items: [
        { arrow: true, bold: "Prestás más atención:", text: " el cerebro sale del automático y empieza a registrar de verdad." },
        { arrow: true, bold: "Estás más presente:", text: " la mente deja de anticipar lo que viene después y vuelve a lo que está pasando." },
        { arrow: true, bold: "Valorás más lo cotidiano:", text: " cosas que parecían menores se vuelven lo que realmente son — momentos únicos." },
        { arrow: true, bold: "Baja la reactividad:", text: " si alguien te molesta durante una comida, la conciencia de que esa comida es irrepetible cambia cómo respondés." },
      ]},
      { type: "quote", text: "No cambia la situación. Cambia la calidad de tu presencia en ella. Y la calidad de presencia es lo único que determina si algo fue vivido o simplemente ocurrido." },
    ]
  },
  {
    id: "prospective",
    label: "EL YO FUTURO",
    title: "Prospective retrospection — vos mismo vas a extrañar este momento",
    body: [
      { type: "p", text: "William Irvine lleva la técnica un paso más lejos con lo que llama prospective retrospection: imaginar que sos tu yo del futuro mirando hacia atrás a este momento exacto." },
      { type: "p", text: "No es que 'alguien en el mundo daría lo que sea por estar acá'. Es que vos mismo — con más años, con cosas que ya no están — vas a mirar este momento y desear haber prestado más atención." },
      { type: "tip", label: "Por qué pega distinto", text: "Elimina la distancia. No es empatía abstracta con otros. Es reconocimiento concreto de que lo que estás viviendo ahora es exactamente lo que después vas a llamar 'esa época'. Esa etapa con los chicos. Ese cuerpo. Esa energía. Esa versión de las personas que querés." },
      { type: "block", label: "Ejemplos que tu yo futuro ya conoce", items: [
        { arrow: false, bold: "→", text: " 'Qué daría por tener esa energía otra vez.'" },
        { arrow: false, bold: "→", text: " 'Qué daría por volver a esa etapa.'" },
        { arrow: false, bold: "→", text: " 'Qué daría por tener esas posibilidades abiertas.'" },
        { arrow: false, bold: "→", text: " 'Qué daría por una tarde más con esa persona.'" },
      ]},
      { type: "p", text: "Todo eso está pasando ahora mismo. El yo futuro ya lo sabe. El yo presente todavía puede vivirlo." },
      { type: "attributed", text: "Usa el futuro para reconciliarte con el presente. Es la forma más poderosa de cerrar el gap — no desde la abundancia externa, sino desde el reconocimiento de lo que ya tenés.", author: "William B. Irvine, The Stoic Path" },
    ]
  },
  {
    id: "impermanencia",
    label: "IMPERMANENCIA",
    title: "'Esto también va a pasar' — los dos sentidos",
    body: [
      { type: "p", text: "Los estoicos y las tradiciones contemplativas orientales coinciden en algo: la impermanencia no es solo una fuente de dolor. Es también la condición que hace posible el valor de las cosas." },
      { type: "p", text: "Si todo durara para siempre, nada tendría peso. Es la finitud la que le da densidad a los momentos. Un atardecer vale lo que vale porque dura minutos. Una conversación genuina vale lo que vale porque no se puede replicar." },
      { type: "block", label: "Los dos usos de la impermanencia", items: [
        { arrow: true, bold: "En los momentos buenos:", text: " 'esto no se repite' → presencia total, menos piloto automático, más registro real de lo que está pasando." },
        { arrow: true, bold: "En los momentos difíciles:", text: " 'esto también va a pasar' → perspectiva, menos dramatismo, menos identificación con el problema. El dolor es real pero no es permanente." },
      ]},
      { type: "quote", text: "La impermanencia no es el enemigo de la felicidad. Es su condición de posibilidad. Nada sería valioso si todo fuera eterno." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Ancla 'esto no se repite' · Caminata de presencia · Práctica de última vez",
    body: [
      { type: "p", text: "Tres prácticas que se refuerzan. Pueden usarse juntas o por separado. La más poderosa es la que se vuelve hábito — no la que se hace perfectamente una vez." },
      { type: "block", label: "1. Ancla 'esto no se repite'", items: [
        { arrow: true, bold: "", text: "Una vez al día, en cualquier momento — una comida, una conversación, un momento cotidiano — te decís: 'esto no se repite'." },
        { arrow: true, bold: "", text: "No en voz alta, no con drama. Solo el pensamiento, y lo que venga después." },
        { arrow: true, bold: "", text: "Frase alternativa: 'mi yo futuro querría estar acá'." },
      ]},
      { type: "block", label: "2. Caminata de presencia", items: [
        { arrow: true, bold: "", text: "Una caminata — aunque sea corta — sin teléfono, sin música, sin objetivo." },
        { arrow: true, bold: "", text: "Solo lo que hay: la textura del suelo, el sonido del entorno, la temperatura del aire, la gente que pasa." },
        { arrow: true, bold: "", text: "Si la mente se va, volvé. Cada regreso es el ejercicio." },
      ]},
      { type: "block", label: "3. Práctica de 'última vez' en relaciones", items: [
        { arrow: true, bold: "", text: "Antes de una interacción importante — una comida, una llamada, un momento con alguien que querés — una pausa y una pregunta: '¿si esta fuera la última vez que veo a esta persona, cómo querría estar?'" },
        { arrow: true, bold: "", text: "No como angustia. Como calibrador de presencia y actitud." },
        { arrow: true, bold: "", text: "Esa pregunta cambia la escucha, baja la reactividad, y sube exponencialmente la calidad de lo que pasa." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hay algo en tu vida que estés viendo como 'fondo' pero que, si lo perdieras mañana, extrañarías profundamente? ¿Por qué esperás perderlo para verlo?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hubo algún momento hoy donde estuve realmente presente — no de paso?",
        "¿Hay una persona, lugar o situación que estoy dando por sentada que, vista desde el futuro, ya sería un recuerdo valioso?",
        "¿Usé el ancla 'esto no se repite' en algún momento? ¿Qué cambió?",
        "¿Qué conversación o momento de hoy hubiera sido diferente si hubiera traído más presencia?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "El presente no necesita ser extraordinario para merecer atención. Necesita ser visto. Y esa es una decisión que siempre está disponible — ahora, no después." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Tenés una vida llena de momentos que están pasando ahora mismo.\n\nY que, con alta probabilidad, en algún punto no van a estar más.\n\nNo es un pensamiento oscuro. Es la realidad. Y el problema no es que sea así — el problema es que el cerebro lo sabe y aún así actúa como si todo fuera a estar ahí para siempre.\n\nLos estoicos desarrollaron una práctica para romper exactamente eso. No para angustiarse. Para vivir de verdad lo que ya está acá." },
  { time: "1:30 – 4:30", title: "La técnica y el yo futuro", text: "La práctica es simple.\n\nAntes o durante una experiencia — una comida, una conversación, un momento cualquiera — te decís: esto podría no repetirse.\n\nNo como amenaza. Como recordatorio de que está pasando ahora, que es real, y que merece presencia real.\n\nWilliam Irvine la lleva un paso más lejos con lo que llama prospective retrospection.\n\nNo es 'hay gente que daría lo que sea por estar acá'. Es algo más directo: vos mismo — con más años, con cosas que ya no están — vas a mirar este momento y desear haber prestado más atención.\n\nTodo lo que tu yo futuro ya extraña, está pasando ahora mismo.\n\nEsa energía. Esa etapa. Esas personas. Esas posibilidades. El yo futuro ya lo sabe. El yo presente todavía puede vivirlo." },
  { time: "4:30 – 6:00", title: "Impermanencia", text: "La impermanencia no es el enemigo de la felicidad. Es su condición de posibilidad.\n\nNada sería valioso si todo fuera eterno. Un atardecer vale lo que vale porque dura minutos. Una conversación genuina vale lo que vale porque no se puede replicar.\n\nY tiene dos usos prácticos.\n\nEn los momentos buenos: 'esto no se repite' activa presencia. El piloto automático se apaga y empezás a registrar de verdad lo que está pasando.\n\nEn los momentos difíciles: 'esto también va a pasar' devuelve perspectiva. El dolor es real, pero no es permanente. Y eso cambia todo." },
  { time: "6:00 – 7:30", title: "Práctica guiada", text: "Vamos a hacer la práctica ahora.\n\nPensá en algo o alguien en tu vida que estés viendo como 'fondo'. Algo presente, familiar, que el cerebro ya dejó de registrar realmente.\n\n[pausa — 8 seg]\n\nAhora preguntate: ¿qué pasaría si esto no estuviera mañana?\n\n[pausa — 10 seg]\n\nNo con drama. Solo sentí el contraste entre cómo lo ves habitualmente y cómo lo verías si supieras que es la última vez.\n\n[pausa — 8 seg]\n\nY ahora tu yo de diez años mirando hacia acá: ¿qué vería en este momento que vos hoy no estás viendo?\n\n[pausa larga — 12 seg]\n\nEso que apareció — eso es lo que ya tenés y todavía podés vivir." },
  { time: "7:30 – 8:30", title: "Cierre", text: "El presente no necesita ser extraordinario para merecer atención.\n\nNecesita ser visto.\n\nY esa es una decisión que siempre está disponible — ahora, no después.\n\nEl próximo módulo abre el Pilar IV — el equilibrio. Después de trabajar el cuerpo, la mente y la conciencia, el siguiente paso es ver si las distintas dimensiones de tu vida están en equilibrio o si alguna está dominando a costa de las demás.\n\nPrimero la presencia. Después el mapa. El orden importa." },
] },
  13: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Una buena vida no es solo una cosa bien. Es el equilibrio dinámico entre distintas dimensiones.",
    body: [
      { type: "p", text: "La mayoría de las personas optimiza una dimensión a costa de las demás. Éxito profesional a expensas de los vínculos. Vida social intensa sin espacio para uno mismo. Desarrollo espiritual desconectado de la realidad material. Disciplina sin disfrute." },
      { type: "p", text: "No porque lo elijan conscientemente. Sino porque sin un mapa que muestre todas las dimensiones al mismo tiempo, la tendencia natural es ir hacia donde hay más urgencia, más placer inmediato, o más miedo. Y eso, sostenido en el tiempo, produce desequilibrio." },
      { type: "p", text: "Este módulo introduce el mapa de equilibrio de hapi: siete dimensiones de la vida, cada una con su propio punto de equilibrio, su exceso y su falta. No para juzgar dónde estás — sino para ver con claridad lo que de otra forma sería invisible." },
      { type: "quote", text: "El equilibrio no es un estado que se alcanza. Es una dirección que se mantiene. Se detecta, se ajusta, y se vuelve a detectar." },
    ]
  },
  {
    id: "logica",
    label: "LA LÓGICA",
    title: "Cada dimensión tiene un exceso y una falta. El equilibrio es el punto de conciencia.",
    body: [
      { type: "p", text: "El modelo está inspirado en una idea antigua — que cada cualidad humana tiene dos extremos que la desvirtúan, y un punto de equilibrio que la expresa en su forma más útil. Ni demasiado ni demasiado poco." },
      { type: "p", text: "La generosidad sin límites drena. La disciplina sin flexibilidad aplasta. La humildad sin identidad es auto-abandono. El equilibrio no es el punto medio matemático — es el punto de máxima utilidad para cada persona en cada contexto." },
      { type: "tip", label: "Por qué no es estático", text: "El equilibrio de alguien de 25 años no es el mismo que a los 45. El equilibrio en un momento de expansión no es el mismo que en un momento de consolidación. El mapa no da respuestas fijas — da preguntas correctas. ¿Dónde estoy hoy? ¿Qué dimensión está dominando? ¿Cuál estoy ignorando?" },
      { type: "p", text: "Y hay algo más: los desequilibrios rara vez son visibles desde adentro. La persona con exceso de disciplina suele creer que 'así se hacen las cosas'. La que tiene falta de límites suele creer que 'es generosa'. El mapa sirve precisamente para eso: ver lo que la familiaridad volvió invisible." },
    ]
  },
  {
    id: "mapa",
    label: "LAS 7 DIMENSIONES",
    title: "El mapa — una vista de conjunto",
    body: [
      { type: "dims_overview" },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Chequeo semanal · Mapa personal · Acción de corrección",
    body: [
      { type: "p", text: "El mapa solo tiene valor si se usa. Una vez por semana — cinco minutos — es suficiente para detectar desequilibrios antes de que se conviertan en problemas." },
      { type: "block", label: "Chequeo semanal — tres preguntas", items: [
        { arrow: true, bold: "¿Qué dimensión dominó esta semana?", text: " La que más energía consumió, la más presente, la más activa." },
        { arrow: true, bold: "¿Qué dimensión ignoré?", text: " La que no apareció, la que dejé para después, la que evité." },
        { arrow: true, bold: "¿Hay una corrección pequeña y concreta que puedo hacer esta semana?", text: " No un giro de 180 grados — un ajuste micro." },
      ]},
      { type: "tip", label: "La regla del ajuste mínimo", text: "El objetivo no es equilibrar todo al mismo tiempo — eso es paralización. Es identificar el desequilibrio más urgente y hacer una acción pequeña en esa dirección. Repetido semana a semana, ese proceso construye equilibrio real sin dramas." },
      { type: "block", label: "Señales de desequilibrio por exceso", items: [
        { arrow: true, bold: "", text: "Agotamiento crónico — estás dando demasiado en una o más dimensiones." },
        { arrow: true, bold: "", text: "Sensación de vacío a pesar de logros — éxito en una dimensión, hambre en otra." },
        { arrow: true, bold: "", text: "Conflicto recurrente en un área — puede señalar un desequilibrio de límites o armonía." },
      ]},
      { type: "block", label: "Señales de desequilibrio por falta", items: [
        { arrow: true, bold: "", text: "Sensación de que algo falta pero no podés nombrarlo — revisar dimensión de conexión o propósito." },
        { arrow: true, bold: "", text: "Reactividad alta — puede señalar falta de límites o de disciplina interna." },
        { arrow: true, bold: "", text: "Dificultad para sostener cualquier cosa — generalmente señala falta de estructura (límites o perseverancia)." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Cuál de las 7 dimensiones reconocés que más descuidás de forma consistente? ¿Por qué esa y no otra? ¿Qué dice eso sobre tu configuración actual?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Qué dimensión dominó tu semana? ¿A qué costo?",
        "¿Hay una dimensión que sistemáticamente dejás para después? ¿Por qué?",
        "¿Reconocés en vos un patrón de exceso en alguna dimensión — algo que creés que es virtud pero que en realidad te desequilibra?",
        "¿Cuál es la acción más pequeña que podés hacer esta semana para corregir el desequilibrio más urgente?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "El mapa no te dice cómo vivir. Te ayuda a ver cómo estás viviendo. Y esa diferencia — entre vivir en automático y vivir con conciencia — es exactamente lo que hapi entrena." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "Apertura del Pilar IV", text: "Llegamos al cuarto pilar — el equilibrio.\n\nDespués de trabajar el cuerpo, la mente y la conciencia, este pilar hace una pregunta distinta: ¿hay algo que estás sobredesarrollando a costa de otro? ¿Hay una dimensión de tu vida que dominó tanto que las demás quedaron en sombra?\n\nLa mayoría de las personas optimiza una dimensión. Éxito a expensas de los vínculos. Disciplina sin disfrute. Generosidad sin límites. Y no lo notan — porque desde adentro se siente como virtud.\n\nEste módulo introduce el mapa. Siete dimensiones. Cada una con su punto de equilibrio, su exceso y su falta." },
  { time: "2:00 – 5:30", title: "La lógica del mapa", text: "El modelo viene de una idea antigua: cada cualidad tiene dos extremos que la desvirtúan, y un punto de equilibrio que la expresa en su forma más útil.\n\nLa generosidad sin límites drena. La disciplina sin flexibilidad aplasta. La humildad sin identidad es auto-abandono. La conexión sin autonomía crea dependencia.\n\nNi demasiado. Ni demasiado poco.\n\nLas siete dimensiones son: Materia, Generosidad, Límites, Armonía, Perseverancia, Humildad y Conexión.\n\nNo son compartimentos separados. Se influyen. Cuando una está en extremo, afecta a las otras. La persona con exceso de generosidad casi siempre tiene déficit de límites. La que tiene exceso de disciplina muchas veces tiene déficit de conexión.\n\nEl equilibrio tampoco es estático. El mapa de los 25 años no es el mismo que a los 45. Lo que sirve en expansión no sirve en consolidación. El mapa no da respuestas — da las preguntas correctas." },
  { time: "5:30 – 7:30", title: "El chequeo semanal", text: "Una vez por semana. Cinco minutos. Tres preguntas.\n\n¿Qué dimensión dominó esta semana? La que más energía consumió, la más presente, la más activa.\n\n¿Qué dimensión ignoré? La que no apareció, la que dejé para después.\n\n¿Hay una corrección pequeña y concreta que puedo hacer esta semana?\n\nNo un giro de 180 grados. Un ajuste micro. Repetido semana a semana, ese proceso construye equilibrio real sin dramas.\n\nLa señal de desequilibrio por exceso: agotamiento crónico, sensación de vacío a pesar de los logros, conflicto recurrente en un área.\n\nLa señal de desequilibrio por falta: sensación de que algo falta pero no podés nombrarlo, reactividad alta, dificultad para sostener cualquier cosa." },
  { time: "7:30 – 9:00", title: "Práctica guiada", text: "Vamos a hacer el chequeo ahora.\n\nPensá en tu semana. ¿Qué dimensión dominó? Trabajo, relaciones, disciplina, dar a otros, búsqueda de armonía — ¿qué estuvo más presente?\n\n[pausa — 8 seg]\n\nAhora la otra cara: ¿qué ignoraste? ¿Qué dejaste para después?\n\n[pausa — 8 seg]\n\nSin juicio. Solo observación.\n\n¿Hay una corrección pequeña — un ajuste mínimo — que podrías hacer esta semana en la dirección de lo que ignoraste?\n\n[pausa — 10 seg]\n\nY la pregunta más honesta: ¿hay alguna dimensión que sistemáticamente dejás para después, semana a semana? ¿Cuál? ¿Por qué esa?\n\n[pausa larga — 12 seg]" },
  { time: "9:00 – 10:00", title: "Cierre", text: "El mapa no te dice cómo vivir.\n\nTe ayuda a ver cómo estás viviendo. Y esa diferencia — entre vivir en automático y vivir con conciencia — es exactamente lo que este sistema entrena.\n\nLos próximos módulos del Pilar IV trabajan cada dimensión en profundidad, empezando por la materia: cómo usarla sin que ella te use. Rico es el que menos necesita. Y eso, bien entendido, es una forma de libertad que el dinero no puede comprar.\n\nPrimero el mapa. Después la navegación." },
] },
  14: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Las tres dimensiones más visibles — y las más fáciles de desequilibrar.",
    body: [
      { type: "p", text: "El Pilar IV trabaja las dimensiones del equilibrio de a una, empezando por las tres que más aparecen en la vida cotidiana: cómo nos relacionamos con el dinero y lo material, cuánto damos a los demás, y qué límites ponemos." },
      { type: "p", text: "Son tres dimensiones que parecen independientes pero están profundamente conectadas. La persona que da sin límites casi siempre tiene un desequilibrio de límites. La que acumula sin disfrutar suele tener miedo de perder, no amor por tener. La que tiene límites rígidos frecuentemente compensa una falta de generosidad interna." },
      { type: "p", text: "Este módulo trabaja cada una por separado — con su exceso, su falta y su punto de equilibrio — y después muestra cómo se influyen entre sí." },
      { type: "quote", text: "Usar lo material sin que lo material te use a vos. Dar sin perderte. Sostener sin rigidizarte. Tres equilibrios, una sola dirección." },
    ]
  },
  {
    id: "materia",
    label: "DIMENSIÓN 1 — MATERIA",
    title: "Rico es el que menos necesita para estar bien",
    body: [
      { type: "p", text: "La relación con el dinero y lo material es una de las más reveladoras sobre el estado interno de una persona. No porque el dinero sea malo — sino porque el modo en que uno lo busca, lo usa y lo pierde muestra con claridad qué está manejando realmente la vida." },
      { type: "block", label: "Los dos extremos", items: [
        { arrow: true, bold: "Exceso — acumulación:", text: " vivir para tener más. El bienestar siempre está un escalón más arriba. Nunca es suficiente. La identidad se construye sobre lo que se posee. Cuando se pierde algo material, se siente como pérdida de uno mismo." },
        { arrow: true, bold: "Falta — rechazo:", text: " incomodidad con lo material, dificultad para generar o retener, narrativa de que el dinero corrompe. Este extremo suele disfrazar como virtud lo que en realidad es miedo o una creencia limitante no trabajada." },
      ]},
      { type: "tip", label: "El punto de equilibrio", text: "La materia como herramienta. Tengo lo que necesito para vivir bien sin que definir mi identidad por ello. Disfruto lo que tengo sin necesidad constante de más. No rechazo lo material — lo uso con conciencia de que es un medio, no un fin." },
      { type: "p", text: "Séneca era uno de los hombres más ricos de Roma y vivía periodos de austeridad voluntaria. No porque el dinero fuera malo — sino para demostrarle a su propio sistema nervioso que podía estar bien sin él. La libertad real no es tener mucho. Es no necesitar mucho para estar bien." },
      { type: "attributed", text: "No temo la pobreza porque sé que puedo vivir con ella. Y el que sabe eso, ya no le teme a nada.", author: "Séneca" },
      { type: "tip", label: "Pregunta diagnóstico", text: "¿Tu nivel de bienestar sube y baja según tu situación económica del momento? ¿O hay una base estable que el dinero no mueve? La respuesta dice más sobre tu equilibrio en esta dimensión que cualquier número en tu cuenta bancaria." },
    ]
  },
  {
    id: "generosidad",
    label: "DIMENSIÓN 2 — GENEROSIDAD",
    title: "Dar desde la abundancia, no desde el miedo a no ser suficiente",
    body: [
      { type: "p", text: "La generosidad es una de las cualidades más valoradas en casi todas las culturas y tradiciones. Pero hay dos tipos de generosidad que se parecen en la superficie y son completamente distintas en su origen: la que nace de la abundancia y la que nace del miedo." },
      { type: "block", label: "Los dos extremos", items: [
        { arrow: true, bold: "Exceso — dar sin límites:", text: " no poder decir que no, sentir que el valor propio depende de cuánto se da, confundir generosidad con sacrificio. Este patrón suele producir resentimiento oculto — se da, pero se espera algo a cambio que nunca se pide directamente." },
        { arrow: true, bold: "Falta — retención:", text: " cierre, egoísmo, dificultad para compartir. Puede venir del miedo a perder, de la desconfianza, o de una narrativa de escasez que dice que lo que se da ya no vuelve." },
      ]},
      { type: "tip", label: "El punto de equilibrio", text: "Doy porque tengo algo genuino para ofrecer — no porque me sienta obligado, ni para que me quieran, ni para demostrar que soy buena persona. La generosidad real no requiere que nadie lo note. Y no drena porque no viene de un lugar de carencia." },
      { type: "p", text: "La distinción más importante no es cuánto se da. Es desde dónde se da. El mismo acto puede ser liberador o agotador según el origen. Dar desde la culpa genera resentimiento. Dar desde la elección genuina genera expansión." },
      { type: "quote", text: "La generosidad que requiere aprobación para sostenerse no es generosidad. Es una transacción disfrazada de virtud." },
      { type: "tip", label: "Señal de desequilibrio por exceso", text: "¿Sentís resentimiento después de dar — aunque nadie te lo pidió? ¿Decís que sí cuando querés decir que no? Esas señales apuntan a que la generosidad está sirviendo a una necesidad de validación, no a un deseo genuino de dar." },
    ]
  },
  {
    id: "limites",
    label: "DIMENSIÓN 3 — LÍMITES",
    title: "Los límites no restringen la vida. Son lo que le da forma.",
    body: [
      { type: "p", text: "La palabra 'límites' tiene mala prensa en muchas culturas. Se asocia con egoísmo, dureza o falta de amor. Pero los límites bien entendidos son exactamente lo opuesto: son la estructura que permite que las relaciones, la generosidad y la vida cotidiana sean sostenibles." },
      { type: "block", label: "Los dos extremos", items: [
        { arrow: true, bold: "Exceso — rigidez:", text: " control excesivo, normas demasiado estrictas, dificultad para adaptarse. Todo se vuelve regla. La disciplina aplasta la espontaneidad. Los límites rígidos suelen venir del miedo — al desorden, a perder el control, a ser vulnerables." },
        { arrow: true, bold: "Falta — permeabilidad:", text: " desorden, dificultad para sostener compromisos propios, dejar que todo entre. Sin límites no hay forma, y sin forma no hay identidad. La falta de límites agota porque uno termina administrando las consecuencias del desorden de otros." },
      ]},
      { type: "tip", label: "El punto de equilibrio", text: "Los límites como estructura de la libertad. Digo que sí cuando quiero decir que sí. Digo que no cuando quiero decir que no. Mis límites no son muros — son bordes que definen dónde termino yo y dónde empieza el otro. Y eso hace posible la conexión genuina." },
      { type: "p", text: "Hay una paradoja interesante: las personas con límites claros suelen ser más generosas que las que no los tienen. Porque cuando podés decir que no, el sí tiene peso real. La persona que no puede negarse a nada eventualmente se niega a todo — aunque no lo diga explícitamente." },
      { type: "quote", text: "Un sí que no puede ser no, no es un sí. Es rendición. Y la rendición sostenida destruye la confianza en uno mismo." },
    ]
  },
  {
    id: "interaccion",
    label: "CÓMO SE CONECTAN",
    title: "Las tres dimensiones se influyen — y se desequilibran juntas",
    body: [
      { type: "p", text: "El desequilibrio en estas tres dimensiones rara vez aparece de forma aislada. Hay patrones recurrentes que vale la pena conocer." },
      { type: "block", label: "Patrones frecuentes", items: [
        { arrow: true, bold: "Exceso de generosidad + falta de límites:", text: " el patrón más común. La persona da demasiado porque no puede decir que no. El resultado es agotamiento, resentimiento oculto y relaciones desequilibradas." },
        { arrow: true, bold: "Exceso de acumulación + falta de generosidad:", text: " la materia como sustituto de conexión. Se acumula como forma de sentirse seguro, pero la retención bloquea la circulación — de dinero, de energía, de vínculos." },
        { arrow: true, bold: "Exceso de límites rígidos + falta de generosidad:", text: " la disciplina como muro. La estructura protege, pero también aísla. La rigidez suele compensar un miedo profundo a la vulnerabilidad." },
      ]},
      { type: "p", text: "Identificar el patrón propio no es para juzgarse — es para saber dónde aplicar la corrección. El ajuste en una dimensión suele moverse solo en las otras." },
      { type: "tip", label: "La conexión con el Módulo 13", text: "Si en el chequeo semanal del mapa notás desequilibrio en materia, generosidad o límites, este módulo da el contexto y las herramientas para entender qué está pasando realmente — y qué ajuste concreto tiene sentido." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Pregunta de la semana · Chequeo de las tres dimensiones · Acción concreta",
    body: [
      { type: "p", text: "Una práctica semanal breve para las tres dimensiones. No requiere más de diez minutos. La consistencia — semana a semana — es lo que produce el cambio." },
      { type: "block", label: "Pregunta semanal por dimensión", items: [
        { arrow: true, bold: "Materia:", text: " ¿Hubo algún momento esta semana donde mi bienestar dependió de algo material que no tenía o perdí? ¿Qué dice eso sobre mi relación con esta dimensión?" },
        { arrow: true, bold: "Generosidad:", text: " ¿Hubo algo que di esta semana desde la obligación en lugar de desde la elección? ¿Hubo algo que no di y que hubiera querido dar?" },
        { arrow: true, bold: "Límites:", text: " ¿Dije que sí a algo que en realidad quería decir que no? ¿Hubo algún límite que necesitaba poner y no puse? ¿Qué me frenó?" },
      ]},
      { type: "block", label: "Acción concreta de ajuste", items: [
        { arrow: true, bold: "", text: "Identificar la dimensión más desequilibrada de las tres esta semana." },
        { arrow: true, bold: "", text: "Elegir una sola acción pequeña en dirección al equilibrio — no un cambio grande, un ajuste micro." },
        { arrow: true, bold: "", text: "Anotarla. Hacerla. Revisar el siguiente ciclo si produjo diferencia." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hay un patrón en estas tres dimensiones que se repite en tu vida hace años? ¿Lo ves como parte de tu carácter — o como algo que podrías ajustar? La diferencia entre esas dos respuestas es la diferencia entre la identidad fija y el crecimiento." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Tu nivel de bienestar esta semana estuvo influenciado por tu situación material? ¿En qué dirección?",
        "¿Hubo algo que diste desde la obligación? ¿Algo que no diste y querías dar?",
        "¿Pusiste todos los límites que necesitabas esta semana? ¿Qué te frenó cuando no lo hiciste?",
        "¿Reconocés alguno de los patrones de interacción entre las tres dimensiones en tu vida cotidiana?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Usar lo material sin que te use. Dar sin perderte. Sostener sin rigidizarte. Tres equilibrios que, trabajados juntos, producen una vida más liviana y más genuina." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Este módulo trabaja tres dimensiones que parecen independientes y están profundamente conectadas.\n\nCómo nos relacionamos con el dinero y lo material. Cuánto damos a los demás. Qué límites ponemos.\n\nLas tres aparecen todos los días. Y las tres tienen exactamente la misma lógica: un exceso que parece virtud pero desgasta, una falta que parece prudencia pero limita, y un punto de equilibrio que las hace sostenibles." },
  { time: "1:30 – 4:30", title: "Materia y generosidad", text: "La materia primero.\n\nRico no es el que más tiene. Es el que menos necesita para estar bien. Esa diferencia — entre acumular para sentirse seguro y tener lo necesario para vivir bien — define si la materia te sirve o te sirve a vos.\n\nSéneca era uno de los hombres más ricos de Roma y vivía periodos de austeridad voluntaria. No porque el dinero fuera malo. Sino para demostrarle a su sistema nervioso que podía estar bien sin él. La libertad real no es tener mucho. Es no necesitar mucho.\n\nAhora la generosidad.\n\nHay dos tipos que se parecen en la superficie y son completamente distintas: la que nace de la abundancia y la que nace del miedo a no ser suficiente.\n\nDar desde la obligación genera resentimiento oculto. Dar desde la elección genuina genera expansión.\n\nLa señal más clara del desequilibrio: ¿sentís resentimiento después de dar, aunque nadie te lo pidió? Eso señala que la generosidad está sirviendo a una necesidad de validación, no a un deseo real de dar." },
  { time: "4:30 – 6:30", title: "Límites y conexiones", text: "Los límites.\n\nLa palabra tiene mala prensa. Se asocia con egoísmo o frialdad. Pero los límites bien entendidos son exactamente lo opuesto: son la estructura que hace posible que la generosidad y los vínculos sean sostenibles.\n\nSin límites, el sí no tiene peso. La persona que no puede decir que no, eventualmente se niega a todo — aunque no lo diga explícitamente.\n\nHay una paradoja: las personas con límites claros suelen ser más generosas que las que no los tienen. Porque cuando podés decir que no, el sí es real.\n\nY las tres dimensiones se conectan. El patrón más común: exceso de generosidad más falta de límites. La persona da demasiado porque no puede decir que no. El resultado es agotamiento y resentimiento oculto.\n\nIdentificar el patrón no es para juzgarse. Es para saber dónde aplicar la corrección." },
  { time: "6:30 – 8:00", title: "Práctica guiada", text: "Tres preguntas. Una por dimensión.\n\nMateria: ¿Hubo algún momento esta semana donde tu bienestar dependió de algo material que no tenías o perdiste?\n\n[pausa — 8 seg]\n\nGenerosidad: ¿Hubo algo que diste desde la obligación en lugar de desde la elección? ¿Algo que no diste y que querías dar?\n\n[pausa — 8 seg]\n\nLímites: ¿Dijiste que sí a algo que en realidad querías decir que no? ¿Qué te frenó?\n\n[pausa — 10 seg]\n\n¿Cuál de las tres dimensiones está más desequilibrada ahora mismo?\n\n[pausa — 8 seg]\n\n¿Hay una acción pequeña — no un giro de 180 grados, un ajuste micro — que podés hacer esta semana en esa dirección?\n\n[pausa larga — 10 seg]" },
  { time: "8:00 – 9:00", title: "Cierre", text: "Usar lo material sin que te use. Dar sin perderte. Sostener sin rigidizarte.\n\nTres equilibrios que, trabajados juntos, producen una vida más liviana y más genuina.\n\nEl próximo módulo trabaja otra dimensión del Pilar IV: el equilibrio entre profundidad y ligereza. Ni todo serio ni todo superficial. Una vida plena necesita las dos — y saber cuándo estar en cada una.\n\nPrimero la base material. Después la profundidad. El orden sigue siendo importante." },
] },
  15: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Ni todo profundo ni todo superficial. Una vida plena necesita las dos.",
    body: [
      { type: "p", text: "Hay una creencia implícita en muchos sistemas de desarrollo personal: que lo profundo es siempre mejor que lo superficial. Que pensar más, reflexionar más y buscar más sentido es la dirección correcta en todos los contextos." },
      { type: "p", text: "Pero eso es un desequilibrio disfrazado de virtud. La persona que solo puede estar en la profundidad — que siente que el humor es pérdida de tiempo, que las conversaciones livianas son vacías, que disfrutar sin reflexionar es una forma de inconsciencia — termina siendo una carga para sí misma y para los demás." },
      { type: "p", text: "La vida plena no es permanentemente profunda. Es capaz de moverse entre profundidad y ligereza según el contexto. Y esa capacidad de movimiento — de estar en lo liviano sin culpa y en lo profundo sin angustia — es una de las formas más sofisticadas de equilibrio." },
      { type: "quote", text: "La vida consciente no rechaza lo superficial ni se pierde en lo profundo. Encuentra el equilibrio entre ambos." },
    ]
  },
  {
    id: "los_extremos",
    label: "LOS DOS EXTREMOS",
    title: "Lo que pasa cuando uno domina al otro",
    body: [
      { type: "p", text: "Como en todas las dimensiones del Pilar IV, el desequilibrio aparece en dos formas que se parecen a virtudes pero que en realidad limitan." },
      { type: "block", label: "Exceso de profundidad", items: [
        { arrow: true, bold: "La vida se vuelve pesada:", text: " todo requiere análisis, todo tiene una capa oculta que explorar, todo momento liviano genera una sensación de que 'falta algo'." },
        { arrow: true, bold: "Dificultad para disfrutar:", text: " el disfrute simple se siente como superficialidad. La risa, el juego, lo cotidiano se perciben como pérdida de tiempo frente a lo que 'realmente importa'." },
        { arrow: true, bold: "Aislamiento social:", text: " las personas con exceso de profundidad suelen sentirse incomprendidas — y a veces son ellas las que no permiten que la conexión sea liviana, que es como la mayoría de las conexiones empieza." },
        { arrow: true, bold: "Parálisis por análisis:", text: " la profundidad excesiva en las decisiones produce inacción. Nunca es suficiente información, nunca es el momento ideal, siempre hay más capas que explorar antes de actuar." },
      ]},
      { type: "block", label: "Exceso de superficialidad", items: [
        { arrow: true, bold: "La vida se vuelve vacía:", text: " sin espacio para la reflexión, el sentido o la conexión genuina, los días se suceden sin que quede nada que valga la pena recordar." },
        { arrow: true, bold: "Evasión de lo difícil:", text: " lo superficial usado como refugio del malestar. El humor constante, la distracción perpetua, el movimiento sin pausa — como formas de no sentir lo que necesita ser sentido." },
        { arrow: true, bold: "Vínculos sin profundidad:", text: " muchos contactos, poca conexión real. El desarrollo personal queda bloqueado porque requiere mirar hacia adentro, lo que la superficialidad evita." },
        { arrow: true, bold: "Hábitos sin propósito:", text: " rutinas que se ejecutan sin preguntarse para qué. La disciplina vacía de sentido eventualmente colapsa." },
      ]},
    ]
  },
  {
    id: "cuatro_areas",
    label: "CUATRO ÁREAS",
    title: "Dónde aparece este equilibrio en la vida cotidiana",
    body: [
      { type: "p", text: "El equilibrio entre profundidad y ligereza no es un estado general — es una capacidad que se expresa de forma distinta en cada área de la vida." },
      { type: "block", label: "En lo cotidiano", items: [
        { arrow: true, bold: "La ligereza:", text: " disfrutar, reír, lo liviano, el placer sin justificación. Una buena comida, una conversación absurda, una serie sin pretensiones." },
        { arrow: true, bold: "La profundidad:", text: " reflexionar, entender, crecer, dar sentido a lo que pasa." },
        { arrow: false, bold: "→", text: " Sin ligereza, la vida se vuelve un proyecto de mejora permanente sin disfrute. Sin profundidad, los días pasan sin dejar rastro." },
      ]},
      { type: "block", label: "En lo social", items: [
        { arrow: true, bold: "La ligereza:", text: " interacción, humor, liviandad, la conversación que no va a ningún lado y está bien así." },
        { arrow: true, bold: "La profundidad:", text: " conexión real, conversaciones que importan, presencia genuina." },
        { arrow: false, bold: "→", text: " Si sos solo profundo en lo social, desconectás. Si sos solo superficial, no conectás de verdad. Los mejores vínculos tienen las dos velocidades." },
      ]},
      { type: "block", label: "En el desarrollo personal", items: [
        { arrow: true, bold: "La ligereza:", text: " hábitos, rutinas, disciplina como práctica — sin interrogar cada acción." },
        { arrow: true, bold: "La profundidad:", text: " propósito, sentido, identidad, preguntarse para qué." },
        { arrow: false, bold: "→", text: " Solo hábitos sin sentido se vuelven automáticos y vacíos. Solo introspección sin acción produce inmovilidad." },
      ]},
      { type: "block", label: "En la espiritualidad y el sentido", items: [
        { arrow: true, bold: "La ligereza:", text: " gratitud simple, presencia sin análisis, el momento como es sin buscarle más capas." },
        { arrow: true, bold: "La profundidad:", text: " transformación interna, trabajo genuino sobre patrones y creencias." },
        { arrow: false, bold: "→", text: " Este equilibrio es clave para hapi específicamente: evita que el sistema caiga en la banalidad del autoayuda superficial, y también evita el dogmatismo espiritual que aplasta." },
      ]},
    ]
  },
  {
    id: "señales",
    label: "SEÑALES DE DESEQUILIBRIO",
    title: "Cómo reconocer hacia qué lado se inclina tu configuración actual",
    body: [
      { type: "p", text: "El desequilibrio en esta dimensión es particularmente difícil de detectar porque los dos extremos tienden a racionalizarse como virtud." },
      { type: "tip", label: "Señales de exceso de profundidad", text: "Sentís que el humor trivializa lo que te importa. Te cuesta disfrutar algo sin analizarlo. Las conversaciones livianas te aburren o te generan una sensación de pérdida de tiempo. Tomás demasiado tiempo en decidir porque siempre hay más que considerar. Sentís que pocas personas 'te entienden de verdad'." },
      { type: "tip", label: "Señales de exceso de superficialidad", text: "Sentís que los días pasan rápido pero no queda nada memorable. Usás el humor o la actividad para no sentir algo que está incómodo. Tenés muchos contactos pero pocas conversaciones que realmente importen. Los hábitos que empezás no se sostienen porque no tienen una razón que valga. Evitás la soledad porque en el silencio aparece algo que preferís no ver." },
      { type: "p", text: "Ninguna de las dos configuraciones es mejor ni peor. Son puntos de partida distintos que requieren correcciones distintas. Lo importante es identificar el propio patrón — no para juzgarlo, sino para saber en qué dirección ajustar." },
    ]
  },
  {
    id: "por_que_importa",
    label: "POR QUÉ IMPORTA PARA HAPI",
    title: "Este equilibrio es el que le da identidad al sistema",
    body: [
      { type: "p", text: "Hay un riesgo específico en cualquier sistema de desarrollo personal: caer en uno de los dos extremos. O se vuelve tan profundo que solo le habla a los que ya están en el camino — y pierde a todos los demás. O se vuelve tan accesible y liviano que pierde toda profundidad real — y se convierte en contenido de Instagram con frases bonitas que no cambian nada." },
      { type: "p", text: "hapi apunta al equilibrio entre ambos. Profundo pero accesible. Espiritual pero práctico. Exigente pero disfrutable. Esa es una posición rara y valiosa — y este módulo no es solo filosofía abstracta, sino la base de por qué el sistema funciona como funciona." },
      { type: "tip", label: "La frase que resume todo", text: "No todo lo superficial es vacío, ni todo lo profundo es valioso. Una vida plena requiere liviandad para disfrutar y profundidad para entender. El equilibrio entre ambos evita tanto la trivialidad como el exceso de carga." },
      { type: "attributed", text: "La sabiduría no está en volverse serio. Está en saber cuándo ser serio y cuándo no serlo.", author: "Mario Sabán" },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Diagnóstico personal · Práctica de ligereza intencional · Práctica de profundidad",
    body: [
      { type: "p", text: "Dos prácticas, una por extremo. La idea es que cada persona identifique hacia qué lado está desequilibrada y aplique la corrección correspondiente." },
      { type: "block", label: "Diagnóstico previo — 2 preguntas", items: [
        { arrow: true, bold: "", text: "¿Cuándo fue la última vez que disfrutaste algo liviano sin sentir que estabas perdiendo el tiempo?" },
        { arrow: true, bold: "", text: "¿Cuándo fue la última vez que tuviste una conversación genuinamente profunda — que te movió algo por dentro?" },
      ]},
      { type: "block", label: "Si tu desequilibrio es hacia la profundidad — práctica de ligereza intencional", items: [
        { arrow: true, bold: "", text: "Elegir una actividad esta semana que sea puramente disfrutable sin ningún objetivo de mejora." },
        { arrow: true, bold: "", text: "Tener una conversación liviana y quedarme en ella — sin intentar llevarla a algo más profundo." },
        { arrow: true, bold: "", text: "Notar la incomodidad que aparece — y quedarse en lo liviano de todas formas." },
      ]},
      { type: "block", label: "Si tu desequilibrio es hacia la superficialidad — práctica de profundidad", items: [
        { arrow: true, bold: "", text: "Elegir una situación de esta semana y preguntarle: ¿qué hay debajo de la superficie acá? ¿Qué no estoy viendo?" },
        { arrow: true, bold: "", text: "Tener una conversación donde hagas una pregunta que realmente te interese — no de cortesía." },
        { arrow: true, bold: "", text: "Escribir o reflexionar cinco minutos sobre algo que pasó sin apuro por llegar a una conclusión." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hacia qué lado se inclina tu configuración habitual? ¿Y en qué área de tu vida ese desequilibrio es más costoso — en tus vínculos, en tu disfrute cotidiano, en tu desarrollo, o en tu sentido de vida?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hubo momentos esta semana donde disfrutaste algo simple sin analizarlo? ¿Cómo te quedaste?",
        "¿Hubo momentos donde evitaste ir a la profundidad de algo porque resultaba incómodo?",
        "¿En qué área de tu vida el desequilibrio entre profundidad y ligereza es más visible?",
        "¿Hay alguien en tu vida que encarne bien este equilibrio? ¿Qué podés aprender de cómo se mueve?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Ni todo serio ni todo liviano. Una vida que solo puede estar en un registro es una vida incompleta. El movimiento entre los dos — elegido, consciente — es lo que hace que todo tenga el peso justo." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Hay una creencia que recorre casi todos los sistemas de desarrollo personal: que lo profundo es siempre mejor que lo superficial.\n\nPero eso es un desequilibrio disfrazado de virtud.\n\nLa persona que solo puede estar en la profundidad — que siente que el humor es pérdida de tiempo, que las conversaciones livianas son vacías — termina siendo una carga para sí misma y para los que la rodean.\n\nY la persona que solo puede estar en la superficie — que usa la liviandad como refugio de lo difícil — termina con días llenos y vida vacía.\n\nEste módulo trabaja uno de los equilibrios más finos del sistema: moverse entre profundidad y ligereza según el contexto. Sin culpa en ninguno de los dos." },
  { time: "1:30 – 4:30", title: "Los dos extremos y las cuatro áreas", text: "El exceso de profundidad se ve así: la vida se vuelve pesada. Todo requiere análisis. Lo liviano genera culpa. Las decisiones se paralizan porque siempre hay más capas que explorar.\n\nEl exceso de superficialidad se ve así: los días pasan rápido y no queda nada. Los vínculos tienen muchos contactos y poca conexión real. Los hábitos sin sentido colapsan.\n\nY este equilibrio aparece en todas las áreas de la vida.\n\nEn lo cotidiano: sin ligereza la vida se convierte en un proyecto de mejora permanente sin disfrute. Sin profundidad los días pasan sin dejar rastro.\n\nEn lo social: si sos solo profundo, desconectás. Si sos solo superficial, no conectás de verdad. Los mejores vínculos tienen las dos velocidades.\n\nEn el desarrollo personal: solo hábitos sin sentido se vuelven vacíos. Solo introspección sin acción produce inmovilidad.\n\nY en la espiritualidad: este equilibrio es el que le da identidad a hapi. Profundo pero accesible. Espiritual pero práctico. Esa posición es rara. Y es valiosa." },
  { time: "4:30 – 6:00", title: "Señales de desequilibrio", text: "Hay señales concretas en cada dirección.\n\nSi tu exceso es hacia la profundidad: sentís que el humor trivializa lo que te importa. Te cuesta disfrutar algo sin analizarlo. Tomás demasiado tiempo en decidir. Sentís que pocas personas te entienden de verdad.\n\nSi tu exceso es hacia la superficialidad: los días pasan rápido pero no queda nada memorable. Usás la actividad o el humor para no sentir algo incómodo. Evitás la soledad porque en el silencio aparece algo que preferís no ver.\n\nNinguna es mejor ni peor. Son puntos de partida distintos con correcciones distintas.\n\nLo importante es saber hacia dónde te inclinás — para saber en qué dirección ajustar." },
  { time: "6:00 – 7:30", title: "Práctica guiada", text: "Dos preguntas de diagnóstico.\n\n¿Cuándo fue la última vez que disfrutaste algo liviano sin sentir que estabas perdiendo el tiempo?\n\n[pausa — 8 seg]\n\n¿Cuándo fue la última vez que tuviste una conversación genuinamente profunda — que te movió algo por dentro?\n\n[pausa — 8 seg]\n\n¿Hacia qué lado está el desequilibrio en tu vida ahora?\n\n[pausa — 6 seg]\n\nSi es hacia la profundidad: esta semana, elegí una actividad puramente disfrutable sin objetivo de mejora. Y quedate en ella, aunque aparezca la incomodidad de estar 'perdiendo el tiempo'.\n\nSi es hacia la superficialidad: esta semana, elegí una situación y preguntale qué hay debajo. Hacé una pregunta que realmente te interese. Reflexioná cinco minutos sobre algo sin apuro por llegar a una conclusión.\n\n[pausa — 10 seg]\n\n¿En qué área de tu vida este desequilibrio es más costoso?\n\n[pausa larga — 10 seg]" },
  { time: "7:30 – 8:00", title: "Cierre", text: "Ni todo serio ni todo liviano.\n\nUna vida que solo puede estar en un registro es una vida incompleta.\n\nEl movimiento entre los dos — elegido, consciente — es lo que hace que todo tenga el peso justo.\n\nEl próximo módulo abre el Pilar V: las relaciones y el propósito. Empezamos por la base — la relación con uno mismo. Porque la calidad de los vínculos con los demás siempre refleja la calidad del vínculo que uno tiene consigo mismo.\n\nPrimero el equilibrio interno. Después la conexión genuina." },
] },
  16: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Soy libre cuando elijo compartir. No cuando necesito no estar solo.",
    body: [
      { type: "p", text: "Hay una pregunta que pocas personas se hacen con honestidad: ¿estoy con los demás porque los elijo, o porque no puedo estar bien solo? La diferencia parece sutil. En la práctica, lo cambia todo." },
      { type: "p", text: "La calidad de la relación con uno mismo determina la calidad de las relaciones con los demás. No como teoría — como realidad que se hace visible en el tipo de vínculos que uno construye, en lo que busca en ellos, en lo que aguanta y en lo que no puede soltar." },
      { type: "p", text: "Este es el primer módulo del Pilar V — Relaciones y Propósito. Y empieza acá, desde adentro, porque no hay forma de construir vínculos genuinos desde un lugar de carencia. La conexión real solo es posible cuando uno llega desde la plenitud, no desde la necesidad." },
      { type: "quote", text: "La relación más importante que vas a tener en tu vida es la que tenés con vos mismo. Todo lo demás se construye desde ahí." },
    ]
  },
  {
    id: "soledad",
    label: "SOLEDAD VS. ESTAR SOLO",
    title: "Dos experiencias que se parecen y son completamente distintas",
    body: [
      { type: "p", text: "Estar solo es una circunstancia externa: no hay nadie presente. La soledad es un estado interno: una sensación de vacío, desconexión o incomodidad que aparece cuando uno se queda solo consigo mismo." },
      { type: "p", text: "La distinción importa porque revela algo profundo sobre la relación con uno mismo. Una persona que puede estar sola sin sentir soledad tiene algo que vale más que cualquier compañía: se basta a sí misma. Una persona que no puede tolerar estar sola está, en cierta medida, atrapada — porque su bienestar depende de la presencia constante de otros." },
      { type: "tip", label: "Lo que la intolerancia a la soledad revela", text: "No es debilidad de carácter ni defecto personal. Es una señal de que hay algo en la relación con uno mismo que todavía no está resuelto. La presencia constante de otros puede estar sirviendo como distracción de algo interno que incomoda. La soledad fuerza el encuentro con uno mismo. Y ese encuentro puede ser incómodo — pero es la base de todo lo que viene después." },
      { type: "p", text: "La práctica de la soledad consciente no es retiro espiritual ni aislamiento. Es aprender a estar con uno mismo sin necesitar que algo externo llene el espacio. Esa capacidad, desarrollada, cambia radicalmente cómo uno se relaciona con los demás." },
    ]
  },
  {
    id: "dependencia",
    label: "DEPENDENCIA EMOCIONAL",
    title: "Cuándo la conexión se convierte en necesidad",
    body: [
      { type: "p", text: "La dependencia emocional no es solo una característica de las relaciones románticas. Aparece en amistades, en vínculos familiares, en la relación con grupos de pertenencia. Cada vez que el bienestar de uno depende de la validación, la presencia o la aprobación de otro de forma sistemática, hay dependencia." },
      { type: "block", label: "Señales concretas", items: [
        { arrow: true, bold: "Necesitás validación externa para sentirte seguro", text: " — tomar decisiones sin la aprobación de alguien específico genera ansiedad." },
        { arrow: true, bold: "La ausencia del otro genera angustia desproporcionada", text: " — un mensaje sin respuesta, una cita cancelada, un silencio que se interpreta como rechazo." },
        { arrow: true, bold: "Regulás tu estado emocional a través de otros", text: " — si ellos están bien, vos estás bien. Si ellos están mal, vos también." },
        { arrow: true, bold: "Tolerás cosas que no querías tolerar por miedo a perder el vínculo", text: " — los límites ceden antes que la relación." },
        { arrow: true, bold: "El tiempo a solas se llena compulsivamente", text: " — con el teléfono, con actividad constante, con cualquier cosa que evite la quietud." },
      ]},
      { type: "p", text: "Identificar estos patrones no es para juzgarse. Es para ver con claridad desde dónde se está construyendo la relación con los demás — y qué trabajo hace falta hacer desde adentro antes de poder cambiar los vínculos desde afuera." },
      { type: "tip", label: "El origen más frecuente", text: "La dependencia emocional casi siempre tiene raíces en la relación con uno mismo: baja autoestima real (no la declarada), una narrativa interna de que 'no soy suficiente solo', o la creencia de que el valor propio depende de ser querido y elegido por otros." },
    ]
  },
  {
    id: "relacion_interna",
    label: "LA RELACIÓN CON UNO MISMO",
    title: "Qué significa estar bien con uno — en concreto",
    body: [
      { type: "p", text: "No es una declaración de autoconfianza ni un estado permanente de paz interior. Es algo más práctico: la capacidad de estar presente con uno mismo sin necesitar escapar de esa presencia." },
      { type: "block", label: "Lo que implica en la práctica", items: [
        { arrow: true, bold: "Poder estar en silencio sin incomodidad urgente:", text: " no necesitar llenar cada momento con estímulo externo." },
        { arrow: true, bold: "Tener una narrativa interna que no es enemiga:", text: " el diálogo interno — lo que uno se dice a sí mismo — no es cruel, no exige lo imposible, no compara constantemente." },
        { arrow: true, bold: "Conocer los propios patrones sin esquivarlos:", text: " saber cuándo reaccionás, por qué, qué te dispara. No para controlarlo todo sino para no ser completamente sorprendido por uno mismo." },
        { arrow: true, bold: "No buscar en otros lo que no trabajaste en vos:", text: " no esperar que alguien externo resuelva lo que solo vos podés resolver." },
        { arrow: true, bold: "Elegir compartir, no necesitar no estar solo:", text: " la diferencia entre 'quiero estar con esta persona' y 'no puedo estar sin esta persona'." },
      ]},
      { type: "quote", text: "La persona que está bien consigo misma no necesita que los demás la completen. Puede recibirlos como lo que son — personas distintas, no extensiones de sus propias necesidades." },
    ]
  },
  {
    id: "dialogo_interno",
    label: "EL DIÁLOGO INTERNO",
    title: "Lo que te decís cuando nadie escucha define quién sos cuando todos miran",
    body: [
      { type: "p", text: "El diálogo interno — esa voz constante que comenta, juzga, recuerda y anticipa — es el factor más determinante de la relación con uno mismo. Y sin embargo, la mayoría de las personas nunca lo examina." },
      { type: "p", text: "El problema no es que el diálogo interno exista — es inevitable. El problema es cuándo opera desde un lugar de hostilidad crónica: exigiéndose lo que no se le exigiría a nadie más, interpretando cada error como prueba de una falla fundamental, comparando constantemente hacia arriba." },
      { type: "block", label: "Tres patrones del diálogo interno hostil", items: [
        { arrow: true, bold: "La comparación permanente:", text: " 'otros lo hacen mejor, llegan más rápido, tienen más'. La comparación selectiva — siempre hacia arriba, siempre en los peores momentos propios — es uno de los generadores de sufrimiento más consistentes." },
        { arrow: true, bold: "El perfeccionismo como castigo:", text: " el estándar imposible que garantiza que nunca hay suficiente. 'Podría haber sido mejor', 'no llegué a lo que debía', 'tendría que haber...'" },
        { arrow: true, bold: "La anticipación catastrófica:", text: " el cerebro genera escenarios negativos que casi nunca ocurren pero que se viven como si fueran reales. El sufrimiento anticipado es real aunque el evento no ocurra." },
      ]},
      { type: "tip", label: "El primer paso", text: "No reemplazar el diálogo hostil por uno artificialmente positivo — eso no funciona. Sino observarlo. Nombrarlo. 'Estoy teniendo el pensamiento de que soy un fracaso.' La distancia que crea el nombramiento es el inicio del cambio. Lo que se observa pierde parte de su poder automático." },
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Práctica de soledad consciente · Check de dependencia · Diálogo interno",
    body: [
      { type: "p", text: "Tres prácticas que apuntan a la misma raíz desde distintos ángulos. Se pueden usar por separado o en secuencia." },
      { type: "block", label: "1. Práctica de soledad consciente — 10 minutos", items: [
        { arrow: true, bold: "", text: "Un momento al día — mañana, tarde o noche — sin teléfono, sin música, sin actividad de distracción." },
        { arrow: true, bold: "", text: "Solo estar. Observar lo que aparece: pensamientos, incomodidad, impulso de salir de ahí." },
        { arrow: true, bold: "", text: "No se trata de llegar a la paz. Se trata de tolerar y conocer lo que aparece cuando no hay nada que llenar el espacio." },
        { arrow: true, bold: "", text: "Con el tiempo, lo que era incomodidad se vuelve familiaridad. Y la familiaridad con uno mismo es la base de todo equilibrio interno." },
      ]},
      { type: "block", label: "2. Check de dependencia emocional — semanal", items: [
        { arrow: true, bold: "", text: "¿Hubo alguna decisión esta semana que tomé principalmente para obtener aprobación externa?" },
        { arrow: true, bold: "", text: "¿Hubo momentos donde mi estado emocional dependió directamente del estado o la reacción de otra persona?" },
        { arrow: true, bold: "", text: "¿Hubo algo que toleré que no quería tolerar por miedo a perder el vínculo?" },
        { arrow: true, bold: "", text: "Las respuestas no requieren acción inmediata — requieren honestidad. El patrón se vuelve visible antes de poder cambiarse." },
      ]},
      { type: "block", label: "3. Diálogo interno — observación y nombramiento", items: [
        { arrow: true, bold: "", text: "Cuando aparece un pensamiento crítico o ansioso sobre uno mismo, nombrarlo: 'estoy teniendo el pensamiento de que...'." },
        { arrow: true, bold: "", text: "Sin juzgar si es verdadero o falso. Solo observar que es un pensamiento — no una realidad objetiva." },
        { arrow: true, bold: "", text: "Pregunta de cierre: ¿Le diría esto a alguien que quiero? Si la respuesta es no, ¿por qué me lo digo a mí?" },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hay algo que buscás sistemáticamente en los demás que en realidad necesitás construir en vos? ¿Validación, calma, seguridad, dirección? Eso que buscás afuera dice más sobre la relación con vos mismo que cualquier cosa que otro pueda darte." },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hubo momentos esta semana donde elegí compañía para no estar solo — en lugar de porque genuinamente la quería?",
        "¿Qué pasa cuando estás en silencio sin estímulos externos? ¿Qué aparece?",
        "¿Cómo es tu diálogo interno en los momentos difíciles? ¿Sería aceptable ese tono si lo usaras con alguien que querés?",
        "¿Hay algo que buscás en los vínculos que podrías empezar a construir desde adentro?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Estar bien con uno mismo no es un estado que se alcanza una vez. Es una relación que se cultiva. Como todas las relaciones importantes — con paciencia, con honestidad y con la voluntad de seguir mirando aunque lo que aparezca sea incómodo." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Apertura del Pilar V", text: "Llegamos al último pilar.\n\nLos cuatro anteriores trabajaron el cuerpo, la mente, la conciencia y el equilibrio. Este trabaja lo que queda — y lo que en cierta forma sostiene todo lo anterior: las relaciones y el propósito.\n\nY empieza, como casi todo en hapi, desde adentro.\n\nHay una pregunta que pocas personas se hacen con honestidad: ¿estoy con los demás porque los elijo, o porque no puedo estar bien solo?\n\nLa diferencia parece sutil. En la práctica, lo cambia todo." },
  { time: "1:30 – 4:30", title: "Soledad y dependencia", text: "Estar solo es una circunstancia. La soledad es un estado interno.\n\nUna persona que puede estar sola sin sentir soledad tiene algo que vale más que cualquier compañía: se basta a sí misma.\n\nUna persona que no puede tolerar estar sola está, en cierta medida, atrapada. Su bienestar depende de la presencia constante de otros.\n\nLa dependencia emocional aparece en amistades, en familia, en grupos. Cada vez que el bienestar depende de la validación o la presencia de otro de forma sistemática, hay dependencia.\n\nLas señales son concretas: necesitás aprobación para decidir. Un silencio genera angustia. Regulás tu estado emocional a través de cómo están los demás. Tolerás lo que no querías tolerar por miedo a perder el vínculo.\n\nIdentificar eso no es para juzgarse. Es para ver con claridad desde dónde se está construyendo la relación con los demás — y qué trabajo hace falta hacer desde adentro." },
  { time: "4:30 – 6:30", title: "El diálogo interno", text: "El diálogo interno — esa voz que comenta, juzga y anticipa — es el factor más determinante de la relación con uno mismo. Y casi nadie lo examina.\n\nEl problema no es que exista — es inevitable. El problema es cuando opera desde la hostilidad: exigiéndote lo que no le exigirías a nadie más, interpretando cada error como prueba de una falla fundamental.\n\nTres patrones frecuentes: la comparación permanente hacia arriba. El perfeccionismo como castigo — el estándar imposible que garantiza que nunca es suficiente. Y la anticipación catastrófica — el sufrimiento por eventos que casi nunca ocurren pero que se viven como reales.\n\nEl primer paso no es reemplazar ese diálogo por uno artificialmente positivo. Es nombrarlo. 'Estoy teniendo el pensamiento de que soy un fracaso.'\n\nLa distancia que crea el nombramiento es el inicio del cambio. Lo que se observa pierde parte de su poder automático." },
  { time: "6:30 – 8:30", title: "Práctica guiada", text: "Tres preguntas. Tomá el tiempo que necesitás con cada una.\n\nPrimera: esta semana, ¿hubo algún momento donde elegiste compañía para no estar solo — en lugar de porque genuinamente la querías?\n\n[pausa — 8 seg]\n\nSegunda: ¿cómo es tu diálogo interno cuando cometés un error o cuando las cosas no salen? ¿Usarías ese mismo tono con alguien que querés?\n\n[pausa — 10 seg]\n\nTercera: ¿hay algo que buscás sistemáticamente en los demás — validación, calma, dirección, seguridad — que en realidad necesitás construir en vos?\n\n[pausa larga — 12 seg]\n\nEsa última respuesta — si dejás que aparezca con honestidad — es la más importante del módulo." },
  { time: "8:30 – 10:00", title: "Cierre", text: "Soy libre cuando elijo compartir. No cuando necesito no estar solo.\n\nEsa diferencia — cuando se vive, no solo cuando se entiende — cambia completamente la calidad de todos los vínculos que uno construye.\n\nEl próximo módulo trabaja las relaciones desde afuera: cómo los vínculos que duran son los que crecen en equilibrio. No para completarse — para evolucionar juntos.\n\nPrimero la relación con uno mismo. Después la relación con los demás. Siempre en ese orden." },
] },
  17: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "Las relaciones no duran porque duren. Duran porque crecen.",
    body: [
      { type: "p", text: "Hay una creencia muy extendida sobre los vínculos duraderos: que lo que los sostiene es el amor, la compatibilidad, o simplemente el tiempo. Pero ninguna de esas cosas, sola, explica por qué algunas relaciones que empezaron con todo terminan en nada, y otras que parecían improbables se vuelven inquebrantables." },
      { type: "p", text: "Lo que sostiene una relación en el tiempo es el equilibrio dinámico entre las personas que la forman. No el equilibrio estático — no que todo sea siempre igual — sino la capacidad de detectar cuando algo se desbalanceó y ajustarlo antes de que el desequilibrio se vuelva crónico." },
      { type: "p", text: "Esto aplica a relaciones románticas, amistades profundas, vínculos familiares, sociedades de trabajo. Cualquier relación donde dos o más personas crecen — o donde una crece y la otra no — está sujeta a este principio." },
      { type: "quote", text: "Las relaciones no existen para completar a las personas. Existen para que las personas completas puedan crecer juntas." },
    ]
  },
  {
    id: "equilibrio_dinamico",
    label: "EL EQUILIBRIO DINÁMICO",
    title: "Por qué las relaciones se desequilibran — y cómo se rompen",
    body: [
      { type: "p", text: "Las personas cambian. A distintas velocidades, en distintas direcciones, con distintos ritmos. Eso es inevitable. El problema no es que cambien — es cuando una persona crece y la otra no, y el desequilibrio generado no se reconoce ni se trabaja." },
      { type: "block", label: "Los tres patrones más comunes de desequilibrio", items: [
        { arrow: true, bold: "Uno crece, el otro no:", text: " uno de los dos sigue desarrollándose — en valores, en perspectiva, en aspiraciones — mientras el otro permanece en el mismo lugar. La brecha que se abre no es de amor sino de distancia entre versiones. Si no se nombra y trabaja, eventualmente la relación sostiene una versión que ya no existe." },
        { arrow: true, bold: "Ambos crecen en direcciones opuestas:", text: " los dos evolucionan, pero en sentidos que se alejan. Los valores que antes eran compartidos empiezan a divergir. La compatibilidad que era real en un momento deja de serlo. Esto no es falla — es cambio. Pero necesita reconocerse." },
        { arrow: true, bold: "Uno da, el otro toma — cronificado:", text: " el desequilibrio en la energía que cada uno pone en la relación. Sostenido en el tiempo, agota al que da y no exige nada al que toma. La generosidad sin reciprocidad eventualmente se convierte en resentimiento." },
      ]},
      { type: "p", text: "Los desequilibrios no se resuelven solos. Tienden a profundizarse. Y lo que podría haberse corregido con una conversación honesta en el momento, requiere mucho más trabajo cuando se deja acumular." },
    ]
  },
  {
    id: "conexion_genuina",
    label: "CONEXIÓN GENUINA",
    title: "La diferencia entre conectar y necesitar",
    body: [
      { type: "p", text: "El módulo anterior trabajó la relación con uno mismo como fundamento. Este módulo es la consecuencia natural: cuando uno está bien consigo mismo, la forma en que se vincula con los demás cambia de raíz." },
      { type: "p", text: "La conexión que viene de la plenitud se parece a esto: elijo estar con esta persona porque suma a mi vida, porque aprendo de ella, porque hay algo genuino que se crea entre los dos. No porque la necesite para estar bien, ni porque la ausencia genere angustia, ni porque llenar el espacio sea más importante que la calidad de lo que se llena." },
      { type: "block", label: "Conexión genuina vs. conexión desde la carencia", items: [
        { arrow: false, bold: "→", text: " Genuina: elijo estar. Desde la carencia: necesito no estar solo." },
        { arrow: false, bold: "→", text: " Genuina: la relación suma energía. Desde la carencia: la relación administra la ansiedad." },
        { arrow: false, bold: "→", text: " Genuina: puedo irme cuando necesito espacio sin angustia. Desde la carencia: la separación genera pánico." },
        { arrow: false, bold: "→", text: " Genuina: los límites se sostienen naturalmente. Desde la carencia: los límites colapsan por miedo a perder el vínculo." },
      ]},
      { type: "tip", label: "La pregunta honesta", text: "¿En los vínculos más importantes de tu vida, estás por elección o por necesidad? La respuesta puede ser incómoda. Y es exactamente esa incomodidad la que señala dónde hay trabajo por hacer." },
    ]
  },
  {
    id: "limites_sanos",
    label: "LÍMITES SANOS",
    title: "Los límites en los vínculos no los alejan. Los sostienen.",
    body: [
      { type: "p", text: "En el contexto de las relaciones, los límites son la condición que hace posible la conexión genuina a largo plazo. Un vínculo sin límites claros eventualmente se desgasta — porque uno de los dos termina cediendo lo que no quería ceder, hasta que no puede más." },
      { type: "p", text: "El límite sano no es un muro. Es una forma de decir: esto es lo que puedo dar, esto es lo que necesito, esto es lo que no funciona para mí. Dicho con claridad y a tiempo, ese nivel de honestidad fortalece el vínculo. Callado por miedo, lo erosiona." },
      { type: "block", label: "Lo que los límites sanos no son", items: [
        { arrow: true, bold: "No son egoísmo:", text: " cuidar lo propio dentro de un vínculo no es egoísmo — es condición de sostenibilidad." },
        { arrow: true, bold: "No son castigo:", text: " 'no quiero hablar de esto ahora' no es abandono. Es una necesidad legítima que puede coexistir con el vínculo." },
        { arrow: true, bold: "No son permanentes:", text: " un límite puede ajustarse. Lo que no se puede sostener es la ausencia crónica de ellos." },
      ]},
      { type: "p", text: "La persona que no puede poner límites en sus vínculos eventualmente los pone de la peor forma: desapareciendo, distanciándose o explotando. La claridad temprana es más amable que el colapso tardío." },
      { type: "quote", text: "Un vínculo donde no podés decir que no no es un vínculo — es una obligación. Y las obligaciones no generan amor. Generan resentimiento." },
    ]
  },
  {
    id: "conversacion",
    label: "LA CONVERSACIÓN DE CRECIMIENTO",
    title: "Cómo hablar de los desequilibrios sin destruir el vínculo",
    body: [
      { type: "p", text: "La mayoría de los desequilibrios en las relaciones no se resuelven porque no se hablan. No porque las personas no los vean — sino porque no saben cómo iniciar esa conversación sin que se convierta en conflicto." },
      { type: "p", text: "Hay un tipo de conversación que hace esto posible: la conversación de crecimiento. No es una confrontación ni una queja — es una apertura. Una invitación a ver juntos algo que está pasando, con la intención de mejorar el vínculo, no de ganar una discusión." },
      { type: "block", label: "La estructura", items: [
        { arrow: true, bold: "Empezar desde uno mismo:", text: " 'yo noto que...' o 'yo me siento...' en lugar de 'vos siempre...' o 'el problema es que...'. La diferencia en el punto de partida define si la conversación va a ser posible o va a cerrarse en el primer minuto." },
        { arrow: true, bold: "Hablar del patrón, no del evento:", text: " no 'lo que pasó el martes' sino 'hay algo que se repite y me gustaría que lo miremos juntos'. El patrón abre. El evento específico suele activar la defensa." },
        { arrow: true, bold: "Proponer, no exigir:", text: " 'me gustaría que...' o '¿podríamos probar...?' en lugar de 'tenés que...' o 'necesito que cambies'. La propuesta deja espacio al otro. La exigencia lo cierra." },
        { arrow: true, bold: "Cerrar con algo concreto:", text: " una conversación de crecimiento que no termina en algo específico — un acuerdo, una decisión, una próxima revisión — suele ser un desahogo que no cambia nada." },
      ]},
    ]
  },
  {
    id: "practica",
    label: "LA PRÁCTICA",
    title: "Check de equilibrio · Conversación de crecimiento · Límites sanos",
    body: [
      { type: "p", text: "Tres prácticas. La primera es de observación, la segunda de conversación, la tercera de ajuste." },
      { type: "block", label: "1. Check de equilibrio en relaciones — semanal", items: [
        { arrow: true, bold: "", text: "Elegí una relación importante. ¿Estás creciendo en ella o estás estancado? ¿El otro está creciendo? ¿En la misma dirección o en direcciones que se alejan?" },
        { arrow: true, bold: "", text: "¿Hay un desequilibrio en lo que cada uno da? ¿Venís cediendo algo que no querías ceder?" },
        { arrow: true, bold: "", text: "¿Hay algo que necesitás decir y no dijiste? ¿Cuánto tiempo lleva acumulado?" },
      ]},
      { type: "block", label: "2. Conversación de crecimiento — cuando el check lo indica", items: [
        { arrow: true, bold: "", text: "Cuando el check revela algo que necesita ser dicho, elegir el momento apropiado — no en medio de un conflicto, no cuando el otro está en modo defensa." },
        { arrow: true, bold: "", text: "Usar la estructura: desde uno mismo, el patrón, la propuesta, el cierre concreto." },
        { arrow: true, bold: "", text: "El objetivo no es tener razón. Es que el vínculo funcione mejor para los dos." },
      ]},
      { type: "block", label: "3. Límites sanos — práctica de claridad", items: [
        { arrow: true, bold: "", text: "Identificar un límite en algún vínculo que no está claro o que se viene cediendo." },
        { arrow: true, bold: "", text: "Formularlo internamente primero: ¿qué necesito realmente? ¿Qué no puedo seguir sosteniendo?" },
        { arrow: true, bold: "", text: "Comunicarlo cuando sea el momento — con claridad, sin dramatismo, sin pedir permiso para tenerlo." },
      ]},
      { type: "tip", label: "Pregunta de autoconocimiento", text: "¿Hay algún vínculo en tu vida que esté sostenido más por hábito o miedo que por elección genuina? ¿Qué pasaría si le pusieras límites claros — o si tuvieras la conversación que viene postergando?" },
    ]
  },
  {
    id: "reflexion",
    label: "REFLEXIÓN",
    title: "Preguntas para tu diario",
    body: [
      { type: "checks", items: [
        "¿Hay alguna relación importante donde sientas que el crecimiento fue divergiendo? ¿Lo nombré alguna vez?",
        "¿Hay un vínculo donde venís cediendo más de lo que querés? ¿Cuánto tiempo lleva eso?",
        "¿Hay una conversación de crecimiento que necesitás tener y que venís postergando? ¿Qué te frena?",
        "¿Los límites que tenés en tus vínculos importantes están claros — para vos y para el otro?",
        "¿Qué te dijo esta práctica sobre vos hoy?",
      ]},
      { type: "p", text: "Las relaciones más sólidas no son las que nunca tienen tensión. Son las que saben qué hacer con la tensión cuando aparece. Esa capacidad — de nombrar, ajustar y seguir — es lo que las hace duraderas." },
    ]
  },
], audio: [
  { time: "0:00 – 1:30", title: "Intro", text: "Las relaciones no duran porque duren.\n\nDuran porque crecen.\n\nLo que sostiene un vínculo en el tiempo no es el amor abstracto ni el tiempo compartido. Es la capacidad de detectar cuándo algo se desequilibró y ajustarlo antes de que ese desequilibrio se vuelva crónico.\n\nEsto aplica a relaciones románticas, amistades profundas, vínculos de trabajo, familia. Cualquier relación donde hay personas que cambian — que es decir, todas las relaciones." },
  { time: "1:30 – 4:00", title: "Desequilibrios y conexión genuina", text: "Las personas cambian. A distintos ritmos, en distintas direcciones. El problema no es el cambio — es cuando una persona crece y la otra no, y la brecha que se abre no se reconoce ni se trabaja.\n\nHay tres patrones comunes. Uno crece, el otro no — y la relación sostiene una versión que ya no existe. Ambos crecen en direcciones que se alejan — y la compatibilidad que era real deja de serlo. O uno da y el otro toma, cronificado — hasta que el que da no puede más.\n\nY después está la pregunta más honesta de este módulo: en los vínculos que más importan, ¿estás por elección o por necesidad?\n\nConexión genuina: elijo estar con esta persona porque suma, porque aprendo, porque hay algo real que se crea entre nosotros. No porque la necesite para estar bien.\n\nEsa diferencia — cuando se vive y no solo cuando se entiende — cambia completamente el tipo de vínculo que uno construye." },
  { time: "4:00 – 6:00", title: "Límites y conversación", text: "Los límites en los vínculos no los alejan. Los sostienen.\n\nUn vínculo sin límites claros eventualmente se desgasta — porque uno de los dos cede lo que no quería ceder, hasta que no puede más. La claridad temprana es más amable que el colapso tardío.\n\nY la forma de trabajar los desequilibrios cuando aparecen es la conversación de crecimiento. No una confrontación ni una queja — una apertura. Una invitación a ver juntos algo que está pasando.\n\nLa estructura es simple. Empezar desde uno mismo, no desde el otro. Hablar del patrón, no del evento específico. Proponer, no exigir. Y cerrar con algo concreto.\n\nLa conversación que termina sin nada específico suele ser un desahogo que no cambia nada. La que termina con un acuerdo — aunque sea pequeño — mueve algo real." },
  { time: "6:00 – 7:30", title: "Práctica guiada", text: "Pensá en una relación importante para vos ahora mismo.\n\n[pausa — 5 seg]\n\nPrimera pregunta: ¿están creciendo juntos — o el crecimiento de uno se fue alejando del otro?\n\n[pausa — 8 seg]\n\nSegunda: ¿hay algo que venís cediendo en esa relación que no querías ceder? ¿Cuánto tiempo lleva eso?\n\n[pausa — 8 seg]\n\nTercera: ¿hay algo que necesitás decir y no dijiste? ¿Una conversación que se viene postergando?\n\n[pausa — 8 seg]\n\n¿Qué te frena para tenerla?\n\n[pausa larga — 10 seg]\n\nEsa respuesta — lo que te frena — es la más importante del ejercicio." },
  { time: "7:30 – 9:00", title: "Cierre", text: "Las relaciones más sólidas no son las que nunca tienen tensión.\n\nSon las que saben qué hacer con la tensión cuando aparece. Esa capacidad — de nombrar, ajustar y seguir — es lo que las hace duraderas.\n\nEl último módulo del sistema trabaja el propósito. El alma de todo lo que hapi construyó en estos 18 módulos. Cómo integrar sentido sin dogma, cómo leer los obstáculos como información, cómo escribir el manifiesto personal que cierra el sistema.\n\nPrimero las relaciones. Después el propósito. El orden refleja la lógica de todo el sistema: adentro primero, afuera después." },
] },
  18: { sections: [
  {
    id: "intro",
    label: "INTRODUCCIÓN",
    title: "El propósito no es un destino. Es la dirección que le da sentido al camino.",
    body: [
      { type: "p", text: "Este es el último módulo del sistema. No el final — el punto de integración. El lugar donde todo lo que se trabajó en los 17 módulos anteriores encuentra su por qué." },
      { type: "p", text: "El propósito no es una respuesta que se recibe ni un destino que se alcanza. Es una orientación que emerge de conocerse bien, de vivir con conciencia, y de hacerse las preguntas correctas en el momento correcto." },
      { type: "p", text: "Viktor Frankl, sobreviviente del Holocausto y fundador de la logoterapia, observó algo que los campos de concentración nazis pusieron en evidencia de la forma más brutal posible: las personas que sobrevivían no eran necesariamente las más fuertes físicamente. Eran las que tenían un por qué." },
      { type: "quote", text: "Quien tiene un por qué para vivir puede soportar casi cualquier cómo. — Viktor Frankl" },
    ]
  },
  {
    id: "busqueda",
    label: "LA BÚSQUEDA YA ES EL CAMINO",
    title: "No hay que encontrar el propósito para empezar a vivirlo",
    body: [
      { type: "p", text: "Uno de los mayores bloqueos en torno al propósito es la creencia de que hay que 'descubrirlo' antes de poder actuar. Como si existiera un destino predefinido que hay que localizar, y hasta entonces uno está en suspenso." },
      { type: "p", text: "La realidad es más dinámica: el propósito no se encuentra — se construye. Se construye viviendo con atención, notando qué activa algo genuino, qué tipo de contribución te parece que vale la pena, qué querías que existiera en el mundo y no existía." },
      { type: "tip", label: "El propósito como brújula, no como mapa", text: "Un mapa dice exactamente adónde ir. Una brújula dice en qué dirección moverse. El propósito funciona como brújula: no necesita estar completamente definido para orientar decisiones cotidianas. ¿Esta decisión me acerca o me aleja de lo que importa? Esa pregunta sola es suficiente para vivir con más dirección." },
      { type: "p", text: "La búsqueda misma — hacerse las preguntas, prestar atención a lo que resuena, rechazar lo que no — ya es parte del propósito. No hay un momento en que 'ya lo encontraste' y deja de haber trabajo. Hay una orientación que se profundiza con el tiempo." },
      { type: "attributed", text: "No busques el éxito. Cuanto más lo busques y lo conviertas en tu objetivo, más lo vas a esquivar. El éxito llega como consecuencia no intencionada de la dedicación personal a algo más grande que uno mismo.", author: "Viktor Frankl" },
    ]
  },
  {
    id: "obstaculos",
    label: "LOS OBSTÁCULOS COMO INFORMACIÓN",
    title: "Cada dificultad contiene algo que el éxito no hubiera dado",
    body: [
      { type: "p", text: "Los estoicos lo sabían. La Kabbalah lo enseña. Frankl lo vivió. Todas las tradiciones que trabajan la dimensión de sentido convergen en lo mismo: los obstáculos no son interrupciones del camino. Son parte del camino." },
      { type: "p", text: "Esto no es positivisimo vacío — es una herramienta de interpretación. Cuando algo difícil ocurre, hay dos preguntas disponibles. La primera es: ¿por qué me pasa esto? Esa pregunta lleva hacia la victimización, el resentimiento, la búsqueda de culpables. La segunda es: ¿qué hay acá para aprender? Esa pregunta lleva hacia el crecimiento, la acción, la recuperación del poder." },
      { type: "block", label: "Lo que los obstáculos pueden contener", items: [
        { arrow: true, bold: "Información sobre supuestos incorrectos:", text: " lo que creías que funcionaba y no funcionó. Ese dato vale más que años de teoría." },
        { arrow: true, bold: "Señales de desequilibrio:", text: " muchas veces lo que parece un problema externo es la manifestación de algo interno que necesita ajuste." },
        { arrow: true, bold: "Oportunidad de fortaleza:", text: " el sistema inmune mental del módulo 09: sin exposición a la adversidad, no hay resiliencia. La dificultad atravesada conscientemente construye algo que la comodidad no puede construir." },
        { arrow: true, bold: "Reorientación de dirección:", text: " a veces el obstáculo no es algo a superar sino algo que señala que la dirección no era la correcta. No derrota — redirección." },
      ]},
      { type: "quote", text: "La vida no me pasa. Me entrena. Cada obstáculo es una invitación a aprender algo que todavía no sabía sobre mí." },
    ]
  },
  {
    id: "tikkun",
    label: "TIKKÚN — LA CORRECCIÓN",
    title: "La vida como proceso de evolución y aprendizaje continuo",
    body: [
      { type: "p", text: "En la tradición de la Kabbalah, existe el concepto de tikkún — literalmente 'corrección' o 'reparación'. La idea es que cada persona llega a esta vida con aspectos específicos que necesitan trabajarse, y que las experiencias — especialmente las difíciles — son oportunidades para ese trabajo." },
      { type: "p", text: "Sin entrar en el plano metafísico del concepto, hay algo universalmente aplicable en esta forma de ver la vida: cada experiencia difícil puede leerse como información sobre algo que todavía necesita equilibrio. No como castigo — como oportunidad." },
      { type: "p", text: "El patrón que se repite en la vida de una persona no es accidente. Es señal. La misma situación que vuelve de distintas formas — el mismo tipo de conflicto en distintos vínculos, la misma forma de sabotear lo que funciona, el mismo miedo que aparece en contextos diferentes — está mostrando algo específico que necesita atención." },
      { type: "tip", label: "La pregunta del tikkún aplicada", text: "Ante cualquier situación difícil o patrón recurrente: ¿qué aspecto de mí necesita trabajarse acá? No desde la culpa — desde la curiosidad. Esta pregunta transforma la experiencia de víctima pasiva a aprendiz activo. Y eso, repetido suficientes veces, produce una forma de vivir completamente distinta." },
    ]
  },
  {
    id: "integracion",
    label: "EL SISTEMA INTEGRADO",
    title: "Los 5 pilares como un todo — cómo se sostienen entre sí",
    body: [
      { type: "p", text: "El propósito no flota en el aire — necesita una base. Y esa base es exactamente lo que los 17 módulos anteriores construyeron." },
      { type: "pillars_visual" },
      { type: "p", text: "Sin el Pilar I — el cuerpo — el propósito queda sin energía para ejecutarse. Sin el Pilar II — la mente entrenada — el propósito se pierde ante la primera dificultad. Sin el Pilar III — la conciencia — el propósito se persigue en automático sin vivirlo. Sin el Pilar IV — el equilibrio — el propósito en un área destruye las demás. Sin el Pilar V — las relaciones — el propósito se vuelve solitario y frágil." },
      { type: "quote", text: "El propósito no reemplaza el trabajo de los otros pilares. Les da sentido. Sin propósito, los hábitos son disciplina vacía. Con propósito, son dirección." },
    ]
  },
  {
    id: "manifiesto",
    label: "EL MANIFIESTO PERSONAL",
    title: "Escribir el propio — la práctica de cierre del sistema",
    body: [
      { type: "p", text: "Un manifiesto personal no es una lista de metas ni un plan de cinco años. Es una declaración de orientación: quién sos, qué importa, cómo querés vivir, en qué dirección se mueve todo." },
      { type: "p", text: "No necesita ser largo ni definitivo. Puede ser cinco líneas. Lo importante es que sea honesto — que salga de lo que realmente importa y no de lo que debería importar según otros." },
      { type: "block", label: "Cinco preguntas para escribirlo", items: [
        { arrow: true, bold: "¿Qué tipo de persona querés ser?", text: " No qué querés lograr — qué cualidades querés encarnar." },
        { arrow: true, bold: "¿Qué es lo que más te importa proteger en tu vida?", text: " Las respuestas revelan los valores reales, no los declarados." },
        { arrow: true, bold: "¿Qué tipo de contribución querés hacer?", text: " En cualquier escala — familia, trabajo, comunidad, mundo." },
        { arrow: true, bold: "¿Qué patrón querés romper?", text: " Lo que aprendiste de ti mismo en estos 18 módulos que ya no querés seguir repitiendo." },
        { arrow: true, bold: "¿Cómo querés que se sienta una semana bien vivida?", text: " No qué querés haber logrado — cómo querés haberte sentido." },
      ]},
      { type: "tip", label: "No es para siempre", text: "El manifiesto cambia. La persona que eras al empezar hapi no es la misma que la termina. Revisarlo cada seis meses o un año — con las mismas cinco preguntas — muestra la evolución con claridad. Eso solo ya vale el sistema completo." },
    ]
  },
  {
    id: "cierre",
    label: "CIERRE DEL SISTEMA",
    title: "No es el final. Es el principio de la versión que construiste.",
    body: [
      { type: "p", text: "18 módulos. 5 pilares. Cuerpo, mente, conciencia, equilibrio, relaciones y propósito. Un sistema que no prescribe cómo vivir sino que ayuda a descubrir la propia forma de hacerlo." },
      { type: "p", text: "Lo que hapi construyó no es un conjunto de hábitos ni una lista de prácticas. Es una forma de mirar. Una disposición a observar, a preguntar, a ajustar. Una capacidad de atravesar lo difícil sin quebrarse y de vivir lo cotidiano sin perderlo." },
      { type: "p", text: "El sistema no termina acá. Se reinicia. Los módulos se vuelven a leer con otra mirada cuando uno tiene más experiencia. Las prácticas se profundizan. Las preguntas generan respuestas distintas con el tiempo." },
      { type: "tip", label: "La pregunta de propósito diaria", text: "Una sola pregunta para llevar de aquí en adelante: ¿lo que hago hoy está alineado con quien quiero ser? No como exigencia — como brújula. Algunos días la respuesta es sí. Otros no. Lo importante es seguir haciéndola." },
      { type: "quote", text: "No se trata de llegar. Se trata de la forma en que recorrés el camino. Y eso — la calidad de la presencia con que vivís cada día — es lo único que realmente construye algo que dura." },
    ]
  },
], audio: [
  { time: "0:00 – 2:00", title: "El último módulo", text: "Este es el módulo 18. El último.\n\nNo el final — el punto de integración. El lugar donde todo lo que se trabajó en los 17 módulos anteriores encuentra su por qué.\n\nViktor Frankl observó algo que los campos de concentración nazis pusieron en evidencia de la forma más brutal posible: las personas que sobrevivían no eran necesariamente las más fuertes. Eran las que tenían un por qué.\n\nQuien tiene un por qué para vivir puede soportar casi cualquier cómo.\n\nEse es el territorio de este módulo. El propósito — no como destino que se alcanza, sino como dirección que orienta." },
  { time: "2:00 – 4:30", title: "La búsqueda y los obstáculos", text: "El propósito no se encuentra. Se construye.\n\nSe construye viviendo con atención, notando qué activa algo genuino, haciéndose las preguntas correctas. La búsqueda misma ya es parte del propósito. No hay un momento en que 'ya lo encontraste' y deja de haber trabajo.\n\nY los obstáculos — los estoicos lo sabían, la Kabbalah lo enseña, Frankl lo vivió — no son interrupciones del camino. Son parte del camino.\n\nHay dos preguntas disponibles ante cualquier dificultad. La primera: ¿por qué me pasa esto? Esa lleva hacia la victimización, la búsqueda de culpables, el resentimiento.\n\nLa segunda: ¿qué hay acá para aprender? Esa lleva hacia el crecimiento, la acción, la recuperación del poder.\n\nLa vida no te pasa. Te entrena. Cada obstáculo es una invitación a aprender algo que todavía no sabías sobre vos." },
  { time: "4:30 – 7:00", title: "El sistema integrado", text: "Los 5 pilares que construiste a lo largo de hapi no son partes separadas. Se sostienen entre sí.\n\nEl Pilar I — el cuerpo — le da energía a todo lo demás. Sin sueño, sin movimiento, sin alimentación consciente, el propósito queda sin combustible.\n\nEl Pilar II — la mente entrenada — le da resiliencia. Sin el filtro estoico, sin el sistema inmune mental, el propósito se pierde ante la primera dificultad real.\n\nEl Pilar III — la conciencia — le da presencia. Sin asombro, sin delight, sin la práctica de la última vez, el propósito se persigue en automático sin vivirlo.\n\nEl Pilar IV — el equilibrio — le da sostenibilidad. Sin las 7 dimensiones en balance, el propósito en un área destruye las demás.\n\nY el Pilar V — las relaciones — le da contexto. El propósito solitario es frágil. El propósito compartido, construido desde la plenitud, se fortalece.\n\nEl propósito no reemplaza el trabajo de los otros pilares. Les da sentido." },
  { time: "7:00 – 9:30", title: "Práctica guiada — manifiesto", text: "Cinco preguntas. Tomá el tiempo que necesitás con cada una.\n\n¿Qué tipo de persona querés ser? No qué querés lograr — qué cualidades querés encarnar.\n\n[pausa — 12 seg]\n\n¿Qué es lo que más importa proteger en tu vida?\n\n[pausa — 10 seg]\n\n¿Qué tipo de contribución querés hacer — en cualquier escala?\n\n[pausa — 10 seg]\n\n¿Qué patrón querés romper? Lo que aprendiste sobre vos en estos 18 módulos que ya no querés seguir repitiendo.\n\n[pausa — 12 seg]\n\n¿Cómo querés que se sienta una semana bien vivida? No qué querés haber logrado — cómo querés haberte sentido.\n\n[pausa larga — 15 seg]\n\nEsas respuestas son tu manifiesto. No importa que todavía no estén escritas. Ya están adentro." },
  { time: "9:30 – 11:00", title: "Cierre del sistema", text: "18 módulos. 5 pilares.\n\nUn sistema que no prescribe cómo vivir sino que ayuda a descubrir la propia forma de hacerlo.\n\nLo que hapi construyó no es una lista de hábitos. Es una forma de mirar. Una disposición a observar, a preguntar, a ajustar.\n\nEl sistema no termina acá. Se reinicia. Los módulos se vuelven a leer con otra mirada cuando uno tiene más experiencia. Las prácticas se profundizan. Las preguntas generan respuestas distintas con el tiempo.\n\nY hay una sola pregunta para llevar de aquí en adelante:\n\n¿Lo que hago hoy está alineado con quien quiero ser?\n\nNo como exigencia. Como brújula.\n\nEso — la calidad de la presencia con que vivís cada día — es lo único que realmente construye algo que dura.\n\n[pausa larga]\n\nGracias por haber llegado hasta acá." },
] },
};

// ─── HELPERS ─────────────────────────────────────────────────
function getPillar(num) { return PILLARS.find(p => p.modules.includes(num)); }
function getStatus(num, done, current) {
  if (done.includes(num)) return "done";
  if (num === current) return "active";
  if (num > current) return "locked";
  return "done";
}

// ─── INITIAL STATE ────────────────────────────────────────────
const INIT_STATE = {
  name: "Martín",
  currentModule: 7,
  completedModules: [1,2,3,4,5,6],
  streak: 12,
  weekProgress: [true,true,true,false,false,false,false],
  currentDay: 3,
};

// ─── SHARED COMPONENTS ────────────────────────────────────────
function HapiLogo({ size=28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {/* círculo verde sólido */}
      <circle cx="30" cy="30" r="30" fill="#7ECBA1"/>
      <circle cx="30" cy="25" r="3" fill="#0F1E14"/>
      <path d="M19 37 Q24 43 30 43 Q36 43 41 37" stroke="#0F1E14" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function ProgressRing({ pct, color, size=48, stroke=3, label }) {
  const r = (size - stroke*2)/2;
  const circ = 2*Math.PI*r;
  return (
    <div className="relative flex items-center justify-center" style={{width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"absolute"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={DIM} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${circ*pct} ${circ}`} strokeLinecap="round"/>
      </svg>
      {label && <span className="text-xs font-bold" style={{color,position:"relative",zIndex:1}}>{label}</span>}
    </div>
  );
}

function renderSection(body, accent="#7ECBA1") {
  return body.map((item,i) => {
    if (item.type==="dims_overview") return <DimCardList key={i}/>;
    if (item.type==="pillars_visual") return <PillarsVisualInline key={i}/>;
    if (item.type==="p") return <p key={i} className="text-sm leading-relaxed mb-4" style={{color:"rgba(255,255,255,0.75)"}}>{item.text}</p>;
    if (item.type==="subtitle") return <p key={i} className="text-xs font-bold mt-5 mb-2" style={{color:accent,letterSpacing:"1px"}}>{item.text}</p>;
    if (item.type==="quote") return (
      <div key={i} className="my-5 pl-4 py-1" style={{borderLeft:"3px solid rgba(255,255,255,0.2)"}}>
        <p className="text-sm leading-relaxed italic" style={{color:MUTED}}>{item.text}</p>
      </div>
    );
    if (item.type==="tip") return (
      <div key={i} className="rounded-2xl p-4 my-4" style={{background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.1)`}}>
        <p className="text-xs font-bold mb-1" style={{color:WHITE}}>{item.label}</p>
        <p className="text-sm leading-relaxed" style={{color:MUTED}}>{item.text}</p>
      </div>
    );
    if (item.type==="attributed") return (
      <div key={i} className="rounded-2xl p-4 my-4" style={{background:CARD,border:`1px solid ${BORDER}`}}>
        <p className="text-sm leading-relaxed italic mb-2" style={{color:"rgba(255,255,255,0.65)"}}>&ldquo;{item.text}&rdquo;</p>
        <p className="text-xs" style={{color:MUTED}}>— {item.author}</p>
      </div>
    );
    if (item.type==="block") return (
      <div key={i} className="my-4">
        {item.label && <p className="text-xs font-bold mb-3" style={{color:WHITE,letterSpacing:"0.5px"}}>{item.label}</p>}
        {item.items.map((row,j) => (
          <div key={j} className="flex gap-2 mb-3">
            {row.arrow && <span className="text-xs mt-0.5 flex-shrink-0" style={{color:MUTED}}>→</span>}
            <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.7)"}}>
              {row.bold && <span className="font-semibold" style={{color:WHITE}}>{row.bold}</span>}
              {row.text}
            </p>
          </div>
        ))}
      </div>
    );
    if (item.type==="checks") return (
      <div key={i} className="my-3">
        {item.items.map((check,j) => (
          <div key={j} className="flex gap-3 mb-3 p-3 rounded-xl" style={{background:SURFACE,border:`1px solid ${BORDER}`}}>
            <span className="text-sm flex-shrink-0" style={{color:DIM}}>☐</span>
            <p className="text-xs leading-relaxed" style={{color:"rgba(255,255,255,0.65)"}}>{check}</p>
          </div>
        ))}
      </div>
    );
    return null;
  });
}

// ─── DIMS (Module 13) ──────────────────────────────────────
const DIMS = [
  {
    num: "01",
    name: "Materia",
    icon: "◆",
    color: "#C4A882",
    exceso: "Acumulación, apego, vivir para tener más. El bienestar siempre depende del próximo escalón material.",
    falta: "Rechazo de lo material, desconexión de la realidad práctica, dificultad para sostener lo cotidiano.",
    equilibrio: "Uso la materia como herramienta, no como fin. Tengo lo que necesito sin que eso me defina.",
    frase: "Rico no es el que más tiene. Es el que menos necesita para estar bien.",
  },
  {
    num: "02",
    name: "Generosidad",
    icon: "❋",
    color: "#A8C4A8",
    exceso: "Dar sin límites, perderse a uno mismo, decir sí a todo. La generosidad sin estructura drena.",
    falta: "Cierre, egoísmo, retención excesiva. No poder dar sin sentir que se pierde algo.",
    equilibrio: "Doy desde la abundancia, no desde la obligación. Sin dejar de cuidarme.",
    frase: "La generosidad real no se da por culpa ni por miedo. Se da porque hay algo genuino para ofrecer.",
  },
  {
    num: "03",
    name: "Límites",
    icon: "▲",
    color: "#C48282",
    exceso: "Rigidez, control excesivo, dureza. Todo se vuelve norma, y la norma aplasta la vida.",
    falta: "Desorden, falta de dirección, permisividad que erosiona. Sin límites no hay forma.",
    equilibrio: "Tengo disciplina pero con flexibilidad. Los límites son estructura de la libertad, no su opuesto.",
    frase: "Los límites no restringen la vida. Son lo que le da forma.",
  },
  {
    num: "04",
    name: "Armonía",
    icon: "◎",
    color: "#82A8C4",
    exceso: "Necesidad de agradar, evitar el conflicto a cualquier costo. La armonía forzada aplasta la autenticidad.",
    falta: "Desconexión emocional, frialdad, dificultad para conectar. La relación se vuelve transaccional.",
    equilibrio: "Busco equilibrio sin dejar de ser auténtico. La armonía genuina incluye la verdad.",
    frase: "La armonía que requiere mentirse a uno mismo no es armonía. Es evasión.",
  },
  {
    num: "05",
    name: "Perseverancia",
    icon: "→",
    color: "#C4B482",
    exceso: "Insistir sin sentido, resistencia al ajuste, identificarse tanto con un camino que se pierde de vista el objetivo.",
    falta: "Rendirse rápido, inconsistencia, esperar resultados sin sostener el proceso.",
    equilibrio: "Persisto con dirección. Sé cuándo empujar y cuándo ajustar. La perseverancia inteligente incluye la revisión.",
    frase: "La constancia no es hacer siempre lo mismo. Es no abandonar lo que importa.",
  },
  {
    num: "06",
    name: "Humildad",
    icon: "◇",
    color: "#A882C4",
    exceso: "Sumisión, falta de identidad, adaptarse tanto que uno desaparece. La humildad sin límites es auto-abandono.",
    falta: "Soberbia, incapacidad de aprender, rigidez de ego. Lo que no puede doblarse, se quiebra.",
    equilibrio: "Aprendo y me adapto sin perder quién soy. La humildad real no borra la identidad — la libera del ego.",
    frase: "La persona más segura no necesita tener siempre la razón. Puede aprender de cualquiera.",
  },
  {
    num: "07",
    name: "Conexión",
    icon: "∞",
    color: "#82C4B4",
    exceso: "Dependencia emocional, necesitar a otros para sentirse completo. Conectar desde la carencia.",
    falta: "Aislamiento, desconexión, dificultad para vincularse genuinamente. La autosuficiencia que excluye.",
    equilibrio: "Me vinculo desde la elección, no desde la necesidad. Estoy bien solo antes de estar bien con otros.",
    frase: "Soy libre cuando elijo compartir. No cuando necesito no estar solo.",
  },
];

// ─── SPECIAL COMPONENTS ─────────────────────────────────────
function PillarsVisualInline() {
  return (
    <div className="my-4">
      {PILLARS.map((p) => (
        <div key={p.id} className="flex items-start gap-3 mb-3 p-3 rounded-xl"
          style={{ background: CARD, border: `1px solid ${p.color}20` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
            {p.num}
          </div>
          <div>
            <p className="text-xs font-bold mb-0.5" style={{ color: p.color }}>{p.name}</p>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{p.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DimCard({ dim, expanded, onToggle }) {
  return (
    <div className="mb-3 rounded-2xl overflow-hidden transition-all"
      style={{ background: SURFACE, border: `1px solid ${expanded ? dim.color + "40" : BORDER}` }}>
      <button onClick={onToggle} className="w-full p-4 text-left flex items-center gap-3"
        style={{ background: "none", border: "none", cursor: "pointer" }}>
        <span className="text-lg w-6 text-center flex-shrink-0" style={{ color: dim.color }}>{dim.icon}</span>
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: dim.color, letterSpacing: "0.5px" }}>DIMENSIÓN {dim.num}</p>
          <p className="text-sm font-semibold" style={{ color: WHITE }}>{dim.name}</p>
        </div>
        <span className="text-xs" style={{ color: MUTED, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <div className="h-px mb-4" style={{ background: BORDER }}/>
          <div className="mb-3 p-3 rounded-xl" style={{ background: "#FF6B6B08", border: "1px solid #FF6B6B18" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#FF8A80" }}>EXCESO</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{dim.exceso}</p>
          </div>
          <div className="mb-3 p-3 rounded-xl" style={{ background: "#FFA50008", border: "1px solid #FFA50018" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#FFCC80" }}>FALTA</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{dim.falta}</p>
          </div>
          <div className="mb-3 p-3 rounded-xl" style={{ background: `${dim.color}10`, border: `1px solid ${dim.color}25` }}>
            <p className="text-xs font-bold mb-1" style={{ color: dim.color }}>EQUILIBRIO</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{dim.equilibrio}</p>
          </div>
          <div className="pl-3 py-1" style={{ borderLeft: `3px solid ${dim.color}` }}>
            <p className="text-xs leading-relaxed italic" style={{ color: "rgba(255,255,255,0.5)" }}>{dim.frase}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DimCardList() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="my-2">
      {DIMS.map((dim) => (
        <DimCard key={dim.num} dim={dim}
          expanded={expanded === dim.num}
          onToggle={() => setExpanded(expanded === dim.num ? null : dim.num)}/>
      ))}
    </div>
  );
}


// ─── ONBOARDING (hapi_v3) ────────────────────────────────────────
const ACCENTS = {
  intro:       "#7ECBA1",
  welcome:     "#7ECBA1",
  nombre:      "#7ECBA1",
  edad:        "#6BA8D4",
  sexo:        "#B094D4",
  momento:     "#7ECBA1",
  tiempo:      "#6BA8D4",
  estilo:      "#D4A574",
  orientacion: "#D47A8F",
  resultado:   "#7ECBA1",
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "intro",    type: "intro" },
  { id: "welcome",  type: "splash" },
  { id: "nombre",   type: "text_input", field: "nombre",
    pregunta: "¿Cómo te llamás?",
    subtitulo: "Así podemos hablarte a vos, no a todos.",
    placeholder: "Tu nombre" },
  { id: "edad",     type: "single", field: "edad",
    pregunta: "¿En qué etapa de vida estás?",
    subtitulo: "Adaptamos las referencias y el tono a tu momento.",
    opciones: [
      { value: "18-25", label: "18 – 25", emoji: "🌱", desc: "Construyendo las bases" },
      { value: "26-35", label: "26 – 35", emoji: "🚀", desc: "Navegando la primera adultez" },
      { value: "36-45", label: "36 – 45", emoji: "⚡", desc: "En el medio del camino" },
      { value: "46-55", label: "46 – 55", emoji: "🧭", desc: "Revisando prioridades" },
      { value: "55+",   label: "55+",     emoji: "🌳", desc: "Con perspectiva" },
    ]},
  { id: "sexo",     type: "single", field: "sexo",
    pregunta: "¿Con cuál te identificás?",
    subtitulo: "Lo usamos para adaptar las recomendaciones físicas del Pilar I.",
    opciones: [
      { value: "hombre", label: "Hombre",              emoji: "👤", desc: "" },
      { value: "mujer",  label: "Mujer",               emoji: "👥", desc: "" },
      { value: "nd",     label: "Prefiero no decirlo", emoji: "🔒", desc: "" },
    ]},
  { id: "momento",  type: "single", field: "momento",
    pregunta: "¿Desde dónde llegás a hapi?",
    subtitulo: "Esto define el tono con el que te vamos a acompañar.",
    opciones: [
      { value: "crisis",    label: "Estoy atravesando algo difícil",   emoji: "🌧", desc: "Crisis, pérdida, o algo que duele" },
      { value: "busqueda",  label: "Busco crecer y mejorar",           emoji: "🌱", desc: "Todo funciona, pero hay más" },
      { value: "optimizar", label: "Quiero optimizar lo que ya tengo", emoji: "⚡", desc: "Sólido, busco el siguiente nivel" },
      { value: "curioso",   label: "Llegué por curiosidad",            emoji: "🔍", desc: "A ver de qué se trata" },
    ]},
  { id: "tiempo",   type: "single", field: "tiempo",
    pregunta: "¿Cuánto tiempo tenés por día?",
    subtitulo: "Adaptamos las prácticas a lo que es real para vos.",
    opciones: [
      { value: "5min",  label: "5 minutos",       emoji: "⏱", desc: "Poco pero constante" },
      { value: "15min", label: "15 minutos",       emoji: "🕐", desc: "Un bloque diario" },
      { value: "30min", label: "30 minutos",       emoji: "🕞", desc: "Comprometido" },
      { value: "libre", label: "Sin restricción",  emoji: "🌊", desc: "El tiempo que haga falta" },
    ]},
  { id: "estilo",   type: "single", field: "estilo",
    pregunta: "¿Cómo preferís recibir las ideas?",
    subtitulo: "No hay opción mejor ni peor. Solo distintas formas de conectar.",
    opciones: [
      { value: "simple",     label: "Simple y directo",           emoji: "💬", desc: "Sin términos técnicos, con ejemplos" },
      { value: "balanceado", label: "Equilibrado",                emoji: "⚦",  desc: "Conceptual pero aplicable" },
      { value: "profundo",   label: "Con profundidad conceptual", emoji: "📚", desc: "Neurociencia, filosofía, evidencia" },
      { value: "tecnico",    label: "Técnico y riguroso",         emoji: "🔬", desc: "Quiero la fuente y el mecanismo" },
    ]},
  { id: "orientacion", type: "single", field: "orientacion",
    pregunta: "¿Cómo procesás la vida principalmente?",
    subtitulo: "Esto nos ayuda a balancear razón e intuición en el camino.",
    opciones: [
      { value: "razon",     label: "Desde la razón",                    emoji: "🧠", desc: "Me guío por la lógica y la evidencia" },
      { value: "intuicion", label: "Desde la intuición",                emoji: "🌿", desc: "Confío en lo que siento" },
      { value: "ambos",     label: "Desde los dos",                     emoji: "⚖",  desc: "Según el momento, uso uno u otro" },
      { value: "buscando",  label: "Todavía lo estoy descubriendo",     emoji: "🔍", desc: "No tengo claro cómo lo hago" },
    ]},
  { id: "resultado", type: "result" },
];

const CONTENT_STEPS = STEPS.filter(s => s.type !== "intro" && s.type !== "splash" && s.type !== "result");

function buildProfile(answers) {
  const tono = {
    crisis:    "Cálido y acompañante. Sin exigencia.",
    busqueda:  "Inspirador y práctico.",
    optimizar: "Directo y orientado a resultados.",
    curioso:   "Abierto y exploratorio.",
  }[answers.momento] || "Cálido y adaptable.";

  const ritmo = {
    "5min":  "Módulos cortos. Una práctica diaria de 5 min.",
    "15min": "Un módulo por semana. Práctica diaria de 10-15 min.",
    "30min": "Ritmo completo. Lectura + audio + práctica.",
    libre:   "Ritmo libre. Todo el sistema disponible.",
  }[answers.tiempo] || "Adaptado a tu disponibilidad.";

  const nivel = {
    simple:     "Conceptos sin jerga técnica. Ejemplos cotidianos.",
    balanceado: "Teoría aplicada. Con contexto pero sin densidad.",
    profundo:   "Base científica y filosófica completa.",
    tecnico:    "Referencias, mecanismos y evidencia.",
  }[answers.estilo] || "Lenguaje balanceado.";

  const orientacion = {
    razon:     "Razón y evidencia — mayor peso en neurociencia y estoicismo.",
    intuicion: "Intuición y significado — mayor peso en filosofía y sentido.",
    ambos:     "Balance entre evidencia y significado.",
    buscando:  "En exploración — presentamos los dos ángulos sin forzar ninguno.",
  }[answers.orientacion] || "Balance entre razón e intuición.";

  const etapa = {
    "18-25": "18–25 · Construyendo las bases",
    "26-35": "26–35 · Primera adultez",
    "36-45": "36–45 · En el medio del camino",
    "46-55": "46–55 · Revisando prioridades",
    "55+":   "55+ · Con perspectiva",
  }[answers.edad] || "—";

  const sexo = { hombre: "Hombre", mujer: "Mujer", nd: "Prefiero no decirlo" }[answers.sexo] || "—";

  return { tono, ritmo, nivel, orientacion, etapa, sexo };
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

const HapiMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="30" fill="url(#hg)"/>
    <path d="M20 38 Q20 22 30 22 Q40 22 40 38" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="30" cy="18" r="3" fill="white"/>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="60" y2="60">
        <stop offset="0%" stopColor="#7ECBA1"/><stop offset="100%" stopColor="#5BA8D4"/>
      </linearGradient>
    </defs>
  </svg>
);

function Shell({ stepId, children, footer }) {
  const accent = ACCENTS[stepId] || "#7ECBA1";
  return (
    <div className="flex flex-col relative" style={{ background: BG, minHeight: "100dvh" }}>
      <div className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}40 0%, transparent 70%)`, opacity: 0.25 }}/>
      <div className="flex items-center gap-2.5 px-6 pt-12 pb-0 z-10 flex-shrink-0">
        <HapiMark size={28}/>
        <span className="text-xs font-bold" style={{ color: accent, letterSpacing: "2.5px" }}>HAPI</span>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-2 z-10">
        {children}
      </div>
      {footer && (
        <div className="px-6 pb-10 pt-3 z-10 flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}

function StepDots({ currentId }) {
  const idx = CONTENT_STEPS.findIndex(s => s.id === currentId);
  const accent = ACCENTS[currentId] || "#7ECBA1";
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {CONTENT_STEPS.map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{ width: i === idx ? "20px" : "5px", height: "5px",
            background: i === idx ? accent : i < idx ? `${accent}50` : DIM }}/>
      ))}
      <span className="text-xs ml-2" style={{ color: MUTED }}>
        {idx + 1} / {CONTENT_STEPS.length}
      </span>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, accent }) {
  return (
    <button onClick={disabled ? undefined : onClick}
      className="w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95"
      style={{
        background: disabled ? "rgba(255,255,255,0.06)" : accent,
        color: disabled ? "rgba(255,255,255,0.2)" : "#0A1220",
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
      {children}
    </button>
  );
}

function OptionCard({ label, desc, emoji, selected, accent, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full p-4 rounded-2xl text-left transition-all active:scale-98 mb-2"
      style={{
        background: selected ? `${accent}15` : SURFACE,
        border: `1px solid ${selected ? accent + "55" : BORDER}`,
      }}>
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: selected ? accent : WHITE }}>{label}</p>
          {desc && <p className="text-xs mt-0.5" style={{ color: MUTED }}>{desc}</p>}
        </div>
        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ border: `2px solid ${selected ? accent : DIM}`, background: selected ? accent : "transparent" }}>
          {selected && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A1220" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      </div>
    </button>
  );
}

// ── STEP SCREENS ──────────────────────────────────────────────────────────────

function IntroStep({ onNext }) {
  const accent = ACCENTS.intro;
  return (
    <Shell stepId="intro">
      <div className="flex flex-col pb-8 pt-8">
        <div className="mb-8">
          <h1 className="font-bold mb-1" style={{ fontSize: 42, color: WHITE, fontFamily: "'Georgia', serif", letterSpacing: "-1px", lineHeight: 1.1 }}>
            hapi
          </h1>
          <p className="text-xs font-semibold" style={{ color: accent, letterSpacing: "3px" }}>VIVIR CONSCIENTE</p>
        </div>

        {/* Carta de presentación — completa */}
        <div className="mb-6">
          <p className="text-xs font-semibold mb-4" style={{ color: accent, letterSpacing: "1.5px" }}>POR QUÉ EXISTE HAPI</p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
            La mayoría de las personas no tiene un problema de información.{" "}
            <span style={{ color: WHITE }}>Tiene un problema de procesamiento.</span>
          </p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            Saben que deberían dormir mejor. Saben que el estrés les está pasando factura.
            Saben que reaccionan de formas que después lamentan. Lo saben — y aun así, nada cambia.
          </p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            Porque el problema no es lo que saben. Es cómo está configurada la mente que procesa esa información.
          </p>

          <div className="rounded-xl p-4 mb-4" style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              El cerebro no está diseñado para hacerte feliz.{" "}
              <span style={{ color: WHITE }}>Está diseñado para sobrevivir.</span>{" "}
              En ausencia de entrenamiento consciente, opera en modo automático: detecta amenazas,
              anticipa problemas, rumia el pasado. Ese modo tiene un nombre coloquial:{" "}
              <span style={{ color: WHITE }}>el loop negativo.</span> La ansiedad de fondo.
              El ruido que no para.
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            No es un defecto de carácter. Es la configuración de fábrica.
          </p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            Lo que descubrieron los estoicos hace dos mil años, y lo que la neurociencia confirma hoy,
            es que esa configuración{" "}
            <span style={{ color: WHITE }}>se puede cambiar.</span>{" "}
            No con fuerza de voluntad ni pensamiento positivo. Con práctica sostenida.
            Con repetición consciente. Con el mismo mecanismo que cambia cualquier habilidad.
          </p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
            Cuando cambia cómo procesás los pensamientos,{" "}
            <span style={{ color: WHITE }}>cambia cómo vivís.</span>
          </p>

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            No de forma dramática ni instantánea. De forma acumulativa y real.
            El loop negativo no desaparece — pierde fuerza. La ansiedad no se elimina
            — se convierte en información. Y lo que queda, con el tiempo, no es euforia
            ni optimismo forzado. Es algo más valioso:{" "}
            <span style={{ color: WHITE }}>ecuanimidad. Presencia. Más capacidad de elegir.</span>
          </p>

          <div className="rounded-xl p-4 mb-1" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold mb-2" style={{ color: accent, letterSpacing: "1px" }}>ESO ES LO QUE ENTRENA HAPI</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              No es autoayuda. No es motivación. No es una promesa de felicidad.
              Es un sistema de prácticas — con base en neurociencia, estoicismo y filosofía aplicada
              — diseñado para pasar del piloto automático a la elección consciente.
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs italic mb-5" style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          Vivir consciente no es un destino. Es una decisión y se practica.
        </p>

        {/* Pills */}
        <div className="flex gap-2 mb-6">
          {[["18", "módulos"], ["5", "pilares"], ["2 modos", "lectura · audio"]].map(([num, lab]) => (
            <div key={lab} className="flex-1 p-3 rounded-xl text-center" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <p className="font-bold text-base" style={{ color: accent }}>{num}</p>
              <p className="text-xs" style={{ color: MUTED }}>{lab}</p>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          className="w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{ background: accent, color: "#0A1220" }}>
          Empezar ✦
        </button>

        <p className="text-xs text-center mt-4" style={{ color: DIM }}>7 preguntas · 5 minutos</p>
      </div>
    </Shell>
  );
}

function SplashStep({ onNext, nombre }) {
  const accent = ACCENTS.welcome;
  return (
    <Shell stepId="welcome">
      <div className="flex flex-col justify-center pb-8" style={{ minHeight: "calc(100dvh - 80px)" }}>
        <div className="mb-6">
          <h1 className="font-bold mb-1" style={{ fontSize: 42, color: WHITE, fontFamily: "'Georgia', serif", letterSpacing: "-1px", lineHeight: 1.1 }}>
            hapi
          </h1>
          <p className="text-xs font-semibold" style={{ color: accent, letterSpacing: "3px" }}>VIVIR CONSCIENTE</p>
        </div>

        <div className="mb-6">
          <AudioPlayer
            url={DRIVE_AUDIO.intro}
            accent={accent}
            title="Introducción a hapi"
            subtitle="Una breve bienvenida al sistema"
          />
        </div>

        <div className="p-4 rounded-2xl mb-6 relative overflow-hidden"
          style={{ background: SURFACE, border: `1px solid ${accent}25` }}>
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10" style={{ background: accent }}/>
          <p className="text-xs font-semibold mb-2" style={{ color: accent, letterSpacing: "1.5px" }}>ANTES DE EMPEZAR</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Vamos a conocerte un poco.{" "}
            <span className="font-semibold" style={{ color: WHITE }}>7 preguntas rápidas</span>{" "}
            para que hapi se adapte a vos, no al revés.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          {[["5 min", "para completar"], ["18", "módulos"], ["5", "pilares"]].map(([num, lab]) => (
            <div key={lab} className="flex-1 rounded-2xl text-center" style={{ background: SURFACE, border: `1px solid ${accent}30`, padding: "14px 8px" }}>
              <p className="font-bold" style={{ color: accent, fontSize: 20 }}>{num}</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>{lab}</p>
            </div>
          ))}
        </div>

        <button onClick={onNext}
          className="w-full rounded-2xl font-semibold transition-all active:scale-95"
          style={{ background: accent, color: "#0A1220", fontSize: 16, padding: "18px", letterSpacing: "0.3px" }}>
          Comenzar ✦
        </button>
      </div>
    </Shell>
  );
}

function TextInputStep({ step, value, onChange, onNext, onBack }) {
  const accent = ACCENTS[step.id];
  const val = value || "";
  return (
    <Shell stepId={step.id}
      footer={
        <div className="flex gap-3">
          <button onClick={onBack} className="px-5 py-4 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: MUTED, border: "none", cursor: "pointer" }}>←</button>
          <PrimaryBtn onClick={onNext} disabled={!val.trim()} accent={accent}>
            Continuar →
          </PrimaryBtn>
        </div>
      }>
      <StepDots currentId={step.id}/>
      <h2 className="font-bold mb-2 leading-tight" style={{ fontSize: 26, color: WHITE, fontFamily: "'Georgia', serif" }}>
        {step.pregunta}
      </h2>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: MUTED }}>{step.subtitulo}</p>

      <input
        type="text" value={val}
        onChange={e => onChange(e.target.value)}
        placeholder={step.placeholder}
        autoFocus
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) onNext(); }}
        className="w-full rounded-2xl text-base outline-none transition-all"
        style={{
          padding: "14px 16px",
          background: SURFACE,
          border: `1.5px solid ${val ? accent + "60" : BORDER}`,
          color: WHITE,
          boxSizing: "border-box",
        }}
      />
      {val && (
        <p className="text-xs mt-3" style={{ color: accent }}>
          Hola, {val} 👋
        </p>
      )}
    </Shell>
  );
}

function SingleStep({ step, value, onChange, onNext, onBack }) {
  const accent = ACCENTS[step.id];
  return (
    <Shell stepId={step.id}
      footer={
        <button onClick={onBack} className="flex items-center gap-1 text-sm"
          style={{ color: MUTED, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver
        </button>
      }>
      <StepDots currentId={step.id}/>
      <h2 className="font-bold mb-2 leading-tight" style={{ fontSize: 24, color: WHITE, fontFamily: "'Georgia', serif" }}>
        {step.pregunta}
      </h2>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: MUTED }}>{step.subtitulo}</p>
      {step.opciones.map(op => (
        <OptionCard key={op.value}
          label={op.label} desc={op.desc} emoji={op.emoji}
          selected={value === op.value} accent={accent}
          onClick={() => { onChange(op.value); setTimeout(onNext, 200); }}/>
      ))}
    </Shell>
  );
}

function ResultStep({ answers, onStart }) {
  const { tono, ritmo, nivel, orientacion, etapa, sexo } = buildProfile(answers);
  const accent = ACCENTS.resultado;
  const rows = [
    { icon: "🗓", label: "ETAPA",       value: etapa },
    { icon: "👤", label: "PERFIL",      value: sexo },
    { icon: "💬", label: "TONO",        value: tono },
    { icon: "⏱",  label: "RITMO",       value: ritmo },
    { icon: "📖", label: "NIVEL",       value: nivel },
    { icon: "🌿", label: "ORIENTACIÓN", value: orientacion },
  ];
  return (
    <Shell stepId="resultado">
      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
          style={{ background: "linear-gradient(135deg, #7ECBA1, #6BA8D4)" }}>✦</div>
        <h2 className="font-bold mb-1" style={{ fontSize: 24, color: WHITE, fontFamily: "'Georgia', serif" }}>
          {answers.nombre ? `Hola, ${answers.nombre}` : "Tu perfil hapi"}
        </h2>
        <p className="text-xs" style={{ color: MUTED }}>Así se ve tu camino personalizado</p>
      </div>

      {/* Profile rows */}
      <div className="flex flex-col gap-2 mb-4">
        {rows.map(r => (
          <div key={r.label} className="flex gap-3 p-3.5 rounded-2xl"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <span className="text-lg flex-shrink-0 mt-0.5">{r.icon}</span>
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: accent, letterSpacing: "1px" }}>{r.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-4 rounded-2xl mb-3" style={{ background: "linear-gradient(135deg, #1E3A2F, #162D40)", border: `1px solid ${accent}25` }}>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
          <span className="font-semibold" style={{ color: WHITE }}>Tu perfil está listo.</span>{" "}
          hapi va a adaptar el lenguaje, las prácticas y el ritmo a lo que elegiste.
        </p>
        <button onClick={onStart}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{ background: accent, color: "#0A1220" }}>
          Empezar con el Módulo 01 →
        </button>
      </div>
      <p className="text-xs text-center" style={{ color: DIM }}>hapi · vivir consciente</p>
    </Shell>
  );
}

// ─── AUDIO PLAYER ────────────────────────────────────────────
function AudioPlayer({ url, accent, title, subtitle, onEnded }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fmt = s => { if (!s || isNaN(s)) return "0:00"; return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`; };
  const toggle = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { setLoading(true); a.play().then(()=>{ setPlaying(true); setLoading(false); }).catch(()=>{ setError(true); setLoading(false); }); }
  };
  const seek = e => {
    const a = audioRef.current; if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };
  const bars = [4,6,5,8,6,4,7,9,7,5,6,9,7,5,8,6,10,8,6,7,9,6,5,7,8,6,4,7,9,7,5,8];
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{background:`${accent}10`,border:`1px solid ${accent}25`}}>
      <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 50% 50%,${accent}08 0%,transparent 70%)`}}/>
      <audio ref={audioRef} src={url} preload="none"
        onTimeUpdate={e=>{ const a=e.target; setCurrentTime(a.currentTime); setProgress(a.duration?a.currentTime/a.duration:0); }}
        onLoadedMetadata={e=>setDuration(e.target.duration)}
        onEnded={()=>{ setPlaying(false); setProgress(0); setCurrentTime(0); if(onEnded) onEnded(); }}
        onError={()=>{ setError(true); setLoading(false); setPlaying(false); }}/>
      <div className="flex items-end justify-center gap-0.5 mb-4 relative" style={{height:"36px"}}>
        {bars.map((h,i)=>(
          <div key={i} className="rounded-full transition-all duration-300" style={{
            width:"2.5px", height:`${h*3}px`,
            background:(progress>0&&(i/bars.length)<progress)?accent:`${accent}30`,
            transform:playing?`scaleY(${0.6+0.4*Math.abs(Math.sin(i*0.7))})`:"scaleY(1)"
          }}/>
        ))}
      </div>
      <p className="text-center text-sm font-semibold mb-1 relative" style={{color:WHITE,fontFamily:"'Georgia',serif"}}>{title}</p>
      {subtitle&&<p className="text-center text-xs mb-4 relative" style={{color:MUTED}}>{subtitle}</p>}
      <div className="mb-2 cursor-pointer relative" onClick={seek}>
        <div className="h-1.5 rounded-full overflow-hidden" style={{background:`${accent}20`}}>
          <div className="h-full rounded-full transition-all duration-200" style={{width:`${progress*100}%`,background:accent}}/>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-xs" style={{color:MUTED}}>{fmt(currentTime)}</span>
        <span className="text-xs" style={{color:MUTED}}>{fmt(duration)}</span>
      </div>
      {error?(
        <p className="text-center text-xs py-2" style={{color:"rgba(255,120,120,0.8)"}}>No se pudo cargar el audio. Verificá tu conexión.</p>
      ):(
        <button onClick={toggle} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 relative"
          style={{background:accent,color:"#080E18",border:"none",cursor:"pointer"}}>
          {loading
            ?<span style={{width:15,height:15,border:"2px solid #080E18",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"hapiSpin 0.8s linear infinite"}}/>
            :playing
              ?<><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Pausar</>
              :<><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Reproducir</>}
        </button>
      )}
      <style>{`@keyframes hapiSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── MODULE PLAYER ────────────────────────────────────────────
function ModulePlayer({ moduleNum, onBack, onComplete }) {
  const [mode, setMode] = useState(null);
  const [sec, setSec] = useState(0);
  const [audioSec, setAudioSec] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [sec, mode]);

  const mod = MODULES[moduleNum];
  const content = MODULE_CONTENT[moduleNum];
  const pillar = getPillar(moduleNum);
  const accent = mod.accent;

  if (!mode) return (
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="relative px-6 pt-12 pb-6" style={{background:`linear-gradient(180deg,${accent}20 0%,transparent 100%)`}}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6"
          style={{color:MUTED,background:"none",border:"none",cursor:"pointer"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Inicio
        </button>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block"
          style={{background:`${accent}20`,color:accent,border:`1px solid ${accent}35`}}>
          Pilar {pillar?.num} · {pillar?.name}
        </span>
        <p className="text-xs mb-1" style={{color:MUTED}}>Módulo {moduleNum}</p>
        <h2 className="font-bold mb-2 leading-tight" style={{fontSize:22,color:WHITE,fontFamily:"'Georgia',serif"}}>{mod.title}</h2>
        <div className="flex gap-2 flex-wrap mt-3">
          {mod.tags.map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full"
              style={{background:SURFACE,color:MUTED,border:`1px solid ${BORDER}`}}>{t}</span>
          ))}
        </div>
      </div>

      <div className="px-6 pt-2">
        <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>ELEGÍ TU MODO</p>
        <button onClick={() => setMode("read")}
          className="w-full p-4 rounded-2xl mb-3 text-left"
          style={{background:`${accent}12`,border:`1px solid ${accent}35`,cursor:"pointer"}}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{color:WHITE}}>Lectura</p>
              <p className="text-xs" style={{color:MUTED}}>~5 min · {content.sections.length} secciones</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{background:`${accent}20`,color:accent}}>Leer</span>
          </div>
        </button>
        <button onClick={() => setMode("audio")}
          className="w-full p-4 rounded-2xl mb-6 text-left"
          style={{background:CARD,border:`1px solid ${BORDER}`,cursor:"pointer"}}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <p className="text-sm font-semibold" style={{color:WHITE}}>Audio con práctica guiada</p>
              <p className="text-xs" style={{color:MUTED}}>{mod.time} · incluye ejercicio en vivo</p>
            </div>
          </div>
        </button>

        <button onClick={onComplete}
          className="w-full py-4 rounded-2xl font-semibold text-sm"
          style={{background:`${accent}15`,color:accent,border:`1px solid ${accent}30`,cursor:"pointer"}}>
          ✓ Marcar como completado
        </button>
      </div>
    </div>
  );

  if (mode === "read") {
    const section = content.sections[sec];
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-6">
        <div className="flex items-center justify-between px-6 pt-12 pb-4 flex-shrink-0">
          <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-xs"
            style={{color:MUTED,background:"none",border:"none",cursor:"pointer"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Módulo {moduleNum}
          </button>
          <span className="text-xs" style={{color:MUTED}}>{sec+1}/{content.sections.length}</span>
        </div>
        <div className="px-6 mb-3">
          <div className="h-1 rounded-full overflow-hidden" style={{background:DIM}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${((sec+1)/content.sections.length)*100}%`,background:accent}}/>
          </div>
        </div>
        <div className="flex gap-1.5 px-6 mb-4 overflow-x-auto">
          {content.sections.map((s,i) => (
            <button key={i} onClick={() => { setSec(i); }}
              className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
              style={{background:i===sec?`${accent}20`:SURFACE,color:i===sec?accent:MUTED,border:`1px solid ${i===sec?accent+"40":BORDER}`,cursor:"pointer"}}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="px-6">
          <p className="text-xs font-bold mb-2" style={{color:accent,letterSpacing:"1px"}}>{section.label}</p>
          <h2 className="font-bold mb-5 leading-tight" style={{fontSize:19,color:WHITE,fontFamily:"'Georgia',serif"}}>{section.title}</h2>
          {renderSection(section.body, accent)}
        </div>
        <div className="px-6 pt-4 flex gap-3">
          {sec>0 && <button onClick={() => setSec(i=>i-1)} className="px-5 py-4 rounded-2xl text-sm" style={{background:SURFACE,color:MUTED,border:"none",cursor:"pointer"}}>←</button>}
          {sec<content.sections.length-1
            ? <button onClick={() => setSec(i=>i+1)} className="flex-1 py-4 rounded-2xl font-semibold text-sm" style={{background:accent,color:"#080E18",cursor:"pointer",border:"none"}}>Continuar →</button>
            : <button onClick={() => { onComplete(); setMode(null); }} className="flex-1 py-4 rounded-2xl font-semibold text-sm" style={{background:accent,color:"#080E18",cursor:"pointer",border:"none"}}>Completar módulo ✦</button>
          }
        </div>
      </div>
    );
  }

  if (mode === "audio") {
    const audioUrl = DRIVE_AUDIO[moduleNum];
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex items-center justify-between px-6 pt-12 pb-6">
          <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-xs"
            style={{color:MUTED,background:"none",border:"none",cursor:"pointer"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Módulo {moduleNum}
          </button>
          <span className="text-xs" style={{color:MUTED}}>🎧 {mod.time}</span>
        </div>
        <div className="px-6 mb-5">
          {audioUrl ? (
            <AudioPlayer
              url={audioUrl}
              accent={accent}
              title={mod.title}
              subtitle={`Módulo ${moduleNum} · incluye práctica guiada`}
            />
          ) : (
            <div className="rounded-2xl p-6 text-center" style={{background:`${accent}10`,border:`1px solid ${accent}25`}}>
              <p className="text-2xl mb-3">🎙️</p>
              <p className="text-sm font-semibold mb-2" style={{color:WHITE}}>Audio en preparación</p>
              <p className="text-xs leading-relaxed" style={{color:MUTED}}>
                Este módulo requiere una grabación especial — lenta y pausada — para acompañar la práctica de elongación consciente. Estará disponible pronto.
              </p>
            </div>
          )}
        </div>
        <div className="px-6">
          <div className="rounded-2xl p-4 mb-4" style={{background:SURFACE,border:`1px solid ${BORDER}`}}>
            <p className="text-xs font-bold mb-2" style={{color:accent,letterSpacing:"1px"}}>SOBRE ESTE AUDIO</p>
            <p className="text-xs leading-relaxed" style={{color:MUTED}}>
              El audio incluye la explicación del módulo, momentos de pausa para practicar, y una práctica guiada al final. Podés escucharlo mientras caminás, hacés elongación, o en un momento tranquilo.
            </p>
          </div>
          <button onClick={() => { onComplete(); setMode(null); }} className="w-full py-4 rounded-2xl font-semibold text-sm"
            style={{background:`${accent}15`,color:accent,border:`1px solid ${accent}30`,cursor:"pointer"}}>
            ✓ Marcar como completado
          </button>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────────────────────
// MOTOR IA — SISTEMA DE PRÁCTICA DIARIA PERSONALIZADA
// ─────────────────────────────────────────────────────────────

function buildMotorSystemPrompt() {
  return `Sos el motor IA de hapi — Fase 2: Integración.

CONTEXTO
El usuario ya completó los 18 módulos del sistema. Ahora vuelve a módulos específicos para integrarlos de verdad — no para repasar, sino para seguir profundizando desde donde está hoy.

IDENTIDAD
hapi integra neurociencia, estoicismo, kabbalah aplicada y psicología conductual. Sus cinco pilares: Cuerpo · Mente · Conciencia · Equilibrio · Relaciones y propósito.
El motor no inventa. Expande. No le dice al usuario qué le hace bien — lo ayuda a descubrirlo.

VOZ EDITORIAL
- Cálida pero directa. Cercana pero no coloquial. Como un amigo que estudió mucho.
- Usás "vos" (tuteo rioplatense). Frases cortas. Párrafos de máximo 3–4 líneas.
- NUNCA: "podés lograrlo", "sos increíble", "tu mejor versión", "tenés que", "deberías".
- SÍ: "podés probar", "observá qué pasa si", "algunos lo encuentran útil — fijate cómo te cae a vos".
- No prometés resultados. No prescribís. Invitás.
- Nunca repetís ejemplos ni frases del módulo original — siempre ángulo nuevo.

REFERENCIAS VÁLIDAS (solo cuando son relevantes, nunca para impresionar):
Andrew Huberman (sueño, luz, cafeína), Estanislao Bachrach (neuroplasticidad), Dr. Facundo Pereyra (microbiota), William Irvine (estoicismo práctico), Sam Harris (meditación), Epicteto / Marco Aurelio (filtro estoico), Viktor Frankl (propósito).

REGLAS DE GENERACIÓN — FASE 2
- El contenido debe sentirse como una versión nueva del módulo, no un resumen del original.
- El "nuevo ángulo" es obligatorio: desarrollá el concepto central desde una perspectiva completamente distinta al módulo base. Usá un ejemplo cotidiano concreto y desarrollalo en profundidad — no apenas lo menciones.
- La práctica puede ser la misma si es fundamental al módulo, o una variante — pero siempre adaptada al estado del check-in del día. Los pasos deben ser detallados y guiados, no telegráficos.
- Si la energía es baja (1-2) o el ánimo es "cansado", simplificá la práctica al mínimo efectivo.
- Si el foco es "alto" y la energía es 4-5, podés ir más profundo.
- NUNCA menciones los valores del check-in en el texto generado. No escribas "tenés energía 3", "tu foco es alto", "estás calmo", ni ninguna referencia explícita a los números o etiquetas del check-in. Usá esa información para calibrar el tono y la profundidad, pero que nunca aparezca en el texto como dato leído.
- Las preguntas de cierre son siempre nuevas — nunca las mismas que el módulo original.
- Extensión total: 5-7 min de lectura. Rico y sustancioso, no denso. El usuario vino a integrar, no a repasar.
- Cada sección debe tener el doble o triple de desarrollo que una primera lectura. Este es el trabajo profundo.

ESTRUCTURA DE SALIDA — RESPONDER SOLO EN JSON VÁLIDO, SIN BACKTICKS NI TEXTO ADICIONAL:
{
  "titulo_sesion": "título evocador para esta sesión de integración, máx 6 palabras",
  "nuevo_angulo": {
    "label": "etiqueta corta del ángulo, ej: 'Otra forma de verlo', máx 4 palabras",
    "texto": "el concepto central del módulo explicado desde un ángulo nuevo. Desarrollá la idea con profundidad real: un ejemplo cotidiano concreto, una segunda vuelta que profundice, y una conexión inesperada con la vida del usuario. Mínimo 250 palabras. Nunca repetir ejemplos del módulo original. IMPORTANTE: separar cada párrafo con \\n\\n para que se rendericen correctamente.",
    "idea_clave": "la idea más poderosa de este nuevo ángulo, en 2-3 frases. Con sustancia real, sin adornos."
  },
  "practica": {
    "titulo": "nombre de la práctica, máx 6 palabras",
    "es_variante": true,
    "nota_variante": "si es_variante es true: en 1-2 líneas, qué cambia respecto a la práctica original y por qué. Si es false: null.",
    "duracion": "duración concreta adaptada al tiempo disponible y al estado del check-in",
    "pasos": ["paso 1 detallado y guiado — explicá el cómo, no solo el qué", "paso 2 con el mismo nivel de detalle", "paso 3", "paso 4", "paso 5 — cierre e integración"],
    "cierre": "pregunta de autoconocimiento genuina al finalizar, nueva y profunda, máx 25 palabras",
    "cierre_diferido": "una segunda pregunta para reflexionar 2-3 días después, cuando el cuerpo haya procesado la práctica, máx 25 palabras"
  },
  "insight": "conexión profunda entre el estado de hoy, el módulo y el momento de vida del usuario. Mínimo 150 palabras. Honesto, no azucarado. Que conecte puntos que el usuario no había conectado solo. IMPORTANTE: separar cada párrafo con \\n\\n para que se rendericen correctamente."
}`;
}

function buildMotorUserPrompt(user, checkin, moduloNum) {
  const mod = MODULES[moduloNum];
  const pillar = getPillar(moduloNum);
  const profile = user.profile || {};
  return `PERFIL DEL USUARIO:
- Nombre: ${user.name || "usuario"}
- Momento vital: ${profile.tono || "búsqueda"}
- Tiempo disponible habitual: ${profile.ritmo || "15 minutos"}
- Estilo de comunicación: ${profile.nivel || "balanceado"}

MÓDULO A INTEGRAR: ${moduloNum} — "${mod.title}"
Pilar: ${pillar?.name || ""}
Conceptos clave del módulo original: ${mod.tags.join(", ")}

CHECK-IN DE HOY:
- Energía: ${checkin.energia}/5
- Ánimo: ${checkin.animo}
- Foco: ${checkin.foco}
- Intención: "${checkin.intencion || "ninguna especificada"}"

Generá la sesión de integración para este usuario, en este módulo, en este momento exacto. El contenido debe sentirse nuevo — mismo módulo, otra capa.`;
}

// ─── PANTALLA DE TRANSICIÓN — FIN DEL SISTEMA ─────────────────
function TransicionFinal({ user, onEntrarMotor }) {
  const [fase, setFase] = useState(0); // 0: celebración, 1: mensaje
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { setTimeout(() => setVisible(true), 80); scrollRef.current?.scrollTo({top:0,behavior:"auto"}); }, [fase]);

  // ── Pantalla 1: Celebración ───────────────────────────────────
  if (fase === 0) return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-10"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.9s ease" }}>

      <div style={{
        minHeight: "60vh",
        background: "linear-gradient(180deg, #120A28 0%, #0D0E1A 60%, #080E18 100%)",
        padding: "64px 24px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Destellos de fondo */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "15%", left: "20%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,168,212,0.1) 0%, transparent 70%)" }}/>
          <div style={{ position: "absolute", top: "30%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,196,154,0.08) 0%, transparent 70%)" }}/>
        </div>

        {/* Icono central */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(196,168,212,0.2), rgba(168,196,154,0.15))",
          border: "1px solid rgba(196,168,212,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", fontSize: 38,
          boxShadow: "0 0 40px rgba(196,168,212,0.15)",
        }}>
          ✦
        </div>

        <p style={{ fontSize: 10, letterSpacing: "4px", color: "#C4A8D4", margin: "0 0 16px", fontFamily: "system-ui" }}>
          18 MÓDULOS · 5 PILARES
        </p>

        <h1 style={{
          fontSize: 30, fontWeight: 400, color: WHITE,
          fontFamily: "'Georgia', serif", lineHeight: 1.3,
          margin: "0 0 16px",
        }}>
          {user.name ? `${user.name},` : ""}<br/>
          lo hiciste.
        </h1>

        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.6)",
          lineHeight: 1.7, fontFamily: "'Georgia', serif", fontStyle: "italic",
          margin: "0 auto 32px", maxWidth: 280,
        }}>
          Completaste el sistema completo de hapi.
        </p>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, margin: "24px 0" }}>
          {[
            { value: "18", sub: "módulos" },
            { value: "5",  sub: "pilares" },
            { value: `${user.streak || "—"}`, sub: "días" },
          ].map(s => (
            <div key={s.sub} style={{
              flex: 1, padding: "16px 10px", borderRadius: 14,
              background: "rgba(196,168,212,0.06)",
              border: "1px solid rgba(196,168,212,0.15)",
              textAlign: "center",
            }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: WHITE, margin: 0, fontFamily: "'Georgia', serif" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0", fontFamily: "system-ui" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Mensaje de reconocimiento */}
        <div style={{
          padding: "20px", borderRadius: 16,
          background: SURFACE,
          border: "1px solid rgba(196,168,212,0.12)",
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, fontFamily: "system-ui", margin: 0 }}>
            Recorriste los cinco pilares. Entendiste los conceptos. Hiciste las prácticas.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, fontFamily: "system-ui", margin: "12px 0 0" }}>
            Eso no es poco. Casi nadie llega hasta acá.
          </p>
        </div>

        <button onClick={() => { setFase(1); setVisible(false); setTimeout(() => setVisible(true), 80); if (scrollRef.current) scrollRef.current.scrollTo({top:0,behavior:"auto"}); }}
          style={{
            width: "100%", padding: "18px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #C4A8D4, #A8C49A)",
            color: "#080E18", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "system-ui", marginBottom: 12,
          }}>
          Seguir →
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: DIM, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          hapi · vivir consciente
        </p>
      </div>
    </div>
  );

  // ── Pantalla 2: El comienzo real ──────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto pb-10"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.9s ease" }}>

      <div style={{
        background: "linear-gradient(180deg, #0A1A14 0%, #080E18 60%)",
        padding: "60px 24px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 20%, rgba(168,196,154,0.1) 0%, transparent 60%)", pointerEvents: "none" }}/>

        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(168,196,154,0.2), rgba(107,168,212,0.15))",
          border: "1px solid rgba(168,196,154,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 34,
          boxShadow: "0 0 32px rgba(168,196,154,0.12)",
        }}>
          🌱
        </div>

        <p style={{ fontSize: 10, letterSpacing: "4px", color: "#A8C49A", margin: "0 0 14px", fontFamily: "system-ui" }}>
          ESTO ES RECIÉN EL COMIENZO
        </p>
        <h1 style={{
          fontSize: 26, fontWeight: 400, color: WHITE,
          fontFamily: "'Georgia', serif", lineHeight: 1.35, margin: 0,
        }}>
          Leer no cambia el cerebro.<br/>La práctica repetida, sí.
        </h1>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Bloque neurociencia */}
        <div style={{
          margin: "24px 0 16px",
          padding: "20px", borderRadius: 16,
          background: SURFACE,
          border: "1px solid rgba(168,196,154,0.12)",
        }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, fontFamily: "system-ui", margin: "0 0 14px" }}>
            Lo que aprendiste en los 18 módulos es la base. Pero el cerebro cambia por repetición — no por comprensión. Los nuevos circuitos se forman cuando una práctica se repite lo suficiente como para volverse automática.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, fontFamily: "system-ui", margin: 0 }}>
            Eso lleva tiempo. Y ese tiempo vale absolutamente la pena.
          </p>
        </div>

        {/* Bloque qué sigue */}
        <div style={{
          padding: "18px 20px", borderRadius: 16,
          background: "rgba(168,196,154,0.06)",
          border: "1px solid rgba(168,196,154,0.18)",
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: "#A8C49A", margin: "0 0 12px", fontFamily: "system-ui", fontWeight: 600 }}>
            QUÉ VIENE AHORA
          </p>
          {[
            "Volvé a los módulos donde sentís desequilibrio.",
            "Hapi genera una sesión nueva cada vez — mismo módulo, otra capa.",
            "La repetición con variación es lo que instala el cambio de verdad.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <span style={{ color: "#A8C49A", fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6, fontFamily: "system-ui" }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Audio Transición */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: "#6BA8D4", margin: "0 0 10px", fontFamily: "system-ui", fontWeight: 600 }}>
            ESCUCHÁ ANTES DE CONTINUAR
          </p>
          <AudioPlayer
            url={DRIVE_AUDIO.transicion}
            accent="#6BA8D4"
            title="Transición al Motor IA"
            subtitle="El siguiente nivel del sistema"
          />
        </div>

        <button onClick={onEntrarMotor}
          style={{
            width: "100%", padding: "18px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #A8C49A, #6BA8D4)",
            color: "#080E18", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "system-ui", marginBottom: 12,
          }}>
          Empezar la práctica →
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: DIM, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          hapi · vivir consciente
        </p>
      </div>
    </div>
  );
}

// ─── MI CAMINO — SELECTOR MÚLTIPLE DE MÓDULOS ────────────────
// ─── MÓDULOS VIEW — accesible desde Fase 2 ───────────────────
function ModulosView({ user, onSelectModule, onBack }) {
  const [pillarAbierto, setPillarAbierto] = useState(null);

  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div style={{
        padding: "48px 24px 20px",
        background: "linear-gradient(180deg, rgba(126,203,161,0.08) 0%, transparent 100%)",
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: MUTED, background: "none", border: "none",
          cursor: "pointer", marginBottom: 16, fontFamily: "system-ui",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Mi camino
        </button>
        <p style={{ fontSize: 10, letterSpacing: "3px", color: "#7ECBA1", margin: "0 0 6px", fontFamily: "system-ui" }}>
          FASE 2 · MÓDULOS
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 400, color: WHITE, margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>
          Los 18 módulos
        </h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.5, fontFamily: "system-ui" }}>
          Revisá cualquier módulo completo cuando quieras.
        </p>
      </div>

      {/* Pilares con módulos colapsables */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {PILLARS.map(p => {
          const done = p.modules.filter(m => user.completedModules.includes(m)).length;
          const abierto = pillarAbierto === p.id;
          return (
            <div key={p.id} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${abierto ? p.color + "40" : BORDER}` }}>
              {/* Cabecera del pilar */}
              <button
                onClick={() => setPillarAbierto(abierto ? null : p.id)}
                style={{
                  width: "100%", padding: "14px 16px",
                  background: abierto ? `${p.color}10` : CARD,
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${p.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: WHITE, margin: 0, fontFamily: "system-ui", fontWeight: 500 }}>
                    {p.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 4, background: DIM, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: p.color, width: `${(done / p.modules.length) * 100}%` }}/>
                    </div>
                    <span style={{ fontSize: 10, color: MUTED, fontFamily: "system-ui", flexShrink: 0 }}>
                      {done}/{p.modules.length}
                    </span>
                  </div>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={abierto ? p.color : MUTED} strokeWidth="2"
                  style={{ transform: abierto ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Lista de módulos del pilar */}
              {abierto && (
                <div style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
                  {p.modules.map((num, i) => {
                    const mod = MODULES[num];
                    const completado = user.completedModules.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => onSelectModule(num)}
                        style={{
                          width: "100%", padding: "13px 16px",
                          borderBottom: i < p.modules.length - 1 ? `1px solid ${BORDER}` : "none",
                          background: "transparent", border: "none",
                          cursor: "pointer", textAlign: "left",
                          display: "flex", alignItems: "center", gap: 12,
                        }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: completado ? `${p.color}25` : DIM,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700,
                          color: completado ? p.color : MUTED,
                          fontFamily: "system-ui",
                        }}>
                          {completado ? "✓" : num}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: WHITE, margin: 0, lineHeight: 1.4, fontFamily: "system-ui" }}>
                            {mod.title}
                          </p>
                          <p style={{ fontSize: 11, color: MUTED, margin: "2px 0 0", fontFamily: "system-ui" }}>
                            {mod.time}
                          </p>
                        </div>
                        <span style={{ color: p.color, fontSize: 16, flexShrink: 0 }}>→</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiCamino({ user, onIniciarSesion, onBack, onVerModulos }) {
  const [pillarFiltro, setPillarFiltro] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const modulosFiltrados = pillarFiltro
    ? PILLARS.find(p => p.id === pillarFiltro)?.modules || []
    : Object.keys(MODULES).map(Number);

  function toggleModulo(num) {
    setSeleccionados(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  }

  const haySeleccion = seleccionados.length > 0;
  const muchos = seleccionados.length > 3;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: "48px 24px 20px",
        background: "linear-gradient(180deg, rgba(107,168,212,0.08) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: MUTED, background: "none", border: "none",
            cursor: "pointer", fontFamily: "system-ui",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Inicio
          </button>
          <button onClick={onVerModulos} style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "#7ECBA1", background: "rgba(126,203,161,0.08)",
            border: "1px solid rgba(126,203,161,0.2)", borderRadius: 20,
            padding: "5px 12px", cursor: "pointer", fontFamily: "system-ui",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Ver módulos
          </button>
        </div>
        <p style={{ fontSize: 10, letterSpacing: "3px", color: "#6BA8D4", margin: "0 0 6px", fontFamily: "system-ui" }}>
          FASE 2 · INTEGRACIÓN
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 400, color: WHITE, margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>
          ¿Qué querés trabajar hoy?
        </h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6, fontFamily: "system-ui" }}>
          Elegí uno o más módulos donde sentís que hay algo por integrar. Cada uno genera una sesión separada.
        </p>
      </div>

      {/* Filtro por pilar */}
      <div style={{ padding: "0 24px 16px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setPillarFiltro(null)} style={{
            padding: "7px 14px", borderRadius: 20,
            border: `1px solid ${!pillarFiltro ? "#6BA8D4" : BORDER}`,
            background: !pillarFiltro ? "rgba(107,168,212,0.15)" : SURFACE,
            color: !pillarFiltro ? WHITE : MUTED,
            fontSize: 12, cursor: "pointer", fontFamily: "system-ui", flexShrink: 0,
          }}>
            Todos
          </button>
          {PILLARS.map(p => (
            <button key={p.id} onClick={() => setPillarFiltro(p.id === pillarFiltro ? null : p.id)} style={{
              padding: "7px 12px", borderRadius: 20,
              border: `1px solid ${pillarFiltro === p.id ? p.color : BORDER}`,
              background: pillarFiltro === p.id ? `${p.color}15` : SURFACE,
              color: pillarFiltro === p.id ? p.color : MUTED,
              fontSize: 11, cursor: "pointer", fontFamily: "system-ui", flexShrink: 0,
            }}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de módulos — selección múltiple */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 9 }}>
        {modulosFiltrados.map(num => {
          const mod = MODULES[num];
          const pillar = getPillar(num);
          const elegido = seleccionados.includes(num);
          return (
            <button key={num} onClick={() => toggleModulo(num)} style={{
              width: "100%", padding: "13px 15px",
              borderRadius: 14,
              border: `1.5px solid ${elegido ? pillar.color : BORDER}`,
              background: elegido ? `${pillar.color}12` : CARD,
              cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.15s",
            }}>
              {/* Checkbox visual */}
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                border: `1.5px solid ${elegido ? pillar.color : "rgba(255,255,255,0.15)"}`,
                background: elegido ? pillar.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#080E18", fontWeight: 700,
                transition: "all 0.15s",
              }}>
                {elegido ? "✓" : ""}
              </div>
              {/* Número del módulo */}
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: `${pillar.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: pillar.color, fontFamily: "system-ui",
              }}>
                {num}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: elegido ? WHITE : "rgba(255,255,255,0.75)", margin: "0 0 2px", lineHeight: 1.4, fontFamily: "system-ui", fontWeight: elegido ? 600 : 400 }}>
                  {mod.title}
                </p>
                <p style={{ fontSize: 11, color: MUTED, margin: 0, fontFamily: "system-ui" }}>
                  {pillar.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA flotante */}
      {haySeleccion && (
        <div style={{
          position: "sticky", bottom: 0,
          padding: "16px 24px 24px",
          background: "linear-gradient(180deg, transparent 0%, #080E18 30%)",
        }}>
          {muchos && (
            <p style={{
              fontSize: 11, color: "#C4A882", textAlign: "center",
              margin: "0 0 10px", fontFamily: "system-ui",
            }}>
              {seleccionados.length} sesiones — puede tomar un rato. ¿Seguro?
            </p>
          )}
          <button onClick={() => onIniciarSesion(seleccionados)} style={{
            width: "100%", padding: "16px",
            borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #6BA8D4, #7ECBA1)",
            color: "#080E18", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "system-ui",
          }}>
            {seleccionados.length === 1
              ? "Empezar sesión →"
              : `Empezar ${seleccionados.length} sesiones →`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CHECK-IN DEL DÍA ─────────────────────────────────────────
function CheckInDia({ user, modulosSeleccionados, onComplete, onBack }) {
  const primerMod = MODULES[modulosSeleccionados[0]];
  const accent = primerMod?.accent || "#6BA8D4";
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const [energia, setEnergia] = useState(3);
  const [animo, setAnimo] = useState(null);
  const [foco, setFoco] = useState(null);
  const [intencion, setIntencion] = useState("");

  const animoOpts = [
    { v: "calmo", label: "Calmo", emoji: "🌊" },
    { v: "ansioso", label: "Ansioso", emoji: "⚡" },
    { v: "motivado", label: "Motivado", emoji: "🔥" },
    { v: "cansado", label: "Cansado", emoji: "🌙" },
    { v: "disperso", label: "Disperso", emoji: "🌀" },
  ];
  const focoOpts = [
    { v: "alto", label: "Alto" },
    { v: "normal", label: "Normal" },
    { v: "bajo", label: "Bajo" },
  ];
  const canContinue = animo && foco;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-8">
      <div style={{ padding: "48px 24px 24px", background: `linear-gradient(180deg, ${accent}10 0%, transparent 100%)` }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontFamily: "system-ui" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Cambiar selección
        </button>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 9, letterSpacing: "2px", color: MUTED, margin: "0 0 10px", fontFamily: "system-ui", fontWeight: 600 }}>
            {modulosSeleccionados.length === 1 ? "MÓDULO A INTEGRAR" : `${modulosSeleccionados.length} MÓDULOS A INTEGRAR`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {modulosSeleccionados.map((num, i) => {
              const mod = MODULES[num];
              const pillar = getPillar(num);
              return (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: `${pillar.color}10`, border: `1px solid ${pillar.color}25` }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: `${pillar.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: pillar.color, fontFamily: "system-ui" }}>{num}</div>
                  <p style={{ flex: 1, fontSize: 12, color: WHITE, margin: 0, fontFamily: "system-ui" }}>{mod.title}</p>
                  {modulosSeleccionados.length > 1 && <span style={{ fontSize: 10, color: MUTED, fontFamily: "system-ui" }}>Sesión {i + 1}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 400, color: WHITE, margin: 0, fontFamily: "'Georgia', serif" }}>¿Cómo llegás hoy?</h1>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 6, fontFamily: "system-ui" }}>El contenido se adapta a tu momento.</p>
      </div>
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, margin: "0 0 12px", fontFamily: "system-ui", fontWeight: 600 }}>ENERGÍA HOY</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEnergia(n)} style={{ flex: 1, height: 44, borderRadius: 10, border: energia === n ? `1.5px solid ${accent}` : `1px solid ${BORDER}`, background: energia === n ? `${accent}20` : SURFACE, color: energia === n ? accent : MUTED, fontSize: 15, cursor: "pointer", fontFamily: "system-ui", fontWeight: energia === n ? 700 : 400 }}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Sin energía</span>
            <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Cargado</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, margin: "0 0 12px", fontFamily: "system-ui", fontWeight: 600 }}>¿CÓMO ESTÁS?</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {animoOpts.map(o => (
              <button key={o.v} onClick={() => setAnimo(o.v)} style={{ padding: "9px 13px", borderRadius: 12, border: animo === o.v ? `1.5px solid ${accent}` : `1px solid ${BORDER}`, background: animo === o.v ? `${accent}15` : SURFACE, color: animo === o.v ? WHITE : MUTED, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "system-ui" }}>
                <span>{o.emoji}</span><span>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, margin: "0 0 12px", fontFamily: "system-ui", fontWeight: 600 }}>FOCO MENTAL</p>
          <div style={{ display: "flex", gap: 8 }}>
            {focoOpts.map(o => (
              <button key={o.v} onClick={() => setFoco(o.v)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: foco === o.v ? `1.5px solid ${accent}` : `1px solid ${BORDER}`, background: foco === o.v ? `${accent}15` : SURFACE, color: foco === o.v ? WHITE : MUTED, fontSize: 12, cursor: "pointer", fontFamily: "system-ui", textAlign: "center" }}>{o.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, margin: "0 0 6px", fontFamily: "system-ui", fontWeight: 600 }}>INTENCIÓN <span style={{ color: DIM, fontWeight: 400, letterSpacing: 0 }}>(opcional)</span></p>
          <textarea value={intencion} onChange={e => setIntencion(e.target.value)} placeholder="¿Hay algo específico que querés trabajar hoy?" rows={2}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${BORDER}`, background: SURFACE, color: WHITE, fontSize: 13, resize: "none", outline: "none", fontFamily: "system-ui", lineHeight: 1.5, boxSizing: "border-box" }}/>
        </div>
        <button onClick={() => canContinue && onComplete({ energia, animo, foco, intencion })}
          style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: canContinue ? accent : DIM, color: canContinue ? "#080E18" : MUTED, fontSize: 15, fontWeight: 700, cursor: canContinue ? "pointer" : "not-allowed", fontFamily: "system-ui", marginBottom: 8 }}>
          {modulosSeleccionados.length === 1 ? "Generar sesión →" : `Generar ${modulosSeleccionados.length} sesiones →`}
        </button>
      </div>
    </div>
  );
}

// ─── LOADING IA ───────────────────────────────────────────────
function LoadingIA({ modulosSeleccionados, progreso }) {
  const total = modulosSeleccionados?.length || 1;
  const accent = MODULES[modulosSeleccionados?.[0]]?.accent || "#6BA8D4";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${accent}25`, borderTop: `2px solid ${accent}`, animation: "hapiSpin 1s linear infinite" }}/>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: WHITE, fontSize: 16, margin: 0, fontFamily: "'Georgia', serif" }}>
          {total === 1 ? "Preparando tu sesión" : `Generando ${total} sesiones`}
        </p>
        <p style={{ color: MUTED, fontSize: 13, marginTop: 8, fontFamily: "system-ui", lineHeight: 1.6 }}>
          {total === 1
            ? "hapi adapta el contenido\na tu momento de hoy..."
            : `${progreso} de ${total} listas...`}
        </p>
        {total > 1 && (
          <div style={{ width: 160, height: 3, borderRadius: 4, background: DIM, margin: "12px auto 0", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, background: accent, width: `${(progreso / total) * 100}%`, transition: "width 0.4s ease" }}/>
          </div>
        )}
      </div>
      <style>{`@keyframes hapiSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── PANTALLA DE PRÁCTICA GENERADA ────────────────────────────
// ─── SESIÓN GENERADA — FORMATO 3 BLOQUES ─────────────────────
function PracticaDiaria({ rutinas, modulosSeleccionados, checkin, onVolver, onNuevaSesion }) {
  const [sesionIdx, setSesionIdx] = useState(0);
  const [paginaIdx, setPaginaIdx] = useState(0); // 0=angulo, 1=practica, 2=insight
  const [pasoActivo, setPasoActivo] = useState(null);
  const [completada, setCompletada] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [sesionIdx, paginaIdx]);

  const irASesion = (idx) => {
    setSesionIdx(idx);
    setPaginaIdx(0);
    setPasoActivo(null);
    setCompletada(false);
  };

  const irAPagina = (idx) => {
    setPaginaIdx(idx);
    setPasoActivo(null);
  };

  const moduloNum = modulosSeleccionados[sesionIdx];
  const rutina = rutinas[sesionIdx];
  const mod = MODULES[moduloNum];
  const pillar = getPillar(moduloNum);
  const accent = mod.accent;
  const energiaEmoji = ["😴","🥱","😐","😊","⚡"][checkin.energia - 1];
  const totalSesiones = modulosSeleccionados.length;
  const esUltima = sesionIdx === totalSesiones - 1;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">

      {/* Header */}
      <div style={{ padding: "44px 24px 18px", background: `linear-gradient(180deg, ${accent}14 0%, transparent 100%)` }}>
        {/* Botón volver a Mi camino */}
        <button onClick={onVolver} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: MUTED, background: "none", border: "none",
          cursor: "pointer", marginBottom: 16, fontFamily: "system-ui",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Mi camino
        </button>

        {/* Barra de páginas de la sesión */}
        <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
          {["Nuevo ángulo", "Práctica", "Insight"].map((label, i) => (
            <button key={i} onClick={() => irAPagina(i)} style={{
              flex: 1, padding: "5px 4px", borderRadius: 8, border: "none",
              background: i === paginaIdx ? `${accent}20` : "transparent",
              cursor: "pointer",
            }}>
              <div style={{ height: 3, borderRadius: 4, background: i <= paginaIdx ? accent : DIM, marginBottom: 4 }}/>
              <p style={{ fontSize: 9, color: i === paginaIdx ? accent : MUTED, margin: 0, fontFamily: "system-ui", fontWeight: 600, letterSpacing: "0.5px" }}>
                {label.toUpperCase()}
              </p>
            </button>
          ))}
        </div>

        {/* Indicador de sesiones múltiples */}
        {totalSesiones > 1 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {modulosSeleccionados.map((num, i) => {
              const p = getPillar(num);
              return (
                <button key={num} onClick={() => irASesion(i)} style={{
                  flex: 1, height: 4, borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === sesionIdx ? p.color : i < sesionIdx ? `${p.color}60` : DIM,
                  transition: "all 0.2s",
                }}/>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            {totalSesiones > 1 && (
              <p style={{ fontSize: 9, letterSpacing: "2px", color: MUTED, margin: "0 0 4px", fontFamily: "system-ui" }}>
                SESIÓN {sesionIdx + 1} DE {totalSesiones}
              </p>
            )}
            <p style={{ fontSize: 9, letterSpacing: "2px", color: accent, margin: "0 0 5px", fontFamily: "system-ui" }}>
              MÓDULO {moduloNum} · {pillar?.name.toUpperCase()}
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 400, color: WHITE, margin: 0, fontFamily: "'Georgia', serif", lineHeight: 1.3 }}>
              {rutina.titulo_sesion}
            </h1>
          </div>
          <div style={{ padding: "5px 9px", borderRadius: 20, background: SURFACE, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 5, flexShrink: 0, marginLeft: 8 }}>
            <span style={{ fontSize: 13 }}>{energiaEmoji}</span>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: "system-ui" }}>{checkin.animo}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* PÁGINA 1 — Nuevo ángulo */}
        {paginaIdx === 0 && (
        <>
        <div style={{ borderRadius: 14, background: CARD, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ padding: "13px 15px", background: `linear-gradient(135deg, ${accent}12, transparent)`, borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 9, letterSpacing: "2px", color: accent, margin: "0 0 2px", fontFamily: "system-ui", fontWeight: 600 }}>
              NUEVO ÁNGULO
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: 0, fontFamily: "system-ui" }}>
              {rutina.nuevo_angulo.label}
            </p>
          </div>
          <div style={{ padding: "14px 15px" }}>
            {rutina.nuevo_angulo.texto.split("\n\n").map((parrafo, i, arr) => (
              <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: i < arr.length - 1 ? "0 0 12px" : "0 0 12px", lineHeight: 1.65, fontFamily: "system-ui" }}>
                {parrafo}
              </p>
            ))}
            <div style={{ padding: "11px 13px", borderRadius: 10, background: `${accent}08`, border: `1px solid ${accent}18` }}>
              <p style={{ fontSize: 13, color: WHITE, margin: 0, lineHeight: 1.5, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                "{rutina.nuevo_angulo.idea_clave}"
              </p>
            </div>
          </div>
        </div>

        {/* Botón continuar página 1 */}
        <button onClick={() => irAPagina(1)} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: accent, color: "#080E18",
          fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
        }}>
          Continuar a la práctica →
        </button>
        </>
        )}

        {/* PÁGINA 2 — Práctica */}
        {paginaIdx === 1 && (
        <>
        <div style={{ borderRadius: 14, background: CARD, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <div style={{ padding: "13px 15px", background: `linear-gradient(135deg, ${accent}10, transparent)`, borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: "2px", color: accent, margin: "0 0 2px", fontFamily: "system-ui", fontWeight: 600 }}>
                PRÁCTICA{rutina.practica.es_variante ? " · VARIANTE" : ""}
              </p>
              <p style={{ fontSize: 14, color: WHITE, margin: 0, fontFamily: "system-ui", fontWeight: 500 }}>
                {rutina.practica.titulo}
              </p>
            </div>
            <span style={{ padding: "4px 10px", borderRadius: 20, background: `${accent}18`, color: accent, fontSize: 11, fontFamily: "system-ui", flexShrink: 0, marginLeft: 8 }}>
              {rutina.practica.duracion}
            </span>
          </div>

          {rutina.practica.es_variante && rutina.practica.nota_variante && (
            <div style={{ padding: "9px 15px", background: `${accent}06`, borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, color: MUTED, margin: 0, fontFamily: "system-ui", fontStyle: "italic" }}>
                ↻ {rutina.practica.nota_variante}
              </p>
            </div>
          )}

          <div style={{ padding: "12px 15px" }}>
            {rutina.practica.pasos.map((paso, i) => (
              <button key={i} onClick={() => setPasoActivo(pasoActivo === i ? null : i)} style={{
                width: "100%", display: "flex", alignItems: "flex-start", gap: 11,
                padding: "11px 0",
                borderBottom: i < rutina.practica.pasos.length - 1 ? `1px solid ${BORDER}` : "none",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  background: pasoActivo === i ? accent : `${accent}20`,
                  color: pasoActivo === i ? "#080E18" : accent,
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui",
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 13, color: pasoActivo === i ? WHITE : "rgba(255,255,255,0.68)", margin: 0, lineHeight: 1.55, fontFamily: "system-ui" }}>
                  {paso}
                </p>
              </button>
            ))}

            {!completada ? (
              <button onClick={() => setCompletada(true)} style={{
                width: "100%", marginTop: 14, padding: "11px", borderRadius: 10,
                border: `1px solid ${accent}35`, background: "transparent", color: accent,
                fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
              }}>
                Marcar como completada ✓
              </button>
            ) : (
              <div style={{ marginTop: 14, padding: "13px", borderRadius: 10, background: `${accent}10`, border: `1px solid ${accent}28` }}>
                <p style={{ fontSize: 9, color: accent, margin: "0 0 6px", fontFamily: "system-ui", fontWeight: 600, letterSpacing: "1px" }}>PREGUNTA DE CIERRE</p>
                <p style={{ fontSize: 13, color: WHITE, margin: 0, lineHeight: 1.5, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                  {rutina.practica.cierre}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón continuar página 2 */}
        <button onClick={() => irAPagina(2)} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: accent, color: "#080E18",
          fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
        }}>
          Continuar al insight →
        </button>
        </>
        )}

        {/* PÁGINA 3 — Insight + Cierre */}
        {paginaIdx === 2 && (
          <>
        {/* Insight */}
        {rutina.insight && (
          <div style={{ padding: "15px 16px", borderRadius: 14, background: CARD, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 9, letterSpacing: "2px", color: MUTED, margin: "0 0 9px", fontFamily: "system-ui", fontWeight: 600 }}>
              INSIGHT DE HOY
            </p>
            {rutina.insight.split("\n\n").map((parrafo, i, arr) => (
              <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", margin: i < arr.length - 1 ? "0 0 12px" : 0, lineHeight: 1.7, fontFamily: "system-ui" }}>
                {parrafo}
              </p>
            ))}
          </div>
        )}

        {/* Cierre diferido */}
        {rutina.practica?.cierre_diferido && (
          <div style={{ padding: "14px 16px", borderRadius: 14, background: SURFACE, border: `1px solid rgba(196,168,212,0.2)` }}>
            <p style={{ fontSize: 9, letterSpacing: "2px", color: "#C4A8D4", margin: "0 0 8px", fontFamily: "system-ui", fontWeight: 600 }}>
              PARA REFLEXIONAR EN UNOS DÍAS
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
              {rutina.practica.cierre_diferido}
            </p>
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {mod.tags.map(tag => (
            <span key={tag} style={{ padding: "5px 10px", borderRadius: 20, background: SURFACE, border: `1px solid ${BORDER}`, color: MUTED, fontSize: 11, fontFamily: "system-ui" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Navegación entre sesiones */}
        {/* Navegación entre sesiones */}
        <div style={{ display: "flex", gap: 10 }}>
          {sesionIdx > 0 && (
            <button onClick={() => irASesion(sesionIdx - 1)} style={{
              padding: "13px 16px", borderRadius: 12, border: `1px solid ${BORDER}`,
              background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
            }}>
              ← Anterior
            </button>
          )}
          {!esUltima ? (
            <button onClick={() => irASesion(sesionIdx + 1)} style={{
              flex: 1, padding: "13px", borderRadius: 12, border: "none",
              background: accent, color: "#080E18",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
            }}>
              Siguiente sesión →
            </button>
          ) : (
            <button onClick={onNuevaSesion} style={{
              flex: 1, padding: "13px", borderRadius: 12, border: `1px solid ${BORDER}`,
              background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
            }}>
              ↺ Nueva sesión
            </button>
          )}
        </div>

        {sesionIdx === 0 && totalSesiones === 1 && (
          <button onClick={onVolver} style={{
            padding: "11px", borderRadius: 12, border: `1px solid ${BORDER}`,
            background: "transparent", color: DIM, fontSize: 12, cursor: "pointer", fontFamily: "system-ui",
          }}>
            ← Elegir otros módulos
          </button>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: DIM, margin: 0, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          hapi · vivir consciente
        </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────

// ─── EXPLORAR — CONTENIDO ─────────────────────────────────────
const EXPLORAR_ITEMS = [
  {
    id: "modestia",
    titulo: "La modestia",
    categoria: "Conciencia · Equilibrio",
    tiempo: "5 min",
    color: "#A8C49A",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "La modestia no es lo que parece",
        cuerpo: "Vivimos en una época que confunde visibilidad con valor. Las redes sociales premian al que más ocupa espacio. El sistema económico necesita que queramos más de lo que tenemos. Y sin darnos cuenta, aprendemos a construir una identidad hacia afuera — para ser vistos, para ser reconocidos, para demostrar quiénes somos.\n\nLa modestia, en ese contexto, parece una desventaja. Casi una ingenuidad.\n\nPero hay algo que la sabiduría antigua enseña desde hace siglos y que la psicología moderna empieza a confirmar: quien necesita demostrar quién es, todavía no sabe quién es.",
      },
      {
        label: "DESARROLLO",
        titulo: "La modestia real es interior",
        cuerpo: "Hay una confusión frecuente que vale la pena desarmar. La modestia no es falsa humildad. No es hacerse menos de lo que uno es. No es negar los propios logros ni vivir en la carencia. Eso no es modestia — es otro tipo de desequilibrio, igual de problemático.\n\nLa modestia real es un estado de quien sabe lo que tiene y no necesita mostrarlo. Es la diferencia entre el que entra al salón anunciándose y el que llega, se sienta atrás, y escucha — porque tiene algo real para aprender.\n\nHay una historia que ilustra esto: un hombre asistía regularmente a unas clases, siempre sentado al final del aula, tomando notas en silencio. Al final del curso se descubre que era uno de los grandes jefes de investigación oncológica de Europa. Sin chapa. Sin primera fila. Sin necesidad de que nadie supiera quién era. Eso es la modestia hecha carne.",
      },
      {
        label: "DESARROLLO",
        titulo: "El ego desequilibrado",
        cuerpo: "El ego desequilibrado no viene de la soberbia sino de la baja autoestima. Quien se jacta, quien necesita la primera fila, quien construye su identidad en lo que tiene o en lo que logró, lo hace porque en algún lugar profundo no está seguro de quién es sin eso. El ruido externo tapa el silencio interno.\n\nEl modesto, en cambio, no necesita expandirse porque sabe lo que tiene. Los que necesitan expandirse son los que tienen que mostrar la potencia.\n\nHay un camino concreto hacia la modestia: el agradecimiento. Cuando agradecés algo genuinamente, lo estás valorando. Y quien valora lo que tiene no siente la urgencia de acumular lo que no tiene. El agradecimiento — no como ritual sino como forma de mirar — te ancla en lo real.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "La modestia no es hacerse pequeño. Es no necesitar hacerse grande.",
        reflexion: [
          "¿Hay algún área de tu vida donde sentís que necesitás demostrar algo — a otros o a vos mismo? ¿Qué estarías demostrando exactamente?",
          "¿Cuándo fue la última vez que agradeciste genuinamente algo cotidiano — no por obligación sino porque lo viste de verdad?",
          "¿Hay algo que hacés, tenés o buscás principalmente por lo que dice de vos hacia afuera? ¿Qué pasaría si nadie lo viera?",
        ],
      },
    ],
  },
  {
    id: "vacio",
    titulo: "Vacío existencial",
    categoria: "Conciencia · Propósito",
    tiempo: "5 min",
    color: "#9B8EC4",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "El vacío no es el problema",
        cuerpo: "Hay un momento que casi todos conocen pero pocos nombran. Un domingo a la tarde sin planes. Un viaje largo terminado. Un logro alcanzado que no trajo lo que prometía. Un silencio entre una cosa y la siguiente.\n\nAparece algo incómodo. Una especie de pregunta sin forma que no sabés cómo responder. Y la respuesta automática suele ser la misma: llenarlo. Rápido. Con lo que sea.\n\nEso que sentís tiene nombre. Y entenderlo cambia bastante la relación con uno mismo.\n\nLa primera cosa que vale la pena invertir es la percepción: el vacío no es una falla. Es una función. Todo lo que existe tiene vacío porque el vacío es lo que permite recibir. El vacío existencial no es una señal de que algo está roto. Es una señal de que hay un espacio disponible que todavía no encontró para qué sirve.",
      },
      {
        label: "DESARROLLO",
        titulo: "Dos formas de responder al vacío",
        cuerpo: "Cuando aparece el vacío, hay básicamente dos respuestas posibles.\n\nLa primera es la evasión. Llenarlo con cualquier cosa — actividad, consumo, ruido, vínculos que ocupan espacio sin nutrir. Moverse mucho para no quedarse quieto con la pregunta. Hay una anécdota que ilustra esto: un hombre corre desesperado por la calle. Alguien le pregunta a dónde va. \"Buscando trabajo\", responde. \"¿Y si el trabajo quedó atrás?\", le dice el otro. \"Entonces te estás escapando, no buscando.\"\n\nMucha gente vive así. Se mueve sin saber hacia dónde. Y lo que parece productividad es en realidad una huida del silencio.\n\nLa segunda respuesta es la conciencia. Quedarse con el vacío el tiempo suficiente para preguntarse qué está pidiendo. Porque el vacío existencial, cuando no se tapa sino que se habita, eventualmente revela algo: el sentido.",
      },
      {
        label: "DESARROLLO",
        titulo: "El sentido como respuesta real",
        cuerpo: "La pandemia mostró algo con claridad: la gente que \"no tenía tiempo\" tuvo de repente 24 horas para estar consigo misma. Y muchos se encontraron con algo inesperado: no sabían qué hacer con ese tiempo. El ruido que antes tapaba la pregunta desapareció, y la pregunta quedó sola en el centro.\n\nAlgunos salieron transformados. Otros, cuando terminó, volvieron a las corridas exactamente donde las habían dejado.\n\nEl vacío existencial no desaparece. Sigue ahí. Pero cuando una persona encuentra el sentido de su vida — lo que la mueve de verdad, lo que haría aunque nadie la mirara — ese vacío deja de ser amenaza y se convierte en motor. La felicidad, en este sentido, no es un estado emocional. Es la sensación de que el vacío que uno tiene está siendo llenado con lo que vino a llenar.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "El vacío no es lo que le falta a tu vida. Es el espacio que espera ser llenado con lo que realmente importa.",
        reflexion: [
          "¿Cuándo aparece el vacío en tu vida? ¿En qué momentos, situaciones o transiciones lo sentís con más fuerza?",
          "Cuando sentís ese vacío, ¿cuál es tu respuesta automática? ¿Lo tapás o te quedás con él?",
          "¿Hay algo que hacés — o que podrías hacer — que llena ese espacio sin que lo sientas como evasión?",
        ],
      },
    ],
  },
  {
    id: "autoestima",
    titulo: "Autoestima",
    categoria: "Conciencia · Relaciones",
    tiempo: "5 min",
    color: "#7ECBA1",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "Amá a tu prójimo como a vos mismo",
        cuerpo: "Hay una frase que casi todos conocemos: amá a tu prójimo como a vos mismo. La solemos leer como una instrucción hacia afuera — sé generoso, sé compasivo con otros.\n\nPero hay una parte que se pasa por alto: como a vos mismo. La calidad del amor que podés dar afuera depende directamente de cómo te tratás adentro.\n\nY ahí aparece una pregunta incómoda: ¿cómo te tratás a vos mismo, realmente?\n\nHay una paradoja que vale la pena entender: la alta autoestima, cuando es exagerada, es también baja autoestima. El narcisismo no viene de quererse demasiado. Viene de no quererse lo suficiente. Quien necesita que todos sepan quién es, está compensando algo que internamente no está resuelto. No hay alta ni baja. Hay autoestima equilibrada — o desequilibrada en cualquiera de sus dos direcciones.",
      },
      {
        label: "DESARROLLO",
        titulo: "Reconocer sin exaltar",
        cuerpo: "Hay una distinción que cambia bastante la forma de relacionarse con uno mismo: la diferencia entre reconocer las propias virtudes y exaltarlas.\n\nReconocer es ver con honestidad lo que uno tiene — las fortalezas reales, las capacidades genuinas, lo que funciona bien. Es necesario. Sin ese reconocimiento, uno no puede potenciar lo que tiene ni usarlo para trabajar lo que falta.\n\nExaltar es otra cosa. Es inflar, mostrar, hacer bandera. Ahí sí puede aparecer el ego en el sentido problemático.\n\nHay una tendencia cultural a enfocarse casi exclusivamente en los desequilibrios propios como \"oportunidades de mejora\" — y es correcto, lo son. Pero las virtudes también son oportunidades. Dejarlas sin desarrollar porque \"ya las tengo\" es desperdiciar la mitad del trabajo.\n\nEl equilibrio está en mirar a ambos lados con la misma honestidad: defectos con compasión, virtudes con reconocimiento.",
      },
      {
        label: "DESARROLLO",
        titulo: "La señal más clara",
        cuerpo: "Una parte importante de la autoestima fue construida desde afuera — por las voces que escuchaste durante los años en que todavía no tenías criterio propio para filtrarlas. Alguien que te dijo que no podías. Esas voces se instalan y con el tiempo se vuelven propias.\n\nEl trabajo de la autoestima, en parte, es distinguir entre esas voces heredadas y la propia evaluación honesta de quién sos.\n\nLa autoestima equilibrada se construye sobre una sola base: la honestidad radical con uno mismo. No la honestidad social — esa que cuida la imagen que otros tienen de vos. Sino la que se ejerce puertas adentro, sin público.\n\n¿Cómo saber si la autoestima está en un lugar sano? Hay una señal concreta: la paz interior que no se modifica por el exterior. Quien la tiene puede recibir críticas sin derrumbarse y elogios sin inflarse. No porque sea indiferente, sino porque su base no depende de lo que el exterior confirme en cada momento.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "No podés dar lo que no te das. La calidad de cómo te tratás a vos mismo define la calidad de cómo tratás a todo lo demás.",
        reflexion: [
          "¿Cómo sos con vos mismo cuando cometés un error? ¿Le hablarías a alguien que querés de la misma forma que te hablás a vos?",
          "¿Podés nombrar tres virtudes propias genuinas — no las que otros te dicen, sino las que vos reconocés? ¿Las estás desarrollando activamente?",
          "¿Hay alguna voz heredada — de alguien del pasado — que todavía opera como tuya? ¿Qué diría tu propia evaluación honesta en su lugar?",
        ],
      },
    ],
  },
  {
    id: "perfeccionismo",
    titulo: "Perfeccionismo",
    categoria: "Mente · Conciencia",
    tiempo: "5 min",
    color: "#E07B6A",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "El detalle que se come el todo",
        cuerpo: "El perfeccionismo tiene buena prensa. Se presenta como dedicación, como estándares altos, como el motor de los que no se conforman con poco.\n\nPero hay algo que vale la pena mirar más de cerca: el perfeccionismo no siempre empuja hacia adelante. Muchas veces paraliza, agota y, paradójicamente, aleja del resultado que supuestamente busca.\n\nHay un tipo particular de perfeccionismo que se disfraza de rigor: ir a los detalles con tanta profundidad que en algún punto se pierde de vista el conjunto. Los detalles son infinitos. Cuanto más se desciende en ellos sin anclar en los principios generales, más se pierde el entendimiento real de lo que se está analizando.\n\nCitar no es integrar. Acumular referencias no es comprender. La profundidad real requiere que quien analiza aparezca en el análisis.",
      },
      {
        label: "DESARROLLO",
        titulo: "La vara que siempre sube",
        cuerpo: "El perfeccionismo tiene una característica que lo hace especialmente agotador: la vara siempre sube.\n\nSacaste ocho — la vara pasa a nueve. Sacaste nueve — la vara pasa a diez. Llegaste a diez — era lo mínimo esperado, no hay celebración. La vara se mueve antes de que puedas celebrar haber llegado.\n\nEn ese esquema, la persona nunca está en el nivel que debería estar. Y eso tiene un costo real en la autoestima: la sensación acumulada de no ser suficiente, de que el esfuerzo nunca es el correcto, de que algo siempre falla.\n\nHay una diferencia importante entre estimular y presionar. Estimular celebra lo logrado y abre el camino al siguiente paso. Presionar ignora lo logrado y señala siempre lo que faltó.\n\nUna de las confusiones más frecuentes del perfeccionismo es mezclar responsabilidad con culpa. La responsabilidad dice: hago lo que puedo dentro de lo que soy. La culpa dice: no llegué donde debía llegar. El antídoto no es bajar los estándares. Es aplicar compasión al propio proceso.",
      },
      {
        label: "DESARROLLO",
        titulo: "El otro extremo",
        cuerpo: "El perfeccionismo es un desequilibrio por exceso. Pero hay un desequilibrio equivalente en la dirección opuesta: la falta de estructura.\n\nHay personas que invierten mucha energía a lo largo de los años y al final sienten que no llegaron a nada. No porque no hayan hecho esfuerzo — sino porque nunca tuvieron claro a dónde querían llegar ni cómo organizar el camino hacia ahí.\n\nLa disciplina y la organización no son lo contrario de la creatividad. Son lo que permite que la energía disponible vaya a algún lado en lugar de dispersarse. Sin estructura, el movimiento es real pero la dirección es azarosa.\n\nLos dos extremos — el perfeccionismo paralizante y la desorganización dispersa — tienen en común que impiden avanzar. Uno por sobrecontrol, el otro por falta de él.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "El perfeccionismo no eleva el resultado. Eleva la vara hasta que ningún resultado alcanza.",
        reflexion: [
          "¿Hay alguna área de tu vida donde la autoexigencia opera más como condena que como estímulo? ¿Qué pasaría si celebraras lo que lograste antes de pasar al siguiente paso?",
          "Cuando algo no sale como esperabas, ¿qué diferencia hacés entre responsabilidad y culpa? ¿Cómo te hablás en ese momento?",
          "¿Tu nivel de detalle en lo que hacés te acerca a entender el conjunto o te aleja de él?",
        ],
      },
    ],
  },
  {
    id: "soledad",
    titulo: "La soledad",
    categoria: "Conciencia · Relaciones",
    tiempo: "6 min",
    color: "#6BA8D4",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "Dos formas de estar solo",
        cuerpo: "Hay dos formas de estar solo. Una que nutre. Otra que agota.\n\nLa diferencia no está en la cantidad de tiempo que pasás a solas — está en lo que encontrás cuando el ruido externo desaparece y quedás frente a vos mismo.\n\nLa soledad positiva no es la ausencia de gente. Es la presencia con uno mismo que permite procesar, reflexionar y crecer desde adentro.\n\nLa soledad negativa tampoco es la ausencia de gente. Es la huida hacia adentro para no tener que confrontar con el exterior — o la sensación de vacío que aparece cuando no sabés qué hacer con el silencio.\n\nHay un detalle importante: el miedo a la soledad no es miedo a estar solo. Es miedo a lo que aparece cuando estás solo. La soledad no genera ese malestar — lo revela.",
      },
      {
        label: "DESARROLLO",
        titulo: "Lo que no querés ver",
        cuerpo: "Cuando alguien llena su agenda compulsivamente, cuando necesita estar rodeado de gente constantemente, cuando el silencio le resulta insoportable — no está huyendo de la soledad. Está huyendo de la información que la soledad trae.\n\nEsa información puede ser una relación que no funciona y que no querés terminar. Un camino que elegiste y que en el silencio ya no te convence. Una conversación que venís postergando.\n\nEl problema de huir de esa información es que no desaparece. Sigue ahí, insistiendo, golpeando de otras formas — ansiedad difusa, irritabilidad sin causa clara, sensación de que algo falta sin saber qué.\n\nLa práctica no es forzarse a estar solo. Es no huir de lo que aparece cuando el espacio se abre.",
      },
      {
        label: "DESARROLLO",
        titulo: "El equilibrio",
        cuerpo: "Hay una trampa más sutil: creer que estás bien solo cuando en realidad estás evitando el compromiso con los demás. Una persona que está genuinamente bien con su propia compañía también puede estar bien acompañada. Si alguien dice que prefiere la soledad pero se siente mal en compañía — hay algo que no cierra.\n\nLos otros — pareja, amigos, familia — funcionan como espejos que muestran cosas que la introspección sola no puede mostrar. Hay aspectos de uno mismo que solo se revelan en el roce con otro.\n\nNi la soledad permanente ni la socialización permanente. Los dos extremos sirven para lo mismo: evitar algo. El movimiento sano es entre los dos — soledad que procesa la experiencia externa, y vínculos que generan nueva experiencia para procesar.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "No le tenés miedo a la soledad. Le tenés miedo a lo que encontrás cuando estás solo. Y eso que encontrás es exactamente lo que necesitás ver.",
        reflexion: [
          "Cuando tenés tiempo libre y silencio, ¿qué es lo primero que aparece? ¿Lo buscás o lo evitás?",
          "¿Hay algo que venís postergando mirar — una situación, una relación, una decisión — que aparece cuando el ruido externo baja?",
          "¿Usás la compañía de otros para aprender sobre vos mismo, o principalmente para no estar solo?",
        ],
      },
    ],
  },
  {
    id: "velocidad",
    titulo: "Velocidad y proceso",
    categoria: "Conciencia · Mente",
    tiempo: "5 min",
    color: "#C4A882",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "La trampa de lo inmediato",
        cuerpo: "Vivimos convencidos de que movernos más rápido es avanzar más. Que la productividad se mide en cuánto se hace por unidad de tiempo. Que el que para, pierde.\n\nHay una paradoja que vale la pena considerar: la velocidad constante no es avance. Es, en muchos casos, parálisis con movimiento.\n\nLa cultura actual tiene un sesgo muy claro hacia los resultados inmediatos. Se quiere ver el efecto antes de terminar la causa. Se abandona el proceso si el resultado tarda. Se juzga el valor de algo por la rapidez con que produce un retorno visible.\n\nEl problema es que los procesos que realmente cambian algo — los aprendizajes profundos, los cambios de perspectiva, la construcción de una identidad sólida — no producen resultados visibles en el corto plazo. Son lentos. Silenciosos. Y ocurren principalmente adentro.",
      },
      {
        label: "DESARROLLO",
        titulo: "La velocidad como censura invisible",
        cuerpo: "Hay algo que pocas veces se nombra así: la velocidad del sistema moderno funciona como una forma de censura que no necesita prohibir nada.\n\nEn otros tiempos, quien quería que la gente no pensara tenía que quemar libros, perseguir intelectuales, prohibir ideas. Hoy no hace falta. Alcanza con saturar la atención — con estímulos, notificaciones, urgencias permanentes — hasta que el tiempo y la energía para la reflexión profunda simplemente desaparecen.\n\nNo es que se prohíbe leer. Es que no hay tiempo para leer. No es que se prohíbe pensar. Es que el ritmo no deja espacio para pensar.\n\nUna buena metáfora: la información superficial viaja por tuberías delgadas — mucho movimiento, poco volumen. Los procesos profundos viajan por tuberías anchas — aparentemente más lentos, pero transportando infinitamente más.",
      },
      {
        label: "DESARROLLO",
        titulo: "El valor del proceso",
        cuerpo: "La mente quiere resultados tangibles. Es su forma de confirmar que algo está pasando, que el esfuerzo vale. Y eso no está mal — necesitamos esa confirmación para sostenernos en el camino.\n\nPero hay un tipo de resultado que la mente suele ignorar porque no es visible ni medible: el cambio de percepción interior. La manera en que uno lee una situación que antes no podía leer. La calma que aparece donde antes había reactividad.\n\nSi querés saber quién sos, mirá tu agenda. La distribución del tiempo no es un detalle logístico. Es una declaración de identidad. Lo que uno elige hacer con el tiempo disponible refleja qué se está construyendo realmente.\n\nHay una diferencia entre el tiempo que se invierte en profundizar — leer, reflexionar, practicar, estar presente — y el tiempo que se consume en la superficie sin dejar nada.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "Frenar no es perder velocidad. Es elegir el tipo de movimiento que realmente lleva a algún lado.",
        reflexion: [
          "Si mirás tu semana típica, ¿qué proporción del tiempo va hacia actividades que te generan algo duradero versus actividades que simplemente llenan el espacio?",
          "¿Hay algún proceso en tu vida que estás abandonando porque los resultados tardan? ¿Qué pasaría si lo mirarás desde una escala de tiempo más larga?",
          "¿Cuándo fue la última vez que te diste tiempo para pensar sin un objetivo concreto — solo para que algo sedimentara?",
        ],
      },
    ],
  },
  {
    id: "bullying",
    titulo: "Bullying",
    categoria: "Conciencia · Relaciones",
    tiempo: "6 min",
    color: "#D4886A",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "El ángulo que falta",
        cuerpo: "Cuando se habla de bullying, el foco casi siempre está en la víctima — cómo protegerla, cómo fortalecerla, cómo reducir el daño. Es necesario. Pero no es suficiente para ir a la raíz del problema.\n\nLa pregunta que pocas veces se hace es la más importante: ¿cómo crece un acosador? ¿De dónde viene esa conducta? ¿Qué está pasando en esa persona — y en su entorno — para que el daño hacia otro se convierta en algo que busca activamente?\n\nEntender al acosador no es justificarlo. Es desarticular el mal en su origen.",
      },
      {
        label: "DESARROLLO",
        titulo: "El grupo y el chivo expiatorio",
        cuerpo: "Una de las primeras cosas que llama la atención cuando se analiza el bullying es que rara vez es individual. Casi siempre hay un grupo.\n\nEl grupo cumple una función muy específica: le da al acosador una sensación de fuerza que por sí solo no tiene. Dentro del grupo hay pertenencia, hay jerarquía, hay un líder que decide quién está adentro y quién afuera. Y para mantener esa cohesión interna, el grupo necesita un afuera — alguien a quien señalar, discriminar, atacar.\n\nEl acosado no es elegido al azar. Es elegido por algo que lo diferencia. Cualquier característica que lo haga destacar o distinguirse puede convertirse en blanco. Lo que se persigue es exactamente la diferencia — la singularidad, lo que no encaja en el molde del grupo.\n\nEsto tiene una dimensión que va más allá de la escuela. El acoso escolar comparte estructura con los sistemas totalitarios: un líder, un grupo cerrado, un enemigo externo que justifica la cohesión interna. El bullying es el germen de dinámicas mucho más oscuras que aparecen en la vida adulta.",
      },
      {
        label: "DESARROLLO",
        titulo: "La raíz: inferioridad compensada",
        cuerpo: "El acosador no actúa desde la fuerza. Actúa desde la debilidad disfrazada de fuerza.\n\nEn el fondo de casi todo comportamiento agresivo sostenido hay una baja autoestima profunda, una sensación de inferioridad que no puede sostenerse sola y necesita compensarse hacia afuera. Al señalar al otro como inferior, el acosador temporalmente alivia esa sensación propia de no ser suficiente.\n\nToda agresión que apunta a construir superioridad sobre otro está revelando, en realidad, una inferioridad que no se sabe procesar de otra manera.\n\nY esa dinámica no nace en el patio del colegio. Nace antes. En la mayoría de los casos hay un entorno familiar — no necesariamente con violencia física visible — donde hay agresión psicológica, liderazgos autoritarios, dinámicas de control o humillación que el niño internaliza y reproduce. Los acosadores no nacen de la nada. Aprenden.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "Quien necesita hacer sentir inferior a otro está revelando la inferioridad que no sabe cómo sostener adentro.",
        reflexion: [
          "¿Hubo algún momento en tu vida donde actuaste desde la necesidad de pertenecer a un grupo a costa de alguien que quedaba afuera? ¿Qué te impulsaba en ese momento?",
          "Cuando ves comportamientos agresivos o de exclusión en otros, ¿podés ver la debilidad detrás de la agresión? ¿Cambia algo en cómo respondés?",
          "¿Hay algún patrón de tu entorno familiar de origen que todavía influye en cómo manejás el poder en tus relaciones actuales?",
        ],
      },
    ],
  },
  {
    id: "idealizacion",
    titulo: "Idealización",
    categoria: "Conciencia · Relaciones",
    tiempo: "5 min",
    color: "#8EC4B8",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "Admirar vs. idealizar",
        cuerpo: "Admirar a alguien es sano. Reconocer en otro una cualidad que vale la pena, aprender de quien sabe más, sentir respeto genuino por alguien que encarna algo que uno valora — todo eso es parte de crecer.\n\nIdealizar es otra cosa. Y la diferencia importa más de lo que parece.\n\nQuien admira mantiene la conciencia de que el admirado es un ser humano con defectos. Quien idealiza borra esa conciencia. En la idealización, todo lo que hace el otro está bien. Sus errores se justifican, sus contradicciones se ignoran, su figura se vuelve intocable.\n\nEl problema no es el admirado — el problema es lo que el que idealiza necesita que el otro sea. Porque la idealización no dice nada sobre el ídolo. Dice todo sobre quien idealiza.",
      },
      {
        label: "DESARROLLO",
        titulo: "Lo que el ídolo satisface",
        cuerpo: "¿Qué necesita la persona que idealiza? En general, deposita en el otro algo que no puede encontrar en sí misma — una referencia, una seguridad, una respuesta que no tiene. El ídolo se convierte en un objeto que satisface una necesidad propia.\n\nY cuando el ídolo falla — porque tarde o temprano todo ser humano falla — la caída es brutal, porque lo que cae no era una persona real sino una proyección.\n\nHay algo interesante en la tradición bíblica al respecto: ninguno de sus personajes centrales es idealizado. Moisés, el rey David, Abraham — todos tienen contradicciones, errores, momentos de duda o de falla. No se puede idealizar a ninguno. La enseñanza de fondo es que la figura humana, por más grande que sea, sigue siendo humana.",
      },
      {
        label: "DESARROLLO",
        titulo: "La relación bidireccional",
        cuerpo: "Hay un lado de esta ecuación que pocas veces se examina: el del idealizado.\n\nCuando alguien es idealizado y lo acepta — cuando entra en el juego de creerse la imagen que otros le proyectan — hay un segundo desequilibrio en marcha. El ídolo que se cree ídolo necesita esa idealización para sostenerse. Su autoestima depende de que otros lo vean como algo más que humano.\n\nSe forma así una relación de dos desequilibrios que se alimentan mutuamente: uno necesita idealizar, el otro necesita ser idealizado. Ninguno de los dos está viendo al otro — están usando al otro para resolver algo propio.\n\nEsta dinámica no es exclusiva de las relaciones personales. Los sistemas totalitarios se construyen exactamente sobre este mecanismo: el líder que acepta y promueve su propia divinización, y la masa que necesita creer en alguien infalible para no tener que hacerse cargo de su propia vida.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "La idealización no dice nada sobre el ídolo. Dice todo sobre lo que quien idealiza todavía no encontró en sí mismo.",
        reflexion: [
          "¿Hay alguien en tu vida — o en tu historia — a quien hayas idealizado? ¿Qué necesitabas que esa persona fuera para vos?",
          "¿Podés distinguir en vos mismo la diferencia entre admirar a alguien y necesitar que sea perfecto? ¿Qué cambia cuando el admirado comete un error?",
          "¿Hay algún ámbito donde buscás figuras de autoridad que te den certeza en lugar de construir tu propio criterio?",
        ],
      },
    ],
  },
  {
    id: "celos",
    titulo: "Celos",
    categoria: "Conciencia · Relaciones",
    tiempo: "5 min",
    color: "#C4829A",
    paginas: [
      {
        label: "INTRODUCCIÓN",
        titulo: "No todos los celos son iguales",
        cuerpo: "Los celos son una de las emociones más universales y menos comprendidas. Casi todos los han sentido en algún momento. Pocos los examinan con honestidad.\n\nHay una distinción que vale la pena hacer desde el principio: no todos los celos son iguales. Hay celos que son una respuesta natural dentro de un vínculo de compromiso, y hay celos que son un problema en sí mismos — un patrón que destruye lo que dice querer proteger.\n\nUna sensación de incomodidad cuando alguien cercano presta atención a otro, cuando algo que sentís como propio parece amenazado — eso tiene una lógica humana. El problema empieza cuando ese celo se convierte en control. Cuando la necesidad de controlar los movimientos del otro se vuelve más grande que la capacidad de confiar en él.",
      },
      {
        label: "DESARROLLO",
        titulo: "La inseguridad como raíz",
        cuerpo: "Los celos patológicos casi nunca son sobre el otro. Son sobre uno mismo.\n\nEn el fondo hay una creencia muy específica, generalmente no consciente: no soy suficiente. No soy suficientemente interesante, atractivo, valioso — la versión varía, pero el núcleo es el mismo. Y si no soy suficiente, entonces el otro en algún momento va a darse cuenta y va a elegir a alguien mejor.\n\nEsa creencia no nace de la nada. Puede venir de experiencias tempranas de abandono real o percibido. Puede venir de haber crecido en un entorno donde el afecto era condicional, donde había que ganarse el amor siendo de cierta manera. Puede venir de una traición real en el pasado que nunca terminó de procesarse.\n\nLo que sea que haya generado esa herida, el resultado es el mismo: una persona que entra a los vínculos con la convicción de que no va a durar. Y desde esa convicción, cualquier señal ambigua del exterior se lee como confirmación de la amenaza — aunque no lo sea.",
      },
      {
        label: "DESARROLLO",
        titulo: "Lo que el otro no puede dar",
        cuerpo: "La lógica del celoso patológico es comprensible pero circular: si el miedo es que el otro se vaya, la solución aparente es controlarlo para que no pueda irse. Revisar el teléfono. Preguntar dónde estuvo. Vigilar.\n\nEl problema es que el control no toca la raíz. Calma la ansiedad por unos minutos — el otro está donde dijo que estaría — pero la creencia de fondo sigue intacta. No soy suficiente. Y si esa creencia sigue ahí, el próximo motivo de sospecha llega solo.\n\nHay algo que el celoso busca en el control del otro que el otro no puede dar: la seguridad de que es valioso. El otro puede decir mil veces 'te quiero, no hay nadie más' — y la tranquilidad dura horas antes de que el miedo vuelva. Porque la fuente del problema no está en lo que el otro hace o deja de hacer. Está en lo que uno cree de sí mismo.\n\nLos celos patológicos no protegen el vínculo. Lo asfixian. Y hay una paradoja que los hace especialmente destructivos: terminan produciendo exactamente lo que temen. La persona controlada, vigilada, interrogada permanentemente, eventualmente se aleja. Los celos expulsan a quien dicen querer retener.",
      },
      {
        label: "REFLEXIÓN",
        titulo: "Para llevar",
        idea_clave: "Los celos no son sobre el otro. Son el espejo de lo que uno todavía no resolvió sobre sí mismo.",
        reflexion: [
          "Cuando sentís celos, ¿podés identificar la creencia que está debajo? ¿Qué es exactamente lo que temés que el otro descubra de vos?",
          "¿Hay una experiencia pasada — de abandono, de traición, de amor condicional — que todavía influye en cómo te relacionás hoy? ¿La reconocés como pasado o la vivís como presente?",
          "¿Qué necesitaría pasar adentro tuyo para que la presencia del otro alcanzara — sin necesitar verificarla constantemente?",
        ],
      },
    ],
  },
];


// ─── LECTOR PAGINADO — EXPLORAR ───────────────────────────────
function LectorPaginado({ item, onBack }) {
  const [paginaIdx, setPaginaIdx] = useState(0);
  const scrollRef = useRef(null);
  const pagina = item.paginas[paginaIdx];
  const total = item.paginas.length;
  const esReflexion = pagina.reflexion != null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [paginaIdx]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div style={{
        padding: "44px 24px 20px",
        background: `linear-gradient(180deg, ${item.color}12 0%, transparent 100%)`,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: MUTED, background: "none", border: "none",
          cursor: "pointer", marginBottom: 16, fontFamily: "system-ui",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Explorar
        </button>

        {/* Progreso de páginas */}
        <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
          {item.paginas.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 4,
              background: i <= paginaIdx ? item.color : DIM,
              transition: "background 0.3s",
            }}/>
          ))}
        </div>

        <p style={{ fontSize: 10, letterSpacing: "2px", color: item.color, margin: "0 0 6px", fontFamily: "system-ui", fontWeight: 600 }}>
          {pagina.label} · {paginaIdx + 1}/{total}
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: WHITE, margin: 0, fontFamily: "'Georgia', serif", lineHeight: 1.3 }}>
          {pagina.titulo}
        </h1>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Contenido de la página */}
        {!esReflexion ? (
          <div style={{
            padding: "18px",
            borderRadius: 14,
            background: CARD,
            border: `1px solid ${BORDER}`,
          }}>
            {pagina.cuerpo.split("\n\n").map((parrafo, i) => (
              <p key={i} style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.75,
                fontFamily: "system-ui",
                marginBottom: i < pagina.cuerpo.split("\n\n").length - 1 ? 14 : 0,
              }}>
                {parrafo}
              </p>
            ))}
          </div>
        ) : (
          <>
            {/* Idea clave */}
            <div style={{
              padding: "18px",
              borderRadius: 14,
              background: `${item.color}10`,
              border: `1px solid ${item.color}30`,
            }}>
              <p style={{ fontSize: 10, letterSpacing: "2px", color: item.color, margin: "0 0 10px", fontFamily: "system-ui", fontWeight: 600 }}>
                IDEA CLAVE
              </p>
              <p style={{ fontSize: 16, color: WHITE, margin: 0, fontFamily: "'Georgia', serif", fontStyle: "italic", lineHeight: 1.55 }}>
                "{pagina.idea_clave}"
              </p>
            </div>

            {/* Reflexiones */}
            <div style={{
              padding: "18px",
              borderRadius: 14,
              background: CARD,
              border: `1px solid ${BORDER}`,
            }}>
              <p style={{ fontSize: 10, letterSpacing: "2px", color: MUTED, margin: "0 0 14px", fontFamily: "system-ui", fontWeight: 600 }}>
                REFLEXIÓN
              </p>
              {pagina.reflexion.map((preg, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  paddingBottom: i < pagina.reflexion.length - 1 ? 14 : 0,
                  marginBottom: i < pagina.reflexion.length - 1 ? 14 : 0,
                  borderBottom: i < pagina.reflexion.length - 1 ? `1px solid ${BORDER}` : "none",
                }}>
                  <span style={{ color: item.color, fontSize: 16, flexShrink: 0, marginTop: 2 }}>→</span>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.65, fontFamily: "system-ui" }}>
                    {preg}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navegación */}
        <div style={{ display: "flex", gap: 10 }}>
          {paginaIdx > 0 && (
            <button onClick={() => setPaginaIdx(p => p - 1)} style={{
              padding: "14px 18px", borderRadius: 12,
              border: `1px solid ${BORDER}`, background: "transparent",
              color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
            }}>
              ← Anterior
            </button>
          )}
          {paginaIdx < total - 1 ? (
            <button onClick={() => setPaginaIdx(p => p + 1)} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "none",
              background: item.color, color: "#080E18",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
            }}>
              Continuar →
            </button>
          ) : (
            <button onClick={onBack} style={{
              flex: 1, padding: "14px", borderRadius: 12,
              border: `1px solid ${item.color}50`, background: "transparent",
              color: item.color, fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
            }}>
              Volver a Explorar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EXPLORAR VIEW ────────────────────────────────────────────
function ExplorarView({ user, onBack }) {
  const [itemActivo, setItemActivo] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, []);

  if (itemActivo) {
    return <LectorPaginado item={itemActivo} onBack={() => setItemActivo(null)} />;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div style={{
        padding: "48px 24px 24px",
        background: "linear-gradient(180deg, rgba(196,168,132,0.08) 0%, transparent 100%)",
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: MUTED, background: "none", border: "none",
          cursor: "pointer", marginBottom: 16, fontFamily: "system-ui",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Inicio
        </button>
        <p style={{ fontSize: 10, letterSpacing: "3px", color: "#C4A882", margin: "0 0 6px", fontFamily: "system-ui" }}>
          FASE 2 · EXPLORAR
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 400, color: WHITE, margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>
          Explorar
        </h1>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, fontFamily: "system-ui", lineHeight: 1.5 }}>
          Lecturas para profundizar en los temas que más importan.
        </p>
      </div>

      {/* Grid de piezas */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {EXPLORAR_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setItemActivo(item)}
            style={{
              width: "100%", padding: "16px",
              borderRadius: 16,
              border: `1px solid ${item.color}25`,
              background: `${item.color}06`,
              cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: `${item.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>
              📖
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: WHITE, margin: "0 0 3px", fontFamily: "system-ui" }}>
                {item.titulo}
              </p>
              <p style={{ fontSize: 11, color: MUTED, margin: "0 0 6px", fontFamily: "system-ui" }}>
                {item.categoria}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 10, color: item.color,
                  padding: "2px 8px", borderRadius: 10,
                  background: `${item.color}15`,
                  fontFamily: "system-ui", fontWeight: 600,
                }}>
                  📖 {item.tiempo}
                </span>
                <span style={{ fontSize: 10, color: MUTED, fontFamily: "system-ui" }}>
                  {item.paginas.length} páginas
                </span>
              </div>
            </div>
            <span style={{ color: item.color, fontSize: 18, flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: DIM, margin: "24px 0 0", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
        hapi · vivir consciente
      </p>
    </div>
  );
}

// ─── FEEDBACK FORM ────────────────────────────────────────────
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzA5tmVfwXdkYH4ZXUIR4qAcB4D9qlHEyNZW4b4q6CJi4HKPM0_k7AIfRcYXxxBwxSoFQ/exec";

function FeedbackForm({ onClose }) {
  const [step, setStep] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({
    nombre: "", modulos: "", calidad: 0, calidad_comentario: "",
    impacto: "", confusion: "", descripcion: "",
    diferente: 3, rutina: "", precio: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function enviar() {
    setEnviando(true);
    try {
      const params = new URLSearchParams({
        nombre: form.nombre,
        modulos: form.modulos,
        calidad: form.calidad,
        calidad_comentario: form.calidad_comentario,
        impacto: form.impacto,
        confusion: form.confusion,
        descripcion: form.descripcion,
        diferente: form.diferente,
        rutina: form.rutina,
        precio: form.precio,
      });
      await fetch(`${SHEET_URL}?${params.toString()}`, { method: "GET", mode: "no-cors" });
    } catch (e) {}
    setEnviando(false);
    setEnviado(true);
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
    color: WHITE, fontSize: 14, fontFamily: "system-ui",
    outline: "none", resize: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11, letterSpacing: "1.5px", color: MUTED,
    fontFamily: "system-ui", fontWeight: 600, marginBottom: 8, display: "block",
  };

  const steps = [
    // Paso 0 — Nombre
    <div key={0}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Cómo te llamás?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Para poder identificar tu feedback.
      </p>
      <input type="text" value={form.nombre} onChange={e => set("nombre", e.target.value)}
        placeholder="Nombre y apellido" style={{ ...inputStyle, rows: undefined }} />
    </div>,

    // Paso 1 — Hasta qué módulo llegaste
    <div key={1}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Hasta qué módulo llegaste?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        El último que abriste o completaste.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["Ninguno todavía", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].map(op => (
          <button key={op} onClick={() => set("modulos", op)} style={{
            padding: "10px 14px", borderRadius: 20,
            border: `1px solid ${form.modulos === op ? "#C4A882" : BORDER}`,
            background: form.modulos === op ? "rgba(196,168,130,0.15)" : "transparent",
            color: form.modulos === op ? "#C4A882" : MUTED,
            fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
          }}>{op}</button>
        ))}
      </div>
    </div>,

    // Paso 2 — Calidad del contenido
    <div key={2}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Cómo calificarías la calidad del contenido?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Los módulos, los textos, las prácticas.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => set("calidad", n)} style={{
            flex: 1, padding: "14px 0", borderRadius: 10,
            border: `1px solid ${form.calidad === n ? "#C4A882" : BORDER}`,
            background: form.calidad === n ? "rgba(196,168,130,0.15)" : "transparent",
            color: form.calidad === n ? "#C4A882" : MUTED,
            fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Mejorable</span>
        <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Excelente</span>
      </div>
      <textarea rows={3} value={form.calidad_comentario} onChange={e => set("calidad_comentario", e.target.value)}
        placeholder="¿Algo específico sobre el contenido? (opcional)" style={inputStyle} />
    </div>,

    // Paso 3 — Impacto
    <div key={3}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Qué te resonó más?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Un módulo, una idea, una práctica — lo que sea que se quedó.
      </p>
      <textarea rows={4} value={form.impacto} onChange={e => set("impacto", e.target.value)}
        placeholder="Escribí lo que se te venga..." style={inputStyle} />
    </div>,

    // Paso 4 — Confusión / faltantes
    <div key={4}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Algo confuso o que faltó?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Cualquier fricción que hayas sentido — de contenido, diseño o flujo.
      </p>
      <textarea rows={4} value={form.confusion} onChange={e => set("confusion", e.target.value)}
        placeholder="Opcional, pero muy valioso..." style={inputStyle} />
    </div>,

    // Paso 5 — Descripción (copy espontáneo)
    <div key={5}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Cómo le explicarías hapi a alguien?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Con tus palabras, sin pensar demasiado.
      </p>
      <textarea rows={4} value={form.descripcion} onChange={e => set("descripcion", e.target.value)}
        placeholder="Es una app que..." style={inputStyle} />
    </div>,

    // Paso 6 — Diferenciación + precio
    <div key={6}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        Dos últimas preguntas
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        Ya casi terminás.
      </p>

      <span style={labelStyle}>¿QUÉ TAN DIFERENTE TE PARECE DE OTRAS APPS?</span>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => set("diferente", n)} style={{
            flex: 1, padding: "10px 0", borderRadius: 10,
            border: `1px solid ${form.diferente === n ? "#C4A882" : BORDER}`,
            background: form.diferente === n ? "rgba(196,168,130,0.15)" : "transparent",
            color: form.diferente === n ? "#C4A882" : MUTED,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Muy similar</span>
        <span style={{ fontSize: 10, color: DIM, fontFamily: "system-ui" }}>Muy diferente</span>
      </div>

      <span style={labelStyle}>¿PAGARÍAS POR ACCESO COMPLETO?</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {["No pagaría", "$3–5 / mes", "$8–12 / mes", "$15+ / mes"].map(op => (
          <button key={op} onClick={() => set("precio", op)} style={{
            padding: "12px 16px", borderRadius: 10, textAlign: "left",
            border: `1px solid ${form.precio === op ? "#C4A882" : BORDER}`,
            background: form.precio === op ? "rgba(196,168,130,0.15)" : "transparent",
            color: form.precio === op ? "#C4A882" : MUTED,
            fontSize: 14, cursor: "pointer", fontFamily: "system-ui",
          }}>{op}</button>
        ))}
      </div>
    </div>,

    // Paso 7 — Rutina / continuidad
    <div key={7}>
      <p style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
        ¿Te imaginás usando hapi regularmente?
      </p>
      <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px", fontFamily: "system-ui" }}>
        ¿Qué haría falta para que sea parte de tu rutina?
      </p>
      <textarea rows={4} value={form.rutina} onChange={e => set("rutina", e.target.value)}
        placeholder="Sí / no / depende de..." style={inputStyle} />
    </div>,
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%", maxWidth: "480px", margin: "0 auto",
        background: "#0F1117", borderRadius: "24px 24px 0 0",
        padding: "8px 0 48px",
        border: `1px solid ${BORDER}`,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 4, background: DIM, margin: "12px auto 0" }}/>

        {enviado ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: WHITE, margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>
              Gracias por el feedback
            </p>
            <p style={{ fontSize: 14, color: MUTED, margin: "0 0 32px", fontFamily: "system-ui", lineHeight: 1.6 }}>
              Cada respuesta ayuda a hacer hapi mejor para vos y para todos los que vienen.
            </p>
            <button onClick={onClose} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "#C4A882", color: "#080E18",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
            }}>
              Cerrar
            </button>
          </div>
        ) : (
          <div style={{ padding: "24px 24px 0" }}>
            {/* Progreso */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 4,
                  background: i <= step ? "#C4A882" : DIM,
                  transition: "background 0.3s",
                }}/>
              ))}
            </div>

            {steps[step]}

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{
                  padding: "13px 18px", borderRadius: 12,
                  border: `1px solid ${BORDER}`, background: "transparent",
                  color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "system-ui",
                }}>← Anterior</button>
              )}
              {step < steps.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} style={{
                  flex: 1, padding: "13px", borderRadius: 12, border: "none",
                  background: "#C4A882", color: "#080E18",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui",
                }}>Continuar →</button>
              ) : (
                <button onClick={enviar} disabled={enviando} style={{
                  flex: 1, padding: "13px", borderRadius: 12, border: "none",
                  background: enviando ? DIM : "#C4A882", color: "#080E18",
                  fontSize: 14, fontWeight: 700, cursor: enviando ? "default" : "pointer",
                  fontFamily: "system-ui",
                }}>{enviando ? "Enviando..." : "Enviar feedback ✦"}</button>
              )}
            </div>

            <button onClick={onClose} style={{
              width: "100%", marginTop: 12, padding: "10px",
              background: "transparent", border: "none",
              color: DIM, fontSize: 12, cursor: "pointer", fontFamily: "system-ui",
            }}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENÚ DE AJUSTES ──────────────────────────────────────────
function SettingsMenu({ onClose, onReiniciar, onMotorIA, onFeedback }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px", margin: "0 auto",
          background: SURFACE,
          borderRadius: "24px 24px 0 0",
          padding: "8px 0 40px",
          border: `1px solid ${BORDER}`,
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 4, background: DIM, margin: "12px auto 20px" }}/>

        <p style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, margin: "0 0 12px", padding: "0 24px", fontFamily: "system-ui", fontWeight: 600 }}>
          AJUSTES
        </p>

        {/* Opción Feedback */}
        <button onClick={onFeedback} style={{
          width: "100%", padding: "16px 24px",
          background: "transparent", border: "none",
          borderBottom: `1px solid ${BORDER}`,
          cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "rgba(196,168,130,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>✦</div>
          <div>
            <p style={{ fontSize: 14, color: WHITE, margin: 0, fontFamily: "system-ui", fontWeight: 500 }}>
              Dar feedback
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: "2px 0 0", fontFamily: "system-ui" }}>
              Ayudanos a mejorar hapi
            </p>
          </div>
        </button>

        {/* Opción Motor IA */}
        <button onClick={onMotorIA} style={{
          width: "100%", padding: "16px 24px",
          background: "transparent", border: "none",
          borderBottom: `1px solid ${BORDER}`,
          cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "rgba(168,196,154,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>🌱</div>
          <div>
            <p style={{ fontSize: 14, color: WHITE, margin: 0, fontFamily: "system-ui", fontWeight: 500 }}>
              Ir al Motor IA
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: "2px 0 0", fontFamily: "system-ui" }}>
              Simula haber completado los 18 módulos
            </p>
          </div>
        </button>

        {/* Opción Reiniciar */}
        <button onClick={onReiniciar} style={{
          width: "100%", padding: "16px 24px",
          background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "rgba(224,123,106,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>↺</div>
          <div>
            <p style={{ fontSize: 14, color: "#E07B6A", margin: 0, fontFamily: "system-ui", fontWeight: 500 }}>
              Reiniciar desde el onboarding
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: "2px 0 0", fontFamily: "system-ui" }}>
              Borra el progreso y vuelve al inicio
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function HomeView({ user, onSelectModule, onShowPillar, onAbrirMotor, onAbrirAjustes }) {
  const pillar = getPillar(user.currentModule);
  const mod = MODULES[user.currentModule];
  const totalDone = user.completedModules.length;
  const WEEK_ROLES = [{day:"Lunes",role:"Lectura del módulo",icon:"📖"},{day:"Mar–Jue",role:"Práctica diaria",icon:"🎯"},{day:"Viernes",role:"Reflexión y diario",icon:"✏️"},{day:"Sáb–Dom",role:"Integración libre",icon:"🌿"}];

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5"><HapiLogo size={26}/><span className="text-sm font-bold" style={{color:"rgba(255,255,255,0.9)",letterSpacing:"3px"}}>HAPI</span></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{background:SURFACE,border:`1px solid ${BORDER}`}}>
              <span>🔥</span><span className="text-xs font-bold" style={{color:WHITE}}>{user.streak}</span><span className="text-xs" style={{color:MUTED}}>días</span>
            </div>
            <button onClick={onAbrirAjustes}
              className="flex items-center justify-center rounded-full"
              style={{width:34,height:34,background:SURFACE,border:`1px solid ${BORDER}`,cursor:"pointer"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-sm" style={{color:MUTED}}>Buenos días,</p>
        <h1 className="font-bold" style={{fontSize:28,color:WHITE,fontFamily:"'Georgia',serif"}}>{user.name}</h1>
      </div>

      <div className="px-6 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{color:MUTED}}>Progreso total</span>
          <span className="text-xs font-bold" style={{color:WHITE}}>{totalDone}/18</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{background:DIM}}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{width:`${(totalDone/18)*100}%`,background:"linear-gradient(90deg,#7ECBA1,#6BA8D4,#C4A8D4)"}}/>
        </div>
      </div>

      <div className="px-6 mb-5">
        <div className="rounded-2xl p-4" style={{background:CARD,border:`1px solid ${BORDER}`}}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold" style={{color:WHITE}}>Esta semana</p>
            <p className="text-xs" style={{color:MUTED}}>{WEEK_ROLES[Math.min(user.currentDay-1,3)]?.icon} {WEEK_ROLES[Math.min(user.currentDay-1,3)]?.role}</p>
          </div>
          <div className="flex gap-2">
            {["L","M","X","J","V","S","D"].map((d,i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full" style={{background:user.weekProgress[i]?pillar?.color||"#7ECBA1":i===user.currentDay-1?`${pillar?.color}40`:DIM}}/>
                <span style={{color:i===user.currentDay-1?WHITE:MUTED,fontWeight:i===user.currentDay-1?"bold":"normal",fontSize:"10px"}}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 mb-5">
        {onAbrirMotor ? (
          <>
            <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>FASE 2 — PRÁCTICA DIARIA</p>
            <button onClick={onAbrirMotor}
              className="w-full text-left rounded-2xl p-4"
              style={{background:"linear-gradient(135deg, rgba(196,168,212,0.12), rgba(168,196,154,0.08))",border:"1px solid rgba(196,168,212,0.3)",cursor:"pointer"}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{background:"linear-gradient(135deg,rgba(196,168,212,0.2),rgba(168,196,154,0.2))"}}>🌱</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{color:WHITE}}>Mi práctica de hoy</p>
                  <p className="text-xs" style={{color:MUTED}}>Hapi · adaptada a tu momento</p>
                </div>
                <span style={{color:"#C4A8D4",fontSize:18}}>→</span>
              </div>
            </button>
          </>
        ) : (
          <>
            <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>MÓDULO ACTUAL</p>
            <button onClick={() => onSelectModule(user.currentModule)}
              className="w-full text-left rounded-2xl p-4" style={{background:`${pillar?.color}12`,border:`1px solid ${pillar?.color}35`,cursor:"pointer"}}>
              <div className="flex items-start gap-3">
                <ProgressRing pct={0.3} color={pillar?.color||"#7ECBA1"} size={52} stroke={3} label={String(user.currentModule)}/>
                <div className="flex-1 pt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                    style={{background:`${pillar?.color}20`,color:pillar?.color}}>Pilar {pillar?.num} · {pillar?.name}</span>
                  <p className="text-sm font-semibold leading-tight mb-1" style={{color:WHITE}}>{mod?.title}</p>
                  <p className="text-xs" style={{color:MUTED}}>🎧 {mod?.time}</p>
                </div>
                <span className="text-lg pt-1" style={{color:pillar?.color}}>→</span>
              </div>
            </button>
          </>
        )}
      </div>

      <div className="px-6 mb-2"><p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>LOS 5 PILARES</p></div>
      <div className="px-6 flex flex-col gap-3">
        {PILLARS.map(p => {
          const done = p.modules.filter(m => user.completedModules.includes(m)).length;
          const isActive = p.modules.includes(user.currentModule);
          const firstLocked = p.modules[0] > user.currentModule && !user.completedModules.includes(p.modules[0]-1);
          return (
            <button key={p.id} onClick={() => onShowPillar(p.id)}
              className="w-full text-left rounded-2xl p-4"
              style={{background:isActive?`${p.color}10`:CARD,border:`1px solid ${isActive?p.color+"35":BORDER}`,cursor:"pointer",opacity:firstLocked?0.45:1}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{background:`${p.color}15`,border:`1px solid ${p.color}25`}}>
                  {firstLocked?"🔒":p.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold" style={{color:firstLocked?MUTED:WHITE}}>{p.name}</p>
                    <span className="text-xs" style={{color:MUTED}}>{done}/{p.modules.length}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{background:DIM}}>
                    <div className="h-full rounded-full" style={{width:`${(done/p.modules.length)*100}%`,background:p.color}}/>
                  </div>
                </div>
                {isActive && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:`${p.color}20`,color:p.color}}>Activo</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PILLAR VIEW ──────────────────────────────────────────────
function PillarView({ pillarId, user, onBack, onSelectModule }) {
  const p = PILLARS.find(x => x.id===pillarId);
  const done = p.modules.filter(m => user.completedModules.includes(m)).length;
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="relative px-6 pt-12 pb-6" style={{background:`linear-gradient(180deg,${p.color}20 0%,transparent 100%)`}}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6" style={{color:MUTED,background:"none",border:"none",cursor:"pointer"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>Inicio
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{p.emoji}</span>
          <div>
            <p className="text-xs font-bold" style={{color:p.color,letterSpacing:"1.5px"}}>PILAR {p.num}</p>
            <h2 className="font-bold text-xl" style={{color:WHITE,fontFamily:"'Georgia',serif"}}>{p.name}</h2>
          </div>
        </div>
        <p className="text-sm mb-4" style={{color:MUTED}}>{p.subtitle}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:DIM}}>
            <div className="h-full rounded-full" style={{width:`${(done/p.modules.length)*100}%`,background:p.color}}/>
          </div>
          <span className="text-xs font-bold" style={{color:p.color}}>{done}/{p.modules.length}</span>
        </div>
      </div>
      <div className="px-6">
        {p.modules.map(num => {
          const status = getStatus(num, user.completedModules, user.currentModule);
          const isLocked = status==="locked";
          const isDone = status==="done";
          const isActive = status==="active";
          return (
            <button key={num} disabled={isLocked} onClick={() => !isLocked && onSelectModule(num)}
              className="w-full text-left mb-3 rounded-2xl p-4"
              style={{background:isActive?`${p.color}12`:CARD,border:`1px solid ${isActive?p.color+"40":BORDER}`,cursor:isLocked?"not-allowed":"pointer",opacity:isLocked?0.4:1}}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{background:isDone?`${p.color}25`:isActive?`${p.color}20`:DIM,color:isDone||isActive?p.color:MUTED}}>
                  {isDone?"✓":isLocked?"🔒":num}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight mb-1" style={{color:isLocked?MUTED:WHITE}}>{MODULES[num].title}</p>
                  <p className="text-xs" style={{color:MUTED}}>🎧 {MODULES[num].time}</p>
                </div>
                {isActive && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:`${p.color}20`,color:p.color}}>Ahora</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────
function ProgressView({ user }) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12">
      <h2 className="font-bold mb-1" style={{fontSize:24,color:WHITE,fontFamily:"'Georgia',serif"}}>Tu progreso</h2>
      <p className="text-sm mb-6" style={{color:MUTED}}>18 semanas · 1 módulo por semana</p>
      <div className="rounded-2xl p-5 mb-6 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
        <div className="flex justify-center mb-3">
          <ProgressRing pct={user.completedModules.length/18} color="#6BA8D4" size={80} stroke={5}/>
        </div>
        <p className="text-3xl font-bold mb-1" style={{color:WHITE}}>{user.completedModules.length}<span style={{color:MUTED}}>/18</span></p>
        <p className="text-sm" style={{color:MUTED}}>módulos completados</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center"><p className="text-lg font-bold" style={{color:WHITE}}>🔥 {user.streak}</p><p className="text-xs" style={{color:MUTED}}>días</p></div>
          <div className="text-center"><p className="text-lg font-bold" style={{color:WHITE}}>~{18-user.completedModules.length}</p><p className="text-xs" style={{color:MUTED}}>semanas</p></div>
        </div>
      </div>
      <div className="rounded-2xl p-4 mb-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
        <p className="text-xs font-bold mb-3" style={{color:WHITE,letterSpacing:"1px"}}>RITMO SEMANAL</p>
        {[["📖","Lunes","Lectura del módulo"],["🎯","Mar–Jue","Práctica diaria"],["✏️","Viernes","Reflexión y diario"],["🌿","Sáb–Dom","Integración libre"],["🌟","Al terminar pilar","Semana de consolidación"]].map(([i,d,r]) => (
          <div key={d} className="flex items-center gap-3 mb-3">
            <span className="text-base w-6 text-center">{i}</span>
            <div><p className="text-xs font-semibold" style={{color:WHITE}}>{d}</p><p className="text-xs" style={{color:MUTED}}>{r}</p></div>
          </div>
        ))}
      </div>
      <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>POR PILAR</p>
      {PILLARS.map(p => {
        const done = p.modules.filter(m => user.completedModules.includes(m)).length;
        return (
          <div key={p.id} className="mb-3 rounded-xl p-3" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><span>{p.emoji}</span><p className="text-sm font-semibold" style={{color:WHITE}}>{p.name}</p></div>
              <span className="text-xs" style={{color:MUTED}}>{done}/{p.modules.length}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:DIM}}>
              <div className="h-full rounded-full" style={{width:`${(done/p.modules.length)*100}%`,background:p.color}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── REMINDERS VIEW ───────────────────────────────────────────
function RemindersView({ user }) {
  const sistemaCompleto = user?.completedModules?.length >= 18;
  return (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12">
      <h2 className="font-bold mb-1" style={{fontSize:24,color:WHITE,fontFamily:"'Georgia',serif"}}>Audios</h2>
      <p className="text-sm mb-6" style={{color:MUTED}}>Piezas especiales del sistema</p>

      <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>BIBLIOTECA</p>

      <div className="mb-5">
        <p className="text-xs font-semibold mb-2" style={{color:"#C4A8D4"}}>Manifiesto · hapi</p>
        <AudioPlayer
          url={DRIVE_AUDIO.manifiesto}
          accent="#C4A8D4"
          title="El Manifiesto"
          subtitle="La orientación del sistema"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold" style={{color:"#6BA8D4"}}>Transición · Al Motor IA</p>
          {!sistemaCompleto && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"rgba(107,168,212,0.12)",color:"#6BA8D4",border:"1px solid rgba(107,168,212,0.25)"}}>
              🔒 18 módulos
            </span>
          )}
        </div>
        {sistemaCompleto ? (
          <AudioPlayer
            url={DRIVE_AUDIO.transicion}
            accent="#6BA8D4"
            title="Transición al Motor IA"
            subtitle="El siguiente nivel del sistema"
          />
        ) : (
          <div className="rounded-2xl p-5 text-center" style={{background:"rgba(107,168,212,0.06)",border:"1px solid rgba(107,168,212,0.12)"}}>
            <p className="text-lg mb-2">🔒</p>
            <p className="text-sm font-semibold mb-1" style={{color:"rgba(255,255,255,0.4)"}}>Se desbloquea al completar los 18 módulos</p>
            <p className="text-xs" style={{color:MUTED}}>{user?.completedModules?.length || 0}/18 módulos completados</p>
          </div>
        )}
      </div>

      <p className="text-xs font-bold mb-3" style={{color:MUTED,letterSpacing:"1px"}}>RECORDATORIOS</p>
      {[["📅","Avance semanal","Lunes · 9:00 — cuando es momento de avanzar al próximo módulo"],["🌟","Semana de consolidación","Al terminar cada pilar — integrar antes de continuar"]].map(([icon,title,desc]) => (
        <div key={title} className="rounded-2xl p-4 mb-4" style={{background:CARD,border:`1px solid ${BORDER}`}}>
          <div className="flex items-center gap-2 mb-1"><span>{icon}</span><p className="text-sm font-bold" style={{color:WHITE}}>{title}</p></div>
          <p className="text-xs" style={{color:MUTED}}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-3"
      style={{background:`linear-gradient(180deg,transparent 0%,${BG} 40%)`}}>
      <div className="flex w-full rounded-2xl overflow-hidden" style={{background:CARD,border:`1px solid ${BORDER}`}}>
        {[{id:"home",icon:"⌂",label:"Inicio"},{id:"explorar",icon:"✦",label:"Explorar"},{id:"progress",icon:"◎",label:"Progreso"},{id:"reminders",icon:"🔔",label:"Avisos"}].map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className="flex-1 flex flex-col items-center py-3 gap-0.5"
            style={{background:active===t.id?"rgba(107,168,212,0.12)":"none",border:"none",cursor:"pointer"}}>
            <span className="text-base">{t.icon}</span>
            <span style={{color:active===t.id?"#6BA8D4":MUTED,fontSize:"9px",fontWeight:"600"}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
// ─── PERSISTENCE ──────────────────────────────────────────────
const STORAGE_KEY = "hapi_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(screen, user, answers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, user, answers }));
  } catch {}
}

export default function HapiApp() {
  // ── Cargar estado guardado ────────────────────────────────────
  const saved = loadState();

  // ── Scroll al top ─────────────────────────────────────────────
  const appScrollRef = useRef(null);
  const scrollToTop = useCallback(() => {
    // Busca el primer hijo con overflow-y-auto (el scroll real de cada vista)
    if (appScrollRef.current) {
      const scroller = appScrollRef.current.querySelector(".flex-1.overflow-y-auto, [class*=overflow-y-auto]");
      if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // ── Onboarding state (v3 flow) ───────────────────────────────
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [screen, setScreen] = useState(saved?.screen || "onboarding");

  // ── App state ────────────────────────────────────────────────
  const [tab, setTab] = useState("home");
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [user, setUser] = useState(saved?.user || {
    name: "",
    currentModule: 1,
    completedModules: [],
    streak: 0,
    weekProgress: [false,false,false,false,false,false,false],
    currentDay: 1,
    profile: null,
  });

  // ── Hapi state ──────────────────────────────────────────────────
  // ── Settings state ───────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // motorScreen: null | "transicion" | "mi_camino" | "checkin" | "loading" | "practica"
  const [motorScreen, setMotorScreen] = useState(null);
  const [motorModulos, setMotorModulos] = useState([]);   // lista de módulos seleccionados
  const [motorCheckin, setMotorCheckin] = useState(null);
  const [motorRutinas, setMotorRutinas] = useState([]);   // una rutina por módulo
  const [motorError, setMotorError] = useState(false);
  const [motorProgreso, setMotorProgreso] = useState(0);  // cuántas sesiones generadas

  // Si ya completó los 18 módulos y no está en el motor, mostrar transición al entrar
  useEffect(() => {
    if (screen === "app" && !motorScreen && user.completedModules?.length === 18) {
      setMotorScreen("transicion");
    }
  }, [screen]);

  async function handleMotorGenerar(checkinData) {
    setMotorCheckin(checkinData);
    setMotorScreen("loading");
    setMotorError(false);
    setMotorProgreso(0);

    try {
      // Generar todas las sesiones en paralelo
      const promesas = motorModulos.map(num =>
        fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 2500,
            system: buildMotorSystemPrompt(),
            messages: [{ role: "user", content: buildMotorUserPrompt(user, checkinData, num) }],
          }),
        })
        .then(r => r.json())
        .then(data => {
          const raw = data.content?.[0]?.text || "";
          const clean = raw.replace(/```json|```/g, "").trim();
          setMotorProgreso(p => p + 1);
          return JSON.parse(clean);
        })
      );

      const rutinas = await Promise.all(promesas);
      setMotorRutinas(rutinas);
      setMotorScreen("practica");
    } catch (err) {
      console.error("Hapi error:", err);
      setMotorError(true);
      setMotorScreen("checkin");
    }
  }

  // ── Onboarding handlers ──────────────────────────────────────
  const current = STEPS[stepIdx];
  const next = () => { setStepIdx(i => Math.min(i + 1, STEPS.length - 1)); window.scrollTo(0, 0); };
  const back = () => { setStepIdx(i => Math.max(i - 1, 0)); window.scrollTo(0, 0); };
  const setField = (field, val) => setAnswers(prev => ({ ...prev, [field]: val }));

  const onboardingProps = {
    step: current,
    value: answers[current?.field],
    onChange: v => setField(current.field, v),
    onNext: next,
    onBack: back,
  };

  const handleOnboardingStart = () => {
    const profile = buildProfile(answers);
    const newUser = {
      name: answers.nombre || "Hapi",
      profile,
      currentModule: 1,
      completedModules: [],
      streak: 0,
      weekProgress: [false,false,false,false,false,false,false],
      currentDay: 1,
    };
    setUser(newUser);
    setScreen("app");
    saveState("app", newUser, answers);
  };

  const renderOnboardingStep = () => {
    if (!current) return null;
    if (current.type === "intro")       return <IntroStep onNext={next}/>;
    if (current.type === "splash")      return <SplashStep onNext={next} nombre={answers.nombre}/>;
    if (current.type === "result")      return <ResultStep answers={answers} onStart={handleOnboardingStart}/>;
    if (current.type === "text_input")  return <TextInputStep {...onboardingProps}/>;
    if (current.type === "single")      return <SingleStep {...onboardingProps}/>;
    return null;
  };

  // ── App handlers ─────────────────────────────────────────────
  const handleComplete = (num) => {
    setUser(prev => {
      if (prev.completedModules.includes(num)) return prev;
      const newDone = [...prev.completedModules, num].sort((a,b)=>a-b);
      const nextModule = num < 18 ? num + 1 : num;
      const updated = { ...prev, completedModules: newDone, currentModule: nextModule, streak: prev.streak + 1 };
      saveState("app", updated, answers);
      return updated;
    });
    setActiveModule(null);
    setTimeout(scrollToTop, 50);
    if (num === 18) {
      setMotorScreen("transicion");
    }
  };

  const handleSelectModule = (num) => {
    setActiveModule(num);
    setSelectedPillar(null);
  };

  const handleShowPillar = (id) => {
    setSelectedPillar(id);
    setActiveModule(null);
  };

  const handleBack = () => {
    if (activeModule) { setActiveModule(null); return; }
    if (selectedPillar) { setSelectedPillar(null); return; }
  };

  // ── Onboarding shell ─────────────────────────────────────────
  if (screen === "onboarding") {
    return (
      <div className="flex flex-col items-center" style={{ background: "#050D15", minHeight: "100dvh" }}>
        {stepIdx > 0 && (
          <button onClick={() => { setStepIdx(0); setAnswers({}); localStorage.removeItem("hapi_state_v1"); }}
            className="text-xs px-4 py-2 rounded-xl mb-3"
            style={{ background: "rgba(168,213,194,0.08)", color: "rgba(168,213,194,0.4)", border: "1px solid rgba(168,213,194,0.12)" }}>
            ↺ Reiniciar
          </button>
        )}
        <div className="relative flex flex-col overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "480px",
            minHeight: "100dvh",
            background: "#0A1220",
            margin: "0 auto",
          }}>
          {renderOnboardingStep()}
        </div>
      </div>
    );
  }

  // ── Main app ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center" style={{ background: "#040810", minHeight: "100dvh" }}>
      <div ref={appScrollRef} className="relative flex flex-col"
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "100dvh",
          background: "#080E18",
          margin: "0 auto",
        }}>

        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(107,168,212,0.07) 0%,transparent 70%)" }}/>

        {/* ── Motor IA — pantallas de Fase 2 ── */}
        {motorScreen === "transicion" ? (
          <TransicionFinal
            user={user}
            onEntrarMotor={() => setMotorScreen("mi_camino")}
          />
        ) : motorScreen === "mi_camino" ? (
          <MiCamino
            user={user}
            onIniciarSesion={(modulos) => { setMotorModulos(modulos); setMotorScreen("checkin"); }}
            onBack={() => setMotorScreen(null)}
            onVerModulos={() => setMotorScreen("modulos")}
          />
        ) : motorScreen === "checkin" ? (
          <CheckInDia
            user={user}
            modulosSeleccionados={motorModulos}
            onComplete={handleMotorGenerar}
            onBack={() => setMotorScreen("mi_camino")}
          />
        ) : motorScreen === "loading" ? (
          <LoadingIA modulosSeleccionados={motorModulos} progreso={motorProgreso} />
        ) : motorScreen === "practica" && motorRutinas.length > 0 ? (
          <PracticaDiaria
            rutinas={motorRutinas}
            modulosSeleccionados={motorModulos}
            checkin={motorCheckin}
            onVolver={() => setMotorScreen("mi_camino")}
            onNuevaSesion={() => { setMotorRutinas([]); setMotorCheckin(null); setMotorProgreso(0); setMotorScreen("mi_camino"); }}
          />
        ) : motorScreen === "modulos" ? (
          <ModulosView
            user={user}
            onSelectModule={(num) => { setActiveModule(num); setMotorScreen(null); }}
            onBack={() => setMotorScreen("mi_camino")}
          />
        ) : activeModule ? (
          <ModulePlayer moduleNum={activeModule} onBack={handleBack} onComplete={() => handleComplete(activeModule)}/>
        ) : selectedPillar && tab === "home" ? (
          <PillarView pillarId={selectedPillar} user={user} onBack={handleBack} onSelectModule={handleSelectModule}/>
        ) : tab === "home" ? (
          <HomeView
            user={user}
            onSelectModule={handleSelectModule}
            onShowPillar={handleShowPillar}
            onAbrirMotor={user.completedModules?.length === 18 ? () => setMotorScreen("mi_camino") : null}
            onAbrirAjustes={() => setShowSettings(true)}
          />
        ) : tab === "explorar" ? (
          <ExplorarView
            user={user}
            onBack={() => setTab("home")}
          />
        ) : tab === "progress" ? (
          <ProgressView user={user} onAbrirMotor={user.completedModules?.length === 18 ? () => setMotorScreen("mi_camino") : null}/>
        ) : (
          <RemindersView user={user}/>
        )}

        {!activeModule && !motorScreen && (
          <BottomNav active={tab} onChange={t => { setTab(t); setSelectedPillar(null); window.scrollTo(0,0); }}/>
        )}

        {showSettings && (
          <SettingsMenu
            onClose={() => setShowSettings(false)}
            onReiniciar={() => {
              setShowSettings(false);
              localStorage.removeItem("hapi_state_v1");
              window.location.reload();
            }}
            onMotorIA={() => {
              setShowSettings(false);
              setUser(prev => ({
                ...prev,
                completedModules: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
                currentModule: 18,
                streak: prev.streak || 1,
              }));
              setMotorScreen("transicion");
            }}
            onFeedback={() => {
              setShowSettings(false);
              setShowFeedback(true);
            }}
          />
        )}

        {showFeedback && (
          <FeedbackForm onClose={() => setShowFeedback(false)} />
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full opacity-20" style={{ background: "white" }}/>
      </div>
    </div>
  );
}
