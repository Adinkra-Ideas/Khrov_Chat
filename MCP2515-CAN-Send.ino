#include "mcp2515_can.hpp"

const uint8_t SPI_CS_PIN = 9; // Set the CS pinout that Arduino used to connect to the Slave (CAN Controller)
const uint8_t SPI_MOSI_PIN = 11;
const uint8_t SPI_MISO_PIN = 12;
const uint8_t SPI_SCK_PIN = 13;

mcp2515_can CAN(SPI_CS_PIN);


void setup() {
  Serial.begin(9600);
  while(!Serial){};

  // if this CAN.begin is not passed an arg5, it auto defaults to 
  // MCP_16MHz in its header file
  // I believe without the correct clockspeed, the CAN wont also work
  // just like it wont work without the correct SPI 4 cables set
  while (CAN.begin(CAN_500KBPS, SPI_MOSI_PIN, SPI_MISO_PIN, SPI_SCK_PIN) != 0) { // init can bus : baudrate = 500k
    Serial.println("CAN init fail, retry...");
    delay(500);
  }
  Serial.println("CAN init ok!");

}

unsigned char data[8] = {0, 1, 2, 3, 4, 5, 6, 7};

void loop() {
  CAN.sendMsgBuf(0x7, 0, 8, data); // Send the data on the CAN bus
  delay(100);
   Serial.println("CAN BUS sendMsgBuf ok!");

}

// This code is for AVR boards

