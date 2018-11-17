/*Force sensitive resistor with out displayed to serial monitor
 * and Adafruit SSD1306
 */

//test 
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

void setup() {
  Serial.begin(9600);
  for (int16_t i=0; i<128; i+=1){
    Serial.print(i);
    Serial.print(": ");
    Serial.println(EEPROM.read(i));
  }
   // by default, we'll generate the high voltage from the 3.3v line internally! (neat!)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3C (for the 128x32)
  // init done
  display.clearDisplay();
  pinMode(buttonPin, INPUT); //initialize buton pin
}

void loop(void) {
  delay(1);
  display.clearDisplay();
  delay(1);
  standby();
  force();
  saveforce();
}

void standby(void) {
  buttonState = digitalRead(buttonPin);
  while (buttonState == LOW) {
    delay(100);
    //Serial.println("standby");
    //display.clearDisplay();
    buttonState = digitalRead(buttonPin);
  } 
}

void force(void) {
  for (int16_t i=0; i<128; i+=1) {
    fsrReading = analogRead(fsrAnalogPin);
    shortR = (fsrReading/5);
    display.drawLine(127-i, 0, 127-i, shortR, WHITE);
    display.display();
    delay(5);
    forceArray[i] = shortR;
    Serial.println(fsrReading);
  }
  delay(1);
  //display.clearDisplay();
}

void saveforce(void) {
  for (int16_t i=0; i<128; i+=1) {
    EEPROM.write(i, forceArray[i]);
    }
}

