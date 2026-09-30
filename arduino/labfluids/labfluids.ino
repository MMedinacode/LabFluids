// LabFluids – programa base del Arduino (v0.2, SIN PROBAR EN HARDWARE)
// Lee el sensor ultrasónico HC-SR04 a 10 Hz y el sensor de contacto sumergible,
// y envía por el puerto serie una línea por muestra:  t_ms;h_mm;contacto;a0
//   t_ms     = milisegundos desde que se encendió la placa
//   h_mm     = altura del agua medida desde la base del estanque (mm), o -1 si no hubo eco
//   contacto = 1 si el sensor de contacto está mojado, 0 si ya quedó seco (el agua llegó al orificio y dejó de salir)
// El sensor de contacto va a la altura del borde inferior del orificio (h_f = 2 cm desde la base).
//   a0       = lectura analógica del sensor de contacto (0-1023), solo para calibrar UMBRAL_CONTACTO
// La web app usa las tres primeras columnas e ignora la cuarta.

// ---------- Pines (ver Ficha Técnica MVP v2) ----------
const int PIN_TRIG = 9;
const int PIN_ECHO = 8;
const int PIN_CONTACTO = A0;
const int PIN_LED = 7;

// ---------- Valores que se ajustan al calibrar ----------
const float L0_MM = 220.0;          // distancia del sensor a la base del estanque (medir con regla)
const int UMBRAL_CONTACTO = 300;    // punto medio entre la lectura seca y la mojada de A0
const float TEMP_C = 20.0;          // temperatura ambiente (corrige la velocidad del sonido)

const unsigned long PERIODO_MS = 100;  // 10 Hz; el HC-SR04 necesita al menos 60 ms entre mediciones
unsigned long ultimaMuestra = 0;

// Mide la distancia al agua en mm; devuelve -1 si no llega el eco
float medirDistanciaMm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  unsigned long eco_us = pulseIn(PIN_ECHO, HIGH, 30000UL);  // espera máximo 30 ms
  if (eco_us == 0) return -1;

  float c = 331.3 + 0.606 * TEMP_C;   // velocidad del sonido en m/s
  return eco_us * c / 2000.0;         // ida y vuelta: (us · m/s · 1000 mm/m · 1e-6 s/us) / 2
}

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_LED, OUTPUT);
  Serial.begin(115200);
  Serial.println("t_ms;h_mm;contacto;a0");   // encabezado, útil si se guarda como CSV
}

void loop() {
  unsigned long ahora = millis();
  if (ahora - ultimaMuestra < PERIODO_MS) return;
  ultimaMuestra = ahora;

  float x = medirDistanciaMm();
  float h = (x < 0) ? -1 : L0_MM - x;

  int a0 = analogRead(PIN_CONTACTO);
  bool mojado = a0 > UMBRAL_CONTACTO;
  digitalWrite(PIN_LED, mojado ? LOW : HIGH);   // LED encendido = el agua llegó al orificio y dejó de salir

  Serial.print(ahora);
  Serial.print(';');
  Serial.print(h, 1);
  Serial.print(';');
  Serial.print(mojado ? 1 : 0);
  Serial.print(';');
  Serial.println(a0);
}
