let cx, cy;

let logo;

let temas = [];
let temaAtual = 0;

let anguloSuave = 0;

let agenda = {

  0: [ // Domingo
    { nome: "Almoço",  inicio: "13:00", fim: "14:00" }
  ],
  
  1: [ // Segunda
    { nome: "Aula de PEP", inicio: "10:00", fim: "13:00" },
    { nome: "Almoço",      inicio: "13:00", fim: "14:00" },
    { nome: "Aula de LPI", inicio: "14:00", fim: "18:00" },
    { nome: "Jantar",      inicio: "20:00", fim: "21:00" },
    { nome: "Trabalho",    inicio: "21:00", fim: "00:00" }
  ],

  2: [ // Terça
    { nome: "Aula de PDM", inicio: "09:30", fim: "12:30" },
    { nome: "Almoço",  inicio: "12:30", fim: "13:30" },
    { nome: "Aula de PDM",  inicio: "13:30", fim: "16:30" },
    { nome: "Ginásio",      inicio: "18:30", fim: "19:30" },
    { nome: "Jantar",      inicio: "20:00", fim: "21:00" }
  ],

  3:[ // Quarta
    { nome: "Trabalho", inicio: "10:00", fim: "12:30" },
    { nome: "Almoço",  inicio: "12:30", fim: "14:00" },
    { nome: "Trabalho",  inicio: "14:00", fim: "19:00" },
    { nome: "Spinning",     inicio: "19:30", fim: "20:30" },
    { nome: "Jantar",      inicio: "21:00", fim: "22:00" }
  ],
  
  4: [ // Quinta
    { nome: "Aula de PDM", inicio: "09:30", fim: "12:30" },
    { nome: "Almoço",  inicio: "12:30", fim: "14:00" },
    { nome: "Aula de GP",  inicio: "14:00", fim: "17:00" },
    { nome: "Zumba",     inicio: "18:30", fim: "19:30" },
    { nome: "Jantar",      inicio: "20:30", fim: "21:30" }
  ],

  5: [ // Sexta
    { nome: "Aula de TM", inicio: "09:00", fim: "13:00" },
    { nome: "Almoço",  inicio: "13:30", fim: "14:30" },
    { nome: "Trabalho",  inicio: "14:30", fim: "19:00" },
    { nome: "Spinning",     inicio: "19:30", fim: "20:30" },
    { nome: "Jantar",      inicio: "21:00", fim: "22:00" }
  ],

  6: [ // Sábado
    { nome: "Trabalho", inicio: "10:00", fim: "12:30" },
    { nome: "Almoço",  inicio: "13:00", fim: "14:00" }
  ],
};

function horaParaMin(horaStr) {
  if (!horaStr || horaStr.indexOf(":") === -1) return null;
  let partes = horaStr.split(":");
  let h = int(partes[0]);
  let m = int(partes[1]);
  return h * 60 + m;
}

function estaNoIntervalo(agoraMin, inicioMin, fimMin) {
  if (inicioMin == null || fimMin == null) return false;
  if (inicioMin <= fimMin) {
    return agoraMin >= inicioMin && agoraMin <= fimMin;
  } else {
    return (agoraMin >= inicioMin && agoraMin < 24*60) || (agoraMin >= 0 && agoraMin <= fimMin);
  }
}
  
function eventoDoMomento() {
  // usa getDay() do JS: 0 = Domingo, 1 = Segunda, ... 6 = Sábado
  let diaSemana = new Date().getDay();
  let eventosHoje = agenda[diaSemana];

  if (!eventosHoje || eventosHoje.length === 0) {
    return null;
  }

  let agora = hour() * 60 + minute();
  
for (let ev of eventosHoje) {
  let ini = horaParaMin(ev.inicio);
  let fim = horaParaMin(ev.fim);
  if (estaNoIntervalo(agora, ini, fim)) {
    return ev;
  }
  }
for (let ev of eventosHoje) {
    let fim = horaParaMin(ev.fim);
    if (fim == null) continue;
    if (agora <= fim) {
      return ev;
    }
  }

  return null;
}

let bpmAtual = 72;
let tempoProximaMudanca = 0;

let passos = 0;
let tempoProximoPasso = 0;

function preload()
{
  logo1 = loadImage ("Passos.png");
  logo2 = loadImage ("Batimento.png")
}

let escala = 1;

function setup() {
  let tamanho = min(windowWidth * 0.9, 450);
  escala = tamanho / 450;
  var myCanvas = createCanvas(tamanho, tamanho + 50);
  myCanvas.parent("p5Canvas");
  angleMode(DEGREES);
  cx = width/2;
  cy = height/2;
  //background(250)
  
temas = [
  color(168, 230, 207), // Verde
  color(255, 108, 136), // Rosa
  color(249, 185, 56)   // Amarelo
  ];
}

function windowResized() {
  let tamanho = min(windowWidth * 0.9, 450);
  escala = tamanho / 450;
  resizeCanvas(tamanho, tamanho + 50);
  cx = width/2;
  cy = height/2;
}

function mousePressed() {
  temaAtual = (temaAtual + 1) % temas.length;
}

function draw() {
  let cx = width / 2;
  let cy = height / 2;
  let raio = (450/2) * escala;
  fill(30,30,30);
  noStroke();
  ellipse(cx, cy, raio * 2);

  // Hora
  let h = hour();
  let m = minute();
  let hh = nf(h, 2);
  let mm = nf(m, 2);
  let horaTexto = hh + ":" + mm;
  
  fill(234);           
  textAlign(CENTER, CENTER);
  textSize(80 * escala);
  text(horaTexto, width/2, height/2 - 60 * escala);

  // Data
  let num_dia_semana = new Date().getDay();
  let nomes_dia_semana = [];
  nomes_dia_semana[0] = "Domingo";
  nomes_dia_semana[1] = "Segunda";
  nomes_dia_semana[2] = "Terça";
  nomes_dia_semana[3] = "Quarta";
  nomes_dia_semana[4] = "Quinta";
  nomes_dia_semana[5] = "Sexta";
  nomes_dia_semana[6] = "Sábado";

  let dia = day();
  let mes = month();
  let ano = year();
  let textoData = nomes_dia_semana[num_dia_semana] + ", " + nf(dia, 2) + "/" + nf(mes, 2) + "/" + ano;

  fill(234);
  textAlign(CENTER, CENTER);
  textSize(22 * escala);
  text(textoData, width/2, height/2 - 120 * escala);

  // Evento
  let ev = eventoDoMomento();
  let textoEvento;
  if (ev) {
    textoEvento = ev.nome + " (" + ev.inicio + " - " + ev.fim + ")";
  } else {
    textoEvento = "Sem mais eventos hoje (--:-- - --:--)";
  }

  fill(220);
  textAlign(CENTER, CENTER);
  textSize(22 * escala);
  text(textoEvento, width/2, height/2);

  // Arco Exterior 
  let ini = horaParaMin(ev ? ev.inicio : null);
  let fim = horaParaMin(ev ? ev.fim : null);
  let agoraMin = hour()*60 + minute();

  let progressoEvent = constrain((agoraMin - ini) / (fim - ini), 0, 1);
  let anguloReal = progressoEvent * 360;
  anguloSuave = lerp(anguloSuave, anguloReal, 0.05);

  stroke(temas[temaAtual]);  
  strokeWeight(15 * escala);
  noFill();
  strokeCap(ROUND);

  push();
  translate(cx, cy);
  rotate(-90);
  arc(0, 0, 400 * escala, 400 * escala, 0, anguloSuave);
  pop();

  // Bateria
  let bateria = 100;
  let ultimoUpdate = 0;
  
  if (millis() - ultimoUpdate > 30000) {
    bateria = max(0, bateria - 2);
    ultimoUpdate = millis();
  }

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * escala);
  text(bateria + "%", cx, cy + 175 * escala);

  // Icon e Texto Passos 
  if (passos < 5000 && millis() > tempoProximoPasso) {
    passos += int(random(1, 4));
    if (passos > 5000) passos = 5000;
    tempoProximoPasso = millis() + random(600, 1200); 
  }
  
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * escala);
  text(passos + " passos", cx + 60 * escala, cy + 120 * escala);

  imageMode(CENTER);
  tint(temas[temaAtual]);
  image(logo1, cx + 60 * escala, cy + 70 * escala, 40 * escala, 50 * escala);
  noTint(); 
  
  // Icon e Texto Batimentos 
  if (millis() > tempoProximaMudanca) {
    bpmAtual += int(random(-3, 3));
    bpmAtual = constrain(bpmAtual, 70, 110);
    tempoProximaMudanca = millis() + random(5000, 10000);
  }
  
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18 * escala);
  text(bpmAtual + " bpm", cx - 60 * escala, cy + 120 * escala);

  imageMode(CENTER);
  tint(temas[temaAtual]); 
  image(logo2, cx - 60 * escala, cy + 70 * escala, 55 * escala, 55 * escala);
  noTint(); 
}

function touchStarted() {
  temaAtual = (temaAtual + 1) % temas.length;
}