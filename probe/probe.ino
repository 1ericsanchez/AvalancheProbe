// Force Sensor + Display

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <EEPROM.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);

#if (SSD1306_LCDHEIGHT != 32)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

int fsrAnalogPin = 6; // FSR analog 6
int fsrReading;       // the analog reading from the FSR resistor divider
int shortR;           // the fsrReading shortened for line graph
int buttonPin = 2;
int buttonState = 0;
int forceArray[128];
int num_runs;
int max_runs = 7;
int mem = 1024;
// maps roughly to [0, 32] for displaying to lcd screen
int force_scale = 5;
int k;

void setup() {
  Serial.begin(9600);
  // initialize with the I2C addr 0x3C (for the 128x32)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  
  pinMode(buttonPin, INPUT);
  display.clearDisplay();

  num_runs = EEPROM.read(mem-1);
  if (num_runs > max_runs){
    num_runs = 0;
  }
  for (int16_t j=0; j<num_runs; j+=1) {
    print_run(j+1);
    for (int16_t i=0; i<128; i+=1) {
      k = EEPROM.read(j*128+i);
      display.drawLine(127-i, 0, 127-i, k, WHITE);
      display.display();
    }
    delay(1000);
  }
  Serial.print("Runs: ");
  Serial.println(num_runs);
}

void loop(void) {
  delay(1);
  display.clearDisplay();
  delay(1);
  standby();
  if (num_runs < max_runs) {
    num_runs = num_runs + 1;
  }
  print_run(num_runs);
  getforce();
  saveforce();
}

void standby(void) {
  Serial.println("standby");
  buttonState = digitalRead(buttonPin);
  while (buttonState == LOW) {
    delay(200);
    buttonState = digitalRead(buttonPin);
  } 
}

void getforce(void) {
  for (int16_t i=0; i<128; i+=1) {
    fsrReading = analogRead(fsrAnalogPin);
    shortR = (fsrReading/force_scale);
    forceArray[i] = shortR;
    display.drawLine(127-i, 0, 127-i, shortR, WHITE);
    display.display();
    delay(5);
    Serial.println(shortR);
  }
}

void saveforce(void) {
  int pos;
  for (int16_t i=0; i<128; i+=1) {
    pos = (num_runs-1)*128+i;
    EEPROM.write(pos, forceArray[i]);
    delay(5);
  }
  EEPROM.write(mem-1, num_runs);
  Serial.print("Run count: ");
  Serial.println(num_runs);
}

void print_run(int r) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(20,0);
  display.setRotation(1);
  display.println(r);
  display.setRotation(0);
}
